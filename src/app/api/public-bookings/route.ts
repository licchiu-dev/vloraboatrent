import { createBooking } from '@/lib/bookings'

export async function POST(request: Request) {
  const body = await request.json()
  const product = body.tipo === 'esperienza'
    ? body.fascia === 'Mezza giornata' ? 'Esperienza di Pesca - Mezza giornata' : 'Esperienza di Pesca - Giornata intera'
    : body.fascia === 'Mezza giornata' ? 'Noleggio Gommone - Mezza giornata' : 'Noleggio Gommone - Giornata intera'

  const products = await import('@/lib/prisma').then(({ prisma }) =>
    prisma.product.findMany({ where: { name: { in: [product, 'Kit Snorkeling', 'Action Cam', 'Set Tramonto', 'Attrezzatura Pesca'] } } })
  )
  const byName = new Map(products.map((item) => [item.name, item]))
  const items = [
    { productId: byName.get(product)?.id, quantity: body.tipo === 'esperienza' ? body.partecipanti ?? 1 : 1 },
    { productId: byName.get('Kit Snorkeling')?.id, quantity: body.snorkeling ?? 0 },
    { productId: byName.get('Action Cam')?.id, quantity: body.actionCam ?? 0 },
    { productId: byName.get('Set Tramonto')?.id, quantity: body.setTramonto ?? 0 },
    { productId: byName.get('Attrezzatura Pesca')?.id, quantity: body.setAttrezzatura ?? 0 },
  ].filter((item): item is { productId: string; quantity: number } => Boolean(item.productId && item.quantity > 0))

  const booking = await createBooking({
    customer: { name: body.nome, email: body.email, phone: body.telefono },
    date: body.data,
    timeSlot: body.fascia === 'Mezza giornata' ? 'MEZZA_GIORNATA' : 'GIORNATA_INTERA',
    status: 'PENDING',
    items,
    discountCode: body.discountCode,
    notes: body.note,
    createdBy: 'WEBSITE',
  })
  return Response.json(booking)
}
