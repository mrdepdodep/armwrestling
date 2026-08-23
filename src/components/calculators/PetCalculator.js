'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Icon from '@/components/ui/Icon';
import Switch from './Switch';
import Select from './Select';
import SettingsGroup, { SettingsAccordion } from './SettingsGroup';
import { tierClass } from './tier';
import './calculators.css';

// Number-scale suffixes for the pet stat input
const UNITS = [
  { value: '1', label: '—', factor: 1 },
  { value: 'K', label: 'K', factor: 1e3 },
  { value: 'M', label: 'M', factor: 1e6 },
  { value: 'B', label: 'B', factor: 1e9 },
  { value: 'T', label: 'T', factor: 1e12 },
  { value: 'Qd', label: 'Qd', factor: 1e15 },
];

const T = {
  en: {
    title: 'Pet Calculator', desc: 'Enter your pet base stats, then pick modifiers to see the final stats.',
    inputLabel: 'Enter Pet Stats', placeholder: "Enter your pet's base stats...",
    resultLabel: 'Final Pet Stats', settings: 'Settings', slimes: 'Slime', mutation: 'Mutation', evolution: 'Evolution & Size',
    type: 'Type', shiny: 'Shiny', level: 'Level', levelHint: 'Your pet level (1–250)', invalid: 'Please enter a valid number',
  },
  uk: {
    title: 'Калькулятор Петів', desc: 'Введіть базові стати пета та оберіть модифікатори, щоб побачити фінальні стати.',
    inputLabel: 'Введіть статистику пета', placeholder: 'Введіть базові характеристики...',
    resultLabel: 'Фінальні характеристики', settings: 'Налаштування', slimes: 'Слайм', mutation: 'Мутація', evolution: 'Еволюція та розмір',
    type: 'Тип', shiny: 'Блискучий', level: 'Рівень', levelHint: 'Рівень пета (1–250)', invalid: 'Будь ласка, введіть дійсне число',
  },
  ru: {
    title: 'Калькулятор Питомцев', desc: 'Введите базовые статы питомца и выберите модификаторы, чтобы увидеть финальные статы.',
    inputLabel: 'Введите статистику питомца', placeholder: 'Введите базовые характеристики...',
    resultLabel: 'Финальные характеристики', settings: 'Настройки', slimes: 'Слайм', mutation: 'Мутация', evolution: 'Эволюция и размер',
    type: 'Тип', shiny: 'Блестящий', level: 'Уровень', levelHint: 'Уровень питомца (1–250)', invalid: 'Пожалуйста, введите действительное число',
  },
};

const GROUPS = {
  // Kept in sync with the Boosts info page (src/components/info/Boosts.js)
  slime: [
    { id: 'slime_yellow', name: 'Yellow', mult: 1.2 }, { id: 'slime_blue', name: 'Blue', mult: 1.4 },
    { id: 'slime_purple', name: 'Purple', mult: 1.65 }, { id: 'slime_red', name: 'Red', mult: 2.25 },
    { id: 'slime_black', name: 'Black', mult: 2.4 }, { id: 'slime_green', name: 'Green', mult: 2.55 },
    { id: 'slime_orange', name: 'Orange', mult: 2.7 }, { id: 'slime_christmas', name: 'Christmas', mult: 2.85 },
    { id: 'slime_neowave', name: 'Neowave', mult: 3.0 }, { id: 'slime_shock', name: 'Shock', mult: 3.15 },
    { id: 'slime_halloween', name: 'Halloween', mult: 3.25 }, { id: 'slime_krampus', name: 'Krampus', mult: 3.4 },
    { id: 'slime_valentines', name: 'Valentines', mult: 3.6 }, { id: 'slime_toxic', name: 'Toxic', mult: 3.7 },
    { id: 'slime_vibe', name: 'Vibe', mult: 3.8 }, { id: 'slime_fishy', name: 'Fishy', mult: 4.0 },
    { id: 'slime_atlantis', name: 'Atlantis', mult: 4.5 }, { id: 'slime_furnace', name: 'Furnace', mult: 4.8 },
  ],
  mutation: [
    { id: 'mutation_glowing', name: 'Glowing', mult: 1.2 }, { id: 'mutation_rainbow', name: 'Rainbow', mult: 1.35 },
    { id: 'mutation_ghost', name: 'Ghost', mult: 2.0 }, { id: 'mutation_cosmic', name: 'Cosmic', mult: 2.5 },
  ],
  evolution: [
    { id: 'evolution_big', name: 'Big', mult: 1.5 }, { id: 'evolution_huge', name: 'Huge', mult: 2.0 },
    { id: 'evolution_goliath', name: 'Goliath', mult: 2.5 },
  ],
  type: [
    { id: 'type_golden', name: 'Golden', mult: 1.5 }, { id: 'type_void', name: 'Void', mult: 2.0 },
    { id: 'type_pristine', name: 'Pristine', mult: 2.17 },
  ],
};

const SHINY = 1.15;

// Level -> multiplier, matching the Boosts page level table.
// Piecewise-linear interpolation between the known breakpoints.
const LEVEL_BP = [
  [1, 1], [50, 1.245], [100, 1.49], [150, 1.735], [200, 1.98], [250, 2.239],
];
const LEVEL_MIN = 1;
const LEVEL_MAX = 250;

function levelMult(lvl) {
  const l = Math.max(LEVEL_MIN, Math.min(LEVEL_MAX, lvl));
  for (let i = 0; i < LEVEL_BP.length - 1; i++) {
    const [l0, m0] = LEVEL_BP[i];
    const [l1, m1] = LEVEL_BP[i + 1];
    if (l <= l1) return m0 + ((m1 - m0) * (l - l0)) / (l1 - l0);
  }
  return LEVEL_BP[LEVEL_BP.length - 1][1];
}

// Abbreviate large results with number-scale suffixes (K, M, B, T, Qd, ...)
const SCALE = ['', 'K', 'M', 'B', 'T', 'Qd', 'Qn', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
function formatResult(n) {
  if (!isFinite(n)) return '∞';
  const abs = Math.abs(n);
  if (abs < 1000) {
    return n.toLocaleString(undefined, {
      minimumFractionDigits: n % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 8,
    });
  }
  let tier = Math.floor(Math.log10(abs) / 3);
  tier = Math.min(tier, SCALE.length - 1);
  const scaled = n / Math.pow(10, tier * 3);
  const str = scaled.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${str}${SCALE[tier]}`;
}

function OptionRow({ id, label, items, value, onChange }) {
  return (
    <SettingsGroup id={id} label={label}>
      <div className="calc-options">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            data-tier
            className={`option-btn ${tierClass(it.mult)}${value === it.id ? ' active' : ''}`}
            onClick={() => onChange(it.id)}
          >
            {it.name} <span className="muted">x{it.mult}</span>
          </button>
        ))}
      </div>
    </SettingsGroup>
  );
}

export default function PetCalculator() {
  const { lang } = useLanguage();
  const t = T[lang] || T.en;

  const [raw, setRaw] = useState('');
  const [unit, setUnit] = useState('1');
  const [slime, setSlime] = useState('slime_furnace');
  const [mutation, setMutation] = useState('mutation_cosmic');
  const [evolution, setEvolution] = useState('evolution_goliath');
  const [type, setType] = useState('type_pristine');
  const [shiny, setShiny] = useState(true);
  const [level, setLevel] = useState('250');

  const multiplier = useMemo(() => {
    const pick = (group, id) => GROUPS[group].find((x) => x.id === id)?.mult ?? 1;
    let m = pick('slime', slime) * pick('mutation', mutation) * pick('evolution', evolution) * pick('type', type);
    if (shiny) m *= SHINY;
    const lvlNum = parseInt(level, 10);
    if (!Number.isNaN(lvlNum)) m *= levelMult(lvlNum);
    return m;
  }, [slime, mutation, evolution, type, shiny, level]);

  const { result, error } = useMemo(() => {
    if (!raw.trim()) return { result: null, error: '' };
    const base = parseFloat(raw);
    if (Number.isNaN(base)) return { result: null, error: t.invalid };
    const factor = UNITS.find((u) => u.value === unit)?.factor ?? 1;
    return { result: base * factor * multiplier, error: '' };
  }, [raw, unit, multiplier, t]);

  return (
    <>
      <div className="calc">
        {/* LEFT: description + input + output */}
        <div className="calc-left">

          <div className="calc-field">
            <label className="field-label" htmlFor="pet-input">{t.inputLabel}</label>
            <div className="input-row">
              <input id="pet-input" className="input" type="number" step="any"
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
              {result === null ? '0' : formatResult(result)}
            </div>
          </div>
        </div>

        {/* RIGHT: settings */}
        <div className="calc-settings">
          <div className="calc-settings-title">
            <Icon name="gear" size={16} />
            {t.settings}
          </div>

          <SettingsAccordion defaultOpen="slime">
            <OptionRow id="slime" label={t.slimes} items={GROUPS.slime} value={slime} onChange={setSlime} />
            <OptionRow id="mutation" label={t.mutation} items={GROUPS.mutation} value={mutation} onChange={setMutation} />
            <OptionRow id="evolution" label={t.evolution} items={GROUPS.evolution} value={evolution} onChange={setEvolution} />
            <OptionRow id="type" label={t.type} items={GROUPS.type} value={type} onChange={setType} />

            <SettingsGroup id="extra" label="Extra">
              <Switch checked={shiny} onChange={setShiny} name={t.shiny} sub={`x${SHINY}`} />
              <label className="switch-row">
                <span className="switch-row-info">
                  <span className="switch-row-name">{t.level}</span>
                  <span className="switch-row-sub">
                    {t.levelHint} · x{levelMult(parseInt(level, 10) || 1).toFixed(3)}
                  </span>
                </span>
                <input
                  className="input input-compact"
                  type="number"
                  min={LEVEL_MIN}
                  max={LEVEL_MAX}
                  step="1"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  onBlur={(e) => {
                    const n = parseInt(e.target.value, 10);
                    if (Number.isNaN(n)) return setLevel('1');
                    setLevel(String(Math.max(LEVEL_MIN, Math.min(LEVEL_MAX, n))));
                  }}
                />
              </label>
            </SettingsGroup>
          </SettingsAccordion>
        </div>
      </div>
    </>
  );
}
