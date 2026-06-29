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

  const existingRentalUnits = booking.items
    .filter((item) => item.product.category === 'NOLEGGIO')
    .flatMap((item) => Array.from({ length: item.quantity }, () => ({
      product: item.product,
      unitPrice: item.unitPrice,
    })))

  const rentalCounts = new Map<string, {
    product: typeof booking.fleetAssignments[number]['fleetAsset']['pricingProduct'];
    quantity: number;
    unitPrices: number[];
  }>()
  for (const [index, assignment] of booking.fleetAssignments.entries()) {
    const fallbackProduct = assignment.fleetAsset.pricingProduct
    const existingUnit = existingRentalUnits[index]
    const product = existingUnit?.product ?? fallbackProduct
    const unitPrice = existingUnit?.unitPrice ?? fallbackProduct.basePrice
    const current = rentalCounts.get(product.id)
    rentalCounts.set(product.id, {
      product,
      quantity: (current?.quantity ?? 0) + 1,
      unitPrices: [...(current?.unitPrices ?? []), unitPrice],
    })
  }

  if (rentalCounts.size === 0) return booking

  const retainedItems = booking.items.filter((item) => item.product.category !== 'NOLEGGIO')
  const rentalLines = [...rentalCounts.values()].map(({ product, quantity, unitPrices }) => {
    const publicTotal = unitPrices.reduce((sum, unitPrice) => sum + unitPrice, 0)
    const publicUnit = quantity > 0 ? roundMoney(publicTotal / quantity) : product.basePrice
    const partnerUnit = booking.partner ? calcPartnerPrice(product, booking.partner) : publicUnit
    return {
      product,
      quantity,
      unitPrice: publicUnit,
      total: roundMoney(publicUnit * quantity),
      publicTotal,
      partnerTotal: partnerUnit * quantity,
      commission: booking.partner ? roundMoney(publicTotal - partnerUnit * quantity) : 0,
    }
  })

  const retainedPublic = retainedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
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
