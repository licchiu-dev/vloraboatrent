'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/admin/Ui'

export type BookingRow = {
  id: string
  date: string // YYYY-MM-DD
  customerName: string
  customerPhone: string
  services: string
  timeSlot: string
  paymentLabel: string
  totalPublic: number | null
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  partnerName: string
}

type SortKey = keyof BookingRow
type SortDir = 'asc' | 'desc'

function SortableHeader({
  label,
  col,
  sort,
  onSort,
}: {
  label: string
  col: SortKey
  sort: { key: SortKey; dir: SortDir }
  onSort: (col: SortKey) => void
}) {
  const active = sort.key === col
  return (
    <th className="cursor-pointer select-none pb-3 pr-4" onClick={() => onSort(col)}>
      <span className="flex items-center gap-1 text-xs uppercase tracking-wider text-[#4A6580] hover:text-ocean-deep">
        {label}
        <span className="font-mono text-[10px]">{active ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}</span>
      </span>
    </th>
  )
}

const inputClass =
  'rounded-lg border border-[#D0E8F7] px-3 py-2 text-sm outline-none focus:border-ocean-mid bg-white'

export default function BookingsTable({ rows }: { rows: BookingRow[] }) {
  const router = useRouter()
  const [customer, setCustomer] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [status, setStatus] = useState('ACTIVE')
  const [service, setService] = useState('')
  const [partner, setPartner] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'date', dir: 'desc' })
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkStatus, setBulkStatus] = useState<BookingRow['status'] | ''>('')
  const [bulkSaving, setBulkSaving] = useState(false)
  const [bulkMessage, setBulkMessage] = useState('')

  function toggleSort(col: SortKey) {
    setSort((prev) =>
      prev.key === col ? { key: col, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key: col, dir: 'asc' }
    )
  }

  const filtered = useMemo(() => {
    let data = rows
    if (customer) data = data.filter((r) => r.customerName.toLowerCase().includes(customer.toLowerCase()))
    if (dateFrom) data = data.filter((r) => r.date >= dateFrom)
    if (dateTo) data = data.filter((r) => r.date <= dateTo)
    if (status === 'ACTIVE') data = data.filter((r) => r.status === 'PENDING' || r.status === 'CONFIRMED')
    else if (status) data = data.filter((r) => r.status === status)
    if (service) data = data.filter((r) => r.services.toLowerCase().includes(service.toLowerCase()))
    if (partner) data = data.filter((r) => r.partnerName.toLowerCase().includes(partner.toLowerCase()))

    return [...data].sort((a, b) => {
      const av = a[sort.key] ?? ''
      const bv = b[sort.key] ?? ''
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [rows, customer, dateFrom, dateTo, status, service, partner, sort])

  function clearFilters() {
    setCustomer('')
    setDateFrom('')
    setDateTo('')
    setStatus('ACTIVE')
    setService('')
    setPartner('')
  }

  const hasFilter = customer || dateFrom || dateTo || status !== 'ACTIVE' || service || partner
  const filteredIds = filtered.map((row) => row.id)
  const selectedVisibleCount = filteredIds.filter((id) => selectedIds.includes(id)).length
  const allVisibleSelected = filteredIds.length > 0 && selectedVisibleCount === filteredIds.length

  function toggleRow(id: string) {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
    setBulkMessage('')
  }

  function toggleVisibleRows() {
    setSelectedIds((current) => {
      if (allVisibleSelected) return current.filter((id) => !filteredIds.includes(id))
      return [...new Set([...current, ...filteredIds])]
    })
    setBulkMessage('')
  }

  async function applyBulkStatus() {
    if (!bulkStatus || selectedIds.length === 0) return
    if (bulkStatus === 'COMPLETED' && !window.confirm(`Stai completando ${selectedIds.length} booking. La benzina pagata verra impostata a EUR 0 per tutti i selezionati. Continuare?`)) {
      return
    }
    setBulkSaving(true)
    setBulkMessage('')
    const response = await fetch('/api/bookings/bulk', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds, status: bulkStatus }),
    })
    const result = await response.json().catch(() => ({}))
    setBulkSaving(false)
    if (!response.ok) {
      setBulkMessage(result.error ?? 'Bulk update failed.')
      return
    }
    setSelectedIds([])
    setBulkStatus('')
    setBulkMessage(`Updated ${result.count ?? selectedIds.length} bookings.`)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 md:grid-cols-[1fr_auto_auto_1fr_1fr_1fr_auto]">
        <input placeholder="Customer…" value={customer} onChange={(e) => setCustomer(e.target.value)} className={inputClass} />
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={inputClass} title="From date" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputClass} title="To date" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
          <option value="ACTIVE">Pending + confirmed</option>
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <input placeholder="Service…" value={service} onChange={(e) => setService(e.target.value)} className={inputClass} />
        <input placeholder="Partner…" value={partner} onChange={(e) => setPartner(e.target.value)} className={inputClass} />
        {hasFilter && (
          <button type="button" onClick={clearFilters} className="rounded-lg border border-[#D0E8F7] px-3 py-2 text-sm text-[#4A6580] hover:bg-ocean-light">
            Clear
          </button>
        )}
      </div>

      <p className="text-xs text-[#4A6580]">
        {filtered.length} of {rows.length} bookings
      </p>

      <div className="flex flex-col gap-3 rounded-lg border border-[#D0E8F7] bg-ocean-light/60 p-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-bold text-ocean-deep">{selectedIds.length} selected</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value as BookingRow['status'] | '')} className={inputClass}>
            <option value="">Choose status…</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button
            type="button"
            onClick={applyBulkStatus}
            disabled={bulkSaving || selectedIds.length === 0 || !bulkStatus}
            className="rounded-lg bg-ocean-deep px-4 py-2 text-sm font-black text-white disabled:opacity-50"
          >
            {bulkSaving ? 'Updating…' : 'Update selected'}
          </button>
        </div>
      </div>
      {bulkMessage && <p className="text-sm font-bold text-ocean-mid">{bulkMessage}</p>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead>
            <tr>
              <th className="pb-3 pr-4">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleVisibleRows}
                  aria-label="Select visible bookings"
                  className="h-4 w-4 accent-ocean-mid"
                />
              </th>
              <SortableHeader label="Date" col="date" sort={sort} onSort={toggleSort} />
              <SortableHeader label="Customer" col="customerName" sort={sort} onSort={toggleSort} />
              <SortableHeader label="Phone" col="customerPhone" sort={sort} onSort={toggleSort} />
              <SortableHeader label="Services" col="services" sort={sort} onSort={toggleSort} />
              <SortableHeader label="Slot" col="timeSlot" sort={sort} onSort={toggleSort} />
              <SortableHeader label="Payment" col="paymentLabel" sort={sort} onSort={toggleSort} />
              <SortableHeader label="Total" col="totalPublic" sort={sort} onSort={toggleSort} />
              <SortableHeader label="Status" col="status" sort={sort} onSort={toggleSort} />
              <SortableHeader label="Partner" col="partnerName" sort={sort} onSort={toggleSort} />
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D0E8F7]">
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-ocean-light/30">
                <td className="py-4 pr-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => toggleRow(row.id)}
                    aria-label={`Select booking ${row.customerName}`}
                    className="h-4 w-4 accent-ocean-mid"
                  />
                </td>
                <td className="py-4 pr-4 whitespace-nowrap">
                  {new Date(row.date + 'T12:00:00').toLocaleDateString('en-GB')}
                </td>
                <td className="pr-4 font-bold">{row.customerName}</td>
                <td className="pr-4 whitespace-nowrap">{row.customerPhone}</td>
                <td className="pr-4">{row.services}</td>
                <td className="pr-4">{row.timeSlot}</td>
                <td className="pr-4">{row.paymentLabel}</td>
                <td className="pr-4">€{row.totalPublic?.toFixed(2) ?? '—'}</td>
                <td className="pr-4">
                  <Badge
                    tone={
                      row.status === 'PENDING'
                        ? 'yellow'
                        : row.status === 'CONFIRMED'
                          ? 'green'
                          : row.status === 'CANCELLED'
                            ? 'red'
                            : 'dark'
                    }
                  >
                    {row.status}
                  </Badge>
                </td>
                <td className="pr-4">{row.partnerName}</td>
                <td>
                  <Link href={`/admin/prenotazioni/${row.id}`} className="font-black text-ocean-mid">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="py-12 text-center text-[#4A6580]">
                  No bookings match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
