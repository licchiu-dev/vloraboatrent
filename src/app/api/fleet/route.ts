import { FleetCategory } from '@prisma/client'
import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN', 'PARTNER'])
  if ('error' in guard) return guard.error

  const url = new URL(request.url)
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')
  const assets = await prisma.fleetAsset.findMany({
    where: { active: true },
    include: {
      pricingProduct: true,
      assignments: {
        where: from && to ? { booking: { date: { gte: new Date(from), lte: new Date(to) } } } : undefined,
        include: { booking: { include: { customer: true, items: { include: { product: true } } } } },
      },
    },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  })
  return Response.json(assets)
}

export async function POST(request: Request) {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN'])
  if ('error' in guard) return guard.error
  const body = await request.json()
  const pricingProduct = await prisma.product.findFirst({
    where: { category: 'NOLEGGIO', active: true },
    orderBy: { basePrice: 'asc' },
  })
  if (!pricingProduct) {
    return Response.json({ error: 'Create at least one active rental product first.' }, { status: 400 })
  }

  const asset = await prisma.fleetAsset.create({
    data: {
      name: body.name,
      category: body.category in FleetCategory ? body.category : FleetCategory.GOMMONE,
      pricingProductId: pricingProduct.id,
      notes: body.notes,
    },
    include: { pricingProduct: true, assignments: true },
  })
  return Response.json(asset)
}
