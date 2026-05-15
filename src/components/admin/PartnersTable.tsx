'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

export type PartnerRow = {
  id: string
  companyName: string
  type: string
  discountCode: string
  defaultCommission: number
  bookingCount: number
  pendingEarnings: number
}

type SortKey = keyof PartnerRow
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
      <span className="flex items-center gap-1 text-[#4A6580] hover:text-ocean-deep">
        {label}
        <span className="font-mono text-[10px]">{active ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}</span>
      </span>
    </th>
  )
}

const inputClass =
  'rounded-lg border border-[#D0E8F7] px-3 py-2 text-sm outline-none focus:border-ocean-mid bg-white'

export default function PartnersTable({ rows }: { rows: PartnerRow[] }) {
  const [nameFilter, setNameFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [codeFilter, setCodeFilter] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'companyName', dir: 'asc' })

  function toggleSort(col: SortKey) {
    setSort((prev) =>
      prev.key === col ? { key: col, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key: col, dir: 'asc' }
    )
  }

  const filtered = useMemo(() => {
    let data = rows
    if (nameFilter) data = data.filter((r) => r.companyName.toLowerCase().includes(nameFilter.toLowerCase()))
    if (typeFilter) data = data.filter((r) => r.type === typeFilter)
    if (codeFilter) data = data.filter((r) => r.discountCode.toLowerCase().includes(codeFilter.toLowerCase()))

    return [...data].sort((a, b) => {
      const av = a[sort.key] ?? ''
      const bv = b[sort.key] ?? ''
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [rows, nameFilter, typeFilter, codeFilter, sort])

  function clearFilters() {
    setNameFilter('')
    setTypeFilter('')
    setCodeFilter('')
  }

  const hasFilter = nameFilter || typeFilter || codeFilter

  return (
    <div className="space-y-4">
      <div className="grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto]">
        <input
          placeholder="Company name…"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className={inputClass}
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={inputClass}>
          <option value="">All types</option>
          <option value="AGENZIA_TURISTICA">Travel agency</option>
          <option value="AGENZIA_VIAGGI">Tour operator</option>
          <option value="GUIDA">Local guide</option>
          <option value="PRIVATO">Private</option>
        </select>
        <input
          placeholder="Discount code…"
          value={codeFilter}
          onChange={(e) => setCodeFilter(e.target.value)}
          className={inputClass}
        />
        {hasFilter && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-[#D0E8F7] px-3 py-2 text-sm text-[#4A6580] hover:bg-ocean-light"
          >
            Clear
          </button>
        )}
      </div>

      <p className="text-xs text-[#4A6580]">
        {filtered.length} of {rows.length} partners
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr>
              <SortableHeader label="Name" col="companyName" sort={sort} onSort={toggleSort} />
              <SortableHeader label="Type" col="type" sort={sort} onSort={toggleSort} />
              <SortableHeader label="Code" col="discountCode" sort={sort} onSort={toggleSort} />
              <SortableHeader label="Default %" col="defaultCommission" sort={sort} onSort={toggleSort} />
              <SortableHeader label="Bookings" col="bookingCount" sort={sort} onSort={toggleSort} />
              <SortableHeader label="Pending earnings" col="pendingEarnings" sort={sort} onSort={toggleSort} />
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D0E8F7]">
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-ocean-light/30">
                <td className="py-4 pr-4 font-black">{row.companyName}</td>
                <td className="pr-4">{row.type}</td>
                <td className="pr-4">{row.discountCode}</td>
                <td className="pr-4">{row.defaultCommission}%</td>
                <td className="pr-4">{row.bookingCount}</td>
                <td className="pr-4">€{row.pendingEarnings.toFixed(2)}</td>
                <td>
                  <Link href={`/admin/partner/${row.id}`} className="font-black text-ocean-mid">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#4A6580]">
                  No partners match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
