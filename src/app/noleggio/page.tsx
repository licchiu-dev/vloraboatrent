import type { Metadata } from 'next'
import { ProductCategory } from '@prisma/client'
import PublicRental from '@/components/public/PublicRental'
import { formatEuroPrice, getMinimumProductPrice } from '@/lib/public-pricing'

export const metadata: Metadata = {
  title: 'Boat Rental Vlora Albania — No License Required',
  description:
    'Rent a boat in Vlora, Albania without a license. Explore the Albanian Riviera, hidden coves, and crystal-clear waters. Full briefing included. Book online.',
  alternates: { canonical: 'https://vloraboatrent.com/noleggio' },
  openGraph: {
    title: 'Boat Rental Vlora Albania — No License Required',
    description:
      'Rent a boat in Vlora, Albania without a license. Explore the Albanian Riviera, hidden coves, and crystal-clear waters.',
    url: 'https://vloraboatrent.com/noleggio',
  },
}

export default async function NoleggioPage() {
  const startingPrice = formatEuroPrice(await getMinimumProductPrice(ProductCategory.NOLEGGIO))
  return <PublicRental lang="en" startingPrice={startingPrice} />
}
