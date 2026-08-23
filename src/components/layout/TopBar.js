'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES, ALL_PAGES } from '@/lib/nav';
import { useT } from '@/lib/i18n/LanguageContext';
import Icon from '@/components/ui/Icon';
import ThemeToggle from './ThemeToggle';
import LangSwitcher from './LangSwitcher';

export default function TopBar() {
  const pathname = usePathname();
  const t = useT();
  const [openCat, setOpenCat] = useState(null); // desktop dropdown
  const [mobileOpen, setMobileOpen] = useState(false);
  const barRef = useRef(null);

  const activePage = ALL_PAGES.find((p) => `/${p.slug}` === pathname);

  // Close dropdowns on outside click / route change
  useEffect(() => {
    setOpenCat(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) setOpenCat(null);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <header className="topbar" ref={barRef}>
      <div className="topbar-inner">
        <div className="topbar-spacer" />

        {/* Desktop nav */}
        <nav className="topnav">
          {CATEGORIES.map((cat) => {
            const isOpen = openCat === cat.id;
            const hasActive = cat.pages.some((p) => `/${p.slug}` === pathname);
            return (
              <div key={cat.id} className={`topnav-item${isOpen ? ' open' : ''}`}>
                <button
                  className={`topnav-btn${hasActive ? ' active' : ''}`}
                  onClick={() => setOpenCat(isOpen ? null : cat.id)}
                >
                  <Icon name={cat.icon} size={17} />
                  <span>{t(cat.label)}</span>
                  <Icon name="chevron" size={13} className="caret" />
                </button>
                <div className="topnav-menu">
                  {cat.pages.map((page) => {
                    const active = `/${page.slug}` === pathname;
                    return (
                      <Link
                        key={page.slug}
                        href={`/${page.slug}`}
                        className={`topnav-link${active ? ' active' : ''}`}
                      >
                        <Icon name={page.icon} size={17} />
                        <span>{t(page.label)}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="topbar-right">
          <ThemeToggle />
          <LangSwitcher />
          <button
            className="mobile-btn"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            <Icon name={mobileOpen ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="mobile-drawer">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="mobile-group">
              <div className="mobile-group-title">
                <Icon name={cat.icon} size={16} />
                <span>{t(cat.label)}</span>
              </div>
              {cat.pages.map((page) => {
                const active = `/${page.slug}` === pathname;
                return (
                  <Link
                    key={page.slug}
                    href={`/${page.slug}`}
                    className={`mobile-link${active ? ' active' : ''}`}
                  >
                    <Icon name={page.icon} size={18} />
                    <span>{t(page.label)}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
