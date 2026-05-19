'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

const GA_MEASUREMENT_ID = 'G-72XQSSZMH9'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const isFirstPageView = useRef(true)

  useEffect(() => {
    if (isFirstPageView.current) {
      isFirstPageView.current = false
      return
    }

    window.gtag?.('config', GA_MEASUREMENT_ID, {
      page_path: pathname,
    })
  }, [pathname])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}
