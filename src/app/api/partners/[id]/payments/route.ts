import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error

  const { id } = await params
  const body = await request.json()
  const amount = Number(body.amount)
  if (!amount || amount <= 0) return Response.json({ error: 'Invalid amount.' }, { status: 400 })

  const partner = await prisma.partner.findUnique({ where: { id } })
  if (!partner) return Response.json({ error: 'Partner not found.' }, { status: 404 })

  const [payment] = await prisma.$transaction([
    prisma.commissionPayment.create({
      data: {
        partnerId: id,
        amount,
        date: body.date ? new Date(body.date) : new Date(),
        method: body.method ?? 'CASH',
        notes: body.notes || null,
      },
    }),
    prisma.partner.update({
      where: { id },
      data: { pendingEarnings: Math.max(0, partner.pendingEarnings - amount) },
    }),
  ])

  return Response.json(payment)
}
