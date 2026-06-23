'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const selectClass = 'mt-1.5 w-full rounded-lg border border-[#D0E8F7] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-mid'

export default function BookingStatusEditor({
  bookingId,
  initialStatus,
  initialPaymentMethod,
  initialPaymentInstrument,
}: {
  bookingId: string
  initialStatus: string
  initialPaymentMethod: string
  initialPaymentInstrument: string | null
}) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod)
  const [paymentInstrument, setPaymentInstrument] = useState(initialPaymentInstrument ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function save() {
    setSaving(true)
    setMessage('')
    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        paymentMethod,
        paymentInstrument: paymentInstrument || null,
      }),
    })
    setSaving(false)
    if (!response.ok) { setMessage('Update failed.'); return }
    setMessage('Salvato.')
    router.refresh()
  }

  return (
    <div className="mt-6 rounded-lg bg-ocean-light p-4">
      <p className="font-black text-ocean-deep">Status & pagamento</p>
      <div className="mt-4 grid gap-3">
        <label className="text-sm font-bold text-ocean-deep">
          Status prenotazione
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </label>

        <label className="text-sm font-bold text-ocean-deep">
          Quando paga
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={selectClass}>
            <option value="MOLO">Al molo</option>
            <option value="ONLINE">Online</option>
            <option value="PARTNER">Partner</option>
          </select>
        </label>

        <label className="text-sm font-bold text-ocean-deep">
          Come paga
          <select value={paymentInstrument} onChange={(e) => setPaymentInstrument(e.target.value)} className={selectClass}>
            <option value="">— non specificato —</option>
            <option value="REVOLUT">Revolut</option>
            <option value="POS">POS (carta)</option>
            <option value="CONTANTI">Contanti</option>
          </select>
        </label>
      </div>
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-4 rounded-full bg-ocean-deep px-4 py-2 text-sm font-black text-white disabled:opacity-60"
      >
        {saving ? 'Salvataggio…' : 'Salva status'}
      </button>
      {message && <p className="mt-3 text-sm font-bold text-ocean-mid">{message}</p>}
    </div>
  )
}
