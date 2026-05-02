import { csvResponse, generateAllCSVs } from '@/lib/backup'
import { apiRequireRole } from '@/lib/guards'

export async function GET() {
  const guard = await apiRequireRole(['SUPERADMIN'])
  if ('error' in guard) return guard.error
  const file = (await generateAllCSVs()).find((item) => item.filename.startsWith('fornitori-spese-'))!
  return csvResponse(file.filename, file.content)
}
