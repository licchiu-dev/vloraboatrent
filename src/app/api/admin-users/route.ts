import bcrypt from 'bcryptjs'
import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error

  const users = await prisma.user.findMany({
    where: { role: { in: ['SUPERADMIN', 'ADMIN'] } },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
  return Response.json(users)
}

export async function POST(request: Request) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error

  const body = await request.json()
  if (!body.name || !body.email || !body.password) {
    return Response.json({ error: 'Name, email and password are required.' }, { status: 400 })
  }
  if (body.password.length < 8) {
    return Response.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } })
  if (existing) return Response.json({ error: 'Email already in use.' }, { status: 409 })

  const hashed = await bcrypt.hash(body.password, 10)
  const user = await prisma.user.create({
    data: { name: body.name, email: body.email.toLowerCase(), password: hashed, role: 'ADMIN' },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  })
  return Response.json(user)
}
