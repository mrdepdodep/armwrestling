'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import data from '@/data/secret.json';
import './info.css';

// "Percentage 150% | Power 40m" -> { percent: "150%", power: "40m" }
function parseBoosts(str) {
  const out = { percent: null, power: null };
  String(str || '')
    .split('|')
    .map((s) => s.trim())
    .forEach((part) => {
      const pm = part.match(/([\d.,]+%)/);
      if (/percentage/i.test(part) && pm) out.percent = pm[1];
      else if (/power/i.test(part)) out.power = part.replace(/power/i, '').trim();
    });
  return out;
}

export default function Secret() {
  const { lang } = useLanguage();
  const t = data[lang] || data.en;

  return (
    <div className="secret-page">

      <div className="secret-grid">
        {t.pets.map((p) => {
          const b = parseBoosts(p.boosts);
          return (
            <div key={p.name} className="secret-card">
              <div className="secret-card-head">
                <span className="secret-name">{p.name}</span>
                {p.world && <span className="secret-world">{p.world}</span>}
              </div>
              <div className="secret-stats">
                {b.percent && (
                  <div className="secret-stat">
                    <span className="secret-stat-label">Percentage</span>
                    <span className="secret-stat-value">{b.percent}</span>
                  </div>
                )}
                {b.power && (
                  <div className="secret-stat">
                    <span className="secret-stat-label">Power</span>
                    <span className="secret-stat-value">{b.power}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
