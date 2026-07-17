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

export default async function BookingDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams])
  const boatConflict = sp.boat_conflict === '1'
  const [booking, messages, products] = await Promise.all([
    prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        partner: true,
        items: { include: { product: true } },
        fleetAssignments: { include: { fleetAsset: true } },
      },
    }),
    prisma.bookingMessage.findMany({ where: { bookingId: id }, orderBy: { sentAt: 'desc' } }),
    prisma.product.findMany({ where: { active: true }, orderBy: [{ category: 'asc' }, { name: 'asc' }] }),
  ])
  if (!booking) notFound()

  return (
    <>
      {boatConflict && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-900">
          Booking creato correttamente. La barca selezionata era già occupata in questa data — seleziona un&apos;altra barca qui sotto.
        </div>
      )}
      <PageHeader title={`Booking ${booking.id.slice(0, 8)}`} subtitle="Edit all booking details, economics and notes." />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <Card>
          <BookingCoreEditor
            bookingId={booking.id}
            customer={booking.customer}
            date={booking.date}
            timeSlot={booking.timeSlot}
            halfDayPeriod={booking.halfDayPeriod}
            notes={booking.notes}
            internalNotes={booking.internalNotes}
            createdBy={booking.createdBy}
          />
          <div className="mt-8 border-t border-[#D0E8F7] pt-6">
            <BookingItemsEditor bookingId={booking.id} initialItems={booking.items} products={products} />
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
              fuelLiters={booking.fuelLiters}
              fuelAmount={booking.fuelAmount}
              fuelPaymentInstrument={booking.fuelPaymentInstrument}
            />
          </Card>

          <Card>
            <BookingStatusEditor
              bookingId={booking.id}
              initialStatus={booking.status}
              initialPaymentMethod={booking.paymentMethod}
              initialPaymentInstrument={booking.paymentInstrument ?? null}
              initialFuelAmount={booking.fuelAmount}
            />
            <AssetAssignmentEditor
              bookingId={booking.id}
              initialAssetIds={booking.fleetAssignments.map((a) => a.fleetAssetId)}
            />
            <BookingWhatsAppMessage
              bookingId={booking.id}
              date={booking.date}
              totalPublic={booking.totalPublic}
              boatName={booking.fleetAssignments.map((a) => a.fleetAsset.name).join(', ') || null}
              initialMessages={messages.map((m) => ({ ...m, sentAt: m.sentAt.toISOString() }))}
            />
            <DeleteBookingButton bookingId={booking.id} />
          </Card>
        </div>
      </div>
    </>
  )
}
