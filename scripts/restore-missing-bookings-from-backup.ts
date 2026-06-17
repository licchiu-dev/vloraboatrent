import { PrismaClient, BookingStatus, PaymentMethod, ProductCategory, TimeSlot } from '@prisma/client'

const prisma = new PrismaClient()

type CsvRow = Record<string, string>

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
    .map((cells) =>
      Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']))
    ) as CsvRow[]
}

function parseNumber(value: string) {
  if (!value.trim()) return null
  const parsed = Number(value.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
}

function parseItems(value: string) {
  return value
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const match = entry.match(/^(.*)\sx(\d+)$/)
      return {
        name: (match?.[1] ?? entry).trim(),
        quantity: match ? Number(match[2]) : 1,
      }
    })
}

async function main() {
  const backupId = process.argv[2]
  const mode = process.argv[3] ?? 'dry-run'
  const onlyIds = new Set(process.argv.slice(4))
  if (!backupId) throw new Error('Usage: tsx scripts/restore-missing-bookings-from-backup.ts <backupId> [restore]')

  const backup = await prisma.backupLog.findUnique({ where: { id: backupId } })
  if (!backup?.snapshot) throw new Error('Backup snapshot not found')

  const snapshot = backup.snapshot as { files?: { filename: string; content: string }[] }
  const bookingsFile = snapshot.files?.find((file) => file.filename.startsWith('prenotazioni-'))
  const productsFile = snapshot.files?.find((file) => file.filename.startsWith('prodotti-prezzi-'))
  if (!bookingsFile) throw new Error('Bookings CSV not found in snapshot')

  const rows = parseCsv(bookingsFile.content)
  const productRows = productsFile ? parseCsv(productsFile.content) : []
  const backupProductByName = new Map(productRows.map((row) => [row.Nome, row]))
  const existingIds = new Set((await prisma.booking.findMany({ select: { id: true } })).map((booking) => booking.id))
  const missing = rows.filter((row) => row.ID && !existingIds.has(row.ID) && (onlyIds.size === 0 || onlyIds.has(row.ID)))

  const products = await prisma.product.findMany()
  const productByName = new Map(products.map((product) => [product.name, product]))
  const partners = await prisma.partner.findMany()
  const partnerByName = new Map(partners.map((partner) => [partner.companyName.trim(), partner]))

  const unresolvedProducts = new Set<string>()
  const restorableProducts = new Set<string>()
  const unresolvedPartners = new Set<string>()
  for (const row of missing) {
    for (const item of parseItems(row['Prodotti (lista)'])) {
      if (!productByName.has(item.name)) {
        if (backupProductByName.has(item.name)) restorableProducts.add(item.name)
        else unresolvedProducts.add(item.name)
      }
    }
    const partnerName = row['Nome Partner']?.trim()
    if (partnerName && !partnerByName.has(partnerName)) unresolvedPartners.add(partnerName)
  }

  console.log(`Backup ${backupId} (${backup.date.toISOString()})`)
  console.log(`Rows in backup: ${rows.length}`)
  console.log(`ID filter: ${onlyIds.size ? [...onlyIds].join(', ') : '-'}`)
  console.log(`Missing booking IDs: ${missing.length}`)
  console.log(`Products to recreate inactive: ${restorableProducts.size ? [...restorableProducts].join(', ') : '-'}`)
  console.log(`Unresolved products: ${unresolvedProducts.size ? [...unresolvedProducts].join(', ') : '-'}`)
  console.log(`Unresolved partners: ${unresolvedPartners.size ? [...unresolvedPartners].join(', ') : '-'}`)
  console.log('Missing rows:')
  for (const row of missing) {
    console.log(`- ${row.ID} | ${row['Data Prenotazione']} | ${row.Stato} | ${row['Nome Cliente']} | ${row['Nome Partner']?.trim() || '-'} | ${row['Prodotti (lista)']}`)
  }
  if (unresolvedProducts.size) {
    console.log('Available products:')
    for (const product of products) {
      console.log(`- ${product.category}: ${product.name} (${product.basePrice})`)
    }
  }

  if (mode !== 'restore') return
  if (unresolvedProducts.size) throw new Error('Cannot restore with unresolved products')

  for (const name of restorableProducts) {
    const row = backupProductByName.get(name)!
    const existingProductId = row['ID Prodotto']
      ? await prisma.product.findUnique({ where: { id: row['ID Prodotto'] } })
      : null
    const product = await prisma.product.create({
      data: {
        id: existingProductId ? undefined : row['ID Prodotto'] || undefined,
        name,
        category: row.Categoria as ProductCategory,
        basePrice: parseNumber(row['Prezzo Pubblico']) ?? 0,
        active: false,
      },
    })
    productByName.set(product.name, product)
  }

  for (const row of missing) {
    const customer = await prisma.customer.create({
      data: {
        name: row['Nome Cliente'],
        email: row['Email Cliente'],
        phone: row.Telefono,
        createdAt: new Date(row['Data Creazione']),
      },
    })

    const partnerName = row['Nome Partner']?.trim()
    const partner = partnerName ? partnerByName.get(partnerName) : null
    const parsedItems = parseItems(row['Prodotti (lista)'])

    await prisma.booking.create({
      data: {
        id: row.ID,
        customerId: customer.id,
        date: new Date(row['Data Prenotazione']),
        timeSlot: row['Fascia Oraria'] as TimeSlot,
        status: row.Stato as BookingStatus,
        paymentMethod: PaymentMethod.MOLO,
        partnerId: partner?.id,
        discountCode: row['Codice Sconto'] || null,
        totalPublic: parseNumber(row['Prezzo Pubblico']),
        totalPartner: parseNumber(row['Prezzo Partner']),
        commission: parseNumber(row.Commissione),
        notes: row.Note || null,
        createdBy: row['Creato Da'] || 'ADMIN',
        createdAt: new Date(row['Data Creazione']),
        updatedAt: new Date(row['Data Creazione']),
        items: {
          create: parsedItems.map((item) => {
            const product = productByName.get(item.name)!
            return {
              productId: product.id,
              quantity: item.quantity,
              unitPrice: product.basePrice,
              total: product.basePrice * item.quantity,
            }
          }),
        },
      },
    })
  }

  console.log(`Restored bookings: ${missing.length}`)
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    process.exit(1)
  })
