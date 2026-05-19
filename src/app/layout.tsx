import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import SiteChrome from '@/components/SiteChrome'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const BASE_URL = 'https://vloraboatrent.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '1024x1024' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-icon.png',
  },
  title: {
    default: 'Vlora Boat Rent — Boat Rental & Fishing in Albania',
    template: '%s | Vlora Boat Rent',
  },
  description:
    'Rent a boat in Vlora, Albania without a license. Day trips, fishing experiences and sea excursions in the Albanian Riviera. Book online.',
  keywords: [
    'boat rent albania',
    'boat rental vlora',
    'boat rent vlora',
    'vlora boat',
    'albania boat rental',
    'noleggio barche vlora',
    'albanien bootsverleih',
    'rent a boat albania',
    'fishing vlora albania',
    'albanian riviera boat',
  ],
  alternates: {
    canonical: BASE_URL,
    languages: {
      'it': `${BASE_URL}/it`,
      'sq': `${BASE_URL}/sq`,
      'ru': `${BASE_URL}/ru`,
      'ar': `${BASE_URL}/ar`,
      'zh': `${BASE_URL}/zh`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Vlora Boat Rent',
    title: 'Vlora Boat Rent — Boat Rental & Fishing in Albania',
    description:
      'Rent a boat in Vlora, Albania without a license. Day trips, fishing experiences and sea excursions in the Albanian Riviera.',
    images: [
      {
        url: '/images/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Vlora Boat Rent — Albanian Riviera',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vlora Boat Rent — Boat Rental & Fishing in Albania',
    description: 'Rent a boat in Vlora, Albania without a license. Book online.',
    images: ['/images/og-cover.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TouristAttraction',
      '@id': `${BASE_URL}/#business`,
      name: 'Vlora Boat Rent',
      description:
        'License-free boat rentals, fishing experiences, and sea excursions in Vlora, Albania.',
      url: BASE_URL,
      telephone: '+355',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Vlorë',
        addressCountry: 'AL',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 40.4661,
        longitude: 19.4915,
      },
      priceRange: '€€',
      currenciesAccepted: 'EUR, ALL',
      paymentAccepted: 'Cash, Credit Card',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '07:00',
        closes: '20:00',
      },
      touristType: 'Tourists, Fishing Enthusiasts, Adventure Seekers',
      availableLanguage: ['English', 'Italian', 'Albanian', 'Russian'],
      sameAs: [
        'https://noleggiobarchevalona.it',
        'https://vloraboatrent.com',
        'https://vloraboats.com',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'Vlora Boat Rent',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  )
}
