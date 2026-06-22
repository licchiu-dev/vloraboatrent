'use client'

import { useState } from 'react'

type SitePrice = { key: string; label: string; price: number }

export default function SitePriceEditor({ initialPrices }: { initialPrices: SitePrice[] }) {
  const [prices, setPrices] = useState(initialPrices)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  function update(key: string, price: number) {
    setPrices((prev) => prev.map((p) => (p.key === key ? { ...p, price } : p)))
  }

  async function save(item: SitePrice) {
    setSaving(item.key)
    setMessage('')
    const res = await fetch('/api/site-prices', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: item.key, price: item.price, label: item.label }),
    })
    setSaving(null)
    if (!res.ok) { setMessage('Save failed.'); return }
    setMessage(`${item.label} aggiornato.`)
  }

  return (
    <div>
      <h2 className="text-xl font-black text-ocean-deep">Prezzi Sito</h2>
      <p className="mt-1 mb-5 text-sm text-[#4A6580]">
        Questi prezzi vengono mostrati direttamente sul sito pubblico per ogni imbarcazione. Modificali qui per aggiornare il frontend in tempo reale.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {prices.map((item) => (
          <div key={item.key} className="rounded-xl border border-[#D0E8F7] bg-white p-5">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#8AACCC]">{item.key}</p>
            <p className="mb-3 font-black text-ocean-deep">{item.label}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#4A6580]">€</span>
              <input
                type="number"
                min={0}
                step="1"
                value={item.price}
                onChange={(e) => update(item.key, Number(e.target.value))}
                className="w-full rounded-lg border border-[#D0E8F7] px-3 py-2 text-lg font-black text-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-mid"
              />
            </div>
            <button
              type="button"
              onClick={() => save(item)}
              disabled={saving === item.key}
              className="mt-3 w-full rounded-full bg-ocean-deep py-2 text-sm font-black text-white disabled:opacity-60"
            >
              {saving === item.key ? 'Salvataggio…' : 'Salva'}
            </button>
          </div>
        ))}
      </div>
      {message && <p className="mt-4 text-sm font-bold text-ocean-mid">{message}</p>}
    </div>
  )
}
