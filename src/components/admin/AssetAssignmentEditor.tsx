'use client'

import { useEffect, useState } from 'react'

type Asset = {
  id: string
  name: string
  category: string
}

export default function AssetAssignmentEditor({
  bookingId,
  initialAssetIds,
}: {
  bookingId: string
  initialAssetIds: string[]
}) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAssetIds, setSelectedAssetIds] = useState(initialAssetIds)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/fleet')
      .then((response) => response.json())
      .then(setAssets)
  }, [])

  function toggleAsset(assetId: string) {
    setSelectedAssetIds((current) =>
      current.includes(assetId) ? current.filter((id) => id !== assetId) : [...current, assetId]
    )
  }

  async function save() {
    setSaving(true)
    setMessage('')
    const response = await fetch('/api/fleet/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, fleetAssetIds: selectedAssetIds }),
    })
    const result = await response.json()
    setSaving(false)
    if (!response.ok) {
      setMessage(result.error ?? 'Save failed.')
      return
    }
    setMessage('Assets updated.')
  }

  return (
    <div className="mt-6 rounded-lg bg-ocean-light p-4">
      <p className="font-black text-ocean-deep">Asset</p>
      <p className="mt-1 text-sm text-[#4A6580]">Select one or more boats to complete the request and occupy the calendar.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {assets.map((asset) => (
          <label key={asset.id} className="inline-flex items-center gap-2 rounded-full border border-[#D0E8F7] bg-white px-3 py-2 text-sm">
            <input type="checkbox" checked={selectedAssetIds.includes(asset.id)} onChange={() => toggleAsset(asset.id)} />
            {asset.name} · {asset.category}
          </label>
        ))}
      </div>
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-4 rounded-full bg-ocean-deep px-4 py-2 text-sm font-black text-white disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save asset'}
      </button>
      {message && <p className="mt-3 text-sm font-bold text-ocean-mid">{message}</p>}
    </div>
  )
}
