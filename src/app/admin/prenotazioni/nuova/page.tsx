import BookingEditor from '@/components/admin/BookingEditor'
import { PageHeader } from '@/components/admin/Ui'

export default function NewBookingPage() {
  return (
    <>
      <PageHeader title="Create booking" subtitle="Manual admin booking with customer, partner, products and price summary." />
      <BookingEditor />
    </>
  )
}
