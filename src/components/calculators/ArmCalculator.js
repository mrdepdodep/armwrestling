'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Select from './Select';
import './calculators.css';

const T = {
  en: {
    title: 'Arm Stats Calculator',
    desc: 'Enter your base arm stats, pick a golden tier and void to see the maximum stats.',
    inputLabel: 'If arm base',
    placeholder: 'Enter number...',
    resultLabel: 'Max stats',
    settings: 'Settings',
    goldenLabel: 'Golden',
    invalid: 'Please enter a valid number',
    golden: (n) => `${n}/5 golden`,
    noGolden: 'No golden',
    voidLabel: 'Void',
    noVoid: 'No void',
    withVoid: 'Void',
  },
  uk: {
    title: 'Калькулятор Статів Руки',
    desc: 'Введіть базові стати руки, оберіть рівень golden та void, щоб побачити максимальні стати.',
    inputLabel: 'Якщо рука без бафів',
    placeholder: 'Введіть число...',
    resultLabel: 'Максимальні стати',
    settings: 'Налаштування',
    goldenLabel: 'Golden',
    invalid: 'Будь ласка, введіть дійсне число',
    golden: (n) => `${n}/5 золота`,
    noGolden: 'Без золота',
    voidLabel: 'Void',
    noVoid: 'Без войду',
    withVoid: 'Войд',
  },
  ru: {
    title: 'Калькулятор Статов Руки',
    desc: 'Введите базовые статы руки, выберите уровень golden и void, чтобы увидеть максимум.',
    inputLabel: 'Если рука без бафов',
    placeholder: 'Введите число...',
    resultLabel: 'Максимальные статы',
    settings: 'Настройки',
    goldenLabel: 'Golden',
    invalid: 'Пожалуйста, введите действительное число',
    golden: (n) => `${n}/5 золотая`,
    noGolden: 'Без золота',
    voidLabel: 'Void',
    noVoid: 'Без войда',
    withVoid: 'Войд',
  },
};

const GOLDEN = [
  { n: 1, mult: 1.5 },
  { n: 2, mult: 1.65 },
  { n: 3, mult: 1.8 },
  { n: 4, mult: 1.95 },
  { n: 5, mult: 2.1 },
];

// Void is only available after golden and multiplies the golden arm by 4/3: e.g. 1/5 golden x1.5 -> void x2.
const VOID_MULT = 4 / 3;

function formatMult(m) {
  return m.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

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
  const [isVoid, setIsVoid] = useState(false);
  const hasGolden = mult !== 1;
  const voidOn = hasGolden && isVoid;

  const { result, error } = useMemo(() => {
    if (!raw.trim()) return { result: null, error: '' };
    const base = parseFloat(raw);
    if (Number.isNaN(base)) return { result: null, error: t.invalid };
    return { result: base * mult * (voidOn ? VOID_MULT : 1), error: '' };
  }, [raw, mult, voidOn, t]);

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
              options={[
                { value: 1, label: t.noGolden },
                ...GOLDEN.map((g) => ({ value: g.mult, label: `${t.golden(g.n)} (x${g.mult})` })),
              ]}
            />
          </div>

          {hasGolden && (
          <div className="calc-field">
            <label className="field-label">{t.voidLabel}</label>
            <Select
              value={isVoid}
              onChange={setIsVoid}
              options={[
                { value: false, label: t.noVoid },
                { value: true, label: `${t.withVoid} (x${formatMult(mult * VOID_MULT)})` },
              ]}
            />
          </div>
          )}

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
