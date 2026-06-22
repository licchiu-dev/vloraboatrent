import PublicRental from '@/components/public/PublicRental'
import { getSitePrices } from '@/lib/public-pricing'

export const metadata = {
  title: 'Noleggio Gommoni — VLORA RENT A BOAT',
  description: 'Noleggia un gommone senza patente e scopri le calette più belle di Valona.',
}

export default async function ItalianRentalPage() {
  const sitePrices = await getSitePrices()
  return <PublicRental lang="it" sitePrices={sitePrices} />
}
