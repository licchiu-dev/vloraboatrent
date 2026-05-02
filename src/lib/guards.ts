import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import type { Role } from '@prisma/client'
import { authOptions } from './auth'

export async function requireRole(roles: Role[]) {
  const session = await getServerSession(authOptions).catch(() => null)
  if (!session?.user) redirect('/login')
  if (!roles.includes(session.user.role)) redirect(session.user.role === 'PARTNER' ? '/partner' : '/admin')
  return session
}

export async function apiRequireRole(roles: Role[]) {
  const session = await getServerSession(authOptions).catch(() => null)
  if (!session?.user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  if (!roles.includes(session.user.role)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { session }
}
