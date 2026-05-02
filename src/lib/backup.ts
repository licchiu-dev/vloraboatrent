import JSZip from 'jszip'
import { prisma } from './prisma'

const bom = '\uFEFF'

function csvEscape(value: unknown) {
  const text = value == null ? '' : String(value)
  return `"${text.replaceAll('"', '""')}"`
}

function toCsv(headers: string[], rows: unknown[][]) {
  return bom + [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n')
}

function stamp(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

export async function generateAllCSVs(date = new Date()) {
  const today = stamp(date)

  const [bookings, customers, partners, products, suppliers] = await Promise.all([
    prisma.booking.findMany({
      include: { customer: true, partner: { include: { user: true } }, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.customer.findMany({ include: { bookings: true }, orderBy: { createdAt: 'desc' } }),
    prisma.partner.findMany({ include: { user: true, bookings: true }, orderBy: { createdAt: 'desc' } }),
    prisma.product.findMany({ include: { partnerPrices: { include: { partner: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.supplier.findMany({ include: { expenses: true }, orderBy: { createdAt: 'desc' } }),
  ])

  const files = [
    {
      filename: `prenotazioni-${today}.csv`,
      content: toCsv(
        [
          'ID',
          'Data Creazione',
          'Data Prenotazione',
          'Fascia Oraria',
          'Prodotti (lista)',
          'Adulti',
          'Bambini',
          'Stato',
          'Nome Cliente',
          'Email Cliente',
          'Telefono',
          'Prezzo Pubblico',
          'Prezzo Partner',
          'Commissione',
          'Codice Sconto',
          'Nome Partner',
          'Creato Da',
          'Note',
        ],
        bookings.map((booking) => [
          booking.id,
          booking.createdAt.toISOString(),
          booking.date.toISOString(),
          booking.timeSlot,
          booking.items.map((item) => `${item.product.name} x${item.quantity}`).join('; '),
          '',
          '',
          booking.status,
          booking.customer.name,
          booking.customer.email,
          booking.customer.phone,
          booking.totalPublic,
          booking.totalPartner,
          booking.commission,
          booking.discountCode,
          booking.partner?.companyName,
          booking.createdBy,
          booking.notes,
        ])
      ),
    },
    {
      filename: `clienti-${today}.csv`,
      content: toCsv(
        ['ID', 'Nome', 'Email', 'Telefono', 'Data Registrazione', 'N. Prenotazioni', 'Totale Speso'],
        customers.map((customer) => [
          customer.id,
          customer.name,
          customer.email,
          customer.phone,
          customer.createdAt.toISOString(),
          customer.bookings.length,
          customer.bookings.reduce((sum, booking) => sum + (booking.totalPublic ?? 0), 0),
        ])
      ),
    },
    {
      filename: `partner-${today}.csv`,
      content: toCsv(
        [
          'ID',
          'Nome/Azienda',
          'Tipo',
          'Email',
          'Telefono',
          'Codice Sconto',
          'Comm. Default %',
          'Prenotazioni Totali',
          'Guadagni Totali',
          'Guadagni Da Pagare',
          'Data Registrazione',
        ],
        partners.map((partner) => [
          partner.id,
          partner.companyName,
          partner.type,
          partner.user.email,
          partner.phone,
          partner.discountCode,
          partner.defaultCommission,
          partner.bookings.length,
          partner.totalEarnings,
          partner.pendingEarnings,
          partner.createdAt.toISOString(),
        ])
      ),
    },
    {
      filename: `prodotti-prezzi-${today}.csv`,
      content: toCsv(
        ['ID Prodotto', 'Nome', 'Categoria', 'Prezzo Pubblico', 'Nome Partner', 'Comm. % Custom', 'Prezzo Netto Custom'],
        products.flatMap((product) =>
          product.partnerPrices.length
            ? product.partnerPrices.map((price) => [
                product.id,
                product.name,
                product.category,
                product.basePrice,
                price.partner.companyName,
                price.commissionPct,
                price.fixedNetPrice,
              ])
            : [[product.id, product.name, product.category, product.basePrice, '', '', '']]
        )
      ),
    },
    {
      filename: `fornitori-spese-${today}.csv`,
      content: toCsv(
        ['ID Fornitore', 'Nome', 'Tipo', 'Contatto', 'ID Spesa', 'Data Spesa', 'Importo', 'Descrizione'],
        suppliers.flatMap((supplier) =>
          supplier.expenses.length
            ? supplier.expenses.map((expense) => [
                supplier.id,
                supplier.name,
                supplier.type,
                supplier.contact,
                expense.id,
                expense.date.toISOString(),
                expense.amount,
                expense.description,
              ])
            : [[supplier.id, supplier.name, supplier.type, supplier.contact, '', '', '', '']]
        )
      ),
    },
  ]

  return files
}

export async function generateBackupZip() {
  const zip = new JSZip()
  const files = await generateAllCSVs()
  files.forEach((file) => zip.file(file.filename, file.content))
  return { files, buffer: await zip.generateAsync({ type: 'nodebuffer' }) }
}

export function csvResponse(filename: string, content: string) {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
