import Link from 'next/link'
import { notFound } from 'next/navigation'
import AssetAssignmentEditor from '@/components/admin/AssetAssignmentEditor'
import BookingCoreEditor from '@/components/admin/BookingCoreEditor'
import BookingStatusEditor from '@/components/admin/BookingStatusEditor'
import { Card, PageHeader } from '@/components/admin/Ui'
import { requireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export default async function PartnerBookingDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const session = await requireRole(['PARTNER'])
  const [{ id }, sp] = await Promise.all([params, searchParams])
  const boatConflict = sp.boat_conflict === '1'

  const booking = await prisma.booking.findUnique({
    where: { id, partnerId: session.user.partnerId },
    include: { customer: true, items: { include: { product: true } }, fleetAssignments: true },
  })
  if (!booking) notFound()

  return (
    <>
      {boatConflict && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-900">
          Booking creato correttamente. La barca selezionata era già occupata in questa data — seleziona un&apos;altra barca qui sotto.
        </div>
      )}
      <PageHeader
        title={`Booking ${booking.id.slice(0, 8).toUpperCase()}`}
        subtitle={`${booking.customer.name} · ${booking.date.toLocaleDateString('en-GB')}`}
        action={
          <Link href="/partner/prenotazioni" className="rounded-full border border-[#D0E8F7] px-5 py-3 font-black text-[#4A6580]">
            ← My bookings
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
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
            showInternalNotes={false}
          />
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <BookingStatusEditor
              bookingId={booking.id}
              initialStatus={booking.status}
              initialPaymentMethod={booking.paymentMethod}
              initialPaymentInstrument={booking.paymentInstrument ?? null}
              initialFuelAmount={booking.fuelAmount}
            />
          </Card>
          <Card>
            <h3 className="mb-3 font-black text-ocean-deep">Fleet assignment</h3>
            <AssetAssignmentEditor
              bookingId={booking.id}
              initialAssetIds={booking.fleetAssignments.map((a) => a.fleetAssetId)}
            />
          </Card>
        </div>
      </div>
    </>
  )
}
