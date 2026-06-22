import PublicRental from '@/components/public/PublicRental'
import { getSitePrices } from '@/lib/public-pricing'

export default async function ArabicRentalPage() {
  const sitePrices = await getSitePrices()
  return <PublicRental lang="ar" sitePrices={sitePrices} />
}
