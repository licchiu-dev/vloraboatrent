import PublicRental from '@/components/public/PublicRental'
import { getSitePrices } from '@/lib/public-pricing'

export default async function RussianRentalPage() {
  const sitePrices = await getSitePrices()
  return <PublicRental lang="ru" sitePrices={sitePrices} />
}
