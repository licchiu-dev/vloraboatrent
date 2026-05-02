import Link from 'next/link'
import { Badge, Card, PageHeader } from '@/components/admin/Ui'
import { requireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export default async function SettingsPage() {
  await requireRole(['SUPERADMIN'])
  const logs = await prisma.backupLog.findMany({ orderBy: { date: 'desc' }, take: 7 })
  const last = logs[0]
  const exports = [
    ['Bookings CSV', '/api/export/bookings'],
    ['Customers CSV', '/api/export/customers'],
    ['Partners CSV', '/api/export/partners'],
    ['Products CSV', '/api/export/products'],
    ['Suppliers CSV', '/api/export/suppliers'],
    ['Download all ZIP', '/api/export/all'],
  ]
  return (
    <>
      <PageHeader title="Settings" subtitle="User administration and backup/export controls for superadmins." />
      <Card>
        <h2 className="text-xl font-black text-ocean-deep">Backup & Export</h2>
        <p className="mt-2 text-[#4A6580]">
          Last automatic backup: {last ? `${last.date.toLocaleString('en-GB')} · ${last.status}` : 'not yet executed'}.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {exports.map(([label, href]) => <Link key={href} href={href} className="rounded-lg bg-ocean-light px-4 py-3 text-center font-black text-ocean-deep">{label}</Link>)}
        </div>
        <p className="mt-5 text-sm text-[#4A6580]">CSV files are compatible with Excel and Google Sheets. The automatic backup runs every day at 23:00.</p>
      </Card>
      <Card className="mt-6">
        <h2 className="mb-4 text-xl font-black text-ocean-deep">Last 7 backups</h2>
        <div className="divide-y divide-[#D0E8F7]">
          {logs.map((log) => <div key={log.id} className="flex justify-between py-4"><span>{log.date.toLocaleString('en-GB')}</span><Badge tone={log.status === 'SUCCESS' ? 'green' : 'red'}>{log.type} · {log.status}</Badge></div>)}
          {!logs.length && <p className="py-6 text-[#4A6580]">No backup log yet.</p>}
        </div>
      </Card>
    </>
  )
}
