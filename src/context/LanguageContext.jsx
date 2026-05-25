'use client';
import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
} from 'react';
import translations from '../translations/index.js';

// ============================================================
// CONTEXT — useContext лекцийн дагуу
// Lecture: "useContext: consume context in any child component"
// ============================================================
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // useState — хэлний сонголтыг localStorage-аас уншина
  const [lang, setLangState] = useState('EN');

  // useEffect — hydration дараа localStorage-аас уншина
  useEffect(() => {
    const saved = localStorage.getItem('dune_lang');
    if (saved === 'EN' || saved === 'MN') {
      setLangState(saved);
    }
  }, []);

  // useCallback — хэл солих функц, reference тогтворжуулна
  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    localStorage.setItem('dune_lang', newLang);
  }, []);

  // useMemo — одоогийн хэлний орчуулгыг cache хийнэ
  // Lecture: "useMemo: only recalculates when deps change"
  const t = useMemo(() => translations[lang], [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t }),
    [lang, setLang, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// useLanguage — дурын component-д ашиглах custom hook
// Lecture: "Custom hooks: reuse stateful logic between components"
export const useLanguage = () => useContext(LanguageContext);
