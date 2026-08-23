'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import './calculators.css';

const T = {
  en: {
    title: 'Roulette Calculator',
    desc: 'Enter the total spins you need and spins per turn to estimate the total time.',
    totalSpins: 'Total Spins Needed', spinsPerTurn: 'Spins per Turn',
    resultTitle: 'Total Time Needed', totalPlaceholder: 'Enter total spins needed...', spinsPlaceholder: 'Enter spins per turn...',
    invalid: 'Please enter valid positive numbers', missing: 'Please enter both values',
    u: { s: 's', m: 'm', h: 'h', d: 'd' },
  },
  uk: {
    title: 'Калькулятор Рулетки',
    desc: 'Введіть загальну кількість спінів і спінів за хід, щоб оцінити час.',
    totalSpins: 'Загальна Кількість Спінів', spinsPerTurn: 'Спінів за Хід',
    resultTitle: 'Загальний Час', totalPlaceholder: 'Введіть загальну кількість спінів...', spinsPlaceholder: 'Введіть спінів за хід...',
    invalid: 'Будь ласка, введіть дійсні позитивні числа', missing: 'Будь ласка, введіть обидва значення',
    u: { s: 'с', m: 'хв', h: 'г', d: 'д' },
  },
  ru: {
    title: 'Калькулятор Рулетки',
    desc: 'Введите общее количество спинов и спинов за ход, чтобы оценить время.',
    totalSpins: 'Общее Количество Спинов', spinsPerTurn: 'Спинов за Ход',
    resultTitle: 'Общее Время', totalPlaceholder: 'Введите общее количество спинов...', spinsPlaceholder: 'Введите спинов за ход...',
    invalid: 'Пожалуйста, введите действительные положительные числа', missing: 'Пожалуйста, введите оба значения',
    u: { s: 'с', m: 'м', h: 'ч', d: 'д' },
  },
};

function formatTime(seconds, u) {
  if (seconds < 60) return `${Math.ceil(seconds)}${u.s}`;
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    const s = Math.ceil(seconds % 60);
    return s === 0 ? `${m}${u.m}` : `${m}${u.m} ${s}${u.s}`;
  }
  if (seconds < 86400) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.ceil(seconds % 60);
    let r = `${h}${u.h}`;
    if (m > 0) r += ` ${m}${u.m}`;
    else if (s > 0) r += ` ${s}${u.s}`;
    return r;
  }
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  let r = `${d}${u.d}`;
  if (h > 0) r += ` ${h}${u.h}`;
  else if (m > 0) r += ` ${m}${u.m}`;
  return r;
}

export default function RouletteCalculator() {
  const { lang } = useLanguage();
  const t = T[lang] || T.en;

  const [total, setTotal] = useState('');
  const [spins, setSpins] = useState('');

  const { result, error } = useMemo(() => {
    if (!total.trim() || !spins.trim()) return { result: null, error: total || spins ? t.missing : '' };
    const totalNum = parseFloat(total);
    const spinsNum = parseFloat(spins);
    if (Number.isNaN(totalNum) || totalNum <= 0 || Number.isNaN(spinsNum) || spinsNum <= 0)
      return { result: null, error: t.invalid };
    const seconds = (totalNum / spinsNum) * 6;
    return { result: formatTime(seconds, t.u), error: '' };
  }, [total, spins, t]);

  return (
    <>
      <div className="calc calc-single">
        <div className="calc-left">

          <div className="calc-field">
            <label className="field-label" htmlFor="rl-total">{t.totalSpins}</label>
            <input id="rl-total" className="input" type="number" min="1" step="1"
              placeholder={t.totalPlaceholder} value={total} onChange={(e) => setTotal(e.target.value)} />
          </div>

          <div className="calc-field">
            <label className="field-label" htmlFor="rl-spins">{t.spinsPerTurn}</label>
            <input id="rl-spins" className="input" type="number" min="1" step="1"
              placeholder={t.spinsPlaceholder} value={spins} onChange={(e) => setSpins(e.target.value)} />
          </div>

          {error && <div className="calc-error">{error}</div>}

          <div className="calc-output">
            <div className="label">{t.resultTitle}</div>
            <div className="result-value">{result ?? '0'}</div>
          </div>
        </div>
      </div>
    </>
  );
}
