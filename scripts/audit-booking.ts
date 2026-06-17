import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function parseCsv(text: string) {
  const clean = text.replace(/^\uFEFF/, '')
  const rows: string[][] = []
  let row: string[] = []
  let value = ''
  let quoted = false

  for (let i = 0; i < clean.length; i += 1) {
    const char = clean[i]
    const next = clean[i + 1]
    if (quoted) {
      if (char === '"' && next === '"') {
        value += '"'
        i += 1
      } else if (char === '"') {
        quoted = false
      } else {
        value += char
      }
    } else if (char === '"') {
      quoted = true
    } else if (char === ',') {
      row.push(value)
      value = ''
    } else if (char === '\n') {
      row.push(value)
      rows.push(row)
      row = []
      value = ''
    } else if (char !== '\r') {
      value += char
    }
  }

  if (value || row.length) {
    row.push(value)
    rows.push(row)
  }

  const [headers, ...data] = rows
  return data
    .filter((cells) => cells.some(Boolean))
    .map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ''])))
}

async function main() {
  const current = await prisma.booking.findMany({
    where: {
      OR: [
        { date: { gte: new Date('2026-06-14T00:00:00.000Z'), lt: new Date('2026-06-15T00:00:00.000Z') } },
        { partner: { companyName: { contains: 'Boat Trip', mode: 'insensitive' } } },
        { discountCode: { contains: 'boat', mode: 'insensitive' } },
        { customer: { name: { contains: 'Boat Trip', mode: 'insensitive' } } },
      ],
    },
    include: { customer: true, partner: true, items: { include: { product: true } } },
    orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
  })

  console.log('CURRENT MATCHES')
  for (const booking of current) {
    console.log(JSON.stringify({
      id: booking.id,
      date: booking.date.toISOString(),
      status: booking.status,
      customer: booking.customer.name,
      email: booking.customer.email,
      partner: booking.partner?.companyName ?? null,
      discountCode: booking.discountCode,
      createdAt: booking.createdAt.toISOString(),
      items: booking.items.map((item) => `${item.product.name} x${item.quantity}`),
    }))
  }

  const backups = await prisma.backupLog.findMany({
    where: { snapshot: { not: undefined } },
    orderBy: { date: 'desc' },
    take: 20,
  })

  console.log('BACKUP MATCHES')
  for (const backup of backups) {
    const snapshot = backup.snapshot as { files?: { filename: string; content: string }[] } | null
    const file = snapshot?.files?.find((entry) => entry.filename.startsWith('prenotazioni-'))
    if (!file) continue
    const rows = parseCsv(file.content)
    const matches = rows.filter((row) =>
      row['Data Prenotazione']?.startsWith('2026-06-14') ||
      row['Nome Partner']?.toLowerCase().includes('boat trip') ||
      row['Codice Sconto']?.toLowerCase().includes('boat') ||
      row['Nome Cliente']?.toLowerCase().includes('boat trip')
    )
    for (const row of matches) {
      console.log(JSON.stringify({
        backupDate: backup.date.toISOString(),
        backupId: backup.id,
        id: row.ID,
        date: row['Data Prenotazione'],
        status: row.Stato,
        customer: row['Nome Cliente'],
        email: row['Email Cliente'],
        partner: row['Nome Partner'],
        discountCode: row['Codice Sconto'],
        items: row['Prodotti (lista)'],
      }))
    }
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
