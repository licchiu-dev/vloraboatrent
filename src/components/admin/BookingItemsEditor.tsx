'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'

type BookingItem = {
  id: string
  quantity: number
  unitPrice: number
  total: number
  product: { id: string; name: string; basePrice: number }
}

type CatalogProduct = { id: string; name: string; basePrice: number; category: string }

type LineItem = {
  // present for existing items, absent for newly-added
  id?: string
  productId: string
  name: string
  basePrice: number
  quantity: number
}

export default function BookingItemsEditor({
  bookingId,
  initialItems,
  products,
}: {
  bookingId: string
  initialItems: BookingItem[]
  products: CatalogProduct[]
}) {
  const router = useRouter()
  const [lines, setLines] = useState<LineItem[]>(
    initialItems.map((item) => ({
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      basePrice: item.product.basePrice,
      quantity: item.quantity,
    }))
  )
  const [addProductId, setAddProductId] = useState('')
  const [addQty, setAddQty] = useState(1)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Products not yet in the list
  const available = products.filter((p) => !lines.some((l) => l.productId === p.id))

  function addLine() {
    const product = products.find((p) => p.id === addProductId)
    if (!product) return
    setLines((prev) => [...prev, { productId: product.id, name: product.name, basePrice: product.basePrice, quantity: Math.max(1, addQty) }])
    setAddProductId('')
    setAddQty(1)
  }

  function removeLine(idx: number) {
    setLines((prev) => prev.filter((_, i) => i !== idx))
  }

  function setQty(idx: number, qty: number) {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, quantity: Math.max(1, qty) } : l)))
  }

  async function save() {
    setSaving(true)
    setMessage('')
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: lines.map((l) => ({ id: l.id, productId: l.productId, quantity: l.quantity })),
      }),
    })
    setSaving(false)
    if (!res.ok) {
      setMessage('Save failed.')
      return
    }
    setMessage('Saved.')
    router.refresh()
  }

  const totalPublic = lines.reduce((sum, l) => sum + l.basePrice * l.quantity, 0)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-ocean-deep">Products</h2>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-ocean-deep px-4 py-2 text-sm font-black text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save products'}
        </button>
      </div>

      <div className="divide-y divide-[#D0E8F7]">
        {lines.map((line, idx) => (
          <div key={line.id ?? `new-${idx}`} className="grid grid-cols-[1fr_6rem_6rem_2.5rem] items-center gap-3 py-3">
            <span className="text-sm font-medium text-[#1a2e3b]">{line.name}</span>
            <input
              type="number"
              min={1}
              value={line.quantity}
              onChange={(e) => setQty(idx, Number(e.target.value))}
              className="rounded-lg border border-[#D0E8F7] px-3 py-2 text-sm"
              aria-label="Quantity"
            />
            <span className="text-right text-sm font-black text-ocean-deep">
              €{(line.basePrice * line.quantity).toFixed(2)}
            </span>
            <button
              type="button"
              onClick={() => removeLine(idx)}
              className="flex items-center justify-center rounded-full p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
              aria-label="Remove"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {lines.length === 0 && (
        <p className="py-4 text-sm text-[#8AACCC]">No products yet. Add one below.</p>
      )}

      <div className="mt-4 flex justify-end text-sm font-black text-ocean-deep">
        Total (public): €{totalPublic.toFixed(2)}
      </div>

      {/* Add product row */}
      <div className="mt-5 flex flex-wrap items-end gap-2 border-t border-[#D0E8F7] pt-4">
        <label className="flex flex-1 min-w-[160px] flex-col gap-1 text-xs font-bold text-ocean-deep">
          Product
          <select
            value={addProductId}
            onChange={(e) => setAddProductId(e.target.value)}
            className="rounded-lg border border-[#D0E8F7] bg-white px-3 py-2 text-sm text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-ocean-mid"
          >
            <option value="">— Select —</option>
            {available.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (€{p.basePrice})
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold text-ocean-deep">
          Qty
          <input
            type="number"
            min={1}
            value={addQty}
            onChange={(e) => setAddQty(Math.max(1, Number(e.target.value)))}
            className="w-20 rounded-lg border border-[#D0E8F7] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-mid"
          />
        </label>
        <button
          type="button"
          onClick={addLine}
          disabled={!addProductId}
          className="rounded-full bg-ocean-mid px-4 py-2 text-sm font-black text-white disabled:opacity-40"
        >
          Add
        </button>
      </div>

      {message && <p className="mt-3 text-sm font-bold text-ocean-mid">{message}</p>}
    </div>
  )
}
