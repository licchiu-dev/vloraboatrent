'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Badge, Card } from '@/components/admin/Ui'

type Payment = {
  id: string
  amount: number
  date: string
  method: string
  notes: string | null
}

type PartnerData = {
  id: string
  companyName: string
  email: string
  type: string
  discountCode: string
  defaultCommission: number
  phone: string | null
  pendingEarnings: number
  payments: Payment[]
}

const inputClass =
  'mt-0.5 w-full rounded-lg border border-[#D0E8F7] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-mid'

const METHOD_LABELS: Record<string, string> = {
  CASH: 'Cash',
  BANK_TRANSFER: 'Bank transfer',
  CARD: 'Card',
  PAYPAL: 'PayPal',
  OTHER: 'Other',
}

export default function PartnerEditor({ partner }: { partner: PartnerData }) {
  const router = useRouter()

  // --- edit form ---
  const [companyName, setCompanyName] = useState(partner.companyName)
  const [email, setEmail] = useState(partner.email)
  const [type, setType] = useState(partner.type)
  const [code, setCode] = useState(partner.discountCode)
  const [commission, setCommission] = useState(partner.defaultCommission.toString())
  const [phone, setPhone] = useState(partner.phone ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  // --- password change ---
  const [newPassword, setNewPassword] = useState('')
  const [savingPwd, setSavingPwd] = useState(false)
  const [pwdMessage, setPwdMessage] = useState('')
  const [pwdError, setPwdError] = useState(false)

  // --- payment form ---
  const [payAmount, setPayAmount] = useState(partner.pendingEarnings.toFixed(2))
  const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10))
  const [payMethod, setPayMethod] = useState('CASH')
  const [payNotes, setPayNotes] = useState('')
  const [savingPay, setSavingPay] = useState(false)
  const [payMessage, setPayMessage] = useState('')
  const [payError, setPayError] = useState(false)
  const [payments, setPayments] = useState<Payment[]>(partner.payments)
  const [pendingEarnings, setPendingEarnings] = useState(partner.pendingEarnings)

  // --- payment edit / delete ---
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editMethod, setEditMethod] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(null)

  // --- delete ---
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function save() {
    setSaving(true)
    setMessage('')
    const res = await fetch(`/api/partners/${partner.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName, email, type, discountCode: code, defaultCommission: commission, phone }),
    })
    setSaving(false)
    if (!res.ok) { setIsError(true); setMessage('Save failed.'); return }
    setIsError(false)
    setMessage('Saved.')
    router.refresh()
  }

  async function savePassword() {
    if (!newPassword) return
    setSavingPwd(true)
    setPwdMessage('')
    const res = await fetch(`/api/partners/${partner.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }),
    })
    setSavingPwd(false)
    const body = await res.json().catch(() => ({}))
    if (!res.ok) { setPwdError(true); setPwdMessage(body.error ?? 'Failed.'); return }
    setPwdError(false)
    setPwdMessage('Password updated.')
    setNewPassword('')
  }

  async function recordPayment() {
    setSavingPay(true)
    setPayMessage('')
    const res = await fetch(`/api/partners/${partner.id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: payAmount, date: payDate, method: payMethod, notes: payNotes }),
    })
    setSavingPay(false)
    if (!res.ok) {
      const b = await res.json().catch(() => ({}))
      setPayError(true)
      setPayMessage(b.error ?? 'Payment failed.')
      return
    }
    const payment = await res.json()
    setPayError(false)
    setPayMessage('Payment recorded.')
    setPayments((prev) => [{ ...payment, date: payment.date }, ...prev])
    const newPending = Math.max(0, pendingEarnings - Number(payAmount))
    setPendingEarnings(newPending)
    setPayAmount(newPending.toFixed(2))
    setPayNotes('')
    router.refresh()
  }

  function startEditPayment(p: Payment) {
    setEditingPaymentId(p.id)
    setEditAmount(p.amount.toFixed(2))
    setEditDate(new Date(p.date).toISOString().slice(0, 10))
    setEditMethod(p.method)
    setEditNotes(p.notes ?? '')
  }

  async function saveEditPayment(paymentId: string) {
    setSavingEdit(true)
    const res = await fetch(`/api/partners/${partner.id}/payments/${paymentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: editAmount, date: editDate, method: editMethod, notes: editNotes }),
    })
    setSavingEdit(false)
    if (!res.ok) return
    const updated = await res.json()
    setPayments((prev) => prev.map((p) => p.id === paymentId ? { ...updated, date: updated.date } : p))
    setEditingPaymentId(null)
    router.refresh()
  }

  async function deletePayment(paymentId: string) {
    if (!confirm('Delete this payment? This cannot be undone.')) return
    setDeletingPaymentId(paymentId)
    const res = await fetch(`/api/partners/${partner.id}/payments/${paymentId}`, { method: 'DELETE' })
    setDeletingPaymentId(null)
    if (res.ok) {
      const removed = payments.find((p) => p.id === paymentId)
      setPayments((prev) => prev.filter((p) => p.id !== paymentId))
      if (removed) setPendingEarnings((prev) => prev + removed.amount)
      router.refresh()
    }
  }

  async function deletePartner() {
    setDeleting(true)
    const res = await fetch(`/api/partners/${partner.id}`, { method: 'DELETE' })
    setDeleting(false)
    if (!res.ok) { setIsError(true); setMessage('Delete failed.'); return }
    router.push('/admin/partner')
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Edit info */}
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
          <button type="button" onClick={save} disabled={saving}
            className="rounded-full bg-ocean-deep px-5 py-2.5 text-sm font-black text-white disabled:opacity-60">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {message && <p className={`text-sm font-bold ${isError ? 'text-red-600' : 'text-ocean-mid'}`}>{message}</p>}
        </div>
      </Card>

      {/* Password change */}
      <Card>
        <h2 className="mb-3 text-xl font-black text-ocean-deep">Change password</h2>
        <label className="flex flex-col text-sm font-bold text-ocean-deep">
          New password
          <input
            type="password"
            placeholder="Min 8 characters"
            className={inputClass}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <div className="mt-3 flex items-center gap-3">
          <button type="button" onClick={savePassword} disabled={savingPwd || !newPassword}
            className="rounded-full bg-ocean-deep px-5 py-2.5 text-sm font-black text-white disabled:opacity-60">
            {savingPwd ? 'Updating…' : 'Update password'}
          </button>
          {pwdMessage && <p className={`text-sm font-bold ${pwdError ? 'text-red-600' : 'text-ocean-mid'}`}>{pwdMessage}</p>}
        </div>
      </Card>

      {/* Commission payments */}
      <Card>
        <h2 className="text-xl font-black text-ocean-deep">Commission payments</h2>
        <p className="mt-1 text-sm text-[#4A6580]">
          Pending: <span className="font-black text-ocean-deep">€{pendingEarnings.toFixed(2)}</span>
        </p>

        {pendingEarnings > 0 && (
          <div className="mt-4 grid gap-3 rounded-lg bg-ocean-light/50 p-4">
            <p className="text-sm font-black text-ocean-deep">Record a payment</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col text-sm font-bold text-ocean-deep">
                Amount (€)
                <input type="number" min={0} step="0.01" className={inputClass} value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)} />
              </label>
              <label className="flex flex-col text-sm font-bold text-ocean-deep">
                Date
                <input type="date" className={inputClass} value={payDate}
                  onChange={(e) => setPayDate(e.target.value)} />
              </label>
            </div>
            <label className="flex flex-col text-sm font-bold text-ocean-deep">
              Payment method
              <select className={inputClass} value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                <option value="CASH">Cash</option>
                <option value="BANK_TRANSFER">Bank transfer</option>
                <option value="CARD">Card</option>
                <option value="PAYPAL">PayPal</option>
                <option value="OTHER">Other</option>
              </select>
            </label>
            <label className="flex flex-col text-sm font-bold text-ocean-deep">
              Notes (optional)
              <input className={inputClass} placeholder="Reference, transaction ID…"
                value={payNotes} onChange={(e) => setPayNotes(e.target.value)} />
            </label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={recordPayment} disabled={savingPay}
                className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-black text-white disabled:opacity-60">
                {savingPay ? 'Saving…' : 'Record payment'}
              </button>
              {payMessage && <p className={`text-sm font-bold ${payError ? 'text-red-600' : 'text-emerald-600'}`}>{payMessage}</p>}
            </div>
          </div>
        )}

        {/* Payment history */}
        {payments.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-sm font-black text-ocean-deep">Payment history</p>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#D0E8F7] text-xs text-[#4A6580]">
                  <th className="pb-2">Date</th>
                  <th className="pb-2 text-right">Amount</th>
                  <th className="pb-2">Method</th>
                  <th className="pb-2">Notes</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D0E8F7]">
                {payments.map((p) => (
                  editingPaymentId === p.id ? (
                    <tr key={p.id} className="bg-ocean-light/30">
                      <td className="py-2 pr-2">
                        <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)}
                          className="rounded border border-[#D0E8F7] px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-ocean-mid" />
                      </td>
                      <td className="py-2 pr-2">
                        <input type="number" step="0.01" value={editAmount} onChange={(e) => setEditAmount(e.target.value)}
                          className="w-24 rounded border border-[#D0E8F7] px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-ocean-mid" />
                      </td>
                      <td className="py-2 pr-2">
                        <select value={editMethod} onChange={(e) => setEditMethod(e.target.value)}
                          className="rounded border border-[#D0E8F7] px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-ocean-mid">
                          <option value="CASH">Cash</option>
                          <option value="BANK_TRANSFER">Bank transfer</option>
                          <option value="CARD">Card</option>
                          <option value="PAYPAL">PayPal</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </td>
                      <td className="py-2 pr-2">
                        <input value={editNotes} onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Notes"
                          className="w-full rounded border border-[#D0E8F7] px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-ocean-mid" />
                      </td>
                      <td className="py-2">
                        <div className="flex gap-1">
                          <button type="button" onClick={() => saveEditPayment(p.id)} disabled={savingEdit}
                            className="rounded-full bg-ocean-deep px-3 py-1 text-xs font-black text-white disabled:opacity-60">
                            {savingEdit ? '…' : 'Save'}
                          </button>
                          <button type="button" onClick={() => setEditingPaymentId(null)}
                            className="rounded-full border border-[#D0E8F7] px-3 py-1 text-xs font-bold text-[#4A6580]">
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={p.id}>
                      <td className="py-2 pr-3 whitespace-nowrap">{new Date(p.date).toLocaleDateString('en-GB')}</td>
                      <td className="py-2 pr-3 text-right font-black text-ocean-deep">€{p.amount.toFixed(2)}</td>
                      <td className="py-2 pr-3">
                        <Badge tone="green">{METHOD_LABELS[p.method] ?? p.method}</Badge>
                      </td>
                      <td className="py-2 pr-3 text-[#4A6580]">{p.notes ?? '—'}</td>
                      <td className="py-2">
                        <div className="flex gap-1">
                          <button type="button" onClick={() => startEditPayment(p)}
                            className="rounded-full border border-[#D0E8F7] px-3 py-1 text-xs font-bold text-[#4A6580] hover:bg-ocean-light">
                            Edit
                          </button>
                          <button type="button" onClick={() => deletePayment(p.id)}
                            disabled={deletingPaymentId === p.id}
                            className="rounded-full border border-red-200 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-60">
                            {deletingPaymentId === p.id ? '…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        )}

        {payments.length === 0 && pendingEarnings === 0 && (
          <p className="mt-4 text-sm text-[#4A6580]">No commission pending and no payments recorded yet.</p>
        )}
      </Card>

      {/* Danger zone */}
      <Card>
        <h2 className="text-xl font-black text-red-700">Danger zone</h2>
        <p className="mt-2 text-sm text-[#4A6580]">
          Deletes the partner account and the associated login user. Existing bookings are preserved but unlinked.
        </p>
        {!confirmDelete ? (
          <button type="button" onClick={() => setConfirmDelete(true)}
            className="mt-4 rounded-full border border-red-300 px-5 py-2.5 text-sm font-black text-red-700">
            Delete partner
          </button>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <p className="text-sm font-bold text-red-700">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <button type="button" onClick={deletePartner} disabled={deleting}
                className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-black text-white disabled:opacity-60">
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)}
                className="rounded-full border border-[#D0E8F7] px-5 py-2.5 text-sm font-black text-[#4A6580]">
                Cancel
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
