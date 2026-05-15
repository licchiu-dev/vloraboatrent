'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')

  async function remove() {
    if (!window.confirm('Delete this booking permanently?')) return
    setDeleting(true)
    setMessage('')
    const response = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' })
    setDeleting(false)
    if (!response.ok) {
      setMessage('Delete failed.')
      return
    }
    router.push('/admin/prenotazioni')
    router.refresh()
  }

  return (
    <>
      <button
        type="button"
        onClick={remove}
        disabled={deleting}
        className="mt-3 w-full rounded-full border border-red-200 bg-red-50 px-4 py-3 font-black text-red-700 disabled:opacity-60"
      >
        {deleting ? 'Deleting...' : 'Delete booking'}
      </button>
      {message && <p className="mt-2 text-sm font-bold text-red-600">{message}</p>}
    </>
  )
}
