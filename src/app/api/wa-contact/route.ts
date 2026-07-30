import { prisma } from '@/lib/prisma'

export async function POST() {
  await prisma.whatsappClickEvent.create({ data: {} })
  return new Response(null, { status: 204 })
}
