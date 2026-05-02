import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const { code } = await request.json()
  if (!code) return Response.json({ valid: false })

  const partner = await prisma.partner.findUnique({
    where: { discountCode: String(code).trim().toUpperCase() },
    select: { id: true, companyName: true, discountCode: true },
  })

  return Response.json({
    valid: Boolean(partner),
    partnerId: partner?.id,
    partnerName: partner?.companyName,
    discountCode: partner?.discountCode,
  })
}
