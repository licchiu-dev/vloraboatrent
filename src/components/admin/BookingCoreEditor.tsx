'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  bookingId: string
  customer: { name: string; email: string; phone: string }
  date: Date
  timeSlot: string
  halfDayPeriod?: string | null
  notes: string | null
  internalNotes: string | null
  createdBy: string
  showInternalNotes?: boolean
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-bold text-ocean-deep">
      {label}
      {children}
    </label>
  )
}

const inputClass =
  'mt-0.5 w-full rounded-lg border border-[#D0E8F7] bg-white px-3 py-2 font-normal text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-ocean-mid'

export default function BookingCoreEditor({
  bookingId,
  customer,
  date,
  timeSlot,
  halfDayPeriod,
  notes,
  internalNotes,
  createdBy,
  showInternalNotes = true,
}: Props) {
  const router = useRouter()
  const [name, setName] = useState(customer.name)
  const [email, setEmail] = useState(customer.email)
  const [phone, setPhone] = useState(customer.phone)
  const [bookingDate, setBookingDate] = useState(date.toISOString().slice(0, 10))
  const [slot, setSlot] = useState(timeSlot)
  const [period, setPeriod] = useState(halfDayPeriod ?? '')
  const [customerNotes, setCustomerNotes] = useState(notes ?? '')
  const [internal, setInternal] = useState(internalNotes ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  async function save() {
    setSaving(true)
    setMessage('')

    const bookingRes = await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { name, email, phone },
        date: bookingDate,
        timeSlot: slot,
        halfDayPeriod: slot === 'MEZZA_GIORNATA' ? period || null : null,
        notes: customerNotes,
        ...(showInternalNotes ? { internalNotes: internal } : {}),
      }),
    })

    setSaving(false)
    if (!bookingRes.ok) {
      setIsError(true)
      setMessage('Save failed. Check the data and try again.')
      return
    }
    setIsError(false)
    setMessage('Saved.')
    router.refresh()
  }

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-xl font-black text-ocean-deep">Customer</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="Name">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email">
            <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Phone">
            <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-black text-ocean-deep">Booking</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Date">
            <input
              type="date"
              className={inputClass}
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </Field>
          <Field label="Time slot">
            <select className={inputClass} value={slot} onChange={(e) => setSlot(e.target.value)}>
              <option value="GIORNATA_INTERA">Full day</option>
              <option value="MEZZA_GIORNATA">Half day</option>
            </select>
          </Field>
          {slot === 'MEZZA_GIORNATA' && (
            <Field label="Half day period">
              <select className={inputClass} value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="">Not specified</option>
                <option value="MATTINA">Morning</option>
                <option value="POMERIGGIO">Afternoon</option>
              </select>
            </Field>
          )}
        </div>
        <div className={`mt-3 grid gap-3 ${showInternalNotes ? 'sm:grid-cols-2' : ''}`}>
          <Field label="Customer notes">
            <textarea
              rows={3}
              className={inputClass}
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="No customer notes."
            />
          </Field>
          {showInternalNotes && (
            <Field label="Internal notes">
              <textarea
                rows={3}
                className={inputClass}
                value={internal}
                onChange={(e) => setInternal(e.target.value)}
                placeholder="No internal notes."
              />
            </Field>
          )}
        </div>
        <p className="mt-2 text-xs text-[#4A6580]">Created by {createdBy}</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-ocean-deep px-5 py-2.5 text-sm font-black text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {message && (
          <p className={`text-sm font-bold ${isError ? 'text-red-600' : 'text-ocean-mid'}`}>{message}</p>
        )}
      </div>
    </div>
  )
}
