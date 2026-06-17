import type { Partner, PartnerPrice, Product } from '@prisma/client'

export type ProductWithPartnerPrices = Product & {
  partnerPrices?: PartnerPrice[]
}

export function calcPartnerPrice(product: ProductWithPartnerPrices, partner: Partner) {
  const custom = product.partnerPrices?.find((price) => price.partnerId === partner.id)
  if (custom?.fixedNetPrice != null) return custom.fixedNetPrice

  const commissionPct = custom?.commissionPct ?? partner.defaultCommission
  return roundMoney(product.basePrice * (1 - commissionPct / 100))
}

export function calcCommission(product: ProductWithPartnerPrices, partner: Partner, quantity = 1) {
  return roundMoney((product.basePrice - calcPartnerPrice(product, partner)) * quantity)
}

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100
}

// Total public revenue collected from the customer for a booking.
export function bookingRevenue(booking: { totalPublic: number | null }) {
  return booking.totalPublic ?? 0
}
