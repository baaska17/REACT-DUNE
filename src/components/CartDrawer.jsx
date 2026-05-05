import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { cartItems, removeFromCart, clearCart, isCartOpen, setIsCartOpen, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <div id="cart-drawer" className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Shopping Cart</h3>
          <button onClick={() => setIsCartOpen(false)} className="close-btn" aria-label="Close cart">&times;</button>
        </div>
        
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🛒</div>
              <p>Your cart is empty</p>
              <button className="btn-gold" onClick={() => setIsCartOpen(false)} style={{ marginTop: '1rem' }}>
                Go Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-actions">
                <button onClick={clearCart} className="clear-cart-btn">
                  Remove All
                </button>
              </div>
              <div className="cart-items-list">
                {cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className="cart-item-img">
                      <img 
                        src={item.image.startsWith('http') ? item.image : `/${item.image.replace(/^\/?(img\/)?/, '')}`} 
                        alt={item.title} 
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/60?text=Item'; }}
                      />
                    </div>
                    <div className="cart-item-info">
                      <h4>{item.title}</h4>
                      <p className="item-price">{item.quantity} x ${item.price}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="remove-item-btn" title="Remove item">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="total-price">
              <span>Total</span>
              <span id="cart-total">${cartTotal}</span>
            </div>
            <button 
              className="btn-gold checkout-btn" 
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }}
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={() => setIsCartOpen(false)}
      ></div>
    </>
  );
};

export default CartDrawer;
