'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge, Card } from '@/components/admin/Ui'
import { ChevronDown, ChevronRight, Download, RefreshCw } from 'lucide-react'

type LogEntry = {
  id: string
  date: string
  type: string
  status: string
  files: string[]
  error: string | null
  hasSnapshot: boolean
}

const exports = [
  ['Bookings CSV', '/api/export/bookings'],
  ['Customers CSV', '/api/export/customers'],
  ['Partners CSV', '/api/export/partners'],
  ['Products CSV', '/api/export/products'],
  ['Suppliers CSV', '/api/export/suppliers'],
  ['Download all ZIP', '/api/export/all'],
]

export default function SettingsPanel({ logs }: { logs: LogEntry[] }) {
  const router = useRouter()
  const [running, setRunning] = useState(false)
  const [message, setMessage] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  async function runBackup() {
    setRunning(true)
    setMessage('')
    const res = await fetch('/api/backup/manual', { method: 'POST' })
    setRunning(false)
    if (res.ok) {
      setMessage('Backup completed successfully.')
      router.refresh()
    } else {
      setMessage('Backup failed — check logs below.')
    }
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => (prev === id ? null : id))
  }

  const lastAuto = logs.find((l) => l.type === 'AUTO' && l.status === 'SUCCESS')

  return (
    <div className="space-y-6">
      {/* Backup controls */}
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-black text-ocean-deep">Automatic backup</h2>
            <p className="mt-1 text-sm text-[#4A6580]">
              Runs every hour automatically. Last successful auto backup:{' '}
              <span className="font-bold text-ocean-deep">
                {lastAuto ? new Date(lastAuto.date).toLocaleString('en-GB') : 'not yet executed'}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={runBackup}
            disabled={running}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ocean-deep px-5 py-2.5 text-sm font-black text-white disabled:opacity-60"
          >
            <RefreshCw size={15} className={running ? 'animate-spin' : ''} />
            {running ? 'Running…' : 'Run backup now'}
          </button>
        </div>
        {message && (
          <p className={`mt-3 text-sm font-bold ${message.includes('failed') ? 'text-red-600' : 'text-emerald-600'}`}>
            {message}
          </p>
        )}
      </Card>

      {/* Manual export */}
      <Card>
        <h2 className="mb-4 text-xl font-black text-ocean-deep">Export current data</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {exports.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-lg bg-ocean-light px-4 py-3 text-center text-sm font-black text-ocean-deep hover:bg-ocean-light/70"
            >
              {label}
            </a>
          ))}
        </div>
        <p className="mt-3 text-xs text-[#4A6580]">CSV files are compatible with Excel and Google Sheets.</p>
      </Card>

      {/* Backup log */}
      <Card>
        <h2 className="mb-4 text-xl font-black text-ocean-deep">Backup log</h2>
        {logs.length === 0 && (
          <p className="py-6 text-center text-[#4A6580]">No backups yet. Run one manually above.</p>
        )}
        <div className="divide-y divide-[#D0E8F7]">
          {logs.map((log) => {
            const isOpen = expanded === log.id
            const date = new Date(log.date)
            return (
              <div key={log.id}>
                <div
                  className="flex cursor-pointer items-center gap-3 py-3 hover:bg-ocean-light/20 rounded"
                  onClick={() => toggleExpand(log.id)}
                >
                  {isOpen ? <ChevronDown size={16} className="shrink-0 text-[#4A6580]" /> : <ChevronRight size={16} className="shrink-0 text-[#4A6580]" />}

                  <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
                    <span className="whitespace-nowrap text-sm font-bold text-ocean-deep">
                      {date.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="flex gap-2">
                      <Badge tone={log.type === 'MANUAL' ? 'blue' : 'dark'}>{log.type}</Badge>
                      <Badge tone={log.status === 'SUCCESS' ? 'green' : 'red'}>{log.status}</Badge>
                    </div>
                    <span className="text-xs text-[#4A6580]">
                      {log.files.length > 0 ? `${log.files.length} files` : 'no files'}
                    </span>
                  </div>

                  {log.hasSnapshot && (
                    <a
                      href={`/api/backup/${log.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#D0E8F7] px-3 py-1.5 text-xs font-bold text-ocean-mid hover:bg-ocean-light"
                      title="Download ZIP for this backup"
                    >
                      <Download size={12} />
                      ZIP
                    </a>
                  )}
                </div>

                {isOpen && (
                  <div className="mb-3 ml-7 rounded-lg bg-ocean-light/40 px-4 py-3 text-sm">
                    {log.error && (
                      <p className="mb-2 font-bold text-red-700">Error: {log.error}</p>
                    )}
                    {log.files.length > 0 ? (
                      <ul className="space-y-1">
                        {log.files.map((f) => (
                          <li key={f} className="text-[#4A6580]">
                            📄 {f}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[#4A6580]">No files generated.</p>
                    )}
                    {!log.hasSnapshot && log.status === 'SUCCESS' && (
                      <p className="mt-2 text-xs text-[#4A6580]">
                        Snapshot not available — this backup was created before snapshot storage was introduced.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
