import { Card, PageHeader } from '@/components/admin/Ui'
import { prisma } from '@/lib/prisma'

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({ include: { expenses: true }, orderBy: { createdAt: 'desc' } })
  const total = suppliers.flatMap((supplier) => supplier.expenses).reduce((sum, expense) => sum + expense.amount, 0)
  return (
    <>
      <PageHeader title="Suppliers & expenses" subtitle={`Registered expenses total: €${total.toFixed(2)}`} />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead><tr className="text-[#4A6580]">{['Supplier', 'Type', 'Contact', 'Expenses', 'Total'].map((h) => <th key={h} className="pb-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-[#D0E8F7]">
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td className="py-4 font-black">{supplier.name}</td>
                <td>{supplier.type}</td>
                <td>{supplier.contact}</td>
                <td>{supplier.expenses.length}</td>
                <td>€{supplier.expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  )
}
