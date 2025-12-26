'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { DICT, type Dict, type Locale } from './dict';

type I18nContextValue = {
  locale: Locale;
  dict: Dict;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'ccalc.locale';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved === 'pt' || saved === 'en') setLocaleState(saved);
    } catch {
      // ignore
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  };

  const toggleLocale = () => setLocale(locale === 'en' ? 'pt' : 'en');

  return (
    <I18nContext.Provider value={{ locale, dict: DICT[locale], setLocale, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
