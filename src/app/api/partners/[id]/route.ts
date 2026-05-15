import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error
  const { id } = await params
  const body = await request.json()

  const partner = await prisma.partner.update({
    where: { id },
    data: {
      companyName: body.companyName,
      type: body.type,
      discountCode: body.discountCode,
      defaultCommission: Number(body.defaultCommission),
      phone: body.phone ?? null,
      pendingEarnings: body.markPaid ? 0 : undefined,
    },
    include: { user: true },
  })

  if (body.email) {
    await prisma.user.update({
      where: { id: partner.userId },
      data: { email: body.email, name: body.name ?? partner.user.name },
    })
  }

  return Response.json(partner)
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error
  const { id } = await params

  const partner = await prisma.partner.findUnique({ where: { id } })
  if (!partner) return Response.json({ error: 'Not found' }, { status: 404 })

  await prisma.partner.delete({ where: { id } })
  await prisma.user.delete({ where: { id: partner.userId } })

  return Response.json({ ok: true })
}
