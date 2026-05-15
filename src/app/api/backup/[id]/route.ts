import JSZip from 'jszip'
import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

type SnapshotFile = { filename: string; content: string }

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error

  const { id } = await params
  const log = await prisma.backupLog.findUnique({ where: { id } })
  if (!log) return Response.json({ error: 'Not found' }, { status: 404 })
  if (!log.snapshot) return Response.json({ error: 'No snapshot stored for this backup' }, { status: 404 })

  const { files } = log.snapshot as { files: SnapshotFile[] }
  const zip = new JSZip()
  files.forEach((f) => zip.file(f.filename, f.content))

  const uint8 = await zip.generateAsync({ type: 'uint8array' })
  const label = log.date.toISOString().slice(0, 16).replace('T', '_').replace(':', '-')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Response(uint8 as any, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="backup-${label}.zip"`,
    },
  })
}
