'use client';
import React from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

const TYPE_CONFIG = {
  ROOM:      { emoji: '🏕️', labelEN: 'Room',      labelMN: 'Өрөө',   color: '#3b82f6' },
  FOOD:      { emoji: '🍽️', labelEN: 'Food',      labelMN: 'Хоол',   color: '#22c55e' },
  ADVENTURE: { emoji: '🐴', labelEN: 'Adventure', labelMN: 'Аялал',  color: '#f59e0b' },
};

const CartDrawer = () => {
  const { cartItems, removeFromCart, clearCart, isCartOpen, setIsCartOpen, cartTotal } = useCart();
  const { lang } = useLanguage();
  const router = useRouter();
  const isMN = lang === 'MN';

  const getCfg = (type) => TYPE_CONFIG[type] || { emoji: '📦', labelEN: type, labelMN: type, color: '#888' };

  return (
    <>
      <div id="cart-drawer" className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div className="cart-header-left">
            <h3>{isMN ? 'Миний сагс' : 'My Cart'}</h3>
            {cartItems.length > 0 && (
              <span className="cart-header-count">{cartItems.length}</span>
            )}
          </div>
          <button onClick={() => setIsCartOpen(false)} className="close-btn" aria-label="Close cart">
            &times;
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <p className="empty-cart-title">{isMN ? 'Сагс хоосон байна' : 'Your cart is empty'}</p>
              <p className="empty-cart-sub">
                {isMN ? 'Хоол, өрөө эсвэл аялал нэмнэ үү' : 'Add food, rooms or adventures'}
              </p>
              <button className="btn-gold empty-cart-btn" onClick={() => setIsCartOpen(false)}>
                {isMN ? 'Цааш үзэх' : 'Keep Browsing'}
              </button>
            </div>
          ) : (
            <>
              <div className="cart-actions">
                <span className="cart-count-label">
                  {cartItems.length} {isMN ? 'зүйл' : 'item' + (cartItems.length !== 1 ? 's' : '')}
                </span>
                <button onClick={clearCart} className="clear-cart-btn">
                  {isMN ? 'Бүгдийг устгах' : 'Clear All'}
                </button>
              </div>

              <div className="cart-items-list">
                {cartItems.map((item) => {
                  const cfg = getCfg(item.type);
                  const label = isMN ? cfg.labelMN : cfg.labelEN;
                  return (
                    <div key={item.cartId} className="cart-item">
                      <div className="cart-item-img-wrap">
                        <img
                          src={
                            item.image?.startsWith('http')
                              ? item.image
                              : `/${(item.image || '').replace(/^\/?(img\/)?/, '')}`
                          }
                          alt={item.title}
                          onError={(e) => { e.target.src = '/placeholder-food.jpg'; }}
                        />
                        <span className="cart-type-dot" style={{ background: cfg.color }}>
                          {cfg.emoji}
                        </span>
                      </div>

                      <div className="cart-item-info">
                        <div className="cart-item-top">
                          <h4>{item.title}</h4>
                          <span className="cart-type-badge" style={{ color: cfg.color, borderColor: cfg.color }}>
                            {label}
                          </span>
                        </div>
                        <p className="item-price">
                          {item.quantity} × ₮{item.price.toLocaleString()}
                        </p>
                        {item.type === 'ROOM' && item.bookingDates?.checkin && (
                          <p className="cart-item-meta">
                            📅 {item.bookingDates.checkin} → {item.bookingDates.checkout}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="remove-item-btn"
                        title={isMN ? 'Устгах' : 'Remove'}
                      >
                        &times;
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="total-price">
              <span>{isMN ? 'Нийт дүн' : 'Total'}</span>
              <span id="cart-total">₮{cartTotal.toLocaleString()}</span>
            </div>
            <button
              className="btn-gold checkout-btn"
              onClick={() => {
                setIsCartOpen(false);
                router.push('/checkout');
              }}
            >
              {isMN ? 'Төлбөр хийх' : 'Checkout'} →
            </button>
          </div>
        )}
      </div>

      <div
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`}
        onClick={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default CartDrawer;
