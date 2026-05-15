import { ProductCategory } from '@prisma/client'
import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const products = await prisma.product.findMany({ where: { active: true }, orderBy: { name: 'asc' } })
  return Response.json(products)
}

export async function POST(request: Request) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error
  const body = await request.json()

  if (!body.name?.trim()) return Response.json({ error: 'Name is required.' }, { status: 400 })

  const product = await prisma.product.create({
    data: {
      name: body.name.trim(),
      category: body.category in ProductCategory ? body.category : ProductCategory.EXTRA,
      basePrice: Math.max(0, Number(body.basePrice) || 0),
      description: body.description ?? null,
      active: true,
    },
  })
  return Response.json(product, { status: 201 })
}

export async function PATCH(request: Request) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error
  const body = await request.json()

  if (body.partnerId && body.productId) {
    const hasFixedNetPrice = body.fixedNetPrice != null
    const price = await prisma.partnerPrice.upsert({
      where: { partnerId_productId: { partnerId: body.partnerId, productId: body.productId } },
      update: {
        commissionPct: hasFixedNetPrice ? null : body.commissionPct,
        fixedNetPrice: body.fixedNetPrice,
      },
      create: {
        partnerId: body.partnerId,
        productId: body.productId,
        commissionPct: hasFixedNetPrice ? null : body.commissionPct,
        fixedNetPrice: body.fixedNetPrice,
      },
    })
    return Response.json(price)
  }

  const product = await prisma.product.update({
    where: { id: body.id },
    data: {
      basePrice: body.basePrice,
      active: body.active,
      name: body.name,
      category: body.category,
      description: body.description,
    },
  })
  return Response.json(product)
}
