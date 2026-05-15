import FleetPlanner from '@/components/admin/FleetPlanner'
import FleetAssetManager from '@/components/admin/FleetAssetManager'
import { PageHeader } from '@/components/admin/Ui'
import { prisma } from '@/lib/prisma'

export default async function FleetPage() {
  const assets = await prisma.fleetAsset.findMany({
    include: {
      pricingProduct: true,
      assignments: {
        include: { booking: true },
      },
    },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  })

  const summaries = assets.map((asset) => {
    const validAssignments = asset.assignments.filter((assignment) => assignment.booking.status !== 'CANCELLED')
    return {
      id: asset.id,
      name: asset.name,
      category: asset.category,
      active: asset.active,
      notes: asset.notes,
      pricingProductName: asset.pricingProduct.name,
      bookingsCount: validAssignments.length,
      revenue: validAssignments.reduce((sum) => sum + asset.pricingProduct.basePrice, 0),
    }
  })

  return (
    <>
      <PageHeader title="Fleet" subtitle="Manage vessels, monitor revenue and plan availability." />
      <div className="mb-8">
        <FleetAssetManager assets={summaries} />
      </div>
      <FleetPlanner canManageFleet />
    </>
  )
}
