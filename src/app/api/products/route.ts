import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const products = await prisma.product.findMany({ where: { active: true }, orderBy: { name: 'asc' } })
  return Response.json(products)
}

export async function PATCH(request: Request) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error
  const body = await request.json()

  if (body.partnerId && body.productId) {
    const price = await prisma.partnerPrice.upsert({
      where: { partnerId_productId: { partnerId: body.partnerId, productId: body.productId } },
      update: {
        commissionPct: body.fixedNetPrice ? null : body.commissionPct,
        fixedNetPrice: body.fixedNetPrice,
      },
      create: {
        partnerId: body.partnerId,
        productId: body.productId,
        commissionPct: body.fixedNetPrice ? null : body.commissionPct,
        fixedNetPrice: body.fixedNetPrice,
      },
    })
    return Response.json(price)
  }

  const product = await prisma.product.update({
    where: { id: body.id },
    data: { basePrice: body.basePrice, active: body.active, name: body.name, description: body.description },
  })
  return Response.json(product)
}
