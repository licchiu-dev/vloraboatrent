import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; paymentId: string }> }
) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error

  const { paymentId } = await params
  const body = await request.json()

  const payment = await prisma.commissionPayment.update({
    where: { id: paymentId },
    data: {
      amount: body.amount !== undefined ? Number(body.amount) : undefined,
      date: body.date ? new Date(body.date) : undefined,
      method: body.method ?? undefined,
      notes: body.notes !== undefined ? (body.notes || null) : undefined,
    },
  })
  return Response.json(payment)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; paymentId: string }> }
) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error

  const { paymentId } = await params
  await prisma.commissionPayment.delete({ where: { id: paymentId } })
  return Response.json({ ok: true })
}
