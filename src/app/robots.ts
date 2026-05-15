import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/partner/', '/api/'],
    },
    sitemap: 'https://vloraboatrent.com/sitemap.xml',
  }
}
