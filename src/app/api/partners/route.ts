import bcrypt from 'bcryptjs'
import { PartnerType } from '@prisma/client'
import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

function makeCode(companyName: string) {
  return `SEARENT-${companyName.replace(/[^a-z0-9]/gi, '').slice(0, 8).toUpperCase()}26`
}

export async function GET() {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN'])
  if ('error' in guard) return guard.error
  const partners = await prisma.partner.findMany({ include: { user: true, bookings: true }, orderBy: { createdAt: 'desc' } })
  return Response.json(partners)
}

export async function POST(request: Request) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error
  const body = await request.json()
  const password = await bcrypt.hash(body.password ?? 'admin123', 10)
  const user = await prisma.user.create({
    data: {
      email: String(body.email).toLowerCase(),
      password,
      name: body.name ?? body.companyName,
      role: 'PARTNER',
    },
  })
  const partner = await prisma.partner.create({
    data: {
      userId: user.id,
      companyName: body.companyName,
      type: body.type in PartnerType ? body.type : 'PRIVATO',
      discountCode: body.discountCode || makeCode(body.companyName),
      defaultCommission: Number(body.defaultCommission ?? 10),
      phone: body.phone,
    },
  })
  // TODO: EMAIL — collegare nodemailer/Resend per credenziali accesso al nuovo partner.
  return Response.json(partner)
}

export async function PATCH(request: Request) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error
  const body = await request.json()
  const partner = await prisma.partner.update({
    where: { id: body.id },
    data: {
      companyName: body.companyName,
      type: body.type,
      discountCode: body.discountCode,
      defaultCommission: body.defaultCommission,
      phone: body.phone,
      pendingEarnings: body.markPaid ? 0 : undefined,
    },
  })
  return Response.json(partner)
}
