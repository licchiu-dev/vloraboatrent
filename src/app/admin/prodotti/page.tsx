import { Card, PageHeader } from '@/components/admin/Ui'
import ProductCatalogEditor from '@/components/admin/ProductCatalogEditor'
import { requireRole } from '@/lib/guards'
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
      <Card>
        <ProductCatalogEditor products={products} partners={partners} selectedPartnerId={selectedPartner?.id} />
      </Card>
    </>
  )
}
