type PublicBookingNotification = {
  bookingId: string
  tipo: string
  nome: string
  email: string
  telefono: string
  data: string
  fascia: string
  note?: string
}

type AdminBookingNotification = {
  bookingId: string
  source: 'WEBSITE' | 'PARTNER' | 'ADMIN'
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  timeSlot: string
  status?: string
  partnerName?: string | null
  notes?: string | null
}

const adminEmail = process.env.ADMIN_BOOKING_EMAIL ?? process.env.SUPERADMIN_EMAIL ?? 'leosergio93@gmail.com'
const adminWhatsapp = process.env.ADMIN_BOOKING_WHATSAPP
const brandName = 'VLORA RENT A BOAT'

function bookingSummary(input: PublicBookingNotification | AdminBookingNotification) {
  if ('customerName' in input) {
    return [
      `Booking ID: ${input.bookingId}`,
      `Origine: ${input.source}`,
      `Cliente: ${input.customerName}`,
      `Email: ${input.customerEmail}`,
      `Telefono: ${input.customerPhone}`,
      `Data: ${input.date}`,
      `Fascia: ${input.timeSlot}`,
      `Stato: ${input.status ?? '-'}`,
      `Partner: ${input.partnerName ?? '-'}`,
      `Note: ${input.notes || '-'}`,
    ].join('\n')
  }

  return [
    `Booking ID: ${input.bookingId}`,
    `Servizio: ${input.tipo}`,
    `Cliente: ${input.nome}`,
    `Email: ${input.email}`,
    `Telefono: ${input.telefono}`,
    `Data: ${input.data}`,
    `Fascia: ${input.fascia}`,
    `Note: ${input.note || '-'}`,
  ].join('\n')
}

function logNotificationFailures(results: PromiseSettledResult<unknown>[]) {
  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error('[notifications] delivery failed', result.reason)
    }
  })
}

async function sendResendEmail(to: string, subject: string, text: string) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    console.warn('[notifications] Resend skipped: missing RESEND_API_KEY or RESEND_FROM_EMAIL')
    return
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to,
      subject,
      text,
    }),
  })
  const responseBody = await response.text()

  if (!response.ok) {
    throw new Error(`Resend email failed: ${response.status} ${responseBody}`)
  }

  console.info(`[notifications] Resend accepted email to ${to}: ${responseBody}`)
}

function normalizePhoneForWhatsapp(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  return digits.startsWith('00') ? digits.slice(2) : digits
}

async function sendWhatsappText(toPhone: string, message: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const to = normalizePhoneForWhatsapp(toPhone)
  if (!token || !phoneNumberId || !to) return

  const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { preview_url: false, body: message },
    }),
  })

  if (!response.ok) {
    throw new Error(`WhatsApp message failed: ${response.status}`)
  }
}

export async function notifyPublicBooking(input: PublicBookingNotification) {
  const summary = bookingSummary(input)

  const results = await Promise.allSettled([
    sendResendEmail(adminEmail, `Nuova richiesta prenotazione - ${brandName}`, summary),
    adminWhatsapp
      ? sendWhatsappText(adminWhatsapp, `Nuova richiesta ${brandName}\n\n${summary}`)
      : Promise.resolve(),
  ])
  logNotificationFailures(results)
}

export async function notifyAdminNewBooking(input: AdminBookingNotification) {
  const summary = bookingSummary(input)
  const results = await Promise.allSettled([
    sendResendEmail(adminEmail, `Nuova richiesta ${input.source.toLowerCase()} - ${brandName}`, summary),
    adminWhatsapp
      ? sendWhatsappText(adminWhatsapp, `Nuova richiesta ${brandName}\n\n${summary}`)
      : Promise.resolve(),
  ])
  logNotificationFailures(results)
}
