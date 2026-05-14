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

const adminEmail = process.env.ADMIN_BOOKING_EMAIL ?? 'leosergio93@gmail.com'
const brandName = 'VLORA RENT A BOAT'

function bookingSummary(input: PublicBookingNotification) {
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

async function sendResendEmail(to: string, subject: string, text: string) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) return

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

  if (!response.ok) {
    throw new Error(`Resend email failed: ${response.status}`)
  }
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
  const customerMessage = [
    `Ciao ${input.nome},`,
    `abbiamo ricevuto la tua richiesta di prenotazione con ${brandName}.`,
    'Ti contatteremo entro 24 ore per confermare la disponibilita.',
    '',
    `Data richiesta: ${input.data}`,
    `Fascia: ${input.fascia}`,
  ].join('\n')

  await Promise.allSettled([
    sendResendEmail(adminEmail, `Nuova richiesta prenotazione - ${brandName}`, summary),
    sendResendEmail(input.email, `Richiesta ricevuta - ${brandName}`, customerMessage),
    sendWhatsappText(
      input.telefono,
      `Ciao ${input.nome}, abbiamo ricevuto la tua richiesta con ${brandName}. Ti contatteremo entro 24 ore per confermare la disponibilita.`
    ),
  ])
}
