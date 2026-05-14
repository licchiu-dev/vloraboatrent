import { ProductCategory } from '@prisma/client'
import { isDemoMode } from './demo'
import { prisma } from './prisma'

export async function getMinimumProductPrice(category: ProductCategory) {
  if (isDemoMode()) {
    if (category === ProductCategory.NOLEGGIO) return 150
    if (category === ProductCategory.ESPERIENZA) return 80
    return null
  }

  const result = await prisma.product.aggregate({
    where: { category, active: true },
    _min: { basePrice: true },
  })

  return result._min.basePrice
}

export function formatEuroPrice(value: number | null | undefined, fallback = '€XX') {
  if (value == null) return fallback
  return `€${value.toLocaleString('it-IT', { maximumFractionDigits: 0 })}`
}
