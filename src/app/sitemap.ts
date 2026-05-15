import type { MetadataRoute } from 'next'

const BASE_URL = 'https://vloraboatrent.com'

const LANGS = ['it', 'sq', 'ru', 'ar', 'zh'] as const

const PAGES = ['', '/noleggio', '/esperienza'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const enPages: MetadataRoute.Sitemap = PAGES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.9,
  }))

  const langPages: MetadataRoute.Sitemap = LANGS.flatMap((lang) =>
    PAGES.map((path) => ({
      url: `${BASE_URL}/${lang}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 0.8 : 0.7,
    }))
  )

  return [...enPages, ...langPages]
}
