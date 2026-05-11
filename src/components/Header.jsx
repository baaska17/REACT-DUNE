import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';

const Header = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [lang, setLang] = useState('EN');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <Link to="/" className="logo" onClick={closeMenu}>
        <img src="/logo.jpg" alt="Dune Logo" className="logo-img" />
        <span>Dune Tourist Camp</span>
      </Link>

      <nav className={`main-nav${isMenuOpen ? ' mobile-open' : ''}`}>
        <ul>
          <li><Link to="/" className={isActive('/')} onClick={closeMenu}>Home</Link></li>
          <li><Link to="/horse" className={isActive('/horse')} onClick={closeMenu}>Horse Ride Adventure</Link></li>
          <li><Link to="/restaurant" className={isActive('/restaurant')} onClick={closeMenu}>Restaurant</Link></li>
          <li><Link to="/rooms" className={isActive('/rooms')} onClick={closeMenu}>Rooms</Link></li>
          <li><Link to="/order-track" className={isActive('/order-track')} onClick={closeMenu}>Track Order</Link></li>
        </ul>
      </nav>

      <div className="header-right">
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
          🛒 <span className="cart-badge">{cartCount}</span>
        </div>
        <Link to="/rooms" className="book-now-btn btn-gold">Book Now</Link>
      </div>

      <button
        className="hamburger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu"
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>
    </header>
  );
};

export default Header;
