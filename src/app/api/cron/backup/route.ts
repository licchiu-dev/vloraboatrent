import { generateAllCSVs } from '@/lib/backup'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const expected = `Bearer ${process.env.CRON_SECRET}`
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== expected) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const files = await generateAllCSVs()
    await prisma.backupLog.create({
      data: { type: 'AUTO', status: 'SUCCESS', files: files.map((file) => file.filename) },
    })
    // TODO: EMAIL — collegare nodemailer/Resend per inviare backup notturno come allegato a BACKUP_EMAIL.
    // TODO: BACKUP_STORAGE — valutare salvataggio CSV su storage esterno (S3, Supabase Storage) oltre al log DB.
    return Response.json({ ok: true, files: files.map((file) => file.filename) })
  } catch (error) {
    await prisma.backupLog.create({
      data: { type: 'AUTO', status: 'ERROR', files: [], error: error instanceof Error ? error.message : 'Unknown error' },
    })
    return Response.json({ error: 'Backup failed' }, { status: 500 })
  }
}
