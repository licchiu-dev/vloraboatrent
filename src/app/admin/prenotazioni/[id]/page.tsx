import { notFound } from 'next/navigation'
import { Badge, Card, PageHeader } from '@/components/admin/Ui'
import { prisma } from '@/lib/prisma'

export default async function BookingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { customer: true, partner: true, items: { include: { product: true } } },
  })
  if (!booking) notFound()

  return (
    <>
      <PageHeader title={`Booking ${booking.id.slice(0, 8)}`} subtitle="Editable detail, economics and internal notes." />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <Card>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-black text-ocean-deep">Customer</h2>
              <p className="mt-3 font-bold">{booking.customer.name}</p>
              <p className="text-[#4A6580]">{booking.customer.email}</p>
              <p className="text-[#4A6580]">{booking.customer.phone}</p>
            </div>
            <div>
              <h2 className="text-xl font-black text-ocean-deep">Booking</h2>
              <p className="mt-3">{booking.date.toLocaleDateString('en-GB')} · {booking.timeSlot}</p>
              <p className="mt-2"><Badge>{booking.status}</Badge></p>
              <p className="mt-3 text-sm text-[#4A6580]">Created by {booking.createdBy}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-xl font-black text-ocean-deep">Products</h2>
            <div className="divide-y divide-[#D0E8F7]">
              {booking.items.map((item) => (
                <div key={item.id} className="flex justify-between py-3">
                  <span>{item.product.name} x{item.quantity}</span>
                  <span className="font-black">€{item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-ocean-deep">Economics</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><dt>Public price</dt><dd className="font-black">€{booking.totalPublic?.toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt>Partner price</dt><dd className="font-black">€{booking.totalPartner?.toFixed(2) ?? '-'}</dd></div>
            <div className="flex justify-between"><dt>Commission</dt><dd className="font-black">€{booking.commission?.toFixed(2) ?? '-'}</dd></div>
            <div className="flex justify-between"><dt>Partner</dt><dd>{booking.partner?.companyName ?? 'Direct'}</dd></div>
          </dl>
          <div className="mt-6 rounded-lg bg-ocean-light p-4 text-sm text-[#4A6580]">
            <p className="font-black text-ocean-deep">Notes</p>
            <p className="mt-2">{booking.notes ?? 'No customer notes.'}</p>
            <p className="mt-4 font-black text-ocean-deep">Internal notes</p>
            <p className="mt-2">{booking.internalNotes ?? 'No internal notes.'}</p>
          </div>
          <button className="mt-5 w-full rounded-full bg-ocean-deep px-4 py-3 font-black text-white">Send confirmation email</button>
          <p className="mt-2 text-xs text-[#8AACCC]">// TODO: EMAIL</p>
        </Card>
      </div>
    </>
  )
}
