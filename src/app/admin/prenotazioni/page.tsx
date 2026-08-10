import Link from 'next/link'
import { Card, PageHeader } from '@/components/admin/Ui'
import BookingsTable, { type BookingRow } from '@/components/admin/BookingsTable'
import { prisma } from '@/lib/prisma'

function paymentLabel(paymentMethod: string, status: string) {
  if (paymentMethod === 'ONLINE') return status === 'CONFIRMED' || status === 'COMPLETED' ? 'Paid' : 'Pending payment'
  if (paymentMethod === 'PARTNER') return 'Paid'
  return 'Pay at dock'
}

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { customer: true, partner: true, items: { include: { product: true } } },
    orderBy: { date: 'desc' },
  })

  const rows: BookingRow[] = bookings.map((b) => ({
    id: b.id,
    date: b.date.toISOString().slice(0, 10),
    customerName: b.customer.name,
    customerPhone: b.customer.phone,
    services: b.items.map((i) => i.product.name).join(', '),
    timeSlot: b.timeSlot,
    paymentLabel: paymentLabel(b.paymentMethod, b.status),
    totalPublic: b.totalPublic,
    status: b.status as BookingRow['status'],
    partnerName: b.partner?.companyName ?? 'Direct',
  }))

  return (
    <>
      <PageHeader
        title="Bookings"
        subtitle="Filter by column, click any header to sort."
        action={
          <Link href="/admin/prenotazioni/nuova" className="rounded-full bg-sand px-5 py-3 font-black text-ocean-deep">
            New booking
          </Link>
        }
      />
      <Card>
        <BookingsTable rows={rows} />
      </Card>
    </>
  )
}
