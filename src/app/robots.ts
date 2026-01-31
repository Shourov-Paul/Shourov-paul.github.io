import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shourov-paul.github.io'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },

    host: baseUrl,
    sitemap: baseUrl + '/sitemap.xml',
  }
}
