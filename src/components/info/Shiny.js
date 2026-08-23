'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Icon from '@/components/ui/Icon';
import './info.css';

const MULT = 1.15;

const T = {
  en: { placeholder: 'Type a base %…', base: 'Base', shiny: 'Shiny', empty: 'No matches' },
  uk: { placeholder: 'Введи базовий %…', base: 'База', shiny: 'Шайні', empty: 'Нічого не знайдено' },
  ru: { placeholder: 'Введи базовый %…', base: 'База', shiny: 'Шайни', empty: 'Ничего не найдено' },
};

// base from 100 to 1000 step 5
function buildRows() {
  const rows = [];
  for (let base = 100; base <= 1000; base += 5) {
    const shiny = Math.round(base * MULT * 100) / 100;
    rows.push({ base, shiny });
  }
  return rows;
}

function fmtPct(v) {
  return `${v % 1 === 0 ? v : v.toFixed(2)}%`;
}

export default function Shiny() {
  const { lang } = useLanguage();
  const t = T[lang] || T.en;
  const allRows = useMemo(buildRows, []);
  const [query, setQuery] = useState('');

  // Live result for the exact typed number (even if not on the 5-step grid)
  const exact = useMemo(() => {
    const q = query.trim();
    if (!q) return null;
    const n = parseFloat(q.replace(',', '.'));
    if (Number.isNaN(n)) return null;
    return { base: n, shiny: Math.round(n * MULT * 100) / 100 };
  }, [query]);

  const rows = useMemo(() => {
    const q = query.trim();
    if (!q) return allRows;
    return allRows.filter((r) => String(r.base).startsWith(q));
  }, [allRows, query]);

  return (
    <div className="shiny-page">
      <div className="shiny-search">
        <Icon name="sparkles" size={18} className="shiny-search-icon" />
        <input
          className="shiny-input"
          type="number"
          inputMode="decimal"
          placeholder={t.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="shiny-clear" onClick={() => setQuery('')} aria-label="Clear">
            <Icon name="close" size={16} />
          </button>
        )}
      </div>

      {exact && (
        <div className="shiny-hero">
          <div className="shiny-hero-part">
            <div className="shiny-hero-label">{t.base}</div>
            <div className="shiny-hero-base">{fmtPct(exact.base)}</div>
          </div>
          <Icon name="arrowright" size={22} className="shiny-hero-arrow" />
          <div className="shiny-hero-part">
            <div className="shiny-hero-label">{t.shiny}</div>
            <div className="shiny-hero-val">{fmtPct(exact.shiny)}</div>
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="shiny-empty">{t.empty}</div>
      ) : (
        <div className="shiny-grid">
          {rows.map((r) => (
            <div key={r.base} className="shiny-card">
              <span className="shiny-base">{r.base}%</span>
              <Icon name="arrowright" size={13} className="shiny-arrow" />
              <span className="shiny-val">{fmtPct(r.shiny)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
