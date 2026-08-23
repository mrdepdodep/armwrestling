'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'uk', label: 'UK' },
  { code: 'ru', label: 'RU' },
];

const STORAGE_KEY = 'armHelper_language';

const LanguageContext = createContext({ lang: 'en', setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGUAGES.some((l) => l.code === saved)) setLangState(saved);
  }, []);

  const setLang = useCallback((code) => {
    if (LANGUAGES.some((l) => l.code === code)) {
      setLangState(code);
      localStorage.setItem(STORAGE_KEY, code);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

// Pick a localized value from a { en, uk, ru } object, falling back to en.
export function useT() {
  const { lang } = useLanguage();
  return useCallback((obj) => (obj && (obj[lang] ?? obj.en)) ?? '', [lang]);
}
