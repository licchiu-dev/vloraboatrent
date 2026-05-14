'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Partner, PartnerPrice, Product, ProductCategory } from '@prisma/client'
import { calcPartnerPrice } from '@/lib/pricing'

type ProductWithPrices = Product & { partnerPrices: PartnerPrice[] }

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
        <h2 className="mb-4 text-xl font-black text-ocean-deep">Products</h2>
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead>
            <tr className="text-[#4A6580]">
              {['Name', 'Category', 'Public price', 'Status', 'Description', ''].map((head) => (
                <th key={head} className="pb-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D0E8F7]">
            {sortedProducts.map((product) => (
              <tr key={product.id}>
                <td className="py-4 pr-3">
                  <input
                    value={product.name}
                    onChange={(event) => updateProduct(product.id, { name: event.target.value })}
                    className="w-full rounded-lg border border-[#D0E8F7] px-3 py-2 font-black outline-none focus:border-ocean-bright"
                  />
                </td>
                <td className="pr-3">
                  <select
                    value={product.category}
                    onChange={(event) => updateProduct(product.id, { category: event.target.value as ProductCategory })}
                    className="w-full rounded-lg border border-[#D0E8F7] px-3 py-2 outline-none focus:border-ocean-bright"
                  >
                    <option value="NOLEGGIO">NOLEGGIO</option>
                    <option value="ESPERIENZA">ESPERIENZA</option>
                    <option value="EXTRA">EXTRA</option>
                  </select>
                </td>
                <td className="pr-3">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={product.basePrice}
                    onChange={(event) => updateProduct(product.id, { basePrice: Number(event.target.value) })}
                    className="w-32 rounded-lg border border-[#D0E8F7] px-3 py-2 outline-none focus:border-ocean-bright"
                  />
                </td>
                <td className="pr-3">
                  <label className="inline-flex items-center gap-2 font-bold text-ocean-deep">
                    <input
                      type="checkbox"
                      checked={product.active}
                      onChange={(event) => updateProduct(product.id, { active: event.target.checked })}
                      className="h-4 w-4 accent-ocean-bright"
                    />
                    Active
                  </label>
                </td>
                <td className="pr-3">
                  <input
                    value={product.description ?? ''}
                    onChange={(event) => updateProduct(product.id, { description: event.target.value })}
                    placeholder="Description"
                    className="w-full rounded-lg border border-[#D0E8F7] px-3 py-2 outline-none focus:border-ocean-bright"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => saveProduct(product)}
                    disabled={savingProduct === product.id}
                    className="rounded-full bg-ocean-deep px-4 py-2 text-xs font-black text-white disabled:opacity-60"
                  >
                    {savingProduct === product.id ? 'Saving...' : 'Save'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <h2 className="text-xl font-black text-ocean-deep">Partner prices</h2>
          <form>
            <select name="partner" defaultValue={selectedPartner?.id} className="rounded-lg border border-[#D0E8F7] px-3 py-2">
              {partners.map((partner) => <option key={partner.id} value={partner.id}>{partner.companyName}</option>)}
            </select>
            <button className="ml-2 rounded-lg bg-ocean-deep px-3 py-2 text-sm font-bold text-white">Load</button>
          </form>
        </div>
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="text-[#4A6580]">
              {['Product', 'Public price', 'Default %', 'Custom %', 'Fixed net', 'Result', ''].map((head) => (
                <th key={head} className="pb-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D0E8F7]">
            {sortedProducts.map((product) => {
              const custom = product.partnerPrices.find((price) => price.partnerId === selectedPartner?.id)
              const result = selectedPartner ? calcPartnerPrice(product, selectedPartner) : product.basePrice
              return (
                <tr key={product.id}>
                  <td className="py-4 font-black">{product.name}</td>
                  <td>€{product.basePrice.toFixed(2)}</td>
                  <td>{selectedPartner?.defaultCommission ?? 0}%</td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={custom?.commissionPct ?? ''}
                      placeholder="-"
                      onChange={(event) => updatePartnerPrice(product.id, { commissionPct: event.target.value === '' ? null : Number(event.target.value), fixedNetPrice: null })}
                      className="w-28 rounded-lg border border-[#D0E8F7] px-3 py-2 outline-none focus:border-ocean-bright"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={custom?.fixedNetPrice ?? ''}
                      placeholder="-"
                      onChange={(event) => updatePartnerPrice(product.id, { fixedNetPrice: event.target.value === '' ? null : Number(event.target.value), commissionPct: null })}
                      className="w-28 rounded-lg border border-[#D0E8F7] px-3 py-2 outline-none focus:border-ocean-bright"
                    />
                  </td>
                  <td className="font-black text-ocean-deep">€{result.toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => savePartnerPrice(product)}
                      disabled={savingPrice === product.id || !selectedPartner}
                      className="rounded-full bg-ocean-deep px-4 py-2 text-xs font-black text-white disabled:opacity-60"
                    >
                      {savingPrice === product.id ? 'Saving...' : 'Save'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
