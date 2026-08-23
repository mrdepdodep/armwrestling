'use client';

import { usePathname } from 'next/navigation';
import { ALL_PAGES } from '@/lib/nav';
import { useT } from '@/lib/i18n/LanguageContext';
import Icon from '@/components/ui/Icon';

// Pages that render their own custom header (with imagery, etc.)
const CUSTOM = new Set(['molten-trainer-calculator']);

export default function PageHeader() {
  const pathname = usePathname();
  const t = useT();

  const slug = (pathname || '/').replace(/^\//, '');
  // Root/welcome page and custom-header pages render their own hero.
  if (!slug || CUSTOM.has(slug)) return null;

  const page = ALL_PAGES.find((p) => p.slug === slug);
  if (!page) return null;

  return (
    <header className="page-header">
      <div className="page-header-row">
        <div className="page-header-icon">
          <Icon name={page.icon} size={26} strokeWidth={1.8} />
        </div>
        <div className="page-header-text">
          <h1 className="page-header-title">{t(page.label)}</h1>
          {page.desc && <p className="page-header-desc">{t(page.desc)}</p>}
        </div>
      </div>
    </header>
  );
}
