'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Icon from '@/components/ui/Icon';
import data from '@/data/codes.json';
import './info.css';

export default function Codes() {
  const { lang } = useLanguage();
  const t = data[lang] || data.en;
  const staticCodes = data.common.codes;

  // Custom codes added via the Telegram bot (fetched live). Shown on top.
  const [custom, setCustom] = useState([]);
  useEffect(() => {
    let alive = true;
    fetch('/api/codes')
      .then((r) => (r.ok ? r.json() : { codes: [] }))
      .then((d) => { if (alive) setCustom(Array.isArray(d.codes) ? d.codes : []); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const seen = new Set(custom.map((c) => c.code.toLowerCase()));
  const codes = [...custom, ...staticCodes.filter((c) => !seen.has(c.code.toLowerCase()))];

  const [copied, setCopied] = useState(null);

  const copy = useCallback(async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied((c) => (c === code ? null : c)), 1500);
    } catch {}
  }, []);

  const describe = (code) => {
    if (code.reward) return code.reward;
    const extra = t.extras?.[code.id];
    if (extra) return extra;
    if (code.hours > 0 && t.descTemplate) return t.descTemplate.replace('%hours%', code.hours);
    return '';
  };

  return (
    <div className="info">

      <div className="info-grid codes-grid">
        {codes.map((code) => {
          const desc = describe(code);
          return (
            <div key={code.id} className="code-card">
              <div className="code-value">
                <span className="code-tag">
                  {code.code}
                  {code.isNew && <span className="chip" style={{ marginLeft: 8 }}>NEW</span>}
                </span>
                <button className="code-copy" onClick={() => copy(code.code)} aria-label="Copy code">
                  <Icon name={copied === code.code ? 'check' : 'copy'} size={16} />
                </button>
              </div>
              {desc && <div className="code-reward">{desc}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
