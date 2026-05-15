import bcrypt from 'bcryptjs'
import { PrismaClient, BookingStatus, PartnerType, ProductCategory, TimeSlot } from '@prisma/client'
import { calcPartnerPrice, roundMoney } from '../src/lib/pricing'

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
  const password = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', password, name: 'Super Admin', role: 'SUPERADMIN' },
  })

  await prisma.user.upsert({
    where: { email: 'socio@example.com' },
    update: {},
    create: { email: 'socio@example.com', password, name: 'Socio Admin', role: 'ADMIN' },
  })

  for (const [name, category, basePrice] of products) {
    await prisma.product.upsert({
      where: { name },
      update: { category, basePrice, active: true },
      create: { name, category, basePrice, active: true },
    })
  }

  const partnerUsers = [
    {
      email: 'mario.partner@example.com',
      name: 'Mario Travels',
      companyName: 'Mario Travels Vlore',
      type: PartnerType.AGENZIA_TURISTICA,
      discountCode: 'SEARENT-MARIO26',
      defaultCommission: 12,
      phone: '+355 69 000 111',
    },
    {
      email: 'guide.partner@example.com',
      name: 'Arben Guide',
      companyName: 'Arben Sea Guide',
      type: PartnerType.GUIDA,
      discountCode: 'SEARENT-ARBEN26',
      defaultCommission: 15,
      phone: '+355 69 000 222',
    },
  ]

  const partners = []
  for (const data of partnerUsers) {
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: { email: data.email, password, name: data.name, role: 'PARTNER' },
    })

    const partner = await prisma.partner.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        companyName: data.companyName,
        type: data.type,
        discountCode: data.discountCode,
        defaultCommission: data.defaultCommission,
        phone: data.phone,
      },
    })
    partners.push(partner)
  }

  const allProducts = await prisma.product.findMany()
  await prisma.partnerPrice.upsert({
    where: { partnerId_productId: { partnerId: partners[0].id, productId: allProducts[0].id } },
    update: { fixedNetPrice: 125, commissionPct: null },
    create: { partnerId: partners[0].id, productId: allProducts[0].id, fixedNetPrice: 125 },
  })
  await prisma.partnerPrice.upsert({
    where: { partnerId_productId: { partnerId: partners[1].id, productId: allProducts[3].id } },
    update: { commissionPct: 18, fixedNetPrice: null },
    create: { partnerId: partners[1].id, productId: allProducts[3].id, commissionPct: 18 },
  })

  const customers = await Promise.all(
    ['Alex Johnson', 'Emma Brown', 'Luca Smith', 'Sara Wilson', 'Nora Hall'].map((name, index) =>
      prisma.customer.upsert({
        where: { email: `guest${index + 1}@example.com` },
        update: {},
        create: { name, email: `guest${index + 1}@example.com`, phone: `+39 333 000 00${index}` },
      })
    )
  )

  const statuses = [
    BookingStatus.PENDING,
    BookingStatus.CONFIRMED,
    BookingStatus.CANCELLED,
    BookingStatus.COMPLETED,
    BookingStatus.CONFIRMED,
  ]

  for (let i = 0; i < 5; i++) {
    const product = allProducts[i % allProducts.length]
    const partner = i % 2 === 0 ? partners[i % partners.length] : null
    const productForPricing = { ...product, partnerPrices: await prisma.partnerPrice.findMany({ where: { productId: product.id } }) }
    const partnerUnit = partner ? calcPartnerPrice(productForPricing, partner) : null
    const totalPublic = product.basePrice
    const totalPartner = partnerUnit ?? null
    const commission = partner ? roundMoney(totalPublic - (partnerUnit ?? totalPublic)) : null

    await prisma.booking.create({
      data: {
        customerId: customers[i].id,
        date: new Date(Date.now() + i * 86400000),
        timeSlot: i % 2 ? TimeSlot.MEZZA_GIORNATA : TimeSlot.GIORNATA_INTERA,
        status: statuses[i],
        partnerId: partner?.id,
        discountCode: partner?.discountCode,
        totalPublic,
        totalPartner,
        commission,
        notes: 'Seed booking',
        internalNotes: i === 0 ? 'Follow up availability' : null,
        createdBy: partner ? 'PARTNER' : 'WEBSITE',
        items: {
          create: {
            productId: product.id,
            quantity: 1,
            unitPrice: partnerUnit ?? product.basePrice,
            total: partnerUnit ?? product.basePrice,
          },
        },
      },
    })
  }

  await prisma.supplier.create({
    data: {
      name: 'Harbor Fuel',
      type: 'Fuel',
      contact: 'fuel@example.com',
      expenses: { create: { amount: 120, description: 'Fuel stock', date: new Date() } },
    },
  })
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
