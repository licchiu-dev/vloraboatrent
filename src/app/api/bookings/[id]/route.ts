import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'
import { calcCommission, calcPartnerPrice, roundMoney } from '@/lib/pricing'

// Recalculates totalEarnings and pendingEarnings for a partner from their bookings and payments.
async function syncPartnerEarnings(partnerId: string) {
  const [bookings, payments] = await Promise.all([
    prisma.booking.findMany({
      where: { partnerId, status: { in: ['CONFIRMED', 'COMPLETED'] } },
      select: { commission: true },
    }),
    prisma.commissionPayment.findMany({
      where: { partnerId },
      select: { amount: true },
    }),
  ])
  const totalEarnings = roundMoney(bookings.reduce((s, b) => s + (b.commission ?? 0), 0))
  const paid = roundMoney(payments.reduce((s, p) => s + p.amount, 0))
  const pendingEarnings = roundMoney(Math.max(0, totalEarnings - paid))
  await prisma.partner.update({ where: { id: partnerId }, data: { totalEarnings, pendingEarnings } })
}

function customerData(body: unknown) {
  if (!body || typeof body !== 'object') return null
  const customer = (body as { customer?: unknown }).customer
  if (!customer || typeof customer !== 'object') return null
  const payload = customer as { name?: unknown; email?: unknown; phone?: unknown }
  return {
    name: typeof payload.name === 'string' ? payload.name : undefined,
    email: typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : undefined,
    phone: typeof payload.phone === 'string' ? payload.phone : undefined,
  }
}

async function updateBookingCustomer(bookingId: string, data: { name?: string; email?: string; phone?: string }) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { customerId: true },
  })
  if (!booking) return

  const usedByBookings = await prisma.booking.count({ where: { customerId: booking.customerId } })
  if (usedByBookings > 1) {
    const existing = await prisma.customer.findUnique({ where: { id: booking.customerId } })
    if (!existing) return
    const customer = await prisma.customer.create({
      data: {
        name: data.name ?? existing.name,
        email: data.email ?? existing.email,
        phone: data.phone ?? existing.phone,
      },
    })
    await prisma.booking.update({ where: { id: bookingId }, data: { customerId: customer.id } })
    return
  }

  await prisma.customer.update({
    where: { id: booking.customerId },
    data,
  })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN', 'PARTNER'])
  if ('error' in guard) return guard.error
  const { id } = await params
  const body = await request.json()
  const isPartner = guard.session.user.role === 'PARTNER'

  // Partners can only edit bookings that belong to them
  if (isPartner) {
    const booking = await prisma.booking.findUnique({ where: { id }, select: { partnerId: true, status: true, fuelAmount: true } })
    if (!booking || booking.partnerId !== guard.session.user.partnerId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (body.status === 'COMPLETED') {
      const nextFuelAmount = body.fuelAmount !== undefined
        ? (body.fuelAmount === '' || body.fuelAmount === null ? null : Number(body.fuelAmount))
        : booking.fuelAmount
      if (booking.status !== 'COMPLETED' && (nextFuelAmount == null || Number.isNaN(nextFuelAmount) || nextFuelAmount < 0)) {
        return Response.json({ error: 'Fuel amount is required before completing the booking.' }, { status: 400 })
      }
    }
    const customer = customerData(body)
    const updated = await prisma.$transaction(async (tx) => {
      if (customer) {
        const current = await tx.booking.findUnique({ where: { id }, select: { customerId: true } })
        if (current) {
          const usedByBookings = await tx.booking.count({ where: { customerId: current.customerId } })
          if (usedByBookings > 1) {
            const existing = await tx.customer.findUnique({ where: { id: current.customerId } })
            if (existing) {
              const nextCustomer = await tx.customer.create({
                data: {
                  name: customer.name ?? existing.name,
                  email: customer.email ?? existing.email,
                  phone: customer.phone ?? existing.phone,
                },
              })
              await tx.booking.update({ where: { id }, data: { customerId: nextCustomer.id } })
            }
          } else {
            await tx.customer.update({ where: { id: current.customerId }, data: customer })
          }
        }
      }
      return tx.booking.update({
        where: { id },
        data: {
          date: body.date ? new Date(body.date) : undefined,
          timeSlot: body.timeSlot,
          halfDayPeriod: body.halfDayPeriod !== undefined ? (body.halfDayPeriod || null) : undefined,
          notes: body.notes !== undefined ? (body.notes || null) : undefined,
          status: body.status,
          fuelAmount: body.fuelAmount !== undefined ? (body.fuelAmount === '' || body.fuelAmount === null ? null : Number(body.fuelAmount)) : undefined,
        },
      })
    })
    // Sync partner totals if status changed (e.g. PENDING→CONFIRMED)
    if (body.status && booking.partnerId) await syncPartnerEarnings(booking.partnerId)
    return Response.json(updated)
  }

  // --- SUPERADMIN / ADMIN below ---
  const customer = customerData(body)
  if (customer) await updateBookingCustomer(id, customer)

  if (body.status === 'COMPLETED') {
    const current = await prisma.booking.findUnique({
      where: { id },
      select: { status: true, fuelAmount: true },
    })
    const nextFuelAmount = body.fuelAmount !== undefined
      ? (body.fuelAmount === '' || body.fuelAmount === null ? null : Number(body.fuelAmount))
      : current?.fuelAmount
    if (current?.status !== 'COMPLETED' && (nextFuelAmount == null || Number.isNaN(nextFuelAmount) || nextFuelAmount < 0)) {
      return Response.json({ error: 'Fuel amount is required before completing the booking.' }, { status: 400 })
    }
  }

  if (Array.isArray(body.items)) {
    // Desired state: full list of items. Items with `id` are kept/updated;
    // items without `id` are created; existing items absent from the list
    // are deleted. Totals are always recomputed from catalog prices so that
    // Public price = listino (basePrice × qty), regardless of partner rates.
    type SubmittedItem = { id?: string; productId: string; quantity: number; unitPrice?: number }
    const submitted = (body.items as SubmittedItem[]).filter((s) => s.productId)

    const [existingItems, products, bookingWithPartner] = await Promise.all([
      prisma.bookingItem.findMany({ where: { bookingId: id } }),
      prisma.product.findMany({
        where: { id: { in: submitted.map((s) => s.productId) } },
        include: { partnerPrices: true },
      }),
      prisma.booking.findUnique({ where: { id }, include: { partner: true } }),
    ])

    const partner = bookingWithPartner?.partner ?? null
    const existingIds = new Set(existingItems.map((e) => e.id))
    const keptIds = new Set(submitted.map((s) => s.id).filter(Boolean) as string[])
    const toDeleteIds = [...existingIds].filter((eid) => !keptIds.has(eid))

    // Build per-line pricing.
    // publicUnit: admin-set price (falls back to catalog basePrice) — this IS what customer pays.
    // partnerUnit: partner net price for commission calculation only.
    const lines = submitted
      .map((s) => {
        const product = products.find((p) => p.id === s.productId)
        if (!product) return null
        const qty = Math.max(1, Number(s.quantity) || 1)
        const publicUnit = s.unitPrice != null ? Math.max(0, Number(s.unitPrice)) : product.basePrice
        const partnerUnit = partner ? calcPartnerPrice(product, partner) : publicUnit
        return { s, product, qty, publicUnit, partnerUnit }
      })
      .filter((l): l is NonNullable<typeof l> => l !== null)

    const totalPublic = roundMoney(lines.reduce((sum, l) => sum + l.publicUnit * l.qty, 0))
    const totalPartner = partner ? roundMoney(lines.reduce((sum, l) => sum + l.partnerUnit * l.qty, 0)) : null
    const commission = partner ? roundMoney(totalPublic - (totalPartner ?? 0)) : null

    await prisma.$transaction(async (tx) => {
      if (toDeleteIds.length) {
        await tx.bookingItem.deleteMany({ where: { id: { in: toDeleteIds } } })
      }
      for (const line of lines) {
        if (line.s.id && keptIds.has(line.s.id)) {
          await tx.bookingItem.update({
            where: { id: line.s.id },
            data: {
              productId: line.product.id,
              quantity: line.qty,
              unitPrice: line.publicUnit,
              total: roundMoney(line.publicUnit * line.qty),
            },
          })
        } else {
          await tx.bookingItem.create({
            data: {
              bookingId: id,
              productId: line.product.id,
              quantity: line.qty,
              unitPrice: line.publicUnit,
              total: roundMoney(line.publicUnit * line.qty),
            },
          })
        }
      }
      await tx.booking.update({ where: { id }, data: { totalPublic, totalPartner, commission } })
    })
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: body.status,
      paymentMethod: body.paymentMethod,
      paymentInstrument: body.paymentInstrument !== undefined ? (body.paymentInstrument || null) : undefined,
      notes: body.notes !== undefined ? (body.notes || null) : undefined,
      internalNotes: body.internalNotes !== undefined ? (body.internalNotes || null) : undefined,
      date: body.date ? new Date(body.date) : undefined,
      timeSlot: body.timeSlot,
      halfDayPeriod: body.halfDayPeriod !== undefined ? (body.halfDayPeriod || null) : undefined,
      totalPublic: body.totalPublic !== undefined ? Number(body.totalPublic) : undefined,
      totalPartner: body.totalPartner !== undefined ? (body.totalPartner === '' || body.totalPartner === null ? null : Number(body.totalPartner)) : undefined,
      commission: body.commission !== undefined ? (body.commission === '' || body.commission === null ? null : Number(body.commission)) : undefined,
      fuelLiters: body.fuelLiters !== undefined ? (body.fuelLiters === '' || body.fuelLiters === null ? null : Number(body.fuelLiters)) : undefined,
      fuelAmount: body.fuelAmount !== undefined ? (body.fuelAmount === '' || body.fuelAmount === null ? null : Number(body.fuelAmount)) : undefined,
      fuelPaymentInstrument: body.fuelPaymentInstrument !== undefined ? (body.fuelPaymentInstrument || null) : undefined,
      partnerId: body.partnerId !== undefined ? (body.partnerId || null) : undefined,
      discountCode: body.discountCode !== undefined ? (body.discountCode || null) : undefined,
    },
  })

  // Sync partner totals whenever commission/status/partner changes
  const affectsEarnings = body.commission !== undefined || body.status !== undefined || body.partnerId !== undefined
  if (affectsEarnings && booking.partnerId) await syncPartnerEarnings(booking.partnerId)

  return Response.json(booking)
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN'])
  if ('error' in guard) return guard.error
  const { id } = await params
  const booking = await prisma.booking.findUnique({ where: { id }, select: { partnerId: true } })
  await prisma.booking.delete({ where: { id } })
  if (booking?.partnerId) await syncPartnerEarnings(booking.partnerId)
  return Response.json({ ok: true })
}
