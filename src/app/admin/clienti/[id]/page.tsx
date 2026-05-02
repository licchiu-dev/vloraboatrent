import { notFound } from 'next/navigation'
import { Card, PageHeader } from '@/components/admin/Ui'
import { prisma } from '@/lib/prisma'

export default async function CustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const customer = await prisma.customer.findUnique({ where: { id }, include: { bookings: { include: { items: { include: { product: true } } } } } })
  if (!customer) notFound()
  return (
    <>
      <PageHeader title={customer.name} subtitle={`${customer.email} · ${customer.phone}`} />
      <Card>
        <h2 className="text-xl font-black text-ocean-deep">Booking history</h2>
        <div className="mt-4 divide-y divide-[#D0E8F7]">
          {customer.bookings.map((booking) => (
            <div key={booking.id} className="flex justify-between py-4">
              <span>{booking.date.toLocaleDateString('en-GB')} · {booking.items.map((item) => item.product.name).join(', ')}</span>
              <span className="font-black">€{booking.totalPublic?.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}
