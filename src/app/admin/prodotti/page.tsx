import { Card, PageHeader } from '@/components/admin/Ui'
import ProductCatalogEditor from '@/components/admin/ProductCatalogEditor'
import SitePriceEditor from '@/components/admin/SitePriceEditor'
import { requireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

const SITE_PRICE_DEFAULTS = [
  { key: 'gommone', label: 'Gommone (Joker Boat 580)', price: 200 },
  { key: 'gommone_piccolo', label: 'Gommone piccolo (Joker Boat 500)', price: 150 },
  { key: 'barca', label: 'Barca (Mingolla Brava 18)', price: 180 },
]

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ partner?: string }> }) {
  await requireRole(['SUPERADMIN'])
  const { partner: selectedPartnerId } = await searchParams
  const [products, partners, sitePriceRows] = await Promise.all([
    prisma.product.findMany({ include: { partnerPrices: true }, orderBy: { category: 'asc' } }),
    prisma.partner.findMany({ orderBy: { companyName: 'asc' } }),
    prisma.sitePrice.findMany(),
  ])
  const selectedPartner = partners.find((partner) => partner.id === selectedPartnerId) ?? partners[0]

  const sitePrices = SITE_PRICE_DEFAULTS.map((def) => {
    const row = sitePriceRows.find((r) => r.key === def.key)
    return row ? { key: row.key, label: row.label, price: row.price } : def
  })

  return (
    <>
      <PageHeader title="Product catalog" subtitle="Public list prices and partner-specific net pricing." />
      <Card className="mb-6">
        <SitePriceEditor initialPrices={sitePrices} />
      </Card>
      <Card>
        <ProductCatalogEditor products={products} partners={partners} selectedPartnerId={selectedPartner?.id} />
      </Card>
    </>
  )
}
