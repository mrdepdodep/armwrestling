'use client';

import { useState, useRef, useEffect } from 'react';
import { LANGUAGES, useLanguage } from '@/lib/i18n/LanguageContext';
import Icon from '@/components/ui/Icon';

export default function LangSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <div className={`lang-dd${open ? ' open' : ''}`} ref={ref}>
      <button
        type="button"
        className="lang-dd-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Language"
      >
        <span>{current.label}</span>
        <Icon name="chevron" size={13} className="lang-dd-caret" />
      </button>
      <div className="lang-dd-menu">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            className={`lang-dd-item${lang === l.code ? ' active' : ''}`}
            onClick={() => {
              setLang(l.code);
              setOpen(false);
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
