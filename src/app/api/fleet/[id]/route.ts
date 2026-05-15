import { FleetCategory } from '@prisma/client'
import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN'])
  if ('error' in guard) return guard.error
  const { id } = await params
  const body = await request.json()

  const asset = await prisma.fleetAsset.update({
    where: { id },
    data: {
      name: body.name,
      category: body.category in FleetCategory ? body.category : undefined,
      active: body.active,
      notes: body.notes,
    },
    include: { pricingProduct: true },
  })

  return Response.json(asset)
}
