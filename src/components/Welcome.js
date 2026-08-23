'use client';

import Link from 'next/link';
import { CATEGORIES, DEFAULT_SLUG } from '@/lib/nav';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import worlds from '@/data/worlds.json';
import './welcome.css';

const T = {
  en: {
    badge: 'Arm Wrestling Simulator · Helper',
    title: 'Welcome to Arm Helper',
    desc: 'Calculators and info for Arm Wrestling Simulator. Count your stats, track boosts and find everything you need in one place.',
    cta: 'Get started',
    stats: { calc: 'Calculators', info: 'Info pages', worlds: 'Worlds' },
  },
  uk: {
    badge: 'Arm Wrestling Simulator · Помічник',
    title: 'Ласкаво просимо в Arm Helper',
    desc: 'Калькулятори та інформація для Arm Wrestling Simulator. Рахуй свої стати, стеж за бустами й знаходь усе потрібне в одному місці.',
    cta: 'Почати',
    stats: { calc: 'Калькулятори', info: 'Сторінки', worlds: 'Світи' },
  },
  ru: {
    badge: 'Arm Wrestling Simulator · Помощник',
    title: 'Добро пожаловать в Arm Helper',
    desc: 'Калькуляторы и информация для Arm Wrestling Simulator. Считай свои статы, следи за бустами и находи всё нужное в одном месте.',
    cta: 'Начать',
    stats: { calc: 'Калькуляторы', info: 'Страницы', worlds: 'Миры' },
  },
};

export default function Welcome() {
  const { lang } = useLanguage();
  const t = T[lang] || T.en;

  const calcCount = CATEGORIES.find((c) => c.id === 'calculators')?.pages.length ?? 0;
  const infoCount = CATEGORIES.find((c) => c.id === 'info')?.pages.length ?? 0;
  const worldCount = (worlds[lang]?.worlds || worlds.en?.worlds || []).length;

  return (
    <div className="welcome">
      <div className="welcome-inner">
        <span className="welcome-badge">{t.badge}</span>
        <h1 className="welcome-title">{t.title}</h1>
        <p className="welcome-desc">{t.desc}</p>

        <Link href={`/${DEFAULT_SLUG}`} className="welcome-cta">
          {t.cta}
        </Link>

        <div className="welcome-stats">
          <div className="welcome-stat">
            <span className="welcome-stat-num">{calcCount}</span>
            <span className="welcome-stat-label">{t.stats.calc}</span>
          </div>
          <div className="welcome-stat">
            <span className="welcome-stat-num">{infoCount}</span>
            <span className="welcome-stat-label">{t.stats.info}</span>
          </div>
          <div className="welcome-stat">
            <span className="welcome-stat-num">{worldCount}</span>
            <span className="welcome-stat-label">{t.stats.worlds}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
