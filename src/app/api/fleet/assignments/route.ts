import { apiRequireRole } from '@/lib/guards'
import { syncRentalItemsFromFleet } from '@/lib/fleet'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN', 'PARTNER'])
  if ('error' in guard) return guard.error
  const body = await request.json()

  const booking = await prisma.booking.findUnique({
    where: { id: body.bookingId },
    include: { fleetAssignments: true },
  })
  if (!booking) return Response.json({ error: 'Booking not found' }, { status: 404 })
  if (guard.session.user.role === 'PARTNER' && booking.partnerId !== guard.session.user.partnerId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const assetIds = Array.isArray(body.fleetAssetIds) ? body.fleetAssetIds : []
  const conflict = await prisma.bookingFleetAssignment.findFirst({
    where: {
      fleetAssetId: { in: assetIds },
      bookingId: { not: booking.id },
      booking: {
        date: booking.date,
        status: { not: 'CANCELLED' },
      },
    },
    include: { fleetAsset: true },
  })
  if (conflict) {
    return Response.json({ error: `${conflict.fleetAsset.name} is already assigned on this date.` }, { status: 409 })
  }

  await prisma.$transaction([
    prisma.bookingFleetAssignment.deleteMany({ where: { bookingId: booking.id } }),
    prisma.bookingFleetAssignment.createMany({
      data: assetIds.map((fleetAssetId: string) => ({ bookingId: booking.id, fleetAssetId })),
    }),
  ])

  const updated = await syncRentalItemsFromFleet(booking.id)
  return Response.json(updated)
}
