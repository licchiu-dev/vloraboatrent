import Link from 'next/link'
import { Card, PageHeader } from '@/components/admin/Ui'
import { requireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export default async function PartnerDashboard() {
  const session = await requireRole(['PARTNER'])
  const partner = await prisma.partner.findUnique({
    where: { id: session.user.partnerId },
    include: { bookings: { include: { customer: true, items: { include: { product: true } } }, orderBy: { date: 'desc' }, take: 5 } },
  })

  return (
    <>
      <PageHeader title="Partner dashboard" subtitle="Your code, earnings and latest generated bookings." action={<Link href="/partner/prenotazioni/nuova" className="rounded-full bg-sand px-5 py-3 font-black text-ocean-deep">New booking</Link>} />
      <Card className="mb-6">
        <p className="text-sm font-bold uppercase tracking-widest text-[#4A6580]">Your discount code</p>
        <div className="mt-3 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <p className="text-4xl font-black tracking-tight text-ocean-deep">{partner?.discountCode}</p>
          <button className="rounded-full bg-ocean-deep px-5 py-3 font-black text-white">Copy</button>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm font-bold text-[#4A6580]">Bookings this month</p><p className="mt-2 text-3xl font-black text-ocean-deep">{partner?.bookings.length ?? 0}</p></Card>
        <Card><p className="text-sm font-bold text-[#4A6580]">Total earnings</p><p className="mt-2 text-3xl font-black text-ocean-deep">€{partner?.totalEarnings.toFixed(2)}</p></Card>
        <Card><p className="text-sm font-bold text-[#4A6580]">Pending</p><p className="mt-2 text-3xl font-black text-ocean-deep">€{partner?.pendingEarnings.toFixed(2)}</p></Card>
      </div>
      <Card className="mt-6">
        <h2 className="mb-4 text-xl font-black text-ocean-deep">Latest bookings</h2>
        <div className="divide-y divide-[#D0E8F7]">
          {partner?.bookings.map((booking) => <div key={booking.id} className="flex justify-between py-4"><span>{booking.customer.name} · {booking.date.toLocaleDateString('en-GB')}</span><span className="font-black">€{booking.commission?.toFixed(2)}</span></div>)}
        </div>
      </Card>
    </>
  )
}
