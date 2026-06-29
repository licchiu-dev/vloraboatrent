import { createBooking } from '@/lib/bookings'
import { notifyPublicBooking } from '@/lib/notifications'
import { prisma } from '@/lib/prisma'
import { rentalBoatKind, rentalPriceForDate, rentalProductNameForDate, slotLabel } from '@/lib/rental-pricing'

function blocksSlot(booking: { timeSlot: string; halfDayPeriod: string | null }, requested: string) {
  if (booking.timeSlot === 'GIORNATA_INTERA' || requested === 'GIORNATA_INTERA') return true
  if (!booking.halfDayPeriod) return true
  return booking.halfDayPeriod === requested
}

export async function POST(request: Request) {
  const body = await request.json()
  const requestedRentalSlot = body.tipo === 'noleggio' ? 'GIORNATA_INTERA' : null
  const rentalAsset = body.tipo === 'noleggio' && body.assetId && requestedRentalSlot
    ? await prisma.fleetAsset.findFirst({
        where: { id: body.assetId, active: true },
        include: {
          pricingProduct: true,
          assignments: {
            where: {
              booking: {
                date: new Date(body.data),
                status: { not: 'CANCELLED' },
              },
            },
            select: { booking: { select: { timeSlot: true, halfDayPeriod: true } } },
          },
        },
      })
    : null

  if (body.tipo === 'noleggio' && body.assetId && !rentalAsset) {
    return Response.json({ error: 'Boat not available.' }, { status: 409 })
  }

  if (rentalAsset && requestedRentalSlot) {
    const conflict = rentalAsset.assignments.some((assignment) => blocksSlot(assignment.booking, requestedRentalSlot))
    if (conflict) return Response.json({ error: 'Selected slot is no longer available.' }, { status: 409 })
  }

  const rentalKind = rentalAsset ? rentalBoatKind({ name: rentalAsset.name, category: rentalAsset.category }) : null
  const product = rentalAsset && requestedRentalSlot && rentalKind
    ? rentalProductNameForDate(rentalKind, requestedRentalSlot, body.data) ?? rentalAsset.pricingProduct.name
    : body.tipo === 'esperienza'
    ? 'Esperienza di Pesca - Giornata intera'
    : body.fascia === 'Mezza giornata' ? 'Noleggio Gommone - Mezza giornata' : 'Noleggio Gommone - Giornata intera'

  const products = await import('@/lib/prisma').then(({ prisma }) =>
    prisma.product.findMany({
      where: {
        name: {
          in: [
            product,
            'Snorkeling Kit',
            'Cooler Box',
            'Canna + Mulinello',
            'Esca',
            'Artificiale',
            'Maschera + Boccaglio',
            'Pinne',
            'Muta 3 mm',
            'Calzari',
            'Cintura + Pesi',
            'Fucile Sub',
            'Torcia Sub',
          ],
        },
      },
    })
  )
  const byName = new Map(products.map((item) => [item.name, item]))
  const mainProductId = byName.get(product)?.id ?? rentalAsset?.pricingProductId
  const rentalUnitPrice = rentalAsset && requestedRentalSlot
    ? rentalPriceForDate(
        rentalKind!,
        requestedRentalSlot,
        body.data,
      )
    : undefined
  const items = [
    {
      productId: mainProductId,
      quantity: body.tipo === 'esperienza' ? body.partecipanti ?? 1 : 1,
      unitPrice: rentalUnitPrice,
    },
    { productId: byName.get('Snorkeling Kit')?.id, quantity: body.snorkeling ?? 0 },
    { productId: byName.get('Cooler Box')?.id, quantity: body.setTramonto ?? 0 },
    { productId: byName.get('Canna + Mulinello')?.id, quantity: body.cannaMulinello ?? 0 },
    { productId: byName.get('Esca')?.id, quantity: body.esca ?? 0 },
    { productId: byName.get('Artificiale')?.id, quantity: body.artificiale ?? 0 },
    { productId: byName.get('Maschera + Boccaglio')?.id, quantity: body.mascheraBoccaglio ?? 0 },
    { productId: byName.get('Pinne')?.id, quantity: body.pinne ?? 0 },
    { productId: byName.get('Muta 3 mm')?.id, quantity: body.muta3mm ?? 0 },
    { productId: byName.get('Calzari')?.id, quantity: body.calzari ?? 0 },
    { productId: byName.get('Cintura + Pesi')?.id, quantity: body.cinturaPesi ?? 0 },
    { productId: byName.get('Fucile Sub')?.id, quantity: body.fucileSub ?? 0 },
    { productId: byName.get('Torcia Sub')?.id, quantity: body.torciaSub ?? 0 },
  ].filter((item): item is { productId: string; quantity: number; unitPrice?: number } => Boolean(item.productId && item.quantity > 0))

  const fishingExperienceNote =
    body.tipo === 'esperienza'
      ? `Esperienza scelta: ${body.esperienzaPesca === 'pesca-apnea' ? 'Pesca in apnea' : 'Pesca con le canne'}`
      : ''
  const notes = [fishingExperienceNote, body.note].filter(Boolean).join('\n')

  const booking = await createBooking({
    customer: { name: body.nome, email: body.email, phone: body.telefono },
    date: body.data,
    timeSlot: body.tipo === 'esperienza' || body.fascia === 'Giornata intera' ? 'GIORNATA_INTERA' : 'MEZZA_GIORNATA',
    halfDayPeriod: null,
    status: 'PENDING',
    paymentMethod: 'MOLO',
    items,
    discountCode: body.discountCode,
    notes,
    createdBy: 'WEBSITE',
  })

  if (rentalAsset) {
    await prisma.bookingFleetAssignment.create({
      data: { bookingId: booking.id, fleetAssetId: rentalAsset.id },
    })
  }

  await notifyPublicBooking({
    bookingId: booking.id,
    tipo: body.tipo,
    nome: body.nome,
    email: body.email,
    telefono: body.telefono,
    data: body.data,
    fascia: body.tipo === 'esperienza' ? 'Giornata intera' : requestedRentalSlot ? slotLabel(requestedRentalSlot) : body.fascia,
    note: notes,
  })

  return Response.json(booking)
}
