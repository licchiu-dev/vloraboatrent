import AdminShell from '@/components/admin/AdminShell'
import { requireRole } from '@/lib/guards'

export const dynamic = 'force-dynamic'

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireRole(['SUPERADMIN', 'ADMIN'])
  return <AdminShell>{children}</AdminShell>
}
