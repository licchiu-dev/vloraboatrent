import { prisma } from './prisma'
import { calcCommission, calcPartnerPrice, roundMoney } from './pricing'

export async function syncRentalItemsFromFleet(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      partner: true,
      items: { include: { product: { include: { partnerPrices: true } } } },
      fleetAssignments: { include: { fleetAsset: { include: { pricingProduct: { include: { partnerPrices: true } } } } } },
    },
  })
  if (!booking) return null

  const hasRentalItems = booking.items.some((item) => item.product.category === 'NOLEGGIO')
  if (!hasRentalItems) return booking

  const rentalCounts = new Map<string, { product: typeof booking.fleetAssignments[number]['fleetAsset']['pricingProduct']; quantity: number }>()
  for (const assignment of booking.fleetAssignments) {
    const product = assignment.fleetAsset.pricingProduct
    const current = rentalCounts.get(product.id)
    rentalCounts.set(product.id, { product, quantity: (current?.quantity ?? 0) + 1 })
  }

  if (rentalCounts.size === 0) return booking

  const retainedItems = booking.items.filter((item) => item.product.category !== 'NOLEGGIO')
  const rentalLines = [...rentalCounts.values()].map(({ product, quantity }) => {
    const publicTotal = product.basePrice * quantity
    const partnerUnit = booking.partner ? calcPartnerPrice(product, booking.partner) : product.basePrice
    return {
      product,
      quantity,
      unitPrice: partnerUnit,
      total: roundMoney(partnerUnit * quantity),
      publicTotal,
      partnerTotal: partnerUnit * quantity,
      commission: booking.partner ? calcCommission(product, booking.partner, quantity) : 0,
    }
  })

  const retainedPublic = retainedItems.reduce((sum, item) => sum + item.product.basePrice * item.quantity, 0)
  const retainedPartner = retainedItems.reduce((sum, item) => sum + item.total, 0)
  const retainedCommission = booking.partner
    ? retainedItems.reduce((sum, item) => sum + calcCommission(item.product, booking.partner!, item.quantity), 0)
    : 0

  const totalPublic = roundMoney(retainedPublic + rentalLines.reduce((sum, line) => sum + line.publicTotal, 0))
  const totalPartner = booking.partner
    ? roundMoney(retainedPartner + rentalLines.reduce((sum, line) => sum + line.partnerTotal, 0))
    : null
  const commission = booking.partner
    ? roundMoney(retainedCommission + rentalLines.reduce((sum, line) => sum + line.commission, 0))
    : null

  await prisma.$transaction([
    prisma.bookingItem.deleteMany({
      where: {
        bookingId,
        product: { category: 'NOLEGGIO' },
      },
    }),
    prisma.bookingItem.createMany({
      data: rentalLines.map((line) => ({
        bookingId,
        productId: line.product.id,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        total: line.total,
      })),
    }),
    prisma.booking.update({
      where: { id: bookingId },
      data: { totalPublic, totalPartner, commission },
    }),
  ])

  return prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: true,
      partner: true,
      items: { include: { product: true } },
      fleetAssignments: { include: { fleetAsset: true } },
    },
  })
}
