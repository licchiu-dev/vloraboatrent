'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

type BookingItem = {
  id: string
  quantity: number
  unitPrice: number
  total: number
  product: { name: string }
}

export default function BookingItemsEditor({
  bookingId,
  initialItems,
}: {
  bookingId: string
  initialItems: BookingItem[]
}) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const total = useMemo(() => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [items])

  async function save() {
    setSaving(true)
    setMessage('')
    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items.map((item) => ({ id: item.id, unitPrice: item.unitPrice })) }),
    })
    setSaving(false)
    if (!response.ok) {
      setMessage('Price update failed.')
      return
    }
    setItems((current) => current.map((item) => ({ ...item, total: item.unitPrice * item.quantity })))
    setMessage('Prices updated.')
    router.refresh()
  }

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-ocean-deep">Products</h2>
        <button type="button" onClick={save} disabled={saving} className="rounded-full bg-ocean-deep px-4 py-2 text-sm font-black text-white disabled:opacity-60">
          {saving ? 'Saving...' : 'Save prices'}
        </button>
      </div>
      <div className="divide-y divide-[#D0E8F7]">
        {items.map((item) => (
          <div key={item.id} className="grid gap-3 py-3 md:grid-cols-[1fr_7rem_8rem_8rem] md:items-center">
            <span>{item.product.name} x{item.quantity}</span>
            <span className="text-sm text-[#4A6580]">Unit price</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={item.unitPrice}
              onChange={(event) =>
                setItems((current) =>
                  current.map((candidate) =>
                    candidate.id === item.id ? { ...candidate, unitPrice: Number(event.target.value) } : candidate
                  )
                )
              }
              className="rounded-lg border border-[#D0E8F7] px-3 py-2"
            />
            <span className="text-right font-black">EUR {(item.unitPrice * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end font-black text-ocean-deep">Total: EUR {total.toFixed(2)}</div>
      {message && <p className="mt-3 text-sm font-bold text-ocean-mid">{message}</p>}
    </div>
  )
}
