'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Partner, Product } from '@prisma/client'

type FleetAsset = {
  id: string
  name: string
  category: string
}

export default function BookingEditor({ partnerMode = false }: { partnerMode?: boolean }) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [fleetAssets, setFleetAssets] = useState<FleetAsset[]>([])
  const [fleetAssetIds, setFleetAssetIds] = useState<string[]>([])
  const [items, setItems] = useState([{ productId: '', quantity: 1 }])
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', timeSlot: 'GIORNATA_INTERA', paymentMethod: 'MOLO', partnerId: '', discountCode: '', notes: '', internalNotes: '', status: 'CONFIRMED' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/products').then((res) => res.json()).then(setProducts)
    fetch('/api/fleet').then((res) => res.ok ? res.json() : []).then(setFleetAssets)
    if (!partnerMode) fetch('/api/partners').then((res) => res.ok ? res.json() : []).then(setPartners)
  }, [partnerMode])

  const total = useMemo(() => items.reduce((sum, item) => {
    const product = products.find((candidate) => candidate.id === item.productId)
    return sum + (product?.basePrice ?? 0) * item.quantity
  }, 0), [items, products])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
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
        items: items.filter((item) => item.productId),
      }),
    })
    setSaving(false)
    if (!response.ok) {
      setMessage('Save failed. Check the required fields.')
      return
    }
    const booking = await response.json()
    if (fleetAssetIds.length > 0) {
      const assignmentResponse = await fetch('/api/fleet/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id, fleetAssetIds }),
      })
      if (!assignmentResponse.ok) {
        const result = await assignmentResponse.json()
        setMessage(result.error ?? 'Booking saved, but fleet assignment failed.')
        return
      }
    }
    setMessage('Booking saved.')
    router.push(partnerMode ? '/partner/prenotazioni' : '/admin/prenotazioni')
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-lg border border-[#D0E8F7] bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['name', 'Customer name'],
          ['email', 'Email'],
          ['phone', 'Phone'],
        ].map(([key, label]) => (
          <label key={key} className="text-sm font-bold text-ocean-deep">{label}
            <input required value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-2 w-full rounded-lg border border-[#D0E8F7] px-3 py-2" />
          </label>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <label className="text-sm font-bold text-ocean-deep">Date
          <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-2 w-full rounded-lg border border-[#D0E8F7] px-3 py-2" />
        </label>
        <label className="text-sm font-bold text-ocean-deep">Time slot
          <select value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} className="mt-2 w-full rounded-lg border border-[#D0E8F7] px-3 py-2">
            <option value="GIORNATA_INTERA">Full day</option>
            <option value="MEZZA_GIORNATA">Half day</option>
          </select>
        </label>
        <label className="text-sm font-bold text-ocean-deep">Payment
          <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="mt-2 w-full rounded-lg border border-[#D0E8F7] px-3 py-2">
            <option value="ONLINE">Online</option>
            <option value="PARTNER">Partner</option>
            <option value="MOLO">At the dock</option>
          </select>
        </label>
        {!partnerMode && (
          <label className="text-sm font-bold text-ocean-deep">Partner
            <select value={form.partnerId} onChange={(e) => setForm({ ...form, partnerId: e.target.value, discountCode: partners.find((p) => p.id === e.target.value)?.discountCode ?? '' })} className="mt-2 w-full rounded-lg border border-[#D0E8F7] px-3 py-2">
              <option value="">Direct</option>
              {partners.map((partner) => <option key={partner.id} value={partner.id}>{partner.companyName}</option>)}
            </select>
          </label>
        )}
        {!partnerMode && (
          <label className="text-sm font-bold text-ocean-deep">Initial status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-2 w-full rounded-lg border border-[#D0E8F7] px-3 py-2">
              {['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        )}
      </div>

      <div className="space-y-3">
        <p className="font-black text-ocean-deep">Products</p>
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 md:grid-cols-[1fr_8rem]">
            <select value={item.productId} onChange={(e) => setItems(items.map((line, i) => i === index ? { ...line, productId: e.target.value } : line))} className="rounded-lg border border-[#D0E8F7] px-3 py-2">
              <option value="">Select product</option>
              {products.map((product) => <option key={product.id} value={product.id}>{product.name} - €{product.basePrice}</option>)}
            </select>
            <input type="number" min={1} value={item.quantity} onChange={(e) => setItems(items.map((line, i) => i === index ? { ...line, quantity: Number(e.target.value) } : line))} className="rounded-lg border border-[#D0E8F7] px-3 py-2" />
          </div>
        ))}
        <button type="button" onClick={() => setItems([...items, { productId: '', quantity: 1 }])} className="rounded-full bg-ocean-light px-4 py-2 text-sm font-black text-ocean-deep">Add product</button>
      </div>

      <div className="space-y-3">
        <p className="font-black text-ocean-deep">Fleet asset</p>
        <p className="text-sm text-[#4A6580]">Select one or more boats to place this booking directly on the fleet calendar.</p>
        <div className="flex flex-wrap gap-2">
          {fleetAssets.map((asset) => (
            <label key={asset.id} className="inline-flex items-center gap-2 rounded-full border border-[#D0E8F7] px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={fleetAssetIds.includes(asset.id)}
                onChange={() =>
                  setFleetAssetIds((current) =>
                    current.includes(asset.id) ? current.filter((id) => id !== asset.id) : [...current, asset.id]
                  )
                }
              />
              {asset.name} · {asset.category}
            </label>
          ))}
          {fleetAssets.length === 0 && <p className="text-sm text-[#4A6580]">No fleet assets available yet.</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <textarea placeholder="Customer notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="min-h-28 rounded-lg border border-[#D0E8F7] px-3 py-2" />
        {!partnerMode && <textarea placeholder="Internal notes" value={form.internalNotes} onChange={(e) => setForm({ ...form, internalNotes: e.target.value })} className="min-h-28 rounded-lg border border-[#D0E8F7] px-3 py-2" />}
      </div>

      <div className="flex items-center justify-between rounded-lg bg-ocean-light p-4">
        <div>
          <p className="text-sm font-bold text-[#4A6580]">Price summary</p>
          <p className="text-2xl font-black text-ocean-deep">€{total.toFixed(2)}</p>
        </div>
        <button disabled={saving} className="rounded-full bg-sand px-6 py-3 font-black text-ocean-deep disabled:opacity-60">{saving ? 'Saving...' : 'Save booking'}</button>
      </div>
      {message && <p className="text-sm font-bold text-ocean-mid">{message}</p>}
    </form>
  )
}
