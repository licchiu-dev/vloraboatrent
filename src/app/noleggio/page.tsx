import type { Metadata } from 'next'
import { ProductCategory } from '@prisma/client'
import PublicRental from '@/components/public/PublicRental'
import { formatEuroPrice, getMinimumProductPrice } from '@/lib/public-pricing'

export const metadata: Metadata = {
  title: 'Boat Rentals — VLORA RENT A BOAT',
  description: 'Rent a license-free boat and discover the most beautiful coves. Modern fleet, briefing included.',
}

export default async function NoleggioPage() {
  const startingPrice = formatEuroPrice(await getMinimumProductPrice(ProductCategory.NOLEGGIO))
  return <PublicRental lang="en" startingPrice={startingPrice} />
}
