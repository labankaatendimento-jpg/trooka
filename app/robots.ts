import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/lojista/'],
    },
    sitemap: 'https://trooka.vercel.app/sitemap.xml',
  }
}
