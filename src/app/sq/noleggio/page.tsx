import PublicRental from '@/components/public/PublicRental'
import { getSitePrices } from '@/lib/public-pricing'

export const metadata = {
  title: 'Qira Gomonish — VLORA RENT A BOAT',
  description: 'Merr me qira një gomon pa patentë dhe zbulo gjiret më të bukura të Vlorës.',
}

export default async function AlbanianRentalPage() {
  const sitePrices = await getSitePrices()
  return <PublicRental lang="sq" sitePrices={sitePrices} />
}
