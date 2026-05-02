import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN'])
  if ('error' in guard) return guard.error
  const suppliers = await prisma.supplier.findMany({ include: { expenses: true }, orderBy: { createdAt: 'desc' } })
  return Response.json(suppliers)
}

export async function POST(request: Request) {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN'])
  if ('error' in guard) return guard.error
  const body = await request.json()
  const supplier = await prisma.supplier.create({
    data: {
      name: body.name,
      type: body.type,
      contact: body.contact,
      notes: body.notes,
      expenses: body.expenseAmount
        ? { create: { amount: Number(body.expenseAmount), description: body.expenseDescription, date: new Date(body.expenseDate) } }
        : undefined,
    },
  })
  return Response.json(supplier)
}
