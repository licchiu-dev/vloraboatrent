import type { BookingStatus, TimeSlot } from '@prisma/client'
import { calcCommission, calcPartnerPrice, roundMoney } from './pricing'
import { prisma } from './prisma'

type BookingInput = {
  customer: { name: string; email: string; phone: string }
  date: string
  timeSlot: TimeSlot
  status: BookingStatus
  items: { productId: string; quantity: number }[]
  partnerId?: string | null
  discountCode?: string | null
  notes?: string | null
  internalNotes?: string | null
  createdBy: string
}

export async function createBooking(input: BookingInput) {
  const partner = input.partnerId
    ? await prisma.partner.findUnique({ where: { id: input.partnerId } })
    : input.discountCode
      ? await prisma.partner.findUnique({ where: { discountCode: input.discountCode } })
      : null

  const products = await prisma.product.findMany({
    where: { id: { in: input.items.map((item) => item.productId) }, active: true },
    include: { partnerPrices: true },
  })

  const lines = input.items
    .map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId)
      if (!product) return null
      const quantity = Math.max(1, Number(item.quantity) || 1)
      const publicTotal = product.basePrice * quantity
      const partnerUnit = partner ? calcPartnerPrice(product, partner) : product.basePrice
      return {
        product,
        quantity,
        publicTotal,
        partnerUnit,
        partnerTotal: partnerUnit * quantity,
        commission: partner ? calcCommission(product, partner, quantity) : 0,
      }
    })
    .filter(Boolean)

  const totalPublic = roundMoney(lines.reduce((sum, line) => sum + line!.publicTotal, 0))
  const totalPartner = partner ? roundMoney(lines.reduce((sum, line) => sum + line!.partnerTotal, 0)) : null
  const commission = partner ? roundMoney(lines.reduce((sum, line) => sum + line!.commission, 0)) : null

  const customer = await prisma.customer.upsert({
    where: { email: input.customer.email.toLowerCase() },
    update: { name: input.customer.name, phone: input.customer.phone },
    create: { ...input.customer, email: input.customer.email.toLowerCase() },
  })

  const booking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      date: new Date(input.date),
      timeSlot: input.timeSlot,
      status: input.status,
      partnerId: partner?.id,
      discountCode: partner?.discountCode ?? input.discountCode,
      totalPublic,
      totalPartner,
      commission,
      notes: input.notes,
      internalNotes: input.internalNotes,
      createdBy: input.createdBy,
      items: {
        create: lines.map((line) => ({
          productId: line!.product.id,
          quantity: line!.quantity,
          unitPrice: line!.partnerUnit,
          total: roundMoney(line!.partnerTotal),
        })),
      },
    },
  })

  if (partner && commission) {
    await prisma.partner.update({
      where: { id: partner.id },
      data: {
        totalEarnings: { increment: commission },
        pendingEarnings: { increment: commission },
      },
    })
  }

  // TODO: EMAIL — collegare nodemailer/Resend per conferma prenotazione al cliente e notifica nuova prenotazione all'admin.
  // TODO: STRIPE — integrare pagamento online nel form sito.
  // TODO: AVAILABILITY — logica disponibilità in tempo reale basata su numero barche disponibili per data/slot.
  return booking
}
