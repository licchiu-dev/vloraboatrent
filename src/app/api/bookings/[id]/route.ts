import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'
import { roundMoney } from '@/lib/pricing'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN'])
  if ('error' in guard) return guard.error
  const { id } = await params
  const body = await request.json()

  if (Array.isArray(body.items)) {
    const existingItems = await prisma.bookingItem.findMany({
      where: { bookingId: id },
      include: { product: true },
    })
    const submittedItems = body.items as { id: string; unitPrice: number }[]
    const nextItems = submittedItems
      .map((item: { id: string; unitPrice: number }) => {
        const existing = existingItems.find((candidate) => candidate.id === item.id)
        if (!existing) return null
        const unitPrice = Math.max(0, Number(item.unitPrice) || 0)
        return {
          item: existing,
          unitPrice,
          total: roundMoney(unitPrice * existing.quantity),
        }
      })
      .filter((item): item is { item: typeof existingItems[number]; unitPrice: number; total: number } => Boolean(item))

    const totalPublic = roundMoney(nextItems.reduce((sum, line) => sum + line!.total, 0))
    const bookingWithPartner = await prisma.booking.findUnique({ where: { id }, include: { partner: true } })
    const baseTotal = roundMoney(nextItems.reduce((sum, line) => sum + line!.item.product.basePrice * line!.item.quantity, 0))
    const totalPartner = bookingWithPartner?.partnerId ? totalPublic : null
    const commission = bookingWithPartner?.partnerId ? roundMoney(baseTotal - totalPublic) : null

    await prisma.$transaction([
      ...nextItems.map((line) =>
        prisma.bookingItem.update({
          where: { id: line!.item.id },
          data: { unitPrice: line!.unitPrice, total: line!.total },
        })
      ),
      prisma.booking.update({
        where: { id },
        data: { totalPublic, totalPartner, commission },
      }),
    ])
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: body.status,
      paymentMethod: body.paymentMethod,
      notes: body.notes !== undefined ? (body.notes || null) : undefined,
      internalNotes: body.internalNotes !== undefined ? (body.internalNotes || null) : undefined,
      date: body.date ? new Date(body.date) : undefined,
      timeSlot: body.timeSlot,
      totalPublic: body.totalPublic !== undefined ? Number(body.totalPublic) : undefined,
      totalPartner: body.totalPartner !== undefined ? (body.totalPartner === '' || body.totalPartner === null ? null : Number(body.totalPartner)) : undefined,
      commission: body.commission !== undefined ? (body.commission === '' || body.commission === null ? null : Number(body.commission)) : undefined,
      partnerId: body.partnerId !== undefined ? (body.partnerId || null) : undefined,
      discountCode: body.discountCode !== undefined ? (body.discountCode || null) : undefined,
    },
  })
  return Response.json(booking)
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN'])
  if ('error' in guard) return guard.error
  const { id } = await params
  await prisma.booking.delete({ where: { id } })
  return Response.json({ ok: true })
}
