/**
 * Header Компонент - Baaska
 * Вэбсайтын толгой хэсэг: Лого, Цэс, Хэл солих, Theme солих болон Сагсны дүрсийг агуулна.
 */

'use client';

import React, { useState, useContext, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const { cartCount, setIsCartOpen } = useCart(); // Сагсан дахь барааны тоо болон нээх функц
  const themeContext = useContext(ThemeContext); // Theme (Dark/Light) контекст
  const isDark = themeContext?.isDark;
  const toggleTheme = themeContext?.toggleTheme;

  const { lang, setLang, t } = useLanguage(); // Хэлний тохиргоо болон орчуулга

  const [isMenuOpen, setIsMenuOpen] = useState(false); // Мобайл цэс нээлттэй эсэх
  const [isAdminPort, setIsAdminPort] = useState(false); // Админ порт дээр байгаа эсэх
  const pathname = usePathname(); // Одоо байгаа хуудасны зам

  // Порт шалгах (3001 порт бол Админ товчийг харуулна)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.port === '3001') {
      setIsAdminPort(true);
    }
  }, []);

  // Идэвхтэй байгаа цэсийг тодорхойлох (active class нэмэх)
  const isActive = useCallback(
    (path) => (pathname === path ? 'active' : ''),
    [pathname]
  );

  // Цэсийг хаах функц
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <header className="header">
      {/* Лого хэсэг */}
      <Link href="/" className="logo" onClick={closeMenu}>
        <img src="/logo.jpg" alt="Dune Logo" className="logo-img" />
        <span>Dune Tourist Camp</span>
      </Link>

      {/* Мобайл үед цэсний ард харагдах бүдгэрүүлсэн фон */}
      {isMenuOpen && (
        <div className="nav-backdrop" onClick={closeMenu} aria-hidden="true" />
      )}

      {/* Үндсэн навигацийн цэс */}
      <nav className={`main-nav${isMenuOpen ? ' mobile-open' : ''}`}>
        <ul>
          <li><Link href="/"           className={isActive('/')}           onClick={closeMenu}>{t.nav.home}</Link></li>
          <li><Link href="/horse"      className={isActive('/horse')}      onClick={closeMenu}>{t.nav.horse}</Link></li>
          <li><Link href="/restaurant" className={isActive('/restaurant')} onClick={closeMenu}>{t.nav.restaurant}</Link></li>
          <li><Link href="/rooms"      className={isActive('/rooms')}      onClick={closeMenu}>{t.nav.rooms}</Link></li>
          <li><Link href="/order-track" className={isActive('/order-track')} onClick={closeMenu}>{t.nav.trackOrder}</Link></li>
          {isAdminPort && (
            <li>
              <Link href="/admin" className={isActive('/admin')} onClick={closeMenu}
                style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                Admin
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Баруун талын хэрэгслүүд */}
      <div className="header-right">
        {/* Хэл солих (EN/MN) */}
        <div className="lang-switch">
          <button className={lang === 'EN' ? 'active' : ''} onClick={() => setLang('EN')}>EN</button>
          <button className={lang === 'MN' ? 'active' : ''} onClick={() => setLang('MN')}>MN</button>
        </div>

        {/* Theme солих (☀️/🌙) */}
        <button className="theme-toggle" onClick={toggleTheme} title={isDark ? 'Light mode' : 'Dark mode'}>
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* Сагсны дүрс ба тоолуур */}
        <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
          🛒 <span className="cart-badge" suppressHydrationWarning>{cartCount}</span>
        </div>

        {/* Шууд захиалах товч */}
        <Link href="/rooms" className="book-now-btn btn-gold">
          {t.nav.bookNow}
        </Link>
      </div>

      {/* Мобайл үеийн Хамбургер товч */}
      <button className="hamburger" onClick={() => setIsMenuOpen(prev => !prev)} aria-label="Menu">
        {isMenuOpen ? '✕' : '☰'}
      </button>
    </header>
  );
};

export default Header;
