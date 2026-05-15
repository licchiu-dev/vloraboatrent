import { Badge, Card, PageHeader } from '@/components/admin/Ui'
import { requireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

function maskName(name: string) {
  const [first, last] = name.split(' ')
  return `${first} ${last?.[0] ?? ''}.`
}

function paymentLabel(paymentMethod: 'ONLINE' | 'PARTNER' | 'MOLO', status: string) {
  if (paymentMethod === 'ONLINE') return status === 'CONFIRMED' || status === 'COMPLETED' ? 'Paid' : 'Attesa incasso pagamento online'
  if (paymentMethod === 'PARTNER') return 'Paid'
  return 'Paga al molo'
}

export default async function PartnerBookingsPage() {
  const session = await requireRole(['PARTNER'])
  const bookings = await prisma.booking.findMany({
    where: { partnerId: session.user.partnerId },
    include: { customer: true, items: { include: { product: true } } },
    orderBy: { date: 'desc' },
  })
  return (
    <>
      <PageHeader title="My bookings" subtitle="Only bookings generated with your partner account or code." />
      <Card className="mb-6"><div className="grid gap-3 md:grid-cols-2"><input placeholder="Date filter" className="rounded-lg border border-[#D0E8F7] px-3 py-2" /><input placeholder="Status" className="rounded-lg border border-[#D0E8F7] px-3 py-2" /></div></Card>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead><tr className="text-[#4A6580]">{['Date', 'Customer', 'Services', 'Payment', 'Status', 'Earned commission'].map((h) => <th key={h} className="pb-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-[#D0E8F7]">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="py-4">{booking.date.toLocaleDateString('en-GB')}</td>
                <td className="font-black">{maskName(booking.customer.name)}</td>
                <td>{booking.items.map((item) => item.product.name).join(', ')}</td>
                <td>{paymentLabel(booking.paymentMethod, booking.status)}</td>
                <td><Badge>{booking.status}</Badge></td>
                <td className="font-black">€{booking.commission?.toFixed(2) ?? '0.00'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  )
}
