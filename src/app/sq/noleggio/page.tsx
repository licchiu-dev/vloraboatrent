import { ProductCategory } from '@prisma/client'
import PublicRental from '@/components/public/PublicRental'
import { formatEuroPrice, getMinimumProductPrice } from '@/lib/public-pricing'

export const metadata = {
  title: 'Qira Gomonish — VLORA RENT A BOAT',
  description: 'Merr me qira një gomon pa patentë dhe zbulo gjiret më të bukura të Vlorës.',
}

export default async function AlbanianRentalPage() {
  const startingPrice = formatEuroPrice(await getMinimumProductPrice(ProductCategory.NOLEGGIO))
  return <PublicRental lang="sq" startingPrice={startingPrice} />
}
