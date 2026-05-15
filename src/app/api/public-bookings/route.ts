import { createBooking } from '@/lib/bookings'
import { notifyPublicBooking } from '@/lib/notifications'

export async function POST(request: Request) {
  const body = await request.json()
  const product = body.tipo === 'esperienza'
    ? 'Esperienza di Pesca - Giornata intera'
    : body.fascia === 'Mezza giornata' ? 'Noleggio Gommone - Mezza giornata' : 'Noleggio Gommone - Giornata intera'

  const products = await import('@/lib/prisma').then(({ prisma }) =>
    prisma.product.findMany({
      where: {
        name: {
          in: [
            product,
            'Kit Snorkeling',
            'Action Cam',
            'Set Tramonto',
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
  const items = [
    { productId: byName.get(product)?.id, quantity: body.tipo === 'esperienza' ? body.partecipanti ?? 1 : 1 },
    { productId: byName.get('Kit Snorkeling')?.id, quantity: body.snorkeling ?? 0 },
    { productId: byName.get('Action Cam')?.id, quantity: body.actionCam ?? 0 },
    { productId: byName.get('Set Tramonto')?.id, quantity: body.setTramonto ?? 0 },
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
  ].filter((item): item is { productId: string; quantity: number } => Boolean(item.productId && item.quantity > 0))

  const fishingExperienceNote =
    body.tipo === 'esperienza'
      ? `Esperienza scelta: ${body.esperienzaPesca === 'pesca-apnea' ? 'Pesca in apnea' : 'Pesca con le canne'}`
      : ''
  const notes = [fishingExperienceNote, body.note].filter(Boolean).join('\n')

  const booking = await createBooking({
    customer: { name: body.nome, email: body.email, phone: body.telefono },
    date: body.data,
    timeSlot: body.tipo === 'esperienza' || body.fascia !== 'Mezza giornata' ? 'GIORNATA_INTERA' : 'MEZZA_GIORNATA',
    status: 'PENDING',
    paymentMethod: 'MOLO',
    items,
    discountCode: body.discountCode,
    notes,
    createdBy: 'WEBSITE',
  })

  await notifyPublicBooking({
    bookingId: booking.id,
    tipo: body.tipo,
    nome: body.nome,
    email: body.email,
    telefono: body.telefono,
    data: body.data,
    fascia: body.tipo === 'esperienza' ? 'Giornata intera' : body.fascia,
    note: notes,
  })

  return Response.json(booking)
}
