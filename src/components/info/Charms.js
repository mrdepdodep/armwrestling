'use client';

import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import data from '@/data/charms.json';
import './info.css';

export default function Charms() {
  const { lang } = useLanguage();
  const t = data[lang] || data.en;
  const charms = data.common.charms;

  return (
    <div className="info">
      <div className="media-grid">
        {charms.map((c) => {
          const name = t.names?.[c.id] || c.id;
          const desc = t.descriptions?.[c.id] || c.description;
          return (
            <div key={c.id} className="media-card">
              {c.imageUrl && (
                <div className="media-thumb">
                  <Image
                    src={c.imageUrl}
                    alt={name}
                    fill
                    sizes="(max-width: 600px) 50vw, 220px"
                    style={{ objectFit: 'cover' }}
                    loading="eager"
                    priority
                  />
                </div>
              )}
              <div className="body">
                <span className="title">{name}</span>
                <span className="sub">{desc}</span>
                {c.maxStack != null && (
                  <span className="chip" style={{ alignSelf: 'flex-start' }}>
                    {t.maxStackLabel || t.maxStockLabel} {c.maxStack}%
                  </span>
                )}
                {c.maxStock != null && (
                  <span className="chip" style={{ alignSelf: 'flex-start' }}>
                    {t.maxStockLabel} {c.maxStock}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
