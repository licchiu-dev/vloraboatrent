import { PageHeader, Card } from '@/components/admin/Ui'

export default function NewPartnerPage() {
  return (
    <>
      <PageHeader title="New partner" subtitle="Creates a partner account and discount code. Default password is admin123 unless changed through API." />
      <Card>
        <form action="/api/partners" method="post" className="grid gap-4 md:grid-cols-2">
          {['companyName', 'email', 'phone', 'discountCode'].map((name) => <input key={name} name={name} placeholder={name} className="rounded-lg border border-[#D0E8F7] px-3 py-2" />)}
          <select name="type" className="rounded-lg border border-[#D0E8F7] px-3 py-2">
            {['AGENZIA_VIAGGI', 'AGENZIA_TURISTICA', 'GUIDA', 'PRIVATO'].map((type) => <option key={type}>{type}</option>)}
          </select>
          <input name="defaultCommission" type="number" placeholder="Default commission %" className="rounded-lg border border-[#D0E8F7] px-3 py-2" />
          <p className="md:col-span-2 text-sm text-[#4A6580]">Use the API or a future server action to submit this form from production UI.</p>
        </form>
      </Card>
    </>
  )
}
