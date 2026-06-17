import { Card, PageHeader } from '@/components/admin/Ui'
import { prisma } from '@/lib/prisma'
import { bookingRevenue } from '@/lib/pricing'

export default async function StatsPage() {
  const [bookings, expenses, partners] = await Promise.all([
    prisma.booking.findMany({
      where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
      include: { partner: true, items: { include: { product: true } } },
    }),
    prisma.expense.findMany(),
    prisma.partner.findMany({ include: { bookings: true } }),
  ])
  const revenue = bookings.reduce((sum, booking) => sum + bookingRevenue(booking), 0)
  const costs = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const direct = bookings.filter((booking) => !booking.partnerId).length
  const viaPartner = bookings.length - direct

  return (
    <>
      <PageHeader title="Analytics" subtitle="Revenue, partner performance, service mix and expenses." />
      <div className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-sm font-bold text-[#4A6580]">Revenue</p><p className="mt-2 text-3xl font-black text-ocean-deep">€{revenue.toFixed(2)}</p></Card>
        <Card><p className="text-sm font-bold text-[#4A6580]">Expenses</p><p className="mt-2 text-3xl font-black text-ocean-deep">€{costs.toFixed(2)}</p></Card>
        <Card><p className="text-sm font-bold text-[#4A6580]">Direct</p><p className="mt-2 text-3xl font-black text-ocean-deep">{direct}</p></Card>
        <Card><p className="text-sm font-bold text-[#4A6580]">Partner</p><p className="mt-2 text-3xl font-black text-ocean-deep">{viaPartner}</p></Card>
      </div>
      <Card className="mt-6">
        <h2 className="mb-4 text-xl font-black text-ocean-deep">Top partners</h2>
        <div className="divide-y divide-[#D0E8F7]">
          {partners.sort((a, b) => b.bookings.length - a.bookings.length).slice(0, 5).map((partner) => (
            <div key={partner.id} className="flex justify-between py-4"><span>{partner.companyName}</span><span className="font-black">{partner.bookings.length} bookings</span></div>
          ))}
        </div>
      </Card>
      <p className="mt-4 text-sm text-[#4A6580]">Recharts dependency is installed for replacing these compact summaries with interactive charts.</p>
    </>
  )
}
