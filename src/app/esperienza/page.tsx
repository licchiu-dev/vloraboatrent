import type { Metadata } from 'next'
import PublicFishing from '@/components/public/PublicFishing'

export const metadata: Metadata = {
  title: 'Fishing Experience Vlora Albania — Local Expert Guides',
  description:
    'Join a fishing experience in Vlora, Albania with local expert guides. Rod fishing, freediving, secret spots, and all equipment included. Best boat fishing in Albania.',
  alternates: { canonical: 'https://vloraboatrent.com/esperienza' },
  openGraph: {
    title: 'Fishing Experience Vlora Albania — Local Expert Guides',
    description:
      'Join a fishing experience in Vlora, Albania with local expert guides. Rod fishing, freediving, secret spots, and all equipment included.',
    url: 'https://vloraboatrent.com/esperienza',
  },
}

export default function EsperienzaPage() {
  return <PublicFishing lang="en" />
}
