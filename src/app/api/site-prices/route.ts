import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

const DEFAULTS: { key: string; label: string; price: number }[] = [
  { key: 'gommone', label: 'Gommone (Joker Boat 580)', price: 200 },
  { key: 'gommone_piccolo', label: 'Gommone piccolo (Joker Boat 500)', price: 150 },
  { key: 'barca', label: 'Barca (Mingolla Brava 18)', price: 180 },
]

export async function GET() {
  const rows = await prisma.sitePrice.findMany()
  // Merge DB rows with defaults so all 3 keys are always present
  const result = DEFAULTS.map((def) => {
    const row = rows.find((r) => r.key === def.key)
    return row ?? { ...def, updatedAt: new Date() }
  })
  return Response.json(result)
}

export async function PATCH(request: Request) {
  const guard = await apiRequireRole(['SUPERADMIN', 'ADMIN'])
  if ('error' in guard) return guard.error
  const { key, price, label } = await request.json()
  if (!key || price == null) return Response.json({ error: 'key and price required' }, { status: 400 })
  const row = await prisma.sitePrice.upsert({
    where: { key },
    update: { price: Number(price), ...(label ? { label } : {}) },
    create: {
      key,
      label: label ?? DEFAULTS.find((d) => d.key === key)?.label ?? key,
      price: Number(price),
    },
  })
  return Response.json(row)
}
