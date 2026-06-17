'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'

type BookingItem = {
  id: string
  quantity: number
  unitPrice: number
  total: number
  product: { id: string; name: string; basePrice: number }
}

type CatalogProduct = { id: string; name: string; basePrice: number; category: string }

type LineItem = {
  id?: string        // present for existing items
  productId: string
  name: string
  basePrice: number  // catalog reference
  quantity: number
  unitPrice: number  // editable public price, starts at basePrice
}

const inputClass =
  'rounded-lg border border-[#D0E8F7] bg-white px-3 py-2 text-sm text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-ocean-mid'

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
      unitPrice: item.product.basePrice, // start from catalog price
    }))
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function changeProduct(idx: number, productId: string) {
    const p = products.find((x) => x.id === productId)
    if (!p) return
    setLines((prev) =>
      prev.map((l, i) =>
        i === idx
          ? { ...l, productId: p.id, name: p.name, basePrice: p.basePrice, unitPrice: p.basePrice }
          : l
      )
    )
  }

  function setQty(idx: number, qty: number) {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, quantity: Math.max(1, qty) } : l)))
  }

  function setUnitPrice(idx: number, price: number) {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, unitPrice: Math.max(0, price) } : l)))
  }

  function addLine() {
    const p = products[0]
    if (!p) return
    setLines((prev) => [
      ...prev,
      { productId: p.id, name: p.name, basePrice: p.basePrice, quantity: 1, unitPrice: p.basePrice },
    ])
  }

  function removeLine(idx: number) {
    setLines((prev) => prev.filter((_, i) => i !== idx))
  }

  async function save() {
    setSaving(true)
    setMessage('')
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: lines.map((l) => ({
          id: l.id,
          productId: l.productId,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
        })),
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

  const totalPublic = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0)

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
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

      {/* Header row */}
      <div className="mb-1 hidden grid-cols-[1fr_5rem_7rem_6rem_2.5rem] gap-2 text-xs font-bold uppercase tracking-widest text-[#8AACCC] md:grid">
        <span>Product</span>
        <span className="text-center">Qty</span>
        <span className="text-center">Unit price (€)</span>
        <span className="text-right">Total</span>
        <span />
      </div>

      <div className="divide-y divide-[#D0E8F7]">
        {lines.map((line, idx) => (
          <div
            key={line.id ?? `new-${idx}`}
            className="grid grid-cols-[1fr_2.5rem] items-center gap-2 py-3 md:grid-cols-[1fr_5rem_7rem_6rem_2.5rem]"
          >
            {/* Product selector */}
            <select
              value={line.productId}
              onChange={(e) => changeProduct(idx, e.target.value)}
              className={inputClass}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Quantity */}
            <input
              type="number"
              min={1}
              value={line.quantity}
              onChange={(e) => setQty(idx, Number(e.target.value))}
              className={`${inputClass} text-center`}
              aria-label="Quantity"
            />

            {/* Unit price */}
            <input
              type="number"
              min={0}
              step="0.01"
              value={line.unitPrice}
              onChange={(e) => setUnitPrice(idx, Number(e.target.value))}
              className={`${inputClass} text-center`}
              aria-label="Unit price"
            />

            {/* Line total */}
            <span className="text-right text-sm font-black text-ocean-deep">
              €{(line.unitPrice * line.quantity).toFixed(2)}
            </span>

            {/* Remove */}
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
        <p className="py-4 text-sm text-[#8AACCC]">No products yet.</p>
      )}

      {/* Add row */}
      <div className="mt-3 flex items-center justify-between border-t border-[#D0E8F7] pt-3">
        <button
          type="button"
          onClick={addLine}
          disabled={products.length === 0}
          className="flex items-center gap-1.5 rounded-full bg-ocean-light px-4 py-2 text-sm font-black text-ocean-deep hover:bg-ocean-mid hover:text-white disabled:opacity-40"
        >
          <Plus size={14} />
          Add product
        </button>
        <span className="text-sm font-black text-ocean-deep">
          Total: €{totalPublic.toFixed(2)}
        </span>
      </div>

      {message && <p className="mt-3 text-sm font-bold text-ocean-mid">{message}</p>}
    </div>
  )
}
