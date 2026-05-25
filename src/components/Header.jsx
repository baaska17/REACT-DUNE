'use client';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.isDark;
  const toggleTheme = themeContext?.toggleTheme;

  // useLanguage — LanguageContext-оос хэл болон орчуулга авна
  // Lecture: "useContext: consume in any child component"
  const { lang, setLang, t } = useLanguage();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminPort, setIsAdminPort] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.port === '3001') {
      setIsAdminPort(true);
    }
  }, []);

  const isActive = useCallback(
    (path) => (pathname === path ? 'active' : ''),
    [pathname]
  );

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <header className="header">
      <Link href="/" className="logo" onClick={closeMenu}>
        <img src="/logo.jpg" alt="Dune Logo" className="logo-img" />
        <span>Dune Tourist Camp</span>
      </Link>

      {isMenuOpen && (
        <div className="nav-backdrop" onClick={closeMenu} aria-hidden="true" />
      )}
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

      <div className="header-right">
        {/* Language selector — setLang LanguageContext-руу дамжуулна */}
        <div className="lang-switch">
          <button
            className={lang === 'EN' ? 'active' : ''}
            onClick={() => setLang('EN')}
          >
            EN
          </button>
          <button
            className={lang === 'MN' ? 'active' : ''}
            onClick={() => setLang('MN')}
          >
            MN
          </button>
        </div>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
          🛒 <span className="cart-badge" suppressHydrationWarning>{cartCount}</span>
        </div>

        <Link href="/rooms" className="book-now-btn btn-gold">
          {t.nav.bookNow}
        </Link>
      </div>

      <button
        className="hamburger"
        onClick={() => setIsMenuOpen(prev => !prev)}
        aria-label="Menu"
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>
    </header>
  );
};

export default Header;
