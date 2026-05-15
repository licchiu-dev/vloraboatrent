import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN'])
  if ('error' in guard) return guard.error
  const { id } = await params
  const body = await request.json()

  const customer = await prisma.customer.update({
    where: { id },
    data: {
      name: body.name ?? undefined,
      email: body.email ?? undefined,
      phone: body.phone ?? undefined,
    },
  })
  return Response.json(customer)
}
