"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dict, type DictKey, type Locale } from "@/lib/i18n/dict";

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (k: DictKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "cmw_locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pt");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "pt" || stored === "en") setLocale(stored);
    } catch {
      // ignore
    }
  }, []);

  const api = useMemo<I18nContextValue>(() => {
    const table = dict[locale];
    return {
      locale,
      setLocale: (l) => {
        setLocale(l);
        try {
          localStorage.setItem(STORAGE_KEY, l);
        } catch {
          // ignore
        }
      },
      t: (k) => table[k] ?? k,
    };
  }, [locale]);

  return <I18nContext.Provider value={api}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

