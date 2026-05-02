import Link from 'next/link'
import { Card, PageHeader } from '@/components/admin/Ui'
import { prisma } from '@/lib/prisma'

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({ include: { bookings: true }, orderBy: { createdAt: 'desc' } })
  return (
    <>
      <PageHeader title="Customers" subtitle="Searchable customer registry with booking history." />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead><tr className="text-[#4A6580]">{['Name', 'Email', 'Phone', 'Bookings', 'Total spent', ''].map((h) => <th key={h} className="pb-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-[#D0E8F7]">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="py-4 font-black">{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.bookings.length}</td>
                <td>€{customer.bookings.reduce((sum, booking) => sum + (booking.totalPublic ?? 0), 0).toFixed(2)}</td>
                <td><Link href={`/admin/clienti/${customer.id}`} className="font-black text-ocean-mid">Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  )
}
