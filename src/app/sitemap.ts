import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://zinghealthytreats.com'

  try {
    // Fetch all active products to generate dynamic URLs
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, dateAdded: true },
    })

    const productUrls = products.map((product) => ({
      url: `${baseUrl}/product/${product.id}`,
      lastModified: product.dateAdded,
    }))

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/catalog`,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/subscribe`,
        lastModified: new Date(),
      },
      ...productUrls,
    ]
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error)
    // Fallback to just static routes if DB fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/catalog`,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/subscribe`,
        lastModified: new Date(),
      },
    ]
  }
}
