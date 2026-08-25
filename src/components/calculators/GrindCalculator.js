'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Select from './Select';
import SettingsGroup, { SettingsAccordion } from './SettingsGroup';
import CalcSettingsSheet from './CalcSettingsSheet';
import { tierClass } from './tier';
import './calculators.css';

// Number-scale suffixes for the grind value input
const UNITS = [
  { value: '1', label: '—', factor: 1 },
  { value: 'qd', label: 'qd', factor: 1e15 },
  { value: 'sd', label: 'sd', factor: 1e18 },
  { value: 'st', label: 'st', factor: 1e21 },
  { value: 'ocdc', label: 'ocdc', factor: 1e24 },
  { value: 'nmdc', label: 'nmdc', factor: 1e27 },
];

const T = {
  en: {
    title: 'Grind Calculator', desc: 'Enter your base grind value, then pick your active boosts.',
    inputLabel: 'Enter Base Value', placeholder: 'Enter your base grind value...',
    resultLabel: 'Final Grind Value', settings: 'Settings', invalid: 'Please enter a valid number',
    tp: 'TP Boosts', food: 'Food Boosts', other: 'Other Boosts', friend: 'Friend Boost',
  },
  uk: {
    title: 'Калькулятор Фарму', desc: 'Введіть базове значення фарму та оберіть активні бусти.',
    inputLabel: 'Введіть Базове Значення', placeholder: 'Введіть базове значення фарму...',
    resultLabel: 'Фінальне Значення Фарму', settings: 'Налаштування', invalid: 'Будь ласка, введіть дійсне число',
    tp: 'TP Бусти', food: 'Їжа Бусти', other: 'Інші Бусти', friend: 'Friend Boost',
  },
  ru: {
    title: 'Калькулятор Фарма', desc: 'Введите базовое значение фарма и выберите активные бусты.',
    inputLabel: 'Введите Базовое Значение', placeholder: 'Введите базовое значение фарма...',
    resultLabel: 'Финальное Значение Фарма', settings: 'Настройки', invalid: 'Пожалуйста, введите действительное число',
    tp: 'TP Бусты', food: 'Еда Бусты', other: 'Другие Бусты', friend: 'Friend Boost',
  },
};

// Exclusive groups: only one active at a time.
const TP = [
  { id: 'tp1', label: 'TP1', mult: 1.3, tag: '+30%' },
  { id: 'tp2', label: 'TP2', mult: 1.6, tag: '+60%' },
  { id: 'tp3', label: 'TP3', mult: 1.9, tag: '+90%' },
];
const DONUT = [
  { id: 'donut1', label: 'Pink Donut L1', mult: 1.05, tag: '+5%' },
  { id: 'donut2', label: 'Vanilla Donut L2', mult: 1.1, tag: '+10%' },
  { id: 'donut3', label: 'Chocolate Donut L3', mult: 1.15, tag: '+15%' },
];
const COOKIE = [
  { id: 'cookie1', label: 'Cookie', mult: 1.03, tag: '+3%' },
  { id: 'cookie2', label: 'Tasty Cookie', mult: 1.05, tag: '+5%' },
  { id: 'cookie3', label: 'Enchanted Cookie', mult: 1.07, tag: '+7%' },
];
// Independent toggles.
const OTHER = [
  { id: 'time', label: 'Time Boost', mult: 2.7, tag: '+170%' },
  { id: 'member', label: 'Member', mult: 2.0, tag: '2x' },
  { id: 'premium', label: 'Premium', mult: 1.2, tag: '+20%' },
  { id: 'strength_star', label: 'Strength Star', mult: 1.5, tag: '+50%' },
  { id: 'sandstorm_event', label: 'Sandstorm Event', mult: 1.3, tag: '2x' },
];

function ExclusiveRow({ id, label, items, value, onChange }) {
  return (
    <SettingsGroup id={id} label={label}>
      <div className="calc-options">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            data-tier
            className={`option-btn ${tierClass(it.mult)}${value === it.id ? ' active' : ''}`}
            onClick={() => onChange(value === it.id ? null : it.id)}
          >
            {it.label} <span className="muted">{it.tag}</span>
          </button>
        ))}
      </div>
    </SettingsGroup>
  );
}

export default function GrindCalculator() {
  const { lang } = useLanguage();
  const t = T[lang] || T.en;

  const [raw, setRaw] = useState('');
  const [unit, setUnit] = useState('1');
  const [tp, setTp] = useState(null);
  const [donut, setDonut] = useState(null);
  const [cookie, setCookie] = useState(null);
  const [other, setOther] = useState({});
  const [friends, setFriends] = useState(8);

  const multiplier = useMemo(() => {
    let m = 1;
    const byId = (arr, id) => arr.find((x) => x.id === id)?.mult ?? 1;
    if (tp) m *= byId(TP, tp);
    if (donut) m *= byId(DONUT, donut);
    if (cookie) m *= byId(COOKIE, cookie);
    OTHER.forEach((o) => { if (other[o.id]) m *= o.mult; });
    return m;
  }, [tp, donut, cookie, other]);

  const { result, error } = useMemo(() => {
    if (!raw.trim()) return { result: null, error: '' };
    const base = parseFloat(raw);
    if (Number.isNaN(base)) return { result: null, error: t.invalid };
    const factor = UNITS.find((u) => u.value === unit)?.factor ?? 1;
    let final = base * factor * multiplier;
    for (let i = 0; i < friends; i++) final *= 1.15;
    return { result: final, error: '' };
  }, [raw, unit, multiplier, friends, t]);

  return (
    <>
      <div className="calc">
        {/* LEFT: description + input + output */}
        <div className="calc-left">

          <div className="calc-field">
            <label className="field-label" htmlFor="grind-input">{t.inputLabel}</label>
            <div className="input-row">
              <input id="grind-input" className="input" type="number" step="any"
                placeholder={t.placeholder} value={raw} onChange={(e) => setRaw(e.target.value)} />
              <div className="input-unit">
                <Select options={UNITS} value={unit} onChange={setUnit} />
              </div>
            </div>
          </div>

          {error && <div className="calc-error">{error}</div>}

          <div className="calc-output">
            <div className="label">{t.resultLabel}</div>
            <div className="result-value">
              {result === null ? '0' : result.toLocaleString('uk-UA', {
                minimumFractionDigits: result % 1 === 0 ? 0 : 2, maximumFractionDigits: 8,
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: settings (inline on desktop, gear + bottom sheet on mobile) */}
        <CalcSettingsSheet title={t.settings}>
          <SettingsAccordion defaultOpen="tp">
            <ExclusiveRow id="tp" label={t.tp} items={TP} value={tp} onChange={setTp} />
            <ExclusiveRow id="donut" label={`${t.food} — Donut`} items={DONUT} value={donut} onChange={setDonut} />
            <ExclusiveRow id="cookie" label={`${t.food} — Cookie`} items={COOKIE} value={cookie} onChange={setCookie} />

            <SettingsGroup id="other" label={t.other}>
              <div className="calc-options">
                {OTHER.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    data-tier
                    className={`option-btn ${tierClass(o.mult)}${other[o.id] ? ' active' : ''}`}
                    onClick={() => setOther((prev) => ({ ...prev, [o.id]: !prev[o.id] }))}
                  >
                    {o.label} <span className="muted">{o.tag}</span>
                  </button>
                ))}
              </div>
            </SettingsGroup>

            <SettingsGroup id="friend" label={`${t.friend} (${friends * 15}%)`}>
              <div className="counter">
                <button type="button" className="counter-btn" disabled={friends <= 0}
                  onClick={() => setFriends((f) => Math.max(0, f - 1))}>−</button>
                <span className="counter-value">{friends} / 8</span>
                <button type="button" className="counter-btn" disabled={friends >= 8}
                  onClick={() => setFriends((f) => Math.min(8, f + 1))}>+</button>
              </div>
            </SettingsGroup>
          </SettingsAccordion>
        </CalcSettingsSheet>
      </div>
    </>
  );
}
