import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, PageHeader } from '@/components/admin/Ui'
import PartnerEditor from '@/components/admin/PartnerEditor'
import { requireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'
import { calcPartnerPrice, calcCommission } from '@/lib/pricing'

export default async function PartnerDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole(['SUPERADMIN', 'ADMIN'])
  const canEdit = session.user.role === 'SUPERADMIN'
  const { id } = await params

  const [partner, products, earningsAgg, paidAgg] = await Promise.all([
    prisma.partner.findUnique({
      where: { id },
      include: {
        user: true,
        bookings: {
          include: { customer: true, items: { include: { product: true } } },
          orderBy: { date: 'desc' },
          take: 20,
        },
        payments: { orderBy: { date: 'desc' } },
      },
    }),
    prisma.product.findMany({
      where: { active: true, category: { in: ['NOLEGGIO', 'ESPERIENZA'] } },
      include: { partnerPrices: { where: { partnerId: id } } },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    }),
    // Real-time aggregation — not affected by stale stored values
    prisma.booking.aggregate({
      where: { partnerId: id, status: { in: ['CONFIRMED', 'COMPLETED'] } },
      _sum: { commission: true, totalPublic: true },
      _count: { id: true },
    }),
    prisma.commissionPayment.aggregate({
      where: { partnerId: id },
      _sum: { amount: true },
    }),
  ])
  if (!partner) notFound()

  const totalBookings = earningsAgg._count.id
  const totalRevenue = earningsAgg._sum.totalPublic ?? 0
  const totalEarnings = earningsAgg._sum.commission ?? 0
  const totalPaid = paidAgg._sum.amount ?? 0
  const pendingEarnings = Math.max(0, totalEarnings - totalPaid)

  // Keep stored values in sync without blocking the render
  void prisma.partner.update({
    where: { id },
    data: { totalEarnings, pendingEarnings },
  }).catch(() => {})

  return (
    <>
      <PageHeader
        title={partner.companyName}
        subtitle={`${partner.type} · ${partner.discountCode}`}
        action={
          <Link href="/admin/partner" className="rounded-full border border-[#D0E8F7] px-5 py-3 font-black text-[#4A6580]">
            ← Partners
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm font-bold text-[#4A6580]">Total bookings</p>
          <p className="mt-2 text-3xl font-black text-ocean-deep">{totalBookings}</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-[#4A6580]">Revenue generated</p>
          <p className="mt-2 text-3xl font-black text-ocean-deep">€{totalRevenue.toFixed(0)}</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-[#4A6580]">Total commission</p>
          <p className="mt-2 text-3xl font-black text-ocean-deep">€{totalEarnings.toFixed(0)}</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-[#4A6580]">Pending payment</p>
          <p className="mt-2 text-3xl font-black text-ocean-deep">€{pendingEarnings.toFixed(0)}</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="flex flex-col gap-6">
          <Card>
            <h2 className="mb-5 text-xl font-black text-ocean-deep">Fee calculation per product</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#D0E8F7] text-left">
                  <th className="pb-3 font-bold text-[#4A6580]">Product</th>
                  <th className="pb-3 text-right font-bold text-[#4A6580]">Public</th>
                  <th className="pb-3 text-right font-bold text-[#4A6580]">% applied</th>
                  <th className="pb-3 text-right font-bold text-[#4A6580]">Partner net</th>
                  <th className="pb-3 text-right font-bold text-ocean-deep">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D0E8F7]">
                {products.map((product) => {
                  const custom = product.partnerPrices[0]
                  const partnerNet = calcPartnerPrice(product, partner)
                  const commission = calcCommission(product, partner)
                  const pct = custom?.fixedNetPrice != null
                    ? '(fixed net)'
                    : `${custom?.commissionPct ?? partner.defaultCommission}%`
                  return (
                    <tr key={product.id}>
                      <td className="py-3 font-bold text-ocean-deep">{product.name}</td>
                      <td className="py-3 text-right text-[#4A6580]">€{product.basePrice.toFixed(2)}</td>
                      <td className="py-3 text-right text-[#4A6580]">{pct}</td>
                      <td className="py-3 text-right text-[#4A6580]">€{partnerNet.toFixed(2)}</td>
                      <td className="py-3 text-right font-black text-ocean-deep">€{commission.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-[#4A6580]">
              Commission = public price − partner net. To change per-product pricing go to{' '}
              <Link href={`/admin/prodotti?partner=${id}`} className="font-bold text-ocean-mid underline">
                Product catalog
              </Link>.
            </p>
          </Card>

          <Card>
            <h2 className="mb-4 text-xl font-black text-ocean-deep">Booking history</h2>
            <div className="divide-y divide-[#D0E8F7]">
              {partner.bookings.length === 0 && (
                <p className="py-8 text-center text-[#4A6580]">No bookings yet.</p>
              )}
              {partner.bookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/admin/prenotazioni/${booking.id}`}
                  className="-mx-3 flex flex-col gap-1 rounded-lg px-3 py-3 transition hover:bg-ocean-light md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-black text-ocean-deep">{booking.customer.name}</p>
                    <p className="text-sm text-[#4A6580]">
                      {booking.date.toLocaleDateString('en-GB')} · {booking.items.map((i) => i.product.name).join(', ')}
                    </p>
                  </div>
                  <span className="shrink-0 font-black text-ocean-deep">
                    +€{booking.commission?.toFixed(2) ?? '0.00'}
                  </span>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {canEdit ? (
          <PartnerEditor partner={{
            ...partner,
            email: partner.user.email,
            pendingEarnings,
            payments: partner.payments.map((p) => ({ ...p, date: p.date.toISOString() })),
          }} />
        ) : (
          <div className="rounded-lg border border-[#D0E8F7] bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-[#8AACCC]">Read-only</p>
            <p className="mt-2 text-sm text-[#4A6580]">Only superadmins can edit partner settings.</p>
          </div>
        )}
      </div>
    </>
  )
}
