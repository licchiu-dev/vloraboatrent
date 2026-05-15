import Link from 'next/link'
import { Badge, Card, PageHeader } from '@/components/admin/Ui'
import { prisma } from '@/lib/prisma'

function paymentLabel(paymentMethod: 'ONLINE' | 'PARTNER' | 'MOLO', status: string) {
  if (paymentMethod === 'ONLINE') return status === 'CONFIRMED' || status === 'COMPLETED' ? 'Paid' : 'Attesa incasso pagamento online'
  if (paymentMethod === 'PARTNER') return 'Paid'
  return 'Paga al molo'
}

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { customer: true, partner: true, items: { include: { product: true } } },
    orderBy: { date: 'desc' },
  })

  return (
    <>
      <PageHeader
        title="Bookings"
        subtitle="List and compact calendar view with filters ready for operational use."
        action={<Link href="/admin/prenotazioni/nuova" className="rounded-full bg-sand px-5 py-3 font-black text-ocean-deep">New booking</Link>}
      />

      <Card className="mb-6">
        <div className="grid gap-3 md:grid-cols-5">
          {['Search customer', 'Date range', 'Status', 'Service type', 'Partner'].map((label) => (
            <input key={label} placeholder={label} className="rounded-lg border border-[#D0E8F7] px-3 py-2 text-sm outline-none focus:border-ocean-bright" />
          ))}
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-[#4A6580]">
            <tr>
            {['Date', 'Customer', 'Services', 'Slot', 'Payment', 'Total', 'Status', 'Partner', 'Actions'].map((head) => <th key={head} className="pb-3">{head}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D0E8F7]">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="py-4">{booking.date.toLocaleDateString('en-GB')}</td>
                <td className="font-bold">{booking.customer.name}</td>
                <td>{booking.items.map((item) => item.product.name).join(', ')}</td>
                <td>{booking.timeSlot}</td>
                <td>{paymentLabel(booking.paymentMethod, booking.status)}</td>
                <td>€{booking.totalPublic?.toFixed(2)}</td>
                <td><Badge tone={booking.status === 'PENDING' ? 'yellow' : booking.status === 'CONFIRMED' ? 'green' : booking.status === 'CANCELLED' ? 'red' : 'dark'}>{booking.status}</Badge></td>
                <td>{booking.partner?.companyName ?? 'Direct'}</td>
                <td><Link href={`/admin/prenotazioni/${booking.id}`} className="font-black text-ocean-mid">Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  )
}
