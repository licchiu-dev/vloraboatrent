import { generateBackupZip } from '@/lib/backup'
import { apiRequireRole } from '@/lib/guards'

export async function GET() {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error
  const { buffer } = await generateBackupZip()
  const today = new Date().toISOString().slice(0, 10)

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="backup-valona-${today}.zip"`,
    },
  })
}
