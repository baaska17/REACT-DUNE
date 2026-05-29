/**
 * Theme Context - Baaska
 * Вэбсайтыг Харанхуй (Dark) болон Цайвар (Light) горимд шилжүүлэх логикийг удирдана.
 */

'use client';

import React, { createContext, useState, useEffect } from 'react';

// Context үүсгэх
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false); // Харанхуй горим идэвхтэй эсэх
  const [mounted, setMounted] = useState(false); // Client талд ачаалагдсан эсэх

  // Анх ачаалагдах үед localStorage-аас хадгалсан theme-г шалгах
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      // Хэрэглэгчийн өмнө нь сонгосон theme байгаа бол түүнийг ашиглана
      setIsDark(savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Хэрэв хадгалсан утга байхгүй бол системийн тохиргоог (OS theme) дагана
      setIsDark(true);
    }
  }, []);

  // isDark төлөв өөрчлөгдөх бүрт HTML элементийн атрибутыг шинэчлэх
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');

      // CSS-т 'data-theme' атрибутаар дамжуулан өнгөний тохиргоог дамжуулна
      if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  }, [isDark, mounted]);

  // Горимыг солих функц
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Hydration mismatch (сервер болон клиент талын зөрүү)-аас сэргийлж mounted болсны дараа Provider-ыг буцаана
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
