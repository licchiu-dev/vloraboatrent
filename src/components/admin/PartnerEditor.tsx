'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card } from '@/components/admin/Ui'

type PartnerData = {
  id: string
  companyName: string
  email: string
  type: string
  discountCode: string
  defaultCommission: number
  phone: string | null
  pendingEarnings: number
}

const inputClass =
  'mt-0.5 w-full rounded-lg border border-[#D0E8F7] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-mid'

export default function PartnerEditor({ partner }: { partner: PartnerData }) {
  const router = useRouter()
  const [companyName, setCompanyName] = useState(partner.companyName)
  const [email, setEmail] = useState(partner.email)
  const [type, setType] = useState(partner.type)
  const [code, setCode] = useState(partner.discountCode)
  const [commission, setCommission] = useState(partner.defaultCommission.toString())
  const [phone, setPhone] = useState(partner.phone ?? '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  async function save() {
    setSaving(true)
    setMessage('')
    const res = await fetch(`/api/partners/${partner.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName, email, type, discountCode: code, defaultCommission: commission, phone }),
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

  async function markPaid() {
    setSaving(true)
    const res = await fetch(`/api/partners/${partner.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markPaid: true }),
    })
    setSaving(false)
    if (res.ok) {
      setMessage('Marked as paid.')
      router.refresh()
    }
  }

  async function deletePartner() {
    setDeleting(true)
    const res = await fetch(`/api/partners/${partner.id}`, { method: 'DELETE' })
    setDeleting(false)
    if (!res.ok) {
      setIsError(true)
      setMessage('Delete failed.')
      return
    }
    router.push('/admin/partner')
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="mb-4 text-xl font-black text-ocean-deep">Edit partner</h2>
        <div className="grid gap-3">
          <label className="flex flex-col text-sm font-bold text-ocean-deep">
            Company name
            <input className={inputClass} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-bold text-ocean-deep">
            Email
            <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-bold text-ocean-deep">
            Phone
            <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-bold text-ocean-deep">
            Type
            <select className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="AGENZIA_TURISTICA">Travel agency</option>
              <option value="AGENZIA_VIAGGI">Tour operator</option>
              <option value="GUIDA">Local guide</option>
              <option value="PRIVATO">Private</option>
            </select>
          </label>
          <label className="flex flex-col text-sm font-bold text-ocean-deep">
            Discount code
            <input className={inputClass} value={code} onChange={(e) => setCode(e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-bold text-ocean-deep">
            Default commission %
            <input type="number" min={0} max={100} step="0.1" className={inputClass} value={commission} onChange={(e) => setCommission(e.target.value)} />
            <span className="mt-1 text-xs font-normal text-[#4A6580]">Partner net = public × (1 − {commission}%)</span>
          </label>
        </div>
        <div className="mt-4 flex items-center gap-3">
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
      </Card>

      {partner.pendingEarnings > 0 && (
        <Card>
          <h2 className="text-xl font-black text-ocean-deep">Commission payment</h2>
          <p className="mt-2 text-sm text-[#4A6580]">
            Pending: <span className="font-black text-ocean-deep">€{partner.pendingEarnings.toFixed(2)}</span>
          </p>
          <button
            type="button"
            onClick={markPaid}
            disabled={saving}
            className="mt-4 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-black text-white disabled:opacity-60"
          >
            Mark as paid
          </button>
        </Card>
      )}

      <Card>
        <h2 className="text-xl font-black text-red-700">Danger zone</h2>
        <p className="mt-2 text-sm text-[#4A6580]">
          Deletes the partner account and the associated login user. Existing bookings are preserved but unlinked.
        </p>
        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="mt-4 rounded-full border border-red-300 px-5 py-2.5 text-sm font-black text-red-700"
          >
            Delete partner
          </button>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <p className="text-sm font-bold text-red-700">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={deletePartner}
                disabled={deleting}
                className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-black text-white disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-full border border-[#D0E8F7] px-5 py-2.5 text-sm font-black text-[#4A6580]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
