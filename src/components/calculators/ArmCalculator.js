'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Select from './Select';
import './calculators.css';

const T = {
  en: {
    title: 'Arm Stats Calculator',
    desc: 'Enter your base arm stats and pick a golden tier to see the maximum stats.',
    inputLabel: 'If arm base',
    placeholder: 'Enter number...',
    resultLabel: 'Max stats',
    settings: 'Settings',
    goldenLabel: 'Golden',
    invalid: 'Please enter a valid number',
    golden: (n) => `${n}/5 golden`,
  },
  uk: {
    title: 'Калькулятор Статів Руки',
    desc: 'Введіть базові стати руки та оберіть рівень golden, щоб побачити максимальні стати.',
    inputLabel: 'Якщо рука без бафів',
    placeholder: 'Введіть число...',
    resultLabel: 'Максимальні стати',
    settings: 'Налаштування',
    goldenLabel: 'Golden',
    invalid: 'Будь ласка, введіть дійсне число',
    golden: (n) => `${n}/5 золота`,
  },
  ru: {
    title: 'Калькулятор Статов Руки',
    desc: 'Введите базовые статы руки и выберите уровень golden, чтобы увидеть максимум.',
    inputLabel: 'Если рука без бафов',
    placeholder: 'Введите число...',
    resultLabel: 'Максимальные статы',
    settings: 'Настройки',
    goldenLabel: 'Golden',
    invalid: 'Пожалуйста, введите действительное число',
    golden: (n) => `${n}/5 золотая`,
  },
};

const GOLDEN = [
  { n: 1, mult: 1.5 },
  { n: 2, mult: 1.65 },
  { n: 3, mult: 1.8 },
  { n: 4, mult: 1.95 },
  { n: 5, mult: 2.1 },
];

function formatNumber(value) {
  return value.toLocaleString('uk-UA', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 8,
  });
}

export default function ArmCalculator() {
  const { lang } = useLanguage();
  const t = T[lang] || T.en;

  const [raw, setRaw] = useState('');
  const [mult, setMult] = useState(2.1);

  const { result, error } = useMemo(() => {
    if (!raw.trim()) return { result: null, error: '' };
    const base = parseFloat(raw);
    if (Number.isNaN(base)) return { result: null, error: t.invalid };
    return { result: base * mult, error: '' };
  }, [raw, mult, t]);

  return (
    <>
      <div className="calc calc-single">
        <div className="calc-left">

          <div className="calc-field">
            <label className="field-label" htmlFor="arm-input">
              {t.inputLabel}
            </label>
            <input
              id="arm-input"
              className="input"
              type="number"
              step="any"
              placeholder={t.placeholder}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
            />
          </div>

          <div className="calc-field">
            <label className="field-label">{t.goldenLabel}</label>
            <Select
              value={mult}
              onChange={setMult}
              options={GOLDEN.map((g) => ({ value: g.mult, label: `${t.golden(g.n)} (x${g.mult})` }))}
            />
          </div>

          {error && <div className="calc-error">{error}</div>}

          <div className="calc-output">
            <div className="label">{t.resultLabel}</div>
            <div className="result-value">{result === null ? '0' : formatNumber(result)}</div>
          </div>
        </div>
      </div>
    </>
  );
}
