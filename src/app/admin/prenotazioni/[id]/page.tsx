import { notFound } from 'next/navigation'
import AssetAssignmentEditor from '@/components/admin/AssetAssignmentEditor'
import BookingCoreEditor from '@/components/admin/BookingCoreEditor'
import BookingEconomicsEditor from '@/components/admin/BookingEconomicsEditor'
import BookingItemsEditor from '@/components/admin/BookingItemsEditor'
import BookingStatusEditor from '@/components/admin/BookingStatusEditor'
import BookingWhatsAppMessage from '@/components/admin/BookingWhatsAppMessage'
import DeleteBookingButton from '@/components/admin/DeleteBookingButton'
import { Card, PageHeader } from '@/components/admin/Ui'
import { prisma } from '@/lib/prisma'

export default async function BookingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [booking, messages] = await Promise.all([
    prisma.booking.findUnique({
      where: { id },
      include: { customer: true, partner: true, items: { include: { product: true } }, fleetAssignments: true },
    }),
    prisma.bookingMessage.findMany({ where: { bookingId: id }, orderBy: { sentAt: 'desc' } }),
  ])
  if (!booking) notFound()

  return (
    <>
      <PageHeader title={`Booking ${booking.id.slice(0, 8)}`} subtitle="Edit all booking details, economics and notes." />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <Card>
          <BookingCoreEditor
            bookingId={booking.id}
            customer={booking.customer}
            date={booking.date}
            timeSlot={booking.timeSlot}
            notes={booking.notes}
            internalNotes={booking.internalNotes}
            createdBy={booking.createdBy}
          />
          <div className="mt-8 border-t border-[#D0E8F7] pt-6">
            <BookingItemsEditor bookingId={booking.id} initialItems={booking.items} />
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <BookingEconomicsEditor
              bookingId={booking.id}
              totalPublic={booking.totalPublic}
              totalPartner={booking.totalPartner}
              commission={booking.commission}
              partnerId={booking.partnerId}
              partnerName={booking.partner?.companyName ?? null}
              discountCode={booking.discountCode}
            />
          </Card>

          <Card>
            <BookingStatusEditor
              bookingId={booking.id}
              initialStatus={booking.status}
              initialPaymentMethod={booking.paymentMethod}
            />
            <AssetAssignmentEditor
              bookingId={booking.id}
              initialAssetIds={booking.fleetAssignments.map((a) => a.fleetAssetId)}
            />
            <BookingWhatsAppMessage
              bookingId={booking.id}
              date={booking.date}
              totalPublic={booking.totalPublic}
              initialMessages={messages.map((m) => ({ ...m, sentAt: m.sentAt.toISOString() }))}
            />
            <DeleteBookingButton bookingId={booking.id} />
          </Card>
        </div>
      </div>
    </>
  )
}
