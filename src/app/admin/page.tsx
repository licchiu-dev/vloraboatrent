import Link from 'next/link'
import type { BookingStatus } from '@prisma/client'
import { Badge, Card, PageHeader } from '@/components/admin/Ui'
import WhatsappClicksChart from '@/components/admin/WhatsappClicksChart'
import FleetOccupancyGrid from '@/components/admin/FleetOccupancyGrid'
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

function parseMonthParam(value: string | undefined) {
  const match = value?.match(/^(\d{4})-(\d{2})$/)
  if (!match) return null
  return { year: Number(match[1]), monthIndex: Number(match[2]) - 1 }
}

function monthParam(year: number, monthIndex: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`
}

function buildQuery(current: Record<string, string | undefined>, overrides: Record<string, string>) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(current)) {
    if (value) params.set(key, value)
  }
  for (const [key, value] of Object.entries(overrides)) {
    params.set(key, value)
  }
  return `/admin?${params.toString()}`
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const sp = await searchParams
  const year = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  const monthStart = new Date(year, currentMonth, 1)
  const monthEnd = new Date(year, currentMonth + 1, 1)
  const seasonStart = new Date(year, 5, 1)
  const seasonEnd = new Date(year, 11, 1)

  const selected = parseMonthParam(sp.month) ?? { year, monthIndex: currentMonth }
  const clicksMonthStart = new Date(selected.year, selected.monthIndex, 1)
  const clicksMonthEnd = new Date(selected.year, selected.monthIndex + 1, 1)
  const clicksMonthLabel = clicksMonthStart.toLocaleString('it-IT', { month: 'long', year: 'numeric' })
  const prevMonthParam = monthParam(selected.year, selected.monthIndex - 1)
  const nextMonthParam = monthParam(selected.year, selected.monthIndex + 1)
  const isCurrentMonth = selected.year === year && selected.monthIndex === currentMonth

  const selectedOcc = parseMonthParam(sp.occMonth) ?? { year, monthIndex: currentMonth }
  const occMonthStart = new Date(selectedOcc.year, selectedOcc.monthIndex, 1)
  const occMonthEnd = new Date(selectedOcc.year, selectedOcc.monthIndex + 1, 1)
  const occMonthLabel = occMonthStart.toLocaleString('it-IT', { month: 'long', year: 'numeric' })
  const occPrevMonthParam = monthParam(selectedOcc.year, selectedOcc.monthIndex - 1)
  const occNextMonthParam = monthParam(selectedOcc.year, selectedOcc.monthIndex + 1)
  const daysInOccMonth = new Date(selectedOcc.year, selectedOcc.monthIndex + 1, 0).getDate()

  const [monthBookings, urgentBookings, partnerCount, seasonBookings, whatsappClicks, fleetAssets] = await Promise.all([
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
        items: { select: { quantity: true, unitPrice: true, product: { select: { name: true } } } },
      },
    }),
    prisma.whatsappClickEvent.findMany({
      where: { createdAt: { gte: clicksMonthStart, lt: clicksMonthEnd } },
      select: { createdAt: true },
    }),
    prisma.fleetAsset.findMany({
      include: {
        assignments: {
          where: { booking: { date: { gte: occMonthStart, lt: occMonthEnd }, status: { in: REVENUE_STATUSES } } },
          select: { id: true },
        },
      },
      orderBy: [{ active: 'desc' }, { name: 'asc' }],
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
      const grossTotal = booking.items.reduce((s, item) => s + item.unitPrice * item.quantity, 0)
      if (grossTotal <= 0) continue
      for (const item of booking.items) {
        if (baseName(item.product.name) !== row) continue
        sum += bookingRevenue(booking) * ((item.unitPrice * item.quantity) / grossTotal)
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

  const clicksByDay = new Map<number, number>()
  for (const click of whatsappClicks) {
    const day = click.createdAt.getDate()
    clicksByDay.set(day, (clicksByDay.get(day) ?? 0) + 1)
  }
  const daysInSelectedMonth = new Date(selected.year, selected.monthIndex + 1, 0).getDate()
  const whatsappClicksChartData = Array.from({ length: daysInSelectedMonth }, (_, i) => ({
    day: i + 1,
    count: clicksByDay.get(i + 1) ?? 0,
  }))

  const boatOccupancy = fleetAssets.map((asset) => ({
    id: asset.id,
    name: asset.name,
    active: asset.active,
    count: asset.assignments.length,
  }))

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

      <Card className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-ocean-deep">Click bottone WhatsApp</h2>
            <p className="mt-1 text-sm text-[#4A6580] capitalize">
              Click giornalieri sul bottone di contatto WhatsApp · {clicksMonthLabel}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={buildQuery(sp, { month: prevMonthParam })}
              className="rounded-full border border-[#D0E8F7] px-4 py-2 text-sm font-black text-ocean-deep hover:bg-ocean-light"
            >
              ← Mese precedente
            </Link>
            <Link
              href={buildQuery(sp, { month: nextMonthParam })}
              aria-disabled={isCurrentMonth}
              className={`rounded-full px-4 py-2 text-sm font-black text-white ${
                isCurrentMonth ? 'pointer-events-none bg-ocean-deep/40' : 'bg-ocean-deep hover:bg-ocean-mid'
              }`}
            >
              Mese successivo →
            </Link>
          </div>
        </div>
        <div className="mt-5">
          <WhatsappClicksChart data={whatsappClicksChartData} />
        </div>
      </Card>

      <Card className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-ocean-deep">Occupazione flotta</h2>
            <p className="mt-1 text-sm text-[#4A6580] capitalize">
              Prenotazioni confermate + completate · {occMonthLabel}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={buildQuery(sp, { occMonth: occPrevMonthParam })}
              className="rounded-full border border-[#D0E8F7] px-4 py-2 text-sm font-black text-ocean-deep hover:bg-ocean-light"
            >
              ← Mese precedente
            </Link>
            <Link
              href={buildQuery(sp, { occMonth: occNextMonthParam })}
              className="rounded-full bg-ocean-deep px-4 py-2 text-sm font-black text-white hover:bg-ocean-mid"
            >
              Mese successivo →
            </Link>
          </div>
        </div>
        <div className="mt-5">
          <FleetOccupancyGrid boats={boatOccupancy} days={daysInOccMonth} />
        </div>
      </Card>
    </>
  )
}
