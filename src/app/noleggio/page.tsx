import type { Metadata } from 'next'
import PublicRental from '@/components/public/PublicRental'

export const metadata: Metadata = {
  title: 'Boat Rentals — Valona Fishing',
  description: 'Rent a license-free boat and discover the most beautiful coves. Modern fleet, briefing included.',
}

export default function NoleggioPage() {
  return <PublicRental lang="en" />
}
