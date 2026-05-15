import type { Metadata } from 'next'
import PublicHome from '@/components/public/PublicHome'

export const metadata: Metadata = {
  title: 'Boat Rent Albania — Vlora Boat Rental & Sea Experiences',
  description:
    'Best boat rental in Albania. Rent a boat in Vlora without a license, join a fishing experience or book a sea excursion along the Albanian Riviera. Easy online booking.',
  alternates: { canonical: 'https://vloraboatrent.com' },
  openGraph: {
    title: 'Boat Rent Albania — Vlora Boat Rental & Sea Experiences',
    description:
      'Best boat rental in Albania. Rent a boat in Vlora without a license, join a fishing experience or book a sea excursion along the Albanian Riviera.',
    url: 'https://vloraboatrent.com',
  },
}

export default function HomePage() {
  return <PublicHome lang="en" />
}
