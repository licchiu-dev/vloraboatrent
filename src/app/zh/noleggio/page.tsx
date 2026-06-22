import PublicRental from '@/components/public/PublicRental'
import { getSitePrices } from '@/lib/public-pricing'

export default async function ChineseRentalPage() {
  const sitePrices = await getSitePrices()
  return <PublicRental lang="zh" sitePrices={sitePrices} />
}
