import type { Metadata } from 'next'
import PublicRental from '@/components/public/PublicRental'
import { getSitePrices } from '@/lib/public-pricing'

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
  const sitePrices = await getSitePrices()
  return <PublicRental lang="en" sitePrices={sitePrices} />
}
