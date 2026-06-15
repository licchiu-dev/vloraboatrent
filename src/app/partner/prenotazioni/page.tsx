import { Card, PageHeader } from '@/components/admin/Ui'
import PartnerBookingsTable, { type PartnerBookingRow } from '@/components/admin/PartnerBookingsTable'
import { requireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export default async function PartnerBookingsPage() {
  const session = await requireRole(['PARTNER'])

  const bookings = await prisma.booking.findMany({
    where: { partnerId: session.user.partnerId },
    include: { customer: true, items: { include: { product: true } } },
    orderBy: { date: 'desc' },
  })

  const rows: PartnerBookingRow[] = bookings.map((b) => ({
    id: b.id,
    date: b.date.toISOString().slice(0, 10),
    customerName: b.customer.name,
    services: b.items.map((i) => i.product.name).join(', '),
    timeSlot: b.timeSlot,
    status: b.status,
    commission: b.commission,
  }))

  return (
    <>
      <PageHeader title="My bookings" subtitle="Filter by date or status, click headers to sort." />
      <Card>
        <PartnerBookingsTable rows={rows} />
      </Card>
    </>
  )
}
