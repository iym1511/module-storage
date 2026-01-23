import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // API 라우트는 크롤링 제외
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
