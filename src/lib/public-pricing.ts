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

export async function getProductPricesByName(names: string[]) {
  if (isDemoMode()) {
    const demoPrices: Record<string, number> = {
      'Esperienza di Pesca - Giornata intera': 100,
      'Canna + Mulinello': 15,
      Esca: 10,
      Artificiale: 5,
      'Action Cam': 50,
      'Maschera + Boccaglio': 10,
      Pinne: 10,
      'Muta 3 mm': 20,
      Calzari: 5,
      'Cintura + Pesi': 10,
      'Fucile Sub': 25,
      'Torcia Sub': 15,
    }

    return Object.fromEntries(names.flatMap((name) => (demoPrices[name] == null ? [] : [[name, demoPrices[name]]])))
  }

  const products = await prisma.product.findMany({
    where: { name: { in: names }, active: true },
    select: { name: true, basePrice: true },
  })

  return Object.fromEntries(products.map((product) => [product.name, product.basePrice]))
}

export function formatEuroPrice(value: number | null | undefined, fallback = '€XX') {
  if (value == null) return fallback
  return `€${value.toLocaleString('it-IT', { maximumFractionDigits: 0 })}`
}

export async function getSitePrices(): Promise<Record<string, string>> {
  if (isDemoMode()) {
    return { gommone: '€200', gommone_piccolo: '€180', barca: '€230' }
  }
  const rows = await prisma.sitePrice.findMany()
  const defaults: Record<string, number> = { gommone: 200, gommone_piccolo: 180, barca: 230 }
  const all = { ...defaults, ...Object.fromEntries(rows.map((r) => [r.key, r.price])) }
  return Object.fromEntries(Object.entries(all).map(([k, v]) => [k, formatEuroPrice(v)]))
}
