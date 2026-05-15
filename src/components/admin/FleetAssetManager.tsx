'use client'

import { useState } from 'react'
import type { FleetCategory } from '@prisma/client'

type FleetAssetSummary = {
  id: string
  name: string
  category: FleetCategory
  active: boolean
  notes: string | null
  pricingProductName: string
  bookingsCount: number
  revenue: number
}

export default function FleetAssetManager({ assets: initialAssets }: { assets: FleetAssetSummary[] }) {
  const [assets, setAssets] = useState(initialAssets)
  const [savingId, setSavingId] = useState('')
  const [message, setMessage] = useState('')

  function updateAsset(id: string, patch: Partial<FleetAssetSummary>) {
    setAssets((current) => current.map((asset) => (asset.id === id ? { ...asset, ...patch } : asset)))
  }

  async function saveAsset(asset: FleetAssetSummary) {
    setSavingId(asset.id)
    setMessage('')
    const response = await fetch(`/api/fleet/${asset.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: asset.name,
        category: asset.category,
        active: asset.active,
        notes: asset.notes,
      }),
    })
    setSavingId('')
    if (!response.ok) {
      setMessage('Fleet asset save failed.')
      return
    }
    setMessage('Fleet asset saved.')
  }

  const totalRevenue = assets.reduce((sum, asset) => sum + asset.revenue, 0)
  const activeAssets = assets.filter((asset) => asset.active).length
  const totalBookings = assets.reduce((sum, asset) => sum + asset.bookingsCount, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Active assets', activeAssets.toString()],
          ['Assigned bookings', totalBookings.toString()],
          ['Fleet revenue', `EUR ${totalRevenue.toFixed(2)}`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-[#D0E8F7] bg-white p-5">
            <p className="text-sm font-bold text-[#4A6580]">{label}</p>
            <p className="mt-2 text-2xl font-black text-ocean-deep">{value}</p>
          </div>
        ))}
      </div>

      {message && <p className="rounded-lg bg-ocean-light px-4 py-3 text-sm font-bold text-ocean-deep">{message}</p>}

      <div className="overflow-x-auto rounded-lg border border-[#D0E8F7] bg-white p-5">
        <h2 className="mb-4 text-xl font-black text-ocean-deep">Fleet assets</h2>
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-[#4A6580]">
            <tr>
              {['Name', 'Category', 'Linked price', 'Bookings', 'Revenue', 'Active', 'Notes', ''].map((head) => (
                <th key={head} className="pb-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D0E8F7]">
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td className="py-4 pr-3">
                  <input
                    value={asset.name}
                    onChange={(event) => updateAsset(asset.id, { name: event.target.value })}
                    className="w-full rounded-lg border border-[#D0E8F7] px-3 py-2 font-black outline-none focus:border-ocean-bright"
                  />
                </td>
                <td className="pr-3">
                  <select
                    value={asset.category}
                    onChange={(event) => updateAsset(asset.id, { category: event.target.value as FleetCategory })}
                    className="rounded-lg border border-[#D0E8F7] px-3 py-2"
                  >
                    <option value="GOMMONE">GOMMONE</option>
                    <option value="BARCA">BARCA</option>
                  </select>
                </td>
                <td className="pr-3">{asset.pricingProductName}</td>
                <td className="pr-3">{asset.bookingsCount}</td>
                <td className="pr-3 font-black text-ocean-deep">EUR {asset.revenue.toFixed(2)}</td>
                <td className="pr-3">
                  <label className="inline-flex items-center gap-2 font-bold text-ocean-deep">
                    <input
                      type="checkbox"
                      checked={asset.active}
                      onChange={(event) => updateAsset(asset.id, { active: event.target.checked })}
                    />
                    Active
                  </label>
                </td>
                <td className="pr-3">
                  <input
                    value={asset.notes ?? ''}
                    onChange={(event) => updateAsset(asset.id, { notes: event.target.value })}
                    placeholder="Notes"
                    className="w-full rounded-lg border border-[#D0E8F7] px-3 py-2"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => saveAsset(asset)}
                    disabled={savingId === asset.id}
                    className="rounded-full bg-ocean-deep px-4 py-2 text-xs font-black text-white disabled:opacity-60"
                  >
                    {savingId === asset.id ? 'Saving...' : 'Save'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
