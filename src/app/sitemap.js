import { ALL_PAGES } from '@/lib/nav';
import { SITE_URL } from '@/lib/site';

export default function sitemap() {
  const routes = ['', ...ALL_PAGES.map((p) => `/${p.slug}`)];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
