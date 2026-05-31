'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const NAV_ITEMS = [
  { href: '/',           icon: '🏠', labelEN: 'Home',       labelMN: 'Нүүр' },
  { href: '/rooms',      icon: '🏕️', labelEN: 'Rooms',      labelMN: 'Өрөө' },
  { href: '/restaurant', icon: '🍽️', labelEN: 'Menu',       labelMN: 'Цэс' },
  { href: '/horse',      icon: '🐴', labelEN: 'Adventure',  labelMN: 'Аялал' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const { t } = useLanguage();

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {NAV_ITEMS.map(({ href, icon, labelEN }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`bottom-nav-item${active ? ' bottom-nav-item--active' : ''}`}
          >
            <span className="bottom-nav-icon">{icon}</span>
            <span className="bottom-nav-label">{labelEN}</span>
          </Link>
        );
      })}

      {/* Cart — Link биш button, drawer нээнэ */}
      <button
        className="bottom-nav-item bottom-nav-item--cart"
        onClick={() => setIsCartOpen(true)}
        aria-label="Open cart"
      >
        <span className="bottom-nav-icon">
          🛒
          {cartCount > 0 && (
            <span className="bottom-nav-badge" suppressHydrationWarning>
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </span>
        <span className="bottom-nav-label">{t.nav.Cart}</span>
      </button>
    </nav>
  );
}
