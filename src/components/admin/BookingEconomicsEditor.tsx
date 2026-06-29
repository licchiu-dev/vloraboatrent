'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Partner = {
  id: string
  companyName: string
  discountCode: string
}

type Props = {
  bookingId: string
  totalPublic: number | null
  totalPartner: number | null
  commission: number | null
  partnerId: string | null
  partnerName: string | null
  discountCode: string | null
  fuelLiters: number | null
  fuelAmount: number | null
  fuelPaymentInstrument: string | null
}

const inputClass =
  'mt-0.5 w-full rounded-lg border border-[#D0E8F7] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-mid'

export default function BookingEconomicsEditor({
  bookingId,
  totalPublic,
  totalPartner,
  commission,
  partnerId,
  discountCode,
  fuelLiters,
  fuelAmount,
  fuelPaymentInstrument,
}: Props) {
  const router = useRouter()
  const [partners, setPartners] = useState<Partner[]>([])
  const [pub, setPub] = useState(totalPublic?.toString() ?? '')
  const [priv, setPriv] = useState(totalPartner?.toString() ?? '')
  const [comm, setComm] = useState(commission?.toString() ?? '')
  const [selPartnerId, setSelPartnerId] = useState(partnerId ?? '')
  const [code, setCode] = useState(discountCode ?? '')
  const [fuelL, setFuelL] = useState(fuelLiters?.toString() ?? '')
  const [fuelAmt, setFuelAmt] = useState(fuelAmount?.toString() ?? '')
  const [fuelPay, setFuelPay] = useState(fuelPaymentInstrument ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    fetch('/api/partners')
      .then((r) => r.json())
      .then((data: Partner[]) => setPartners(data))
      .catch(() => {})
  }, [])

  async function save() {
    setSaving(true)
    setMessage('')
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        totalPublic: pub === '' ? null : Number(pub),
        totalPartner: priv === '' ? null : Number(priv),
        commission: comm === '' ? null : Number(comm),
        fuelLiters: fuelL === '' ? null : Number(fuelL),
        fuelAmount: fuelAmt === '' ? null : Number(fuelAmt),
        fuelPaymentInstrument: fuelPay || null,
        partnerId: selPartnerId || null,
        discountCode: code || null,
      }),
    })
    setSaving(false)
    if (!res.ok) {
      setIsError(true)
      setMessage('Save failed.')
      return
    }
    setIsError(false)
    setMessage('Saved.')
    router.refresh()
  }

  return (
    <div>
      <h2 className="text-xl font-black text-ocean-deep">Economics</h2>
      <div className="mt-4 grid gap-3">
        <label className="flex flex-col gap-1 text-sm font-bold text-ocean-deep">
          Public price (€)
          <input
            type="number"
            min={0}
            step="0.01"
            className={inputClass}
            value={pub}
            onChange={(e) => setPub(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold text-ocean-deep">
          Partner price (€)
          <input
            type="number"
            min={0}
            step="0.01"
            className={inputClass}
            value={priv}
            onChange={(e) => setPriv(e.target.value)}
            placeholder="—"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold text-ocean-deep">
          Commission (€)
          <input
            type="number"
            min={0}
            step="0.01"
            className={inputClass}
            value={comm}
            onChange={(e) => setComm(e.target.value)}
            placeholder="—"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold text-ocean-deep">
          Partner
          <select
            className={inputClass}
            value={selPartnerId}
            onChange={(e) => setSelPartnerId(e.target.value)}
          >
            <option value="">Direct (no partner)</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.companyName}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold text-ocean-deep">
          Discount code
          <input
            className={inputClass}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="—"
          />
        </label>
        <div className="mt-2 rounded-lg bg-ocean-light p-3">
          <p className="mb-3 font-black text-ocean-deep">Fuel payment</p>
          <div className="grid gap-3">
            <label className="flex flex-col gap-1 text-sm font-bold text-ocean-deep">
              Fuel liters
              <input
                type="number"
                min={0}
                step="0.01"
                className={inputClass}
                value={fuelL}
                onChange={(e) => setFuelL(e.target.value)}
                placeholder="—"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-bold text-ocean-deep">
              Fuel paid (€)
              <input
                type="number"
                min={0}
                step="0.01"
                className={inputClass}
                value={fuelAmt}
                onChange={(e) => setFuelAmt(e.target.value)}
                placeholder="—"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-bold text-ocean-deep">
              Fuel payment method
              <select className={inputClass} value={fuelPay} onChange={(e) => setFuelPay(e.target.value)}>
                <option value="">—</option>
                <option value="REVOLUT">Revolut</option>
                <option value="POS">POS</option>
                <option value="CONTANTI">Contanti</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-ocean-deep px-4 py-2 text-sm font-black text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save economics'}
        </button>
        {message && (
          <p className={`text-sm font-bold ${isError ? 'text-red-600' : 'text-ocean-mid'}`}>{message}</p>
        )}
      </div>
    </div>
  )
}
