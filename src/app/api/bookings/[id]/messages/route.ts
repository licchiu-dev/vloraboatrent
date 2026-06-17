import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN'])
  if ('error' in guard) return guard.error
  const { id } = await params
  const messages = await prisma.bookingMessage.findMany({
    where: { bookingId: id },
    orderBy: { sentAt: 'desc' },
  })
  return Response.json(messages)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN'])
  if ('error' in guard) return guard.error
  const { id } = await params
  const { text } = await request.json()
  if (!text?.trim()) return Response.json({ error: 'text is required' }, { status: 400 })
  const message = await prisma.bookingMessage.create({
    data: { bookingId: id, text: text.trim() },
  })
  return Response.json(message)
}
