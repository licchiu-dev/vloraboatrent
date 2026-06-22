'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Partner, Product } from '@prisma/client'

type FleetAsset = { id: string; name: string; category: string }
type LineItem = { productId: string; quantity: number; unitPrice: number }

const inputClass = 'mt-1.5 w-full rounded-lg border border-[#D0E8F7] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-mid'
const labelClass = 'text-sm font-bold text-ocean-deep'

const PAYMENT_OPTIONS = [
  { value: 'REVOLUT', label: 'Revolut' },
  { value: 'POS', label: 'POS (carta)' },
  { value: 'CONTANTI', label: 'Contanti' },
  { value: 'ONLINE', label: 'Online' },
  { value: 'PARTNER', label: 'Partner' },
  { value: 'MOLO', label: 'Al molo' },
]

export default function BookingEditor({ partnerMode = false }: { partnerMode?: boolean }) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [fleetAssets, setFleetAssets] = useState<FleetAsset[]>([])
  const [fleetAssetIds, setFleetAssetIds] = useState<string[]>([])

  const [items, setItems] = useState<LineItem[]>([{ productId: '', quantity: 1, unitPrice: 0 }])
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    date: '', timeSlot: 'GIORNATA_INTERA',
    paymentMethod: 'REVOLUT',
    partnerId: '', discountCode: '',
    notes: '', internalNotes: '',
    status: 'CONFIRMED',
  })
  // Economics overrides
  const [totalPublicOverride, setTotalPublicOverride] = useState('')
  const [totalPartner, setTotalPartner] = useState('')
  const [commission, setCommission] = useState('')

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/products').then((r) => r.json()).then(setProducts)
    fetch('/api/fleet').then((r) => r.ok ? r.json() : []).then(setFleetAssets)
    if (!partnerMode) fetch('/api/partners').then((r) => r.ok ? r.json() : []).then(setPartners)
  }, [partnerMode])

  // Auto-fill unit price when product changes
  function changeProduct(idx: number, productId: string) {
    const p = products.find((x) => x.id === productId)
    setItems((prev) => prev.map((l, i) => i === idx ? { ...l, productId, unitPrice: p?.basePrice ?? 0 } : l))
  }

  function setQty(idx: number, qty: number) {
    setItems((prev) => prev.map((l, i) => i === idx ? { ...l, quantity: Math.max(1, qty) } : l))
  }

  function setUnitPrice(idx: number, price: number) {
    setItems((prev) => prev.map((l, i) => i === idx ? { ...l, unitPrice: Math.max(0, price) } : l))
  }

  function addItem() {
    setItems((prev) => [...prev, { productId: '', quantity: 1, unitPrice: 0 }])
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const autoTotal = useMemo(
    () => items.reduce((sum, l) => sum + (l.unitPrice || 0) * l.quantity, 0),
    [items]
  )

  // When partner changes, auto-fill discountCode
  function changePartner(partnerId: string) {
    const p = partners.find((x) => x.id === partnerId)
    setForm((f) => ({ ...f, partnerId, discountCode: p?.discountCode ?? '' }))
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    const validItems = items.filter((l) => l.productId)
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { name: form.name, email: form.email, phone: form.phone },
        date: form.date,
        timeSlot: form.timeSlot,
        paymentMethod: form.paymentMethod,
        status: form.status,
        partnerId: form.partnerId || undefined,
        discountCode: form.discountCode || undefined,
        notes: form.notes,
        internalNotes: form.internalNotes,
        items: validItems.map((l) => ({ productId: l.productId, quantity: l.quantity, unitPrice: l.unitPrice })),
        totalPublic: totalPublicOverride !== '' ? Number(totalPublicOverride) : autoTotal || undefined,
        totalPartner: totalPartner !== '' ? Number(totalPartner) : undefined,
        commission: commission !== '' ? Number(commission) : undefined,
      }),
    })
    setSaving(false)
    if (!response.ok) { setMessage('Save failed. Check required fields.'); return }
    const booking = await response.json()
    if (fleetAssetIds.length > 0) {
      const r2 = await fetch('/api/fleet/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id, fleetAssetIds }),
      })
      if (!r2.ok) { const e = await r2.json(); setMessage(e.error ?? 'Booking saved, fleet assignment failed.'); return }
    }
    router.push(partnerMode ? '/partner/prenotazioni' : '/admin/prenotazioni')
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-lg border border-[#D0E8F7] bg-white p-6 shadow-sm">

      {/* Customer */}
      <div>
        <p className="mb-3 font-black text-ocean-deep">Cliente</p>
        <div className="grid gap-4 md:grid-cols-3">
          {(['name', 'email', 'phone'] as const).map((k) => (
            <label key={k} className={labelClass}>
              {k === 'name' ? 'Nome' : k === 'email' ? 'Email' : 'Telefono'}
              <input
                required={k === 'name'}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                className={inputClass}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Date / slot / status / payment */}
      <div>
        <p className="mb-3 font-black text-ocean-deep">Dettagli prenotazione</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className={labelClass}>Data
            <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} />
          </label>
          <label className={labelClass}>Slot
            <select value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} className={inputClass}>
              <option value="GIORNATA_INTERA">Giornata intera</option>
              <option value="MEZZA_GIORNATA">Mezza giornata</option>
            </select>
          </label>
          {!partnerMode && (
            <label className={labelClass}>Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </label>
          )}
          <label className={labelClass}>Pagamento
            <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className={inputClass}>
              {PAYMENT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      {/* Products */}
      <div>
        <p className="mb-3 font-black text-ocean-deep">Servizi</p>
        <div className="mb-1 hidden grid-cols-[1fr_5rem_7rem_6rem_2rem] gap-2 text-xs font-bold uppercase tracking-widest text-[#8AACCC] md:grid">
          <span>Prodotto</span><span className="text-center">Qtà</span><span className="text-center">Prezzo unit. (€)</span><span className="text-right">Totale</span><span />
        </div>
        <div className="divide-y divide-[#D0E8F7]">
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-[1fr_2rem] items-center gap-2 py-2 md:grid-cols-[1fr_5rem_7rem_6rem_2rem]">
              <select
                value={item.productId}
                onChange={(e) => changeProduct(idx, e.target.value)}
                className="rounded-lg border border-[#D0E8F7] px-3 py-2 text-sm"
              >
                <option value="">— Seleziona prodotto —</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input
                type="number" min={1} value={item.quantity}
                onChange={(e) => setQty(idx, Number(e.target.value))}
                className="rounded-lg border border-[#D0E8F7] px-3 py-2 text-center text-sm"
              />
              <input
                type="number" min={0} step="0.01" value={item.unitPrice}
                onChange={(e) => setUnitPrice(idx, Number(e.target.value))}
                className="rounded-lg border border-[#D0E8F7] px-3 py-2 text-center text-sm"
              />
              <span className="text-right text-sm font-black text-ocean-deep">
                €{(item.unitPrice * item.quantity).toFixed(2)}
              </span>
              <button type="button" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addItem} className="mt-2 rounded-full bg-ocean-light px-4 py-2 text-sm font-black text-ocean-deep hover:bg-ocean-mid hover:text-white">
          + Aggiungi servizio
        </button>
      </div>

      {/* Economics */}
      {!partnerMode && (
        <div className="rounded-xl border border-[#D0E8F7] bg-ocean-light/40 p-5">
          <p className="mb-3 font-black text-ocean-deep">Economics</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {!partnerMode && (
              <label className={labelClass}>Partner
                <select value={form.partnerId} onChange={(e) => changePartner(e.target.value)} className={inputClass}>
                  <option value="">Diretto (no partner)</option>
                  {partners.map((p) => <option key={p.id} value={p.id}>{p.companyName}</option>)}
                </select>
              </label>
            )}
            <label className={labelClass}>Discount code
              <input value={form.discountCode} onChange={(e) => setForm({ ...form, discountCode: e.target.value })} placeholder="—" className={inputClass} />
            </label>
            <label className={labelClass}>
              Public price (€)
              <span className="ml-1 text-xs font-normal text-[#8AACCC]">auto: €{autoTotal.toFixed(2)}</span>
              <input
                type="number" min={0} step="0.01"
                value={totalPublicOverride}
                onChange={(e) => setTotalPublicOverride(e.target.value)}
                placeholder={autoTotal.toFixed(2)}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>Partner price (€)
              <input type="number" min={0} step="0.01" value={totalPartner} onChange={(e) => setTotalPartner(e.target.value)} placeholder="—" className={inputClass} />
            </label>
            <label className={labelClass}>Commission (€)
              <input type="number" min={0} step="0.01" value={commission} onChange={(e) => setCommission(e.target.value)} placeholder="—" className={inputClass} />
            </label>
          </div>
        </div>
      )}

      {/* Fleet */}
      <div>
        <p className="mb-1 font-black text-ocean-deep">Barca assegnata</p>
        <p className="mb-3 text-sm text-[#4A6580]">Seleziona le barche per inserire questo booking nel calendario flotta.</p>
        <div className="flex flex-wrap gap-2">
          {fleetAssets.map((a) => (
            <label key={a.id} className="inline-flex items-center gap-2 rounded-full border border-[#D0E8F7] px-3 py-2 text-sm cursor-pointer hover:bg-ocean-light">
              <input
                type="checkbox"
                checked={fleetAssetIds.includes(a.id)}
                onChange={() => setFleetAssetIds((cur) => cur.includes(a.id) ? cur.filter((x) => x !== a.id) : [...cur, a.id])}
              />
              {a.name} · {a.category}
            </label>
          ))}
          {fleetAssets.length === 0 && <p className="text-sm text-[#4A6580]">Nessuna barca disponibile.</p>}
        </div>
      </div>

      {/* Notes */}
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>Note cliente
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${inputClass} min-h-24 resize-y`} />
        </label>
        {!partnerMode && (
          <label className={labelClass}>Note interne
            <textarea value={form.internalNotes} onChange={(e) => setForm({ ...form, internalNotes: e.target.value })} className={`${inputClass} min-h-24 resize-y`} />
          </label>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between rounded-xl bg-ocean-light p-4">
        <div>
          <p className="text-xs font-bold text-[#4A6580]">Totale public</p>
          <p className="text-2xl font-black text-ocean-deep">
            €{(totalPublicOverride !== '' ? Number(totalPublicOverride) : autoTotal).toFixed(2)}
          </p>
        </div>
        <button disabled={saving} className="rounded-full bg-sand px-6 py-3 font-black text-ocean-deep disabled:opacity-60">
          {saving ? 'Salvataggio…' : 'Salva booking'}
        </button>
      </div>
      {message && <p className="text-sm font-bold text-red-500">{message}</p>}
    </form>
  )
}
