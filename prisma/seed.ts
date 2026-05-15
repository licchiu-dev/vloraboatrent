import bcrypt from 'bcryptjs'
import { PrismaClient, ProductCategory } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  ['Noleggio Gommone - Mezza giornata', ProductCategory.NOLEGGIO, 150],
  ['Noleggio Gommone - Giornata intera', ProductCategory.NOLEGGIO, 230],
  ['Esperienza di Pesca - Mezza giornata', ProductCategory.ESPERIENZA, 80],
  ['Esperienza di Pesca - Giornata intera', ProductCategory.ESPERIENZA, 100],
  ['Kit Snorkeling', ProductCategory.EXTRA, 10],
  ['Action Cam', ProductCategory.EXTRA, 50],
  ['Set Tramonto', ProductCategory.EXTRA, 25],
  ['Attrezzatura Pesca', ProductCategory.EXTRA, 20],
  ['Canna + Mulinello', ProductCategory.EXTRA, 15],
  ['Esca', ProductCategory.EXTRA, 10],
  ['Artificiale', ProductCategory.EXTRA, 5],
  ['Maschera + Boccaglio', ProductCategory.EXTRA, 10],
  ['Pinne', ProductCategory.EXTRA, 10],
  ['Muta 3 mm', ProductCategory.EXTRA, 20],
  ['Calzari', ProductCategory.EXTRA, 5],
  ['Cintura + Pesi', ProductCategory.EXTRA, 10],
  ['Fucile Sub', ProductCategory.EXTRA, 25],
  ['Torcia Sub', ProductCategory.EXTRA, 15],
] as const

async function main() {
  const rawPassword = process.env.SUPERADMIN_PASSWORD
  const email = process.env.SUPERADMIN_EMAIL

  if (!rawPassword || !email) {
    throw new Error('SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD env vars are required to run the seed.')
  }

  const password = await bcrypt.hash(rawPassword, 10)

  await prisma.user.upsert({
    where: { email },
    update: { password, name: 'Pantaleo Sergio', role: 'SUPERADMIN', active: true },
    create: { email, password, name: 'Pantaleo Sergio', role: 'SUPERADMIN' },
  })

  for (const [name, category, basePrice] of products) {
    await prisma.product.upsert({
      where: { name },
      update: { category, basePrice, active: true },
      create: { name, category, basePrice, active: true },
    })
  }

}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
