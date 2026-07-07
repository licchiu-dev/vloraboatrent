'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Partner, PartnerPrice, Product, ProductCategory } from '@prisma/client'
import { calcPartnerPrice } from '@/lib/pricing'

type ProductWithPrices = Product & { partnerPrices: PartnerPrice[] }

const inputClass = 'w-full rounded-lg border border-[#D0E8F7] px-3 py-2 text-sm outline-none focus:border-ocean-mid focus:ring-1 focus:ring-ocean-mid'

const EMPTY_NEW = { name: '', category: 'EXTRA' as ProductCategory, basePrice: '', description: '' }

export default function ProductCatalogEditor({
  products: initialProducts,
  partners,
  selectedPartnerId,
}: {
  products: ProductWithPrices[]
  partners: Partner[]
  selectedPartnerId?: string
}) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [newProduct, setNewProduct] = useState(EMPTY_NEW)
  const [addingNew, setAddingNew] = useState(false)
  const [savingNew, setSavingNew] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [savingProduct, setSavingProduct] = useState('')
  const [savingPrice, setSavingPrice] = useState('')
  const [message, setMessage] = useState('')
  const selectedPartner = partners.find((partner) => partner.id === selectedPartnerId) ?? partners[0]

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)),
    [products]
  )

  function updateProduct(id: string, patch: Partial<ProductWithPrices>) {
    setProducts((current) => current.map((product) => (product.id === id ? { ...product, ...patch } : product)))
  }

  function updatePartnerPrice(productId: string, patch: Partial<PartnerPrice>) {
    if (!selectedPartner) return
    setProducts((current) =>
      current.map((product) => {
        if (product.id !== productId) return product
        const existing = product.partnerPrices.find((price) => price.partnerId === selectedPartner.id)
        const nextPrice = existing
          ? { ...existing, ...patch }
          : {
              id: `draft-${productId}`,
              partnerId: selectedPartner.id,
              productId,
              commissionPct: null,
              fixedNetPrice: null,
              ...patch,
            }
        return {
          ...product,
          partnerPrices: existing
            ? product.partnerPrices.map((price) => (price.partnerId === selectedPartner.id ? nextPrice : price))
            : [...product.partnerPrices, nextPrice],
        }
      })
    )
  }

  async function createProduct() {
    if (!newProduct.name.trim()) return
    setSavingNew(true)
    setMessage('')
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newProduct, basePrice: Number(newProduct.basePrice) || 0 }),
    })
    setSavingNew(false)
    if (!res.ok) { setMessage('Create failed.'); return }
    const created = await res.json()
    setProducts((prev) => [...prev, { ...created, partnerPrices: [] }])
    setNewProduct(EMPTY_NEW)
    setAddingNew(false)
    setMessage('Product created.')
    router.refresh()
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product? If it has bookings it will be refused — deactivate it instead.')) return
    setDeletingId(id)
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    setDeletingId('')
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setMessage(body.error ?? 'Delete failed.')
      return
    }
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setMessage('Product deleted.')
    router.refresh()
  }

  async function saveProduct(product: ProductWithPrices) {
    setSavingProduct(product.id)
    setMessage('')
    const response = await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: product.id,
        name: product.name,
        category: product.category,
        basePrice: product.basePrice,
        active: product.active,
        description: product.description,
      }),
    })
    setSavingProduct('')
    if (!response.ok) {
      setMessage('Product save failed.')
      return
    }
    const saved = await response.json()
    updateProduct(product.id, saved)
    setMessage('Product saved.')
    router.refresh()
  }

  async function savePartnerPrice(product: ProductWithPrices) {
    if (!selectedPartner) return
    const custom = product.partnerPrices.find((price) => price.partnerId === selectedPartner.id)
    setSavingPrice(product.id)
    setMessage('')
    const response = await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partnerId: selectedPartner.id,
        productId: product.id,
        commissionPct: custom?.commissionPct ?? null,
        fixedNetPrice: custom?.fixedNetPrice ?? null,
      }),
    })
    setSavingPrice('')
    if (!response.ok) {
      setMessage('Partner price save failed.')
      return
    }
    const saved = await response.json()
    updatePartnerPrice(product.id, saved)
    setMessage('Partner price saved.')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {message && <p className="rounded-lg bg-ocean-light px-4 py-3 text-sm font-bold text-ocean-deep">{message}</p>}

      <div className="overflow-x-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-ocean-deep">Products</h2>
          <button
            type="button"
            onClick={() => setAddingNew((v) => !v)}
            className="rounded-full bg-ocean-deep px-4 py-2 text-sm font-black text-white"
          >
            {addingNew ? 'Cancel' : '+ New product'}
          </button>
        </div>
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead>
            <tr className="text-[#4A6580]">
              {['Name', 'Category', 'Public price (€)', 'Status', 'Description', '', ''].map((head) => (
                <th key={head} className="pb-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D0E8F7]">
            {addingNew && (
              <tr className="bg-ocean-light/40">
                <td className="py-3 pr-3">
                  <input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Product name *"
                    className={inputClass + ' font-black'}
                  />
                </td>
                <td className="pr-3">
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value as ProductCategory }))}
                    className={inputClass}
                  >
                    <option value="NOLEGGIO">NOLEGGIO</option>
                    <option value="ESPERIENZA">ESPERIENZA</option>
                    <option value="EXTRA">EXTRA</option>
                  </select>
                </td>
                <td className="pr-3">
                  <input
                    type="number" min={0} step="0.01"
                    value={newProduct.basePrice}
                    onChange={(e) => setNewProduct((p) => ({ ...p, basePrice: e.target.value }))}
                    placeholder="0.00"
                    className={inputClass + ' w-28'}
                  />
                </td>
                <td className="pr-3 text-sm text-[#4A6580]">Active on create</td>
                <td className="pr-3">
                  <input
                    value={newProduct.description}
                    onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Description"
                    className={inputClass}
                  />
                </td>
                <td colSpan={2}>
                  <button
                    type="button"
                    onClick={createProduct}
                    disabled={savingNew || !newProduct.name.trim()}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white disabled:opacity-60"
                  >
                    {savingNew ? 'Creating…' : 'Create'}
                  </button>
                </td>
              </tr>
            )}
            {sortedProducts.map((product) => (
              <tr key={product.id}>
                <td className="py-4 pr-3">
                  <input
                    value={product.name}
                    onChange={(event) => updateProduct(product.id, { name: event.target.value })}
                    className="w-full rounded-lg border border-[#D0E8F7] px-3 py-2 font-black outline-none focus:border-ocean-mid"
                  />
                </td>
                <td className="pr-3">
                  <select
                    value={product.category}
                    onChange={(event) => updateProduct(product.id, { category: event.target.value as ProductCategory })}
                    className="w-full rounded-lg border border-[#D0E8F7] px-3 py-2 outline-none focus:border-ocean-mid"
                  >
                    <option value="NOLEGGIO">NOLEGGIO</option>
                    <option value="ESPERIENZA">ESPERIENZA</option>
                    <option value="EXTRA">EXTRA</option>
                  </select>
                </td>
                <td className="pr-3">
                  <input
                    type="number" min={0} step="0.01"
                    value={product.basePrice}
                    onChange={(event) => updateProduct(product.id, { basePrice: Number(event.target.value) })}
                    className="w-32 rounded-lg border border-[#D0E8F7] px-3 py-2 outline-none focus:border-ocean-mid"
                  />
                </td>
                <td className="pr-3">
                  <label className="inline-flex items-center gap-2 font-bold text-ocean-deep">
                    <input
                      type="checkbox"
                      checked={product.active}
                      onChange={(event) => updateProduct(product.id, { active: event.target.checked })}
                      className="h-4 w-4 accent-ocean-mid"
                    />
                    Active
                  </label>
                </td>
                <td className="pr-3">
                  <input
                    value={product.description ?? ''}
                    onChange={(event) => updateProduct(product.id, { description: event.target.value })}
                    placeholder="Description"
                    className="w-full rounded-lg border border-[#D0E8F7] px-3 py-2 outline-none focus:border-ocean-mid"
                  />
                </td>
                <td className="pr-2">
                  <button
                    type="button"
                    onClick={() => saveProduct(product)}
                    disabled={savingProduct === product.id}
                    className="rounded-full bg-ocean-deep px-4 py-2 text-xs font-black text-white disabled:opacity-60"
                  >
                    {savingProduct === product.id ? 'Saving…' : 'Save'}
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => deleteProduct(product.id)}
                    disabled={deletingId === product.id}
                    className="rounded-full border border-red-200 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    {deletingId === product.id ? '…' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-black text-ocean-deep">Partner fees</h2>
            <p className="mt-0.5 text-xs text-[#4A6580]">
              For each product choose the fee type: default %, custom %, or fixed net price.
            </p>
          </div>
          <form>
            <select name="partner" defaultValue={selectedPartner?.id} className="rounded-lg border border-[#D0E8F7] px-3 py-2 text-sm">
              {partners.map((partner) => <option key={partner.id} value={partner.id}>{partner.companyName}</option>)}
            </select>
            <button className="ml-2 rounded-lg bg-ocean-deep px-3 py-2 text-sm font-bold text-white">Load</button>
          </form>
        </div>
        {!selectedPartner ? (
          <p className="py-8 text-center text-sm text-[#4A6580]">No partners yet.</p>
        ) : (
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#D0E8F7] text-[#4A6580]">
                <th className="pb-3">Product</th>
                <th className="pb-3 text-right">Public (€)</th>
                <th className="pb-3">Fee type</th>
                <th className="pb-3">Value</th>
                <th className="pb-3 text-right">Quota New Rent Vlora</th>
                <th className="pb-3 text-right">Quota partner</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D0E8F7]">
              {sortedProducts.map((product) => {
                const custom = product.partnerPrices.find((p) => p.partnerId === selectedPartner.id)

                // Derive current fee type from stored data
                const feeType: 'default' | 'pct' | 'fixed' =
                  custom?.fixedNetPrice != null ? 'fixed'
                  : custom?.commissionPct != null ? 'pct'
                  : 'default'

                const partnerNet = calcPartnerPrice(product, selectedPartner)
                const commission = product.basePrice - partnerNet

                return (
                  <tr key={product.id}>
                    <td className="py-3 pr-3 font-bold text-ocean-deep">{product.name}</td>
                    <td className="py-3 pr-3 text-right text-[#4A6580]">€{product.basePrice.toFixed(2)}</td>

                    {/* Fee type selector */}
                    <td className="py-3 pr-3">
                      <select
                        value={feeType}
                        onChange={(e) => {
                          const t = e.target.value as 'default' | 'pct' | 'fixed'
                          if (t === 'default') {
                            updatePartnerPrice(product.id, { commissionPct: null, fixedNetPrice: null })
                          } else if (t === 'pct') {
                            updatePartnerPrice(product.id, { commissionPct: selectedPartner.defaultCommission, fixedNetPrice: null })
                          } else {
                            updatePartnerPrice(product.id, { fixedNetPrice: product.basePrice, commissionPct: null })
                          }
                        }}
                        className="rounded-lg border border-[#D0E8F7] px-2 py-2 text-sm outline-none focus:border-ocean-mid"
                      >
                        <option value="default">Default ({selectedPartner.defaultCommission}%)</option>
                        <option value="pct">Custom %</option>
                        <option value="fixed">Fixed net price (€)</option>
                      </select>
                    </td>

                    {/* Value input — adapts to fee type */}
                    <td className="py-3 pr-3">
                      {feeType === 'default' && (
                        <span className="text-[#4A6580]">—</span>
                      )}
                      {feeType === 'pct' && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number" min={0} max={100} step="0.1"
                            value={custom?.commissionPct ?? selectedPartner.defaultCommission}
                            onChange={(e) => updatePartnerPrice(product.id, { commissionPct: Number(e.target.value), fixedNetPrice: null })}
                            className="w-20 rounded-lg border border-[#D0E8F7] px-2 py-2 outline-none focus:border-ocean-mid"
                          />
                          <span className="text-[#4A6580]">%</span>
                        </div>
                      )}
                      {feeType === 'fixed' && (
                        <div className="flex items-center gap-1">
                          <span className="text-[#4A6580]">€</span>
                          <input
                            type="number" min={0} max={product.basePrice} step="0.01"
                            value={custom?.fixedNetPrice ?? product.basePrice}
                            onChange={(e) => updatePartnerPrice(product.id, { fixedNetPrice: Number(e.target.value), commissionPct: null })}
                            className="w-24 rounded-lg border border-[#D0E8F7] px-2 py-2 outline-none focus:border-ocean-mid"
                          />
                        </div>
                      )}
                    </td>

                    {/* Results */}
                    <td className="py-3 pr-3 text-right font-bold text-[#4A6580]">€{partnerNet.toFixed(2)}</td>
                    <td className="py-3 pr-3 text-right font-black text-ocean-deep">€{commission.toFixed(2)}</td>

                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => savePartnerPrice(product)}
                        disabled={savingPrice === product.id}
                        className="rounded-full bg-ocean-deep px-4 py-2 text-xs font-black text-white disabled:opacity-60"
                      >
                        {savingPrice === product.id ? 'Saving…' : 'Save'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
