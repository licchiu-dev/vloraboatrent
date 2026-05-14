import { ProductCategory } from '@prisma/client'
import PublicRental from '@/components/public/PublicRental'
import { formatEuroPrice, getMinimumProductPrice } from '@/lib/public-pricing'

export default async function ArabicRentalPage() {
  const startingPrice = formatEuroPrice(await getMinimumProductPrice(ProductCategory.NOLEGGIO))
  return <PublicRental lang="ar" startingPrice={startingPrice} />
}
