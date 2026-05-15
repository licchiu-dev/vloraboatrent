import { requireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/admin/Ui'
import SettingsPanel from '@/components/admin/SettingsPanel'

export default async function SettingsPage() {
  await requireRole(['SUPERADMIN'])
  const logs = await prisma.backupLog.findMany({
    orderBy: { date: 'desc' },
    take: 50,
    select: {
      id: true,
      date: true,
      type: true,
      status: true,
      files: true,
      error: true,
      snapshot: true,
    },
  })

  const serialized = logs.map((l) => ({
    ...l,
    date: l.date.toISOString(),
    hasSnapshot: l.snapshot != null,
    snapshot: undefined,
  }))

  return (
    <>
      <PageHeader title="Settings" subtitle="Backup, export and account management for superadmins." />
      <SettingsPanel logs={serialized} />
    </>
  )
}
