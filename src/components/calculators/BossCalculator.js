'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Switch from './Switch';
import './calculators.css';

const T = {
  en: {
    title: 'Boss Calculator',
    desc: 'Enter how much you need and the reward per win to estimate the total time.',
    totalNeeded: 'Total Needed to Collect',
    rewardPerWin: 'Reward per Victory',
    settings: 'Settings',
    vip: 'VIP + Autoclicker',
    vipDesc: '2.5s vs 4.5s per win',
    resultTitle: 'Total Time Needed',
    totalPlaceholder: 'Enter total amount needed...',
    rewardPlaceholder: 'Enter reward per win...',
    invalid: 'Please enter valid positive numbers',
    missing: 'Please fill in both fields',
  },
  uk: {
    title: 'Калькулятор Боса',
    desc: 'Введіть скільки потрібно зібрати та нагороду за перемогу, щоб оцінити час.',
    totalNeeded: 'Всього Потрібно Зібрати',
    rewardPerWin: 'Нагорода за Перемогу',
    settings: 'Налаштування',
    vip: 'VIP + Автоклікер',
    vipDesc: '2.5с проти 4.5с за перемогу',
    resultTitle: 'Загальний Час',
    totalPlaceholder: 'Введіть загальну кількість...',
    rewardPlaceholder: 'Введіть нагороду за перемогу...',
    invalid: 'Будь ласка, введіть дійсні позитивні числа',
    missing: 'Будь ласка, заповніть обидва поля',
  },
  ru: {
    title: 'Калькулятор Босса',
    desc: 'Введите сколько нужно собрать и награду за победу, чтобы оценить время.',
    totalNeeded: 'Всего Нужно Собрать',
    rewardPerWin: 'Награда за Победу',
    settings: 'Настройки',
    vip: 'VIP + Автокликер',
    vipDesc: '2.5с против 4.5с за победу',
    resultTitle: 'Общее Время',
    totalPlaceholder: 'Введите общее количество...',
    rewardPlaceholder: 'Введите награду за победу...',
    invalid: 'Пожалуйста, введите действительные положительные числа',
    missing: 'Пожалуйста, заполните оба поля',
  },
};

function formatTime(seconds) {
  if (seconds < 60) return `${Math.round(seconds * 10) / 10}s`;
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return s === 0 ? `${m}m` : `${m}m ${s}s`;
  }
  if (seconds < 86400) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  }
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  return h === 0 ? `${d}d` : `${d}d ${h}h`;
}

export default function BossCalculator() {
  const { lang } = useLanguage();
  const t = T[lang] || T.en;

  const [total, setTotal] = useState('');
  const [reward, setReward] = useState('');
  const [vip, setVip] = useState(false);

  const { result, error } = useMemo(() => {
    if (!total.trim() || !reward.trim()) return { result: null, error: total || reward ? t.missing : '' };
    const totalNum = parseFloat(total);
    const rewardNum = parseFloat(reward);
    if (Number.isNaN(totalNum) || totalNum <= 0 || Number.isNaN(rewardNum) || rewardNum <= 0)
      return { result: null, error: t.invalid };
    const victories = Math.ceil(totalNum / rewardNum);
    return { result: formatTime(victories * (vip ? 2.5 : 4.5)), error: '' };
  }, [total, reward, vip, t]);

  return (
    <>
      <div className="calc calc-single">
        <div className="calc-left">

          <div className="calc-field">
            <label className="field-label" htmlFor="boss-total">{t.totalNeeded}</label>
            <input id="boss-total" className="input" type="number" min="1" step="1"
              placeholder={t.totalPlaceholder} value={total} onChange={(e) => setTotal(e.target.value)} />
          </div>

          <div className="calc-field">
            <label className="field-label" htmlFor="boss-reward">{t.rewardPerWin}</label>
            <input id="boss-reward" className="input" type="number" min="1" step="1"
              placeholder={t.rewardPlaceholder} value={reward} onChange={(e) => setReward(e.target.value)} />
          </div>

          <div className="calc-inline-setting">
            <Switch checked={vip} onChange={setVip} name={t.vip} sub={t.vipDesc} />
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
