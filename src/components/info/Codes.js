'use client';

import { useState, useCallback } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Icon from '@/components/ui/Icon';
import data from '@/data/codes.json';
import './info.css';

export default function Codes() {
  const { lang } = useLanguage();
  const t = data[lang] || data.en;
  const codes = data.common.codes;

  const [copied, setCopied] = useState(null);

  const copy = useCallback(async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied((c) => (c === code ? null : c)), 1500);
    } catch {}
  }, []);

  const describe = (code) => {
    const extra = t.extras?.[code.id];
    if (extra) return extra;
    if (code.hours > 0 && t.descTemplate) return t.descTemplate.replace('%hours%', code.hours);
    return '';
  };

  return (
    <div className="info">

      <div className="info-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
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
