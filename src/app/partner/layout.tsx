import AdminShell from '@/components/admin/AdminShell'
import { requireRole } from '@/lib/guards'

export const dynamic = 'force-dynamic'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(['PARTNER'])
  return <AdminShell mode="partner" user={{ name: session.user.name, role: session.user.role }}>{children}</AdminShell>
}
