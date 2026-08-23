'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Icon from '@/components/ui/Icon';
import Switch from './Switch';
import SettingsGroup, { SettingsAccordion } from './SettingsGroup';
import { tierClass } from './tier';
import './calculators.css';

const T = {
  en: {
    title: 'Pet Calculator', desc: 'Enter your pet base stats, then pick modifiers to see the final stats.',
    inputLabel: 'Enter Pet Stats', placeholder: "Enter your pet's base stats...",
    resultLabel: 'Final Pet Stats', settings: 'Settings', slimes: 'Slime', mutation: 'Mutation', evolution: 'Evolution & Size',
    type: 'Type', shiny: 'Shiny', maxlvl: 'Max lvl', invalid: 'Please enter a valid number',
  },
  uk: {
    title: 'Калькулятор Петів', desc: 'Введіть базові стати пета та оберіть модифікатори, щоб побачити фінальні стати.',
    inputLabel: 'Введіть статистику пета', placeholder: 'Введіть базові характеристики...',
    resultLabel: 'Фінальні характеристики', settings: 'Налаштування', slimes: 'Слайм', mutation: 'Мутація', evolution: 'Еволюція та розмір',
    type: 'Тип', shiny: 'Блискучий', maxlvl: 'Макс. рівень', invalid: 'Будь ласка, введіть дійсне число',
  },
  ru: {
    title: 'Калькулятор Питомцев', desc: 'Введите базовые статы питомца и выберите модификаторы, чтобы увидеть финальные статы.',
    inputLabel: 'Введите статистику питомца', placeholder: 'Введите базовые характеристики...',
    resultLabel: 'Финальные характеристики', settings: 'Настройки', slimes: 'Слайм', mutation: 'Мутация', evolution: 'Эволюция и размер',
    type: 'Тип', shiny: 'Блестящий', maxlvl: 'Макс. уровень', invalid: 'Пожалуйста, введите действительное число',
  },
};

const GROUPS = {
  slime: [
    { id: 'slime_yellow', name: 'Yellow', mult: 1.2 }, { id: 'slime_blue', name: 'Blue', mult: 1.4 },
    { id: 'slime_purple', name: 'Purple', mult: 1.65 }, { id: 'slime_red', name: 'Red', mult: 2.25 },
    { id: 'slime_black', name: 'Black', mult: 2.4 }, { id: 'slime_green', name: 'Green', mult: 2.55 },
    { id: 'slime_orange', name: 'Orange', mult: 2.7 }, { id: 'slime_christmas', name: 'Christmas', mult: 2.85 },
    { id: 'slime_neowave', name: 'Neowave', mult: 3.0 }, { id: 'slime_shock', name: 'Shock', mult: 3.15 },
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
const MAXLVL = 2.2388;

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
  const [slime, setSlime] = useState('slime_shock');
  const [mutation, setMutation] = useState('mutation_cosmic');
  const [evolution, setEvolution] = useState('evolution_goliath');
  const [type, setType] = useState('type_pristine');
  const [shiny, setShiny] = useState(true);
  const [maxlvl, setMaxlvl] = useState(true);

  const multiplier = useMemo(() => {
    const pick = (group, id) => GROUPS[group].find((x) => x.id === id)?.mult ?? 1;
    let m = pick('slime', slime) * pick('mutation', mutation) * pick('evolution', evolution) * pick('type', type);
    if (shiny) m *= SHINY;
    if (maxlvl) m *= MAXLVL;
    return m;
  }, [slime, mutation, evolution, type, shiny, maxlvl]);

  const { result, error } = useMemo(() => {
    if (!raw.trim()) return { result: null, error: '' };
    const base = parseFloat(raw);
    if (Number.isNaN(base)) return { result: null, error: t.invalid };
    return { result: base * multiplier, error: '' };
  }, [raw, multiplier, t]);

  return (
    <>
      <div className="calc">
        {/* LEFT: description + input + output */}
        <div className="calc-left">

          <div className="calc-field">
            <label className="field-label" htmlFor="pet-input">{t.inputLabel}</label>
            <input id="pet-input" className="input" type="number" step="any"
              placeholder={t.placeholder} value={raw} onChange={(e) => setRaw(e.target.value)} />
          </div>

          {error && <div className="calc-error">{error}</div>}

          <div className="calc-output">
            <div className="label">{t.resultLabel}</div>
            <div className="result-value">
              {result === null ? '0' : result.toLocaleString(undefined, {
                minimumFractionDigits: result % 1 === 0 ? 0 : 2, maximumFractionDigits: 8,
              })}
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
              <Switch checked={maxlvl} onChange={setMaxlvl} name={t.maxlvl} sub={`x${MAXLVL}`} />
            </SettingsGroup>
          </SettingsAccordion>
        </div>
      </div>
    </>
  );
}
