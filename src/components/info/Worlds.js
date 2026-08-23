'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import data from '@/data/worlds.json';
import './info.css';

// "World 0: Garden" -> { num: "0", name: "Garden" }
function splitTitle(title) {
  const m = String(title || '').match(/^\s*\S+\s*(\d+)\s*[:\-–]\s*(.+)$/);
  if (m) return { num: m[1], name: m[2].trim() };
  return { num: null, name: title };
}

export default function Worlds() {
  const { lang } = useLanguage();
  const t = data[lang] || data.en;

  return (
    <div className="worlds-page">

      <div className="worlds-list">
        {t.worlds.map((w, i) => {
          const { num, name } = splitTitle(w.title);
          const features = String(w.description || '')
            .split('|')
            .map((s) => s.trim())
            .filter(Boolean);
          return (
            <div key={i} className="world-row">
              <div className="world-badge">
                <span className="world-num">{num != null ? num : i}</span>
              </div>
              <div className="world-body">
                <div className="world-name">{name}</div>
                {features.length > 0 && (
                  <div className="world-features">
                    {features.map((f, j) => (
                      <span key={j} className="world-feature">{f}</span>
                    ))}
                  </div>
                )}
                {w.details && <div className="world-req">{w.details}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
