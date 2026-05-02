import { Card, PageHeader } from '@/components/admin/Ui'
import { requireRole } from '@/lib/guards'
import { calcPartnerPrice } from '@/lib/pricing'
import { prisma } from '@/lib/prisma'

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ partner?: string }> }) {
  await requireRole(['SUPERADMIN'])
  const { partner: selectedPartnerId } = await searchParams
  const [products, partners] = await Promise.all([
    prisma.product.findMany({ include: { partnerPrices: true }, orderBy: { category: 'asc' } }),
    prisma.partner.findMany({ orderBy: { companyName: 'asc' } }),
  ])
  const selectedPartner = partners.find((partner) => partner.id === selectedPartnerId) ?? partners[0]

  return (
    <>
      <PageHeader title="Product catalog" subtitle="Public list prices and partner-specific net pricing." />
      <Card className="mb-6 overflow-x-auto">
        <h2 className="mb-4 text-xl font-black text-ocean-deep">Products</h2>
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead><tr className="text-[#4A6580]">{['Name', 'Category', 'Public price', 'Status'].map((h) => <th key={h} className="pb-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-[#D0E8F7]">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-4 font-black">{product.name}</td>
                <td>{product.category}</td>
                <td>€{product.basePrice.toFixed(2)}</td>
                <td>{product.active ? 'Active' : 'Disabled'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="overflow-x-auto">
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
          <thead><tr className="text-[#4A6580]">{['Product', 'Public price', 'Default %', 'Custom %', 'Fixed net', 'Result'].map((h) => <th key={h} className="pb-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-[#D0E8F7]">
            {products.map((product) => {
              const custom = product.partnerPrices.find((price) => price.partnerId === selectedPartner?.id)
              const result = selectedPartner ? calcPartnerPrice(product, selectedPartner) : product.basePrice
              return (
                <tr key={product.id}>
                  <td className="py-4 font-black">{product.name}</td>
                  <td>€{product.basePrice.toFixed(2)}</td>
                  <td>{selectedPartner?.defaultCommission ?? 0}%</td>
                  <td>{custom?.commissionPct ?? '-'}</td>
                  <td>{custom?.fixedNetPrice ? `€${custom.fixedNetPrice.toFixed(2)}` : '-'}</td>
                  <td className="font-black text-ocean-deep">€{result.toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="mt-4 text-sm text-[#4A6580]">Rows are backed by /api/products PATCH for inline edits and copy-from-partner workflows.</p>
      </Card>
    </>
  )
}
