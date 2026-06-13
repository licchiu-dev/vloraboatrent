function LoadingLine({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-[#D0E8F7] ${className}`} />
}

export default function AdminPageLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-3">
          <LoadingLine className="h-9 w-56" />
          <LoadingLine className="h-4 w-72 max-w-full" />
        </div>
        <LoadingLine className="h-11 w-36 rounded-full" />
      </div>

      <div className="rounded-lg border border-[#D0E8F7] bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <LoadingLine className="h-10" />
          <LoadingLine className="h-10" />
          <LoadingLine className="h-10" />
          <LoadingLine className="h-10" />
        </div>
        <div className="mt-6 space-y-3">
          <LoadingLine className="h-12" />
          <LoadingLine className="h-12" />
          <LoadingLine className="h-12" />
          <LoadingLine className="h-12" />
        </div>
      </div>
    </div>
  )
}
