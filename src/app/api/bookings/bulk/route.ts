import { BookingStatus } from '@prisma/client'
import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'
import { roundMoney } from '@/lib/pricing'

async function syncPartnerEarnings(partnerId: string) {
  const [bookings, payments] = await Promise.all([
    prisma.booking.findMany({
      where: { partnerId, status: { in: ['CONFIRMED', 'COMPLETED'] } },
      select: { commission: true },
    }),
    prisma.commissionPayment.findMany({
      where: { partnerId },
      select: { amount: true },
    }),
  ])
  const totalEarnings = roundMoney(bookings.reduce((sum, booking) => sum + (booking.commission ?? 0), 0))
  const paid = roundMoney(payments.reduce((sum, payment) => sum + payment.amount, 0))
  const pendingEarnings = roundMoney(Math.max(0, totalEarnings - paid))
  await prisma.partner.update({ where: { id: partnerId }, data: { totalEarnings, pendingEarnings } })
}

export async function PATCH(request: Request) {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN'])
  if ('error' in guard) return guard.error

  const body = await request.json()
  const ids = Array.isArray(body.ids) ? body.ids.filter((id: unknown): id is string => typeof id === 'string') : []
  const status = body.status

  if (ids.length === 0) return Response.json({ error: 'Select at least one booking.' }, { status: 400 })
  if (!(status in BookingStatus)) return Response.json({ error: 'Invalid status.' }, { status: 400 })

  const affected = await prisma.booking.findMany({
    where: { id: { in: ids } },
    select: { id: true, partnerId: true, fuelAmount: true },
  })
  const affectedIds = affected.map((booking) => booking.id)

  if (affectedIds.length === 0) return Response.json({ error: 'No matching bookings found.' }, { status: 404 })
  if (status === BookingStatus.COMPLETED) {
    const missingFuel = affected.filter((booking) => booking.fuelAmount == null)
    if (missingFuel.length > 0) {
      return Response.json(
        { error: `${missingFuel.length} selected booking(s) are missing fuel amount. Open them individually before marking completed.` },
        { status: 400 },
      )
    }
  }

  await prisma.booking.updateMany({
    where: { id: { in: affectedIds } },
    data: { status },
  })

  const partnerIds = [...new Set(affected.flatMap((booking) => (booking.partnerId ? [booking.partnerId] : [])))]
  await Promise.all(partnerIds.map(syncPartnerEarnings))

  return Response.json({ ok: true, count: affectedIds.length })
}
