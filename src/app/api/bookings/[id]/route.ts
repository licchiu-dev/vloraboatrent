import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN'])
  if ('error' in guard) return guard.error
  const { id } = await params
  const body = await request.json()
  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: body.status,
      notes: body.notes,
      internalNotes: body.internalNotes,
      date: body.date ? new Date(body.date) : undefined,
      timeSlot: body.timeSlot,
    },
  })
  return Response.json(booking)
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error
  const { id } = await params
  await prisma.booking.delete({ where: { id } })
  return Response.json({ ok: true })
}
