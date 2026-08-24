'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { tierClass } from '@/components/calculators/tier';
import Icon from '@/components/ui/Icon';
import './info.css';

const SLIMES = {
  title: { en: 'Slimes', uk: 'Слайми', ru: 'Слаймы' },
  icon: 'flask',
  items: [
    { name: 'Yellow', mult: 1.2 }, { name: 'Blue', mult: 1.4 }, { name: 'Purple', mult: 1.65 },
    { name: 'Red', mult: 2.25 }, { name: 'Black', mult: 2.4 }, { name: 'Green', mult: 2.55 },
    { name: 'Orange', mult: 2.7 }, { name: 'Christmas', mult: 2.85 },
    { name: 'Neowave', mult: 3 }, { name: 'Shock', mult: 3.15 },
    { name: 'Halloween', mult: 3.25 }, { name: 'Krampus', mult: 3.4 },
    { name: 'Valentines', mult: 3.6, img: '/assets/valentines-slime-bucket.png' },
    { name: 'Toxic', mult: 3.7, img: '/assets/toxic-slime-bucket.png' },
    { name: 'Vibe', mult: 3.8, img: '/assets/vibe-slime-bucket.png' },
    { name: 'Fishy', mult: 4, img: '/assets/fishy-slime-bucket.png' },
    { name: 'Atlantis', mult: 4.5, img: '/assets/atlantis-slime-bucket.png' },
    { name: 'Furnace', mult: 4.8, img: '/assets/furnace-slime-bucket.png' },
  ],
};

const REST = [
  {
    title: { en: 'Mutation', uk: 'Мутація', ru: 'Мутация' },
    icon: 'sparkles',
    items: [
      { name: 'Glowing', mult: 1.2 }, { name: 'Rainbow', mult: 1.35 },
      { name: 'Ghost', mult: 2 }, { name: 'Cosmic', mult: 2.5 },
    ],
  },
  {
    title: { en: 'Type', uk: 'Тип', ru: 'Тип' },
    icon: 'gem',
    items: [
      { name: 'Golden', mult: 1.5 }, { name: 'Void', mult: 2 }, { name: 'Pristine', mult: 2.17 },
    ],
  },
];

const SIZES = {
  title: { en: 'Sizes', uk: 'Розміри', ru: 'Размеры' },
  icon: 'ruler',
  note: {
    en: '3 pets of the same type = next size. Goliath only via the machine!',
    uk: '3 пети одного типу = наступний розмір. Goliath лише через машину!',
    ru: '3 пета одного типа = следующий уровень. Goliath только через машину!',
  },
  stages: [
    { name: 'Baby', mult: 1 },
    { name: 'Big', mult: 1.5 },
    { name: 'Huge', mult: 2 },
    { name: 'Goliath', mult: 2.5 },
  ],
};

const LEVELS = {
  title: { en: 'Levels', uk: 'Рівні', ru: 'Уровни' },
  icon: 'star',
  head: {
    level: { en: 'Level', uk: 'Рівень', ru: 'Уровень' },
    mult: { en: 'Multiplier', uk: 'Множник', ru: 'Множитель' },
  },
  min: 1,
  max: 2.239,
  items: [
    { name: 'Lvl 1', mult: 1 }, { name: 'Lvl 50', mult: 1.245 },
    { name: 'Lvl 100', mult: 1.49 }, { name: 'Lvl 150', mult: 1.735 },
    { name: 'Lvl 200', mult: 1.98 }, { name: 'Lvl 250', mult: 2.239, top: true },
  ],
};

function fmt(mult) {
  return `×${mult}`;
}

function SectionHead({ icon, title }) {
  return (
    <div className="sec-head">
      <span className="sec-icon"><Icon name={icon} size={18} strokeWidth={1.9} /></span>
      <h2 className="sec-title">{title}</h2>
      <span className="sec-rule" />
    </div>
  );
}

function ListSection({ section, lang }) {
  return (
    <section className="boost-section">
      <SectionHead icon={section.icon} title={section.title[lang] || section.title.en} />
      <div className="boost-list">
        {section.items.map((it) => (
          <div key={it.name} className="boost-row">
            <span className="boost-name">
              {it.img && (
                <img className="boost-thumb" src={it.img} alt={it.name} loading="eager" />
              )}
              {it.name}
            </span>
            <span className={`boost-mult ${tierClass(it.mult)}`}>{fmt(it.mult)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SizeSection({ section, lang }) {
  return (
    <section className="boost-section">
      <SectionHead icon={section.icon} title={section.title[lang] || section.title.en} />
      <div className="size-flow">
        {section.stages.map((s, i) => (
          <div key={s.name} className="size-step-wrap">
            <div className={`size-chip ${i === section.stages.length - 1 ? 'is-top' : ''}`}>
              <span className="size-name">{s.name}</span>
              <span className="size-mult">{fmt(s.mult)}</span>
            </div>
            {i < section.stages.length - 1 && (
              <Icon name="chevron" size={14} className="size-arrow" />
            )}
          </div>
        ))}
      </div>
      <div className="boost-note">
        <Icon name="bulb" size={16} />
        <span>{section.note[lang] || section.note.en}</span>
      </div>
    </section>
  );
}

function LevelSection({ section, lang }) {
  const range = section.max - section.min;
  return (
    <section className="boost-section">
      <SectionHead icon={section.icon} title={section.title[lang] || section.title.en} />
      <div className="lvl-table">
        {section.items.map((it) => {
          const pct = Math.max(0, Math.min(100, ((it.mult - section.min) / range) * 100));
          return (
            <div key={it.name} className={`lvl-row ${it.top ? 'is-top' : ''}`}>
              <span className="lvl-name">
                {it.top && <Icon name="trophy" size={14} className="lvl-trophy" />}
                {it.name}
              </span>
              <span className="lvl-bar-cell">
                <span className="lvl-bar">
                  <span className="lvl-bar-fill" style={{ width: `${pct}%` }} />
                </span>
              </span>
              <span className="lvl-mult">×{it.mult.toFixed(3)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function Boosts() {
  const { lang } = useLanguage();
  return (
    <div className="boosts-panel">
      <div className="boosts-grid">
        <div className="boosts-col boosts-col-main">
          <ListSection section={SLIMES} lang={lang} />
        </div>
        <div className="boosts-col">
          {REST.map((section) => (
            <ListSection key={section.title.en} section={section} lang={lang} />
          ))}
          <SizeSection section={SIZES} lang={lang} />
          <LevelSection section={LEVELS} lang={lang} />
        </div>
      </div>
    </div>
  );
}
