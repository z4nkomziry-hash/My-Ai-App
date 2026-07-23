export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const languages = ['en', 'ku-bd', 'ku-so', 'ar', 'tr', 'fa', 'de', 'fr', 'es', 'ru', 'zh', 'hi'];

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/auth`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/dashboard`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/checkout`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 }
  ];

  const localizedPages = [];
  for (const page of staticPages) {
    for (const lang of languages) {
      localizedPages.push({
        ...page,
        url: `${page.url}?lang=${lang}`,
        priority: page.priority * 0.8
      });
    }
  }

  return [...staticPages, ...localizedPages];
}
