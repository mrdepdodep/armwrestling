'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Icon from '@/components/ui/Icon';
import './calculators.css';

const MULT = 1.5;

const T = {
  en: {
    title: 'Molten Machine',
    desc: 'Trainer upgrade — enter your % and get the result after Molten.',
    inputLabel: 'Your value',
    placeholder: 'Enter number...',
    resultLabel: 'After Molten',
    invalid: 'Please enter a valid number',
  },
  uk: {
    title: 'Molten Machine',
    desc: 'Апгрейд тренера — введи свій % і отримай результат після Molten.',
    inputLabel: 'Твоє значення',
    placeholder: 'Введіть число...',
    resultLabel: 'Після Molten',
    invalid: 'Будь ласка, введіть дійсне число',
  },
  ru: {
    title: 'Molten Machine',
    desc: 'Апгрейд тренера — введи свой % и получи результат после Molten.',
    inputLabel: 'Твоё значение',
    placeholder: 'Введите число...',
    resultLabel: 'После Molten',
    invalid: 'Пожалуйста, введите действительное число',
  },
};

function formatNumber(value) {
  return value.toLocaleString('uk-UA', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 8,
  });
}

export default function MoltenTrainerCalculator() {
  const { lang } = useLanguage();
  const t = T[lang] || T.en;

  const [raw, setRaw] = useState('');

  const { base, result, error } = useMemo(() => {
    if (!raw.trim()) return { base: null, result: null, error: '' };
    const b = parseFloat(raw);
    if (Number.isNaN(b)) return { base: null, result: null, error: t.invalid };
    return { base: b, result: b * MULT, error: '' };
  }, [raw, t]);

  return (
    <div className="molten-calc">
      {/* Hero: machine art on the background (lazy-loaded, AVIF/WebP/PNG) */}
      <div className="molten-hero">
        <picture>
          <source srcSet="/assets/molten_machine.avif" type="image/avif" />
          <source srcSet="/assets/molten_machine.webp" type="image/webp" />
          <img
            className="molten-hero-img"
            src="/assets/molten_machine.png"
            alt=""
            width={610}
            height={430}
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
        </picture>
        <div className="molten-hero-overlay">
          <h2 className="molten-hero-title">{t.title}</h2>
          <p className="molten-hero-desc">{t.desc}</p>
        </div>
      </div>

      {/* Body: input + result */}
      <div className="molten-body">
        <div className="calc-field">
          <label className="field-label" htmlFor="molten-input">
            {t.inputLabel}
          </label>
          <input
            id="molten-input"
            className="input"
            type="number"
            step="any"
            placeholder={t.placeholder}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
          />
        </div>

        {error && <div className="calc-error">{error}</div>}

        <div className="molten-result">
          <div className="molten-flow">
            <span className="molten-flow-base">
              {base === null ? '—' : `${formatNumber(base)}%`}
            </span>
            <Icon name="arrowright" size={18} className="molten-flow-arrow" />
            <span className="molten-flow-op">× {MULT}</span>
          </div>
          <div className="molten-out">
            <div className="molten-out-label">{t.resultLabel}</div>
            <div className="molten-out-value">
              {result === null ? '0%' : `${formatNumber(result)}%`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
