'use client'

import { useState } from 'react'
import { Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) {
      setError('Invalid credentials or inactive user.')
      return
    }
    router.push(params.get('callbackUrl') ?? '/admin')
  }

  return (
    <div className="min-h-screen bg-ocean-deep px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <form onSubmit={submit} className="w-full rounded-lg bg-white p-8 text-[#0A1628] shadow-2xl">
          <div className="mb-8">
            <img
              src="/images/nuovafoto-fronte.ai_4.png"
              alt="VLORA RENT A BOAT"
              className="mb-3 h-14 w-14 rounded-full object-cover ring-1 ring-[#D0E8F7]"
            />
            <h1 className="text-3xl font-black text-ocean-deep">Sign in</h1>
            <p className="mt-2 text-[#4A6580]">Access the VLORA RENT A BOAT admin and partner dashboard.</p>
          </div>

          <label className="mb-2 block text-sm font-bold text-ocean-deep">Email</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className="mb-4 w-full rounded-lg border-2 border-[#D0E8F7] px-4 py-3 outline-none focus:border-ocean-bright"
          />

          <label className="mb-2 block text-sm font-bold text-ocean-deep">Password</label>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="mb-4 w-full rounded-lg border-2 border-[#D0E8F7] px-4 py-3 outline-none focus:border-ocean-bright"
          />

          {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

          <button
            disabled={loading}
            className="w-full rounded-full bg-sand px-6 py-3 font-black text-ocean-deep transition hover:bg-sand-dark disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ocean-deep" />}>
      <LoginForm />
    </Suspense>
  )
}
