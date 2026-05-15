import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error
  const { id } = await params

  const inUse = await prisma.bookingItem.count({ where: { productId: id } })
  if (inUse > 0) {
    return Response.json(
      { error: 'Cannot delete: product is linked to existing bookings. Deactivate it instead.' },
      { status: 409 }
    )
  }

  await prisma.product.delete({ where: { id } })
  return Response.json({ ok: true })
}
