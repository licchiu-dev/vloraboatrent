import { Card, Badge, PageHeader } from '@/components/admin/Ui'
import { demoBookings, isDemoMode } from '@/lib/demo'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  if (isDemoMode()) {
    const today = demoBookings.filter((booking) => booking.date.toDateString() === new Date().toDateString()).length
    const pending = demoBookings.filter((booking) => booking.status === 'PENDING').length
    const revenue = demoBookings
      .filter((booking) => ['CONFIRMED', 'COMPLETED'].includes(booking.status))
      .reduce((sum, booking) => sum + (booking.totalPublic ?? 0), 0)

    return (
      <>
        <PageHeader title="Dashboard" subtitle="Demo admin preview. Add DATABASE_URL, migrate and seed to use real data." />
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">
          Demo mode: PostgreSQL is not configured yet, so this screen uses sample data.
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            ['Bookings today', today],
            ['Last 7 days', demoBookings.length],
            ['Monthly revenue', `€${revenue.toFixed(2)}`],
            ['Pending', pending],
            ['Active partners', 2],
          ].map(([label, value]) => (
            <Card key={label}>
              <p className="text-sm font-bold text-[#4A6580]">{label}</p>
              <p className="mt-3 text-3xl font-black text-ocean-deep">{value}</p>
              {label === 'Pending' && Number(value) > 0 && <div className="mt-3"><Badge tone="red">Needs attention</Badge></div>}
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <h2 className="mb-4 text-xl font-black text-ocean-deep">Today’s mini calendar</h2>
          <div className="divide-y divide-[#D0E8F7]">
            {demoBookings.map((booking) => (
              <div key={booking.id} className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-black text-ocean-deep">{booking.customer.name}</p>
                  <p className="text-sm text-[#4A6580]">{booking.items.map((item) => item.product.name).join(', ')}</p>
                </div>
                <Badge tone={booking.status === 'PENDING' ? 'yellow' : booking.status === 'CONFIRMED' ? 'green' : booking.status === 'CANCELLED' ? 'red' : 'dark'}>
                  {booking.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </>
    )
  }

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - 7)
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [today, week, month, pending, partners, dayBookings] = await Promise.all([
    prisma.booking.count({ where: { date: { gte: dayStart } } }),
    prisma.booking.count({ where: { date: { gte: weekStart } } }),
    prisma.booking.findMany({ where: { date: { gte: monthStart }, status: { in: ['CONFIRMED', 'COMPLETED'] } } }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.partner.count(),
    prisma.booking.findMany({
      where: { date: { gte: dayStart } },
      include: { customer: true, items: { include: { product: true } }, partner: true },
      orderBy: { date: 'asc' },
      take: 8,
    }),
  ])

  const revenue = month.reduce((sum, booking) => sum + (booking.totalPublic ?? 0), 0)

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Today’s operating snapshot for bookings, partners and revenue." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['Bookings today', today],
          ['Last 7 days', week],
          ['Monthly revenue', `€${revenue.toFixed(2)}`],
          ['Pending', pending],
          ['Active partners', partners],
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm font-bold text-[#4A6580]">{label}</p>
            <p className="mt-3 text-3xl font-black text-ocean-deep">{value}</p>
            {label === 'Pending' && Number(value) > 0 && <div className="mt-3"><Badge tone="red">Needs attention</Badge></div>}
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h2 className="mb-4 text-xl font-black text-ocean-deep">Today’s mini calendar</h2>
        <div className="divide-y divide-[#D0E8F7]">
          {dayBookings.map((booking) => (
            <div key={booking.id} className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-black text-ocean-deep">{booking.customer.name}</p>
                <p className="text-sm text-[#4A6580]">{booking.items.map((item) => item.product.name).join(', ')}</p>
              </div>
              <Badge tone={booking.status === 'PENDING' ? 'yellow' : booking.status === 'CONFIRMED' ? 'green' : booking.status === 'CANCELLED' ? 'red' : 'dark'}>
                {booking.status}
              </Badge>
            </div>
          ))}
          {!dayBookings.length && <p className="py-8 text-center text-[#4A6580]">No bookings for today.</p>}
        </div>
      </Card>
    </>
  )
}
