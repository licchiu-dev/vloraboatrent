import Link from 'next/link'
import { Badge, Card, PageHeader } from '@/components/admin/Ui'
import { requireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

const METHOD_LABELS: Record<string, string> = {
  CASH: 'Cash',
  BANK_TRANSFER: 'Bank transfer',
  CARD: 'Card',
  PAYPAL: 'PayPal',
  OTHER: 'Other',
}

export default async function PartnerDashboard() {
  const session = await requireRole(['PARTNER'])
  const partner = await prisma.partner.findUnique({
    where: { id: session.user.partnerId },
    include: {
      bookings: {
        include: { customer: true, items: { include: { product: true } } },
        orderBy: { date: 'desc' },
        take: 5,
      },
      payments: { orderBy: { date: 'desc' }, take: 20 },
    },
  })

  return (
    <>
      <PageHeader
        title="Partner dashboard"
        subtitle="Your code, earnings and latest generated bookings."
        action={
          <Link href="/partner/prenotazioni/nuova" className="rounded-full bg-sand px-5 py-3 font-black text-ocean-deep">
            New booking
          </Link>
        }
      />

      <Card className="mb-6">
        <p className="text-sm font-bold uppercase tracking-widest text-[#4A6580]">Your discount code</p>
        <div className="mt-3 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <p className="text-4xl font-black tracking-tight text-ocean-deep">{partner?.discountCode}</p>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm font-bold text-[#4A6580]">Total bookings</p>
          <p className="mt-2 text-3xl font-black text-ocean-deep">{partner?.bookings.length ?? 0}</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-[#4A6580]">Total earnings</p>
          <p className="mt-2 text-3xl font-black text-ocean-deep">€{partner?.totalEarnings.toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-[#4A6580]">Pending payment</p>
          <p className="mt-2 text-3xl font-black text-ocean-deep">€{partner?.pendingEarnings.toFixed(2)}</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-black text-ocean-deep">Latest bookings</h2>
          <div className="divide-y divide-[#D0E8F7]">
            {partner?.bookings.length === 0 && (
              <p className="py-6 text-center text-[#4A6580]">No bookings yet.</p>
            )}
            {partner?.bookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/partner/prenotazioni/${booking.id}`}
                className="-mx-1 flex justify-between rounded px-1 py-4 hover:bg-ocean-light/30"
              >
                <span className="text-sm">
                  {booking.customer.name} · {booking.date.toLocaleDateString('en-GB')}
                </span>
                <span className="font-black text-ocean-deep">€{booking.commission?.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-black text-ocean-deep">Payment history</h2>
          {partner?.payments.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#4A6580]">No payments received yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#D0E8F7] text-xs text-[#4A6580]">
                  <th className="pb-2">Date</th>
                  <th className="pb-2 text-right">Amount</th>
                  <th className="pb-2">Method</th>
                  <th className="pb-2">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D0E8F7]">
                {partner?.payments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 pr-3 whitespace-nowrap">{p.date.toLocaleDateString('en-GB')}</td>
                    <td className="py-2 pr-3 text-right font-black text-ocean-deep">€{p.amount.toFixed(2)}</td>
                    <td className="py-2 pr-3">
                      <Badge tone="green">{METHOD_LABELS[p.method] ?? p.method}</Badge>
                    </td>
                    <td className="py-2 text-[#4A6580]">{p.notes ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </>
  )
}
