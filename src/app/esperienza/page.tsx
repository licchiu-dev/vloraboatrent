import type { Metadata } from 'next'
import PublicFishing from '@/components/public/PublicFishing'

export const metadata: Metadata = {
  title: 'Fishing Experience — VLORA RENT A BOAT',
  description: 'An unforgettable fishing day with expert local guides. Rod fishing, freediving, secret spots and rental equipment.',
}

export default function EsperienzaPage() {
  return <PublicFishing lang="en" />
}
