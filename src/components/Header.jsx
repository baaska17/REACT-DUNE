import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
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
            <span className="active">EN</span>
            <span>MN</span>
          </div>
          <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
            🛒 <span className="cart-badge">{cartCount}</span>
          </div>
          <Link to="/rooms" className="book-now-btn btn-gold">Rooms</Link>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="main-nav-mobile">
        <ul>
          <li><Link to="/" className={isActive('/')}>Home</Link></li>
          <li><Link to="/horse" className={isActive('/horse')}>Horse Ride</Link></li>
          <li><Link to="/restaurant" className={isActive('/restaurant')}>Dining</Link></li>
          <li><Link to="/rooms" className={isActive('/rooms')}>Rooms</Link></li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
