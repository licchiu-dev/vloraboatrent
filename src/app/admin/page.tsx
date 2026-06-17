import Link from 'next/link'
import type { BookingStatus } from '@prisma/client'
import { Badge, Card, PageHeader } from '@/components/admin/Ui'
import { prisma } from '@/lib/prisma'
import { bookingRevenue } from '@/lib/pricing'

const SEASON_MONTHS = [
  { index: 5, label: 'Jun' },
  { index: 6, label: 'Jul' },
  { index: 7, label: 'Aug' },
  { index: 8, label: 'Sep' },
  { index: 9, label: 'Oct' },
  { index: 10, label: 'Nov' },
]

const REVENUE_STATUSES: BookingStatus[] = ['CONFIRMED', 'COMPLETED']

function baseName(name: string) {
  return name.replace(/ - (Mezza giornata|Giornata intera)$/i, '').trim()
}

export default async function AdminDashboard() {
  const year = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  const monthStart = new Date(year, currentMonth, 1)
  const monthEnd = new Date(year, currentMonth + 1, 1)
  const seasonStart = new Date(year, 5, 1)
  const seasonEnd = new Date(year, 11, 1)

  const [monthBookings, urgentBookings, partnerCount, seasonBookings] = await Promise.all([
    prisma.booking.findMany({
      where: { date: { gte: monthStart, lt: monthEnd }, status: { in: REVENUE_STATUSES } },
      select: { totalPublic: true },
    }),
    prisma.booking.findMany({
      where: { status: 'PENDING' },
      include: { customer: true, items: { include: { product: true } } },
      orderBy: { date: 'asc' },
    }),
    prisma.partner.count(),
    prisma.booking.findMany({
      where: { date: { gte: seasonStart, lt: seasonEnd }, status: { in: REVENUE_STATUSES } },
      select: {
        date: true,
        totalPublic: true,
        items: { select: { quantity: true, product: { select: { name: true, basePrice: true } } } },
      },
    }),
  ])

  // Use the booking's stored totalPublic (actual price at booking time) rather
  // than recomputing from the live product catalog, which drifts as prices
  // change across the season.
  const monthRevenue = monthBookings.reduce((sum, booking) => sum + bookingRevenue(booking), 0)
  const rowNames = [...new Set(seasonBookings.flatMap((booking) => booking.items.map((item) => baseName(item.product.name))))].sort()

  function cellRevenue(row: string, monthIndex: number) {
    let sum = 0
    for (const booking of seasonBookings) {
      if (booking.date.getMonth() !== monthIndex) continue
      const grossTotal = booking.items.reduce((s, item) => s + item.product.basePrice * item.quantity, 0)
      if (grossTotal <= 0) continue
      for (const item of booking.items) {
        if (baseName(item.product.name) !== row) continue
        sum += bookingRevenue(booking) * ((item.product.basePrice * item.quantity) / grossTotal)
      }
    }
    return sum
  }

  function rowTotal(row: string) {
    return SEASON_MONTHS.reduce((sum, m) => sum + cellRevenue(row, m.index), 0)
  }

  function colTotal(monthIndex: number) {
    return rowNames.reduce((sum, row) => sum + cellRevenue(row, monthIndex), 0)
  }

  const grandTotal = SEASON_MONTHS.reduce((sum, m) => sum + colTotal(m.index), 0)

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Urgent actions, monthly revenue and season overview." />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm font-bold text-[#4A6580]">Monthly revenue</p>
          <p className="mt-3 text-3xl font-black text-ocean-deep">€{monthRevenue.toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-[#4A6580]">Active partners</p>
          <p className="mt-3 text-3xl font-black text-ocean-deep">{partnerCount}</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-[#4A6580]">Pending actions</p>
          <p className="mt-3 text-3xl font-black text-ocean-deep">{urgentBookings.length}</p>
          {urgentBookings.length > 0 && (
            <div className="mt-3">
              <Badge tone="red">Needs attention</Badge>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="text-xl font-black text-ocean-deep">Urgent actions</h2>
        <p className="mt-1 mb-4 text-sm text-[#4A6580]">Bookings waiting for confirmation or correction. Click to open.</p>
        {urgentBookings.length === 0 ? (
          <p className="py-10 text-center text-[#4A6580]">No pending actions — all clear.</p>
        ) : (
          <div className="divide-y divide-[#D0E8F7]">
            {urgentBookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/admin/prenotazioni/${booking.id}`}
                className="-mx-3 flex flex-col gap-2 rounded-lg px-3 py-4 transition hover:bg-ocean-light md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-black text-ocean-deep">{booking.customer.name}</p>
                  <p className="text-sm text-[#4A6580]">
                    {booking.date.toLocaleDateString('en-GB')} &middot;{' '}
                    {booking.timeSlot === 'GIORNATA_INTERA' ? 'Full day' : 'Half day'}
                  </p>
                  <p className="text-sm text-[#4A6580]">
                    {booking.items.map((i) => i.product.name).join(', ')}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge tone="yellow">PENDING</Badge>
                  <span className="font-black text-ocean-deep">
                    {booking.totalPublic != null ? `€${booking.totalPublic.toFixed(2)}` : '—'}
                  </span>
                  <span className="text-sm font-bold text-ocean-mid">Review →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      <Card className="mt-6 overflow-x-auto">
        <h2 className="text-xl font-black text-ocean-deep">Season revenue {year}</h2>
        <p className="mt-1 mb-5 text-sm text-[#4A6580]">
          Jun – Nov · Confirmed + completed bookings · Includes services and extras.
        </p>
        {rowNames.length === 0 ? (
          <p className="py-10 text-center text-[#4A6580]">No bookings for the Jun–Nov season yet.</p>
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-[#D0E8F7]">
                <th className="pb-3 text-left font-bold text-[#4A6580]">Service / extra</th>
                {SEASON_MONTHS.map((m) => (
                  <th key={m.index} className="pb-3 text-right font-bold text-[#4A6580]">
                    {m.label}
                  </th>
                ))}
                <th className="pb-3 text-right font-black text-ocean-deep">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D0E8F7]">
              {rowNames.map((row) => (
                <tr key={row}>
                  <td className="py-3 font-bold text-ocean-deep">{row}</td>
                  {SEASON_MONTHS.map((m) => {
                    const val = cellRevenue(row, m.index)
                    return (
                      <td key={m.index} className="py-3 text-right text-[#4A6580]">
                        {val > 0 ? `€${val.toFixed(0)}` : '—'}
                      </td>
                    )
                  })}
                  <td className="py-3 text-right font-black text-ocean-deep">
                    €{rowTotal(row).toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[#D0E8F7]">
                <td className="pt-3 font-black text-ocean-deep">Total</td>
                {SEASON_MONTHS.map((m) => {
                  const val = colTotal(m.index)
                  return (
                    <td key={m.index} className="pt-3 text-right font-black text-ocean-deep">
                      {val > 0 ? `€${val.toFixed(0)}` : '—'}
                    </td>
                  )
                })}
                <td className="pt-3 text-right font-black text-ocean-deep">€{grandTotal.toFixed(0)}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </Card>
    </>
  )
}
