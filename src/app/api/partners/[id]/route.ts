import bcrypt from 'bcryptjs'
import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error
  const { id } = await params
  const body = await request.json()

  const partner = await prisma.partner.update({
    where: { id },
    data: {
      companyName: body.companyName,
      type: body.type,
      discountCode: body.discountCode,
      defaultCommission: Number(body.defaultCommission),
      phone: body.phone ?? null,
    },
    include: { user: true },
  })

  const userPatch: Record<string, unknown> = {}
  if (body.email) userPatch.email = body.email
  if (body.name) userPatch.name = body.name
  if (body.newPassword) {
    if (body.newPassword.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }
    userPatch.password = await bcrypt.hash(body.newPassword, 10)
  }
  if (Object.keys(userPatch).length > 0) {
    await prisma.user.update({ where: { id: partner.userId }, data: userPatch })
  }

  return Response.json(partner)
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error
  const { id } = await params

  const partner = await prisma.partner.findUnique({ where: { id } })
  if (!partner) return Response.json({ error: 'Not found' }, { status: 404 })

  await prisma.partner.delete({ where: { id } })
  await prisma.user.delete({ where: { id: partner.userId } })

  return Response.json({ ok: true })
}
