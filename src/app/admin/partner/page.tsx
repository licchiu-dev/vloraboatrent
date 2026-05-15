import Link from 'next/link'
import { Card, PageHeader } from '@/components/admin/Ui'
import PartnersTable, { type PartnerRow } from '@/components/admin/PartnersTable'
import { prisma } from '@/lib/prisma'

export default async function PartnersPage() {
  const partners = await prisma.partner.findMany({
    include: { user: true, bookings: true },
    orderBy: { companyName: 'asc' },
  })

  const rows: PartnerRow[] = partners.map((p) => ({
    id: p.id,
    companyName: p.companyName,
    type: p.type,
    discountCode: p.discountCode,
    defaultCommission: p.defaultCommission,
    bookingCount: p.bookings.length,
    pendingEarnings: p.pendingEarnings,
  }))

  return (
    <>
      <PageHeader
        title="Partners"
        subtitle="Filter by column, click any header to sort."
        action={
          <Link href="/admin/partner/nuova" className="rounded-full bg-sand px-5 py-3 font-black text-ocean-deep">
            New partner
          </Link>
        }
      />
      <Card>
        <PartnersTable rows={rows} />
      </Card>
    </>
  )
}
