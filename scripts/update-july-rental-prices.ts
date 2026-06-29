import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sitePrices = [
  { key: 'gommone', label: 'Gommone grande', price: 200 },
  { key: 'gommone_piccolo', label: 'Gommone piccolo', price: 180 },
  { key: 'barca', label: 'Barca', price: 230 },
]

const products = [
  ['Noleggio Gommone Grande', 'NOLEGGIO', 200],
  ['Noleggio Gommone Piccolo', 'NOLEGGIO', 180],
  ['Noleggio Barca', 'NOLEGGIO', 230],
  ['Snorkeling Kit', 'EXTRA', 10],
  ['Cooler Box', 'EXTRA', 50],
] as const

async function main() {
  for (const row of sitePrices) {
    await prisma.sitePrice.upsert({
      where: { key: row.key },
      update: { label: row.label, price: row.price },
      create: row,
    })
  }

  await prisma.product.updateMany({
    where: {
      category: { in: ['NOLEGGIO', 'EXTRA'] },
      name: { notIn: products.map(([name]) => name) },
    },
    data: { active: false },
  })

  for (const [name, category, basePrice] of products) {
    await prisma.product.upsert({
      where: { name },
      update: { category, basePrice, active: true },
      create: { name, category, basePrice, active: true },
    })
  }

  console.log(`Updated site prices: ${sitePrices.map((row) => `${row.key}=EUR ${row.price}`).join(', ')}`)
  console.log(`Active simplified products: ${products.length}`)
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
