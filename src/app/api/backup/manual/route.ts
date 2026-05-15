import { generateAllCSVs } from '@/lib/backup'
import { apiRequireRole } from '@/lib/guards'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error

  try {
    const files = await generateAllCSVs()
    const log = await prisma.backupLog.create({
      data: {
        type: 'MANUAL',
        status: 'SUCCESS',
        files: files.map((f) => f.filename),
        snapshot: { files: files.map((f) => ({ filename: f.filename, content: f.content })) },
      },
    })
    return Response.json({ ok: true, id: log.id, files: files.map((f) => f.filename) })
  } catch (error) {
    await prisma.backupLog.create({
      data: {
        type: 'MANUAL',
        status: 'ERROR',
        files: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })
    return Response.json({ error: 'Backup failed' }, { status: 500 })
  }
}
