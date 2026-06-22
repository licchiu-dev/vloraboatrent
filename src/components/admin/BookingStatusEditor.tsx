'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function BookingStatusEditor({
  bookingId,
  initialStatus,
  initialPaymentMethod,
}: {
  bookingId: string
  initialStatus: string
  initialPaymentMethod: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function save() {
    setSaving(true)
    setMessage('')
    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentMethod }),
    })
    setSaving(false)
    if (!response.ok) {
      setMessage('Update failed.')
      return
    }
    setMessage('Booking updated.')
    router.refresh()
  }

  return (
    <div className="mt-6 rounded-lg bg-ocean-light p-4">
      <p className="font-black text-ocean-deep">Status & payment</p>
      <div className="mt-4 grid gap-3">
        <label className="text-sm font-bold text-ocean-deep">
          Booking status
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 w-full rounded-lg border border-[#D0E8F7] bg-white px-3 py-2">
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </label>
        <label className="text-sm font-bold text-ocean-deep">
          Payment method
          <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="mt-2 w-full rounded-lg border border-[#D0E8F7] bg-white px-3 py-2">
            <option value="REVOLUT">Revolut</option>
            <option value="POS">POS (carta)</option>
            <option value="CONTANTI">Contanti</option>
            <option value="ONLINE">Online</option>
            <option value="PARTNER">Partner</option>
            <option value="MOLO">Al molo</option>
          </select>
        </label>
      </div>
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-4 rounded-full bg-ocean-deep px-4 py-2 text-sm font-black text-white disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save status'}
      </button>
      {message && <p className="mt-3 text-sm font-bold text-ocean-mid">{message}</p>}
    </div>
  )
}
