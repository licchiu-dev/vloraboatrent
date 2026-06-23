import { BookingStatus, PaymentInstrument, PaymentMethod, TimeSlot } from '@prisma/client'
import { createBooking } from '@/lib/bookings'
import { apiRequireRole } from '@/lib/guards'
import { notifyAdminNewBooking } from '@/lib/notifications'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN', 'PARTNER'])
  if ('error' in guard) return guard.error

  const where = guard.session.user.role === 'PARTNER' ? { partnerId: guard.session.user.partnerId } : {}
  const bookings = await prisma.booking.findMany({
    where,
    include: {
      customer: true,
      partner: true,
      items: { include: { product: true } },
      fleetAssignments: true,
    },
    orderBy: { date: 'desc' },
  })
  return Response.json(bookings)
}

export async function POST(request: Request) {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN', 'PARTNER'])
  if ('error' in guard) return guard.error
  const body = await request.json()
  const isPartner = guard.session.user.role === 'PARTNER'

  const booking = await createBooking({
    customer: body.customer,
    date: body.date,
    timeSlot: body.timeSlot in TimeSlot ? body.timeSlot : 'GIORNATA_INTERA',
    status: isPartner ? BookingStatus.PENDING : body.status ?? BookingStatus.CONFIRMED,
    paymentMethod: body.paymentMethod in PaymentMethod ? body.paymentMethod : PaymentMethod.MOLO,
    paymentInstrument: body.paymentInstrument in PaymentInstrument ? body.paymentInstrument : null,
    items: body.items ?? [],
    partnerId: isPartner ? guard.session.user.partnerId : body.partnerId,
    discountCode: body.discountCode,
    notes: body.notes,
    internalNotes: isPartner ? null : body.internalNotes,
    createdBy: isPartner ? 'PARTNER' : 'ADMIN',
    totalPublicOverride: isPartner ? undefined : (body.totalPublic != null ? Number(body.totalPublic) : undefined),
    totalPartnerOverride: isPartner ? undefined : (body.totalPartner != null ? Number(body.totalPartner) : undefined),
    commissionOverride: isPartner ? undefined : (body.commission != null ? Number(body.commission) : undefined),
  })

  if (isPartner) {
    const partner = guard.session.user.partnerId
      ? await prisma.partner.findUnique({ where: { id: guard.session.user.partnerId } })
      : null

    await notifyAdminNewBooking({
      bookingId: booking.id,
      source: 'PARTNER',
      customerName: body.customer.name,
      customerEmail: body.customer.email,
      customerPhone: body.customer.phone,
      date: body.date,
      timeSlot: booking.timeSlot,
      status: booking.status,
      partnerName: partner?.companyName,
      notes: body.notes,
    })
  }

  return Response.json(booking)
}
