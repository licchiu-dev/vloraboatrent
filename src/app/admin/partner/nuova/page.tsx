'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, PageHeader } from '@/components/admin/Ui'

const inputClass = 'w-full rounded-lg border border-[#D0E8F7] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-mid'

export default function NewPartnerPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    setSaving(true)
    setError('')
    const res = await fetch('/api/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: data.companyName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        type: data.type,
        discountCode: data.discountCode,
        defaultCommission: Number(data.defaultCommission),
      }),
    })
    setSaving(false)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'Creation failed.')
      return
    }
    router.push('/admin/partner')
    router.refresh()
  }

  return (
    <>
      <PageHeader title="New partner" subtitle="Creates a partner account with login access and a discount code." />
      <Card className="max-w-2xl">
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-bold text-ocean-deep">
            Company name *
            <input name="companyName" required className={inputClass} placeholder="Mario Travels" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold text-ocean-deep">
            Email *
            <input name="email" type="email" required className={inputClass} placeholder="mario@example.com" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold text-ocean-deep">
            Temporary password *
            <input name="password" type="password" required className={inputClass} placeholder="Min 8 characters" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold text-ocean-deep">
            Phone
            <input name="phone" className={inputClass} placeholder="+355 69 000 000" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold text-ocean-deep">
            Partner type *
            <select name="type" required className={inputClass}>
              <option value="AGENZIA_TURISTICA">Travel agency</option>
              <option value="AGENZIA_VIAGGI">Tour operator</option>
              <option value="GUIDA">Local guide</option>
              <option value="PRIVATO">Private</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold text-ocean-deep">
            Discount code
            <input name="discountCode" className={inputClass} placeholder="Auto-generated if empty" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold text-ocean-deep md:col-span-2">
            Default commission % *
            <input name="defaultCommission" type="number" min={0} max={100} step="0.1" required defaultValue={10} className={inputClass} />
            <span className="text-xs font-normal text-[#4A6580]">Partner net price = public price × (1 − commission%). You earn the commission on each booking.</span>
          </label>

          {error && <p className="md:col-span-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}

          <div className="flex gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-ocean-deep px-6 py-3 font-black text-white disabled:opacity-60"
            >
              {saving ? 'Creating…' : 'Create partner'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-full border border-[#D0E8F7] px-6 py-3 font-black text-[#4A6580]"
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </>
  )
}
