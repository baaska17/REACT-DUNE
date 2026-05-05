import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const [lang, setLang] = useState('EN');
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src="/logo.jpg" alt="Dune Logo" className="logo-img" />
        <span>Dune Tourist Camp</span>
      </Link>

      <nav className="main-nav">
        <ul>
          <li><Link to="/" className={isActive('/')}>Home</Link></li>
          <li><Link to="/horse" className={isActive('/horse')}>Horse Ride Adventure</Link></li>
          <li><Link to="/restaurant" className={isActive('/restaurant')}>Restaurant</Link></li>
          <li><Link to="/rooms" className={isActive('/rooms')}>Rooms</Link></li>
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
        <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
          🛒 <span className="cart-badge">{cartCount}</span>
        </div>
        <Link to="/rooms" className="book-now-btn btn-gold">Book Now</Link>
      </div>
    </header>
  );
};

export default Header;
