import BookingEditor from '@/components/admin/BookingEditor'
import { PageHeader } from '@/components/admin/Ui'

export default function PartnerNewBookingPage() {
  return (
    <>
      <PageHeader title="Create partner booking" subtitle="Partner bookings are submitted as pending and reviewed by the admin." />
      <BookingEditor partnerMode />
    </>
  )
}
