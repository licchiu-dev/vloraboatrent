import bcrypt from 'bcryptjs'
import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error

  const { id } = await params
  const body = await request.json()
  const data: Record<string, unknown> = {}

  if (body.name) data.name = body.name
  if (body.email) data.email = body.email.toLowerCase()
  if (typeof body.active === 'boolean') data.active = body.active

  if (body.newPassword) {
    if (body.newPassword.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }
    data.password = await bcrypt.hash(body.newPassword, 10)
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  })
  return Response.json(user)
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error

  const { id } = await params
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return Response.json({ error: 'Not found' }, { status: 404 })
  if (user.role === 'SUPERADMIN') return Response.json({ error: 'Cannot delete a superadmin.' }, { status: 403 })

  await prisma.user.delete({ where: { id } })
  return Response.json({ ok: true })
}
