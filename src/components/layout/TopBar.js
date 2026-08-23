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

  // Lock body scroll + close on Escape while the mobile drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setMobileOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

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
          <span className="topbar-controls">
            <ThemeToggle />
            <LangSwitcher />
          </span>
          <button
            className="mobile-btn"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            <Icon name="menu" size={22} />
          </button>
        </div>
      </div>

      {/* Mobile drawer: backdrop + slide-in panel */}
      <div
        className={`mobile-overlay${mobileOpen ? ' open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <button
          className="mobile-backdrop"
          aria-label="Close menu"
          tabIndex={mobileOpen ? 0 : -1}
          onClick={() => setMobileOpen(false)}
        />
        <div className="mobile-panel" role="dialog" aria-modal="true">
          <div className="mobile-panel-head">
            <span className="mobile-panel-title">{t({ en: 'Menu', uk: 'Меню', ru: 'Меню' })}</span>
            <button
              className="icon-btn"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <Icon name="close" size={22} />
            </button>
          </div>

          <div className="mobile-nav">
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
                      tabIndex={mobileOpen ? 0 : -1}
                    >
                      <Icon name={page.icon} size={18} />
                      <span>{t(page.label)}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mobile-panel-foot">
            <ThemeToggle />
            <LangSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
