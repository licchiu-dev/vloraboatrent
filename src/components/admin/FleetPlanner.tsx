'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { FleetCategory, Product } from '@prisma/client'

type PlannerBooking = {
  id: string
  date: string
  timeSlot: string
  status: string
  paymentMethod: string
  customer: { name: string }
  items: { product: { name: string; category: string } }[]
  fleetAssignments?: { fleetAssetId: string }[]
}

type FleetAssetRow = {
  id: string
  name: string
  category: FleetCategory
  pricingProduct: Product
  assignments: {
    booking: PlannerBooking
  }[]
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function addDays(date: Date, amount: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export default function FleetPlanner({ canManageFleet }: { canManageFleet: boolean }) {
  const [startDate, setStartDate] = useState(isoDate(new Date()))
  const [assets, setAssets] = useState<FleetAssetRow[]>([])
  const [bookings, setBookings] = useState<PlannerBooking[]>([])
  const [selectedAssets, setSelectedAssets] = useState<Record<string, string[]>>({})
  const [newAsset, setNewAsset] = useState({ name: '', category: 'GOMMONE' })
  const [message, setMessage] = useState('')
  const days = useMemo(() => Array.from({ length: 14 }, (_, index) => addDays(new Date(startDate), index)), [startDate])
  const endDate = isoDate(days[days.length - 1])

  async function load() {
    const [fleetResponse, bookingsResponse] = await Promise.all([
      fetch(`/api/fleet?from=${startDate}&to=${endDate}`),
      fetch('/api/bookings'),
    ])
    const [fleetData, bookingData] = await Promise.all([
      fleetResponse.json(),
      bookingsResponse.json(),
    ])
    setAssets(fleetData)
    setBookings(bookingData)
  }

  useEffect(() => {
    load()
  }, [startDate])

  const unassignedBookings = bookings.filter((booking) =>
    booking.status !== 'CANCELLED' &&
    (!booking.fleetAssignments || booking.fleetAssignments.length === 0) &&
    booking.items.some((item) => ['NOLEGGIO', 'ESPERIENZA'].includes(item.product.category))
  )

  async function addAsset(event: React.FormEvent) {
    event.preventDefault()
    setMessage('')
    const response = await fetch('/api/fleet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAsset),
    })
    if (!response.ok) {
      setMessage('Fleet asset save failed.')
      return
    }
    setNewAsset({ name: '', category: 'GOMMONE' })
    setMessage('Fleet asset added.')
    await load()
  }

  function toggleAsset(bookingId: string, assetId: string) {
    setSelectedAssets((current) => {
      const currentIds = current[bookingId] ?? []
      return {
        ...current,
        [bookingId]: currentIds.includes(assetId)
          ? currentIds.filter((id) => id !== assetId)
          : [...currentIds, assetId],
      }
    })
  }

  async function assignAssets(bookingId: string) {
    setMessage('')
    const response = await fetch('/api/fleet/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, fleetAssetIds: selectedAssets[bookingId] ?? [] }),
    })
    const result = await response.json()
    if (!response.ok) {
      setMessage(result.error ?? 'Assignment failed.')
      return
    }
    setMessage('Booking updated.')
    await load()
  }

  return (
    <div className="space-y-6">
      {message && <p className="rounded-lg bg-ocean-light px-4 py-3 text-sm font-bold text-ocean-deep">{message}</p>}

      <div className="rounded-lg border border-[#D0E8F7] bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <label className="text-sm font-bold text-ocean-deep">
            Calendar start
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-2 block rounded-lg border border-[#D0E8F7] px-3 py-2" />
          </label>
          <p className="text-sm text-[#4A6580]">Each row is a physical asset. Any assignment blocks that asset for the day.</p>
        </div>
      </div>

      {canManageFleet && (
        <form onSubmit={addAsset} className="grid gap-3 rounded-lg border border-[#D0E8F7] bg-white p-5 md:grid-cols-[1fr_12rem_auto]">
          <input required placeholder="Asset name" value={newAsset.name} onChange={(event) => setNewAsset({ ...newAsset, name: event.target.value })} className="rounded-lg border border-[#D0E8F7] px-3 py-2" />
          <select value={newAsset.category} onChange={(event) => setNewAsset({ ...newAsset, category: event.target.value })} className="rounded-lg border border-[#D0E8F7] px-3 py-2">
            <option value="GOMMONE">Gommone</option>
            <option value="BARCA">Barca</option>
          </select>
          <button className="rounded-full bg-ocean-deep px-5 py-2 font-black text-white">Add asset</button>
        </form>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-[#D0E8F7] bg-white px-5 py-3 text-sm">
        <span className="font-bold text-[#4A6580]">Legend:</span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-4 w-8 rounded bg-ocean-deep" />
          <span className="text-[#4A6580]">Confirmed</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-4 w-8 rounded border-2 border-ocean-deep bg-white" />
          <span className="text-[#4A6580]">Pending</span>
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#D0E8F7] bg-white">
        <table className="min-w-[1100px] w-full text-sm">
          <thead>
            <tr className="border-b border-[#D0E8F7] text-left text-[#4A6580]">
              <th className="sticky left-0 z-10 bg-white p-4">Fleet</th>
              {days.map((day) => <th key={isoDate(day)} className="min-w-32 p-3">{day.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D0E8F7]">
            {assets.map((asset) => (
              <tr key={asset.id}>
                <th className="sticky left-0 z-10 bg-white p-4 text-left">
                  <p className="font-black text-ocean-deep">{asset.name}</p>
                  <p className="text-xs text-[#4A6580]">{asset.category} · {asset.pricingProduct.name}</p>
                </th>
                {days.map((day) => {
                  const assignment = asset.assignments.find((entry) => isoDate(new Date(entry.booking.date)) === isoDate(day))
                  if (!assignment) return <td key={isoDate(day)} className="border-l border-[#E8F3FA] p-2 align-top" />
                  const isPending = assignment.booking.status === 'PENDING'
                  const bookingHref = canManageFleet
                    ? `/admin/prenotazioni/${assignment.booking.id}`
                    : `/partner/prenotazioni/${assignment.booking.id}`
                  return (
                    <td key={isoDate(day)} className="border-l border-[#E8F3FA] p-2 align-top">
                      <Link href={bookingHref} className={`block rounded-lg border-2 p-2 text-xs transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sand ${isPending ? 'border-ocean-deep bg-white text-ocean-deep' : 'border-ocean-deep bg-ocean-deep text-white'}`}>
                        <p className="font-black">{assignment.booking.customer.name}</p>
                        <p className={isPending ? 'text-ocean-mid' : ''}>{assignment.booking.items.map((item) => item.product.name).join(', ')}</p>
                        <p className={`mt-1 ${isPending ? 'text-[#4A6580]' : 'text-white/75'}`}>Payment: {assignment.booking.paymentMethod}</p>
                      </Link>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-[#D0E8F7] bg-white p-5">
        <h2 className="text-xl font-black text-ocean-deep">Requests to complete</h2>
        <div className="mt-4 space-y-4">
          {unassignedBookings.length === 0 && <p className="text-sm text-[#4A6580]">No unassigned requests.</p>}
          {unassignedBookings.map((booking) => (
            <div key={booking.id} className="rounded-lg border border-[#D0E8F7] p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-black text-ocean-deep">{booking.customer.name}</p>
                  <p className="text-sm text-[#4A6580]">
                    {new Date(booking.date).toLocaleDateString('en-GB')} · {booking.items.map((item) => item.product.name).join(', ')}
                  </p>
                </div>
                <button type="button" onClick={() => assignAssets(booking.id)} className="rounded-full bg-sand px-4 py-2 text-sm font-black text-ocean-deep">
                  Save assignment
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {assets.map((asset) => (
                  <label key={asset.id} className="inline-flex items-center gap-2 rounded-full border border-[#D0E8F7] px-3 py-2 text-sm">
                    <input type="checkbox" checked={(selectedAssets[booking.id] ?? []).includes(asset.id)} onChange={() => toggleAsset(booking.id, asset.id)} />
                    {asset.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
