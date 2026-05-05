import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { cartItems, removeFromCart, clearCart, isCartOpen, setIsCartOpen, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <>
      <div id="cart-drawer" className={`cart-drawer ${isCartOpen ? 'open' : ''}`} style={{ display: 'block' }}>
        <div className="cart-header">
          <h3>Shopping Cart</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button onClick={clearCart} className="remove-item" style={{ color: '#ff4d4d', fontWeight: 600, cursor: 'pointer', border: 'none', background: 'none' }}>
              Remove All
            </button>
            <button onClick={() => setIsCartOpen(false)} className="close-btn">&times;</button>
          </div>
        </div>
        
        <div id="cart-items" className="cart-content">
          {cartItems.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: '2rem' }}>Your cart is empty</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={`/${item.image.replace('img/', '')}`} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} />
                <div className="item-details">
                  <h4>{item.title}</h4>
                  <p>{item.quantity} x ${item.price}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="remove-item">&times;</button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="total-price">
            <span>Total:</span>
            <span id="cart-total">${cartTotal}</span>
          </div>
          <button 
            className="btn-gold checkout-btn" 
            onClick={() => {
              setIsCartOpen(false);
              navigate('/checkout');
            }}
            disabled={cartItems.length === 0}
          >
            Checkout Now
          </button>
        </div>
      </div>
      <div 
        id="cart-overlay" 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
        style={{ display: 'block' }}
        onClick={() => setIsCartOpen(false)}
      ></div>
    </>
  );
};

export default CartDrawer;
