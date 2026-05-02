import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN'])
  if ('error' in guard) return guard.error
  const customers = await prisma.customer.findMany({ include: { bookings: true }, orderBy: { createdAt: 'desc' } })
  return Response.json(customers)
}
