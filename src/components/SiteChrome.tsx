'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hidden = pathname.startsWith('/admin') || pathname.startsWith('/partner') || pathname.startsWith('/login')

  return (
    <>
      {!hidden && <Navbar />}
      <main>{children}</main>
      {!hidden && <Footer />}
    </>
  )
}
