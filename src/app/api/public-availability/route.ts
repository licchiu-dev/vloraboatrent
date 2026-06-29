import { prisma } from '@/lib/prisma'
import { rentalBoatKind, rentalPriceForDate } from '@/lib/rental-pricing'

function validDate(value: string | null) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function blockedSlots(booking: { timeSlot: string; halfDayPeriod: string | null }) {
  if (booking.timeSlot === 'GIORNATA_INTERA') return ['MATTINA', 'POMERIGGIO']
  if (booking.halfDayPeriod === 'MATTINA') return ['MATTINA']
  if (booking.halfDayPeriod === 'POMERIGGIO') return ['POMERIGGIO']
  return ['MATTINA', 'POMERIGGIO']
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const from = validDate(url.searchParams.get('from'))
  const to = validDate(url.searchParams.get('to'))

  if (!from || !to) {
    return Response.json({ error: 'from and to are required in YYYY-MM-DD format.' }, { status: 400 })
  }

  const assets = await prisma.fleetAsset.findMany({
    where: { active: true },
    include: {
      pricingProduct: { select: { id: true, name: true, basePrice: true } },
      assignments: {
        where: {
          booking: {
            date: { gte: new Date(from), lte: new Date(to) },
            status: { not: 'CANCELLED' },
          },
        },
        select: {
          booking: {
            select: {
              date: true,
              timeSlot: true,
              halfDayPeriod: true,
            },
          },
        },
      },
    },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  })

  return Response.json({
    assets: assets.map((asset) => {
      const kind = rentalBoatKind({ name: asset.name, category: asset.category })
      const booked: Record<string, string[]> = {}

      for (const assignment of asset.assignments) {
        const key = dayKey(assignment.booking.date)
        booked[key] = [...new Set([...(booked[key] ?? []), ...blockedSlots(assignment.booking)])]
      }

      return {
        id: asset.id,
        name: asset.name,
        category: asset.category,
        kind,
        productId: asset.pricingProductId,
        productName: asset.pricingProduct.name,
        booked,
        prices: {
          fullDay: rentalPriceForDate(kind, 'GIORNATA_INTERA', from),
          halfDay: rentalPriceForDate(kind, 'MATTINA', from),
        },
      }
    }),
  })
}
