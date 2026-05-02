import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, PageHeader } from '@/components/admin/Ui'
import { prisma } from '@/lib/prisma'

export default async function PartnerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const partner = await prisma.partner.findUnique({ where: { id }, include: { user: true, bookings: { include: { customer: true, items: { include: { product: true } } } } } })
  if (!partner) notFound()
  return (
    <>
      <PageHeader title={partner.companyName} subtitle={`${partner.type} · ${partner.discountCode}`} action={<Link href={`/admin/prodotti?partner=${partner.id}`} className="rounded-full bg-sand px-5 py-3 font-black text-ocean-deep">Manage prices</Link>} />
      <div className="grid gap-6 md:grid-cols-3">
        <Card><p className="text-sm font-bold text-[#4A6580]">Total earnings</p><p className="mt-2 text-3xl font-black text-ocean-deep">€{partner.totalEarnings.toFixed(2)}</p></Card>
        <Card><p className="text-sm font-bold text-[#4A6580]">Pending</p><p className="mt-2 text-3xl font-black text-ocean-deep">€{partner.pendingEarnings.toFixed(2)}</p></Card>
        <Card><p className="text-sm font-bold text-[#4A6580]">Bookings</p><p className="mt-2 text-3xl font-black text-ocean-deep">{partner.bookings.length}</p></Card>
      </div>
      <Card className="mt-6">
        <h2 className="mb-4 text-xl font-black text-ocean-deep">Generated bookings</h2>
        <div className="divide-y divide-[#D0E8F7]">
          {partner.bookings.map((booking) => <div key={booking.id} className="flex justify-between py-4"><span>{booking.customer.name} · {booking.date.toLocaleDateString('en-GB')}</span><span className="font-black">€{booking.commission?.toFixed(2)}</span></div>)}
        </div>
      </Card>
    </>
  )
}
