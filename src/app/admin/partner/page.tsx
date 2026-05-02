import Link from 'next/link'
import { Card, PageHeader } from '@/components/admin/Ui'
import { prisma } from '@/lib/prisma'

export default async function PartnersPage() {
  const partners = await prisma.partner.findMany({ include: { user: true, bookings: true }, orderBy: { createdAt: 'desc' } })
  return (
    <>
      <PageHeader title="Partners" subtitle="Partner registry, codes, commissions and generated bookings." action={<Link href="/admin/partner/nuova" className="rounded-full bg-sand px-5 py-3 font-black text-ocean-deep">New partner</Link>} />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead><tr className="text-[#4A6580]">{['Name', 'Type', 'Code', 'Default %', 'Bookings', 'Pending earnings', ''].map((h) => <th key={h} className="pb-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-[#D0E8F7]">
            {partners.map((partner) => (
              <tr key={partner.id}>
                <td className="py-4 font-black">{partner.companyName}</td>
                <td>{partner.type}</td>
                <td>{partner.discountCode}</td>
                <td>{partner.defaultCommission}%</td>
                <td>{partner.bookings.length}</td>
                <td>€{partner.pendingEarnings.toFixed(2)}</td>
                <td><Link href={`/admin/partner/${partner.id}`} className="font-black text-ocean-mid">Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  )
}
