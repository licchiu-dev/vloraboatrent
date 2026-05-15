'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge, Card } from '@/components/admin/Ui'
import { ChevronDown, ChevronRight, Download, RefreshCw, UserPlus } from 'lucide-react'

type LogEntry = {
  id: string
  date: string
  type: string
  status: string
  files: string[]
  error: string | null
  hasSnapshot: boolean
}

type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  active: boolean
  createdAt: string
}

const allExports = [
  ['Bookings CSV', '/api/export/bookings'],
  ['Customers CSV', '/api/export/customers'],
  ['Partners CSV', '/api/export/partners'],
  ['Products CSV', '/api/export/products'],
  ['Suppliers CSV', '/api/export/suppliers'],
  ['Download all ZIP', '/api/export/all'],
]

const inputClass =
  'mt-0.5 w-full rounded-lg border border-[#D0E8F7] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-mid'

export default function SettingsPanel({ logs }: { logs: LogEntry[] }) {
  const router = useRouter()
  const [running, setRunning] = useState(false)
  const [backupMsg, setBackupMsg] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  // --- users ---
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  // new user form
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [savingUser, setSavingUser] = useState(false)
  const [userMsg, setUserMsg] = useState('')
  const [userError, setUserError] = useState(false)

  // per-user password change
  const [changingPwdFor, setChangingPwdFor] = useState<string | null>(null)
  const [newPwd, setNewPwd] = useState('')
  const [savingPwd, setSavingPwd] = useState(false)
  const [pwdMsg, setPwdMsg] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/admin-users')
      .then((r) => r.json())
      .then((data) => { setUsers(data); setLoadingUsers(false) })
      .catch(() => setLoadingUsers(false))
  }, [])

  async function runBackup() {
    setRunning(true)
    setBackupMsg('')
    const res = await fetch('/api/backup/manual', { method: 'POST' })
    setRunning(false)
    setBackupMsg(res.ok ? 'Backup completed successfully.' : 'Backup failed — check logs below.')
    if (res.ok) router.refresh()
  }

  async function createUser() {
    if (!newName || !newEmail || !newPassword) return
    setSavingUser(true)
    setUserMsg('')
    const res = await fetch('/api/admin-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, email: newEmail, password: newPassword }),
    })
    const body = await res.json()
    setSavingUser(false)
    if (!res.ok) { setUserError(true); setUserMsg(body.error ?? 'Failed.'); return }
    setUserError(false)
    setUserMsg(`Account created for ${body.name}.`)
    setUsers((prev) => [...prev, body])
    setNewName(''); setNewEmail(''); setNewPassword('')
  }

  async function changePassword(userId: string) {
    if (!newPwd) return
    setSavingPwd(true)
    const res = await fetch(`/api/admin-users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword: newPwd }),
    })
    const body = await res.json()
    setSavingPwd(false)
    setPwdMsg((prev) => ({ ...prev, [userId]: res.ok ? 'Password updated.' : (body.error ?? 'Failed.') }))
    if (res.ok) { setChangingPwdFor(null); setNewPwd('') }
  }

  async function toggleActive(user: AdminUser) {
    const res = await fetch(`/api/admin-users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !user.active }),
    })
    if (res.ok) setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, active: !u.active } : u))
  }

  async function deleteUser(userId: string) {
    if (!confirm('Delete this admin account? This cannot be undone.')) return
    const res = await fetch(`/api/admin-users/${userId}`, { method: 'DELETE' })
    if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  const lastAuto = logs.find((l) => l.type === 'AUTO' && l.status === 'SUCCESS')

  return (
    <div className="space-y-6">

      {/* Account management */}
      <Card>
        <h2 className="mb-4 text-xl font-black text-ocean-deep">Admin accounts (Soci)</h2>

        {/* User list */}
        {loadingUsers ? (
          <p className="text-sm text-[#4A6580]">Loading…</p>
        ) : (
          <div className="mb-5 divide-y divide-[#D0E8F7]">
            {users.map((u) => (
              <div key={u.id} className="py-3">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="font-bold text-ocean-deep">{u.name}</span>
                    <span className="ml-2 text-sm text-[#4A6580]">{u.email}</span>
                    <Badge tone={u.role === 'SUPERADMIN' ? 'dark' : 'blue'} >{u.role}</Badge>
                    {!u.active && <Badge tone="red">Inactive</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => { setChangingPwdFor(changingPwdFor === u.id ? null : u.id); setNewPwd('') }}
                      className="rounded-full border border-[#D0E8F7] px-3 py-1 text-xs font-bold text-[#4A6580] hover:bg-ocean-light"
                    >
                      Change password
                    </button>
                    {u.role !== 'SUPERADMIN' && (
                      <>
                        <button
                          type="button"
                          onClick={() => toggleActive(u)}
                          className="rounded-full border border-[#D0E8F7] px-3 py-1 text-xs font-bold text-[#4A6580] hover:bg-ocean-light"
                        >
                          {u.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteUser(u.id)}
                          className="rounded-full border border-red-200 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {changingPwdFor === u.id && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="password"
                      placeholder="New password (min 8 chars)"
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      className="rounded-lg border border-[#D0E8F7] px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ocean-mid"
                    />
                    <button
                      type="button"
                      onClick={() => changePassword(u.id)}
                      disabled={savingPwd || !newPwd}
                      className="rounded-full bg-ocean-deep px-4 py-1.5 text-xs font-black text-white disabled:opacity-60"
                    >
                      {savingPwd ? 'Saving…' : 'Save'}
                    </button>
                    {pwdMsg[u.id] && <span className="text-xs font-bold text-ocean-mid">{pwdMsg[u.id]}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create new admin */}
        <div className="rounded-lg bg-ocean-light/40 p-4">
          <p className="mb-3 flex items-center gap-2 text-sm font-black text-ocean-deep">
            <UserPlus size={15} /> Create new admin account
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col text-sm font-bold text-ocean-deep">
              Full name
              <input className={inputClass} placeholder="Mario Rossi" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </label>
            <label className="flex flex-col text-sm font-bold text-ocean-deep">
              Email
              <input type="email" className={inputClass} placeholder="mario@example.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            </label>
            <label className="flex flex-col text-sm font-bold text-ocean-deep">
              Password
              <input type="password" className={inputClass} placeholder="Min 8 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </label>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={createUser}
              disabled={savingUser || !newName || !newEmail || !newPassword}
              className="rounded-full bg-ocean-deep px-5 py-2 text-sm font-black text-white disabled:opacity-60"
            >
              {savingUser ? 'Creating…' : 'Create admin'}
            </button>
            {userMsg && <p className={`text-sm font-bold ${userError ? 'text-red-600' : 'text-ocean-mid'}`}>{userMsg}</p>}
          </div>
        </div>
      </Card>

      {/* Backup controls */}
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-black text-ocean-deep">Automatic backup</h2>
            <p className="mt-1 text-sm text-[#4A6580]">
              Runs every day at 23:00. Last successful auto backup:{' '}
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
        {backupMsg && (
          <p className={`mt-3 text-sm font-bold ${backupMsg.includes('failed') ? 'text-red-600' : 'text-emerald-600'}`}>
            {backupMsg}
          </p>
        )}
      </Card>

      {/* Manual export */}
      <Card>
        <h2 className="mb-4 text-xl font-black text-ocean-deep">Export current data</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {allExports.map(([label, href]) => (
            <a key={href} href={href}
              className="rounded-lg bg-ocean-light px-4 py-3 text-center text-sm font-black text-ocean-deep hover:bg-ocean-light/70">
              {label}
            </a>
          ))}
        </div>
        <p className="mt-3 text-xs text-[#4A6580]">CSV files are compatible with Excel and Google Sheets.</p>
      </Card>

      {/* Backup log */}
      <Card>
        <h2 className="mb-4 text-xl font-black text-ocean-deep">Backup log</h2>
        {logs.length === 0 && <p className="py-6 text-center text-[#4A6580]">No backups yet.</p>}
        <div className="divide-y divide-[#D0E8F7]">
          {logs.map((log) => {
            const isOpen = expanded === log.id
            const date = new Date(log.date)
            return (
              <div key={log.id}>
                <div className="flex cursor-pointer items-center gap-3 rounded py-3 hover:bg-ocean-light/20"
                  onClick={() => setExpanded(isOpen ? null : log.id)}>
                  {isOpen
                    ? <ChevronDown size={16} className="shrink-0 text-[#4A6580]" />
                    : <ChevronRight size={16} className="shrink-0 text-[#4A6580]" />}
                  <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
                    <span className="whitespace-nowrap text-sm font-bold text-ocean-deep">
                      {date.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="flex gap-2">
                      <Badge tone={log.type === 'MANUAL' ? 'blue' : 'dark'}>{log.type}</Badge>
                      <Badge tone={log.status === 'SUCCESS' ? 'green' : 'red'}>{log.status}</Badge>
                    </div>
                    <span className="text-xs text-[#4A6580]">{log.files.length > 0 ? `${log.files.length} files` : 'no files'}</span>
                  </div>
                  {log.hasSnapshot && (
                    <a href={`/api/backup/${log.id}`} onClick={(e) => e.stopPropagation()}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#D0E8F7] px-3 py-1.5 text-xs font-bold text-ocean-mid hover:bg-ocean-light"
                      title="Download ZIP">
                      <Download size={12} /> ZIP
                    </a>
                  )}
                </div>
                {isOpen && (
                  <div className="mb-3 ml-7 rounded-lg bg-ocean-light/40 px-4 py-3 text-sm">
                    {log.error && <p className="mb-2 font-bold text-red-700">Error: {log.error}</p>}
                    {log.files.length > 0
                      ? <ul className="space-y-1">{log.files.map((f) => <li key={f} className="text-[#4A6580]">📄 {f}</li>)}</ul>
                      : <p className="text-[#4A6580]">No files generated.</p>}
                    {!log.hasSnapshot && log.status === 'SUCCESS' && (
                      <p className="mt-2 text-xs text-[#4A6580]">Snapshot not available — created before snapshot storage.</p>
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
