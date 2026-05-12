import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirmOrder = () => {
    setShowSuccess(true);
    clearCart();
  };

  return (
    <div className="checkout-page">
      <main className="container checkout-container">
        <div className="back-link">
          <Link to="/restaurant">← Back to Menu</Link>
        </div>
        <h1>Checkout</h1>

        <div className="checkout-grid">
          <div className="checkout-form-side">
            {/* Contact Information */}
            <section className="checkout-section glass-panel-light">
              <h2>Contact Information</h2>
              <div className="form-group full-width">
                <label>Full Name *</label>
                <input type="text" placeholder="John Doe" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" placeholder="john@example.com" required />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" placeholder="+976 1234 5678" required />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="checkout-section glass-panel-light">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>
                  <input type="radio" name="payment" checked={paymentMethod === 'card'} readOnly />
                  <span className="radio-custom"></span>
                  <span className="payment-label">💳 Credit / Debit Card</span>
                </label>
                <label className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`} onClick={() => setPaymentMethod('cash')}>
                  <input type="radio" name="payment" checked={paymentMethod === 'cash'} readOnly />
                  <span className="radio-custom"></span>
                  <span className="payment-label">Cash on Delivery</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="card-details">
                  <div className="form-group full-width">
                    <label>Card Number *</label>
                    <input type="text" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date *</label>
                      <input type="text" placeholder="MM/YY" />
                    </div>
                    <div className="form-group">
                      <label>CVV *</label>
                      <input type="text" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}
            </section>

            <button 
              className="confirm-order-btn" 
              onClick={handleConfirmOrder}
              disabled={cartItems.length === 0}
            >
              Confirm Order
            </button>
          </div>

          <aside className="order-summary-side glass-panel-light">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cartItems.map((item, index) => (
                <div key={index} className="summary-item">
                  <span>{item.title} x {item.quantity}</span>
                  <span>₮{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              {cartItems.length === 0 && <p>No items in cart</p>}
            </div>
            
            <div className="summary-totals">
              <div className="summary-line">
                <span>Subtotal</span>
                <span>₮{cartTotal.toLocaleString()}</span>
              </div>
              <div className="summary-line">
                <span>Delivery Fee</span>
                <span className="free">Free</span>
              </div>
              <hr />
              <div className="summary-line total">
                <span>Total</span>
                <span>₮{cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </aside>
        </div>

        {showSuccess && (
          <div className="cart-overlay open" style={{ display: 'block' }}>
            <div className="success-modal">
              <div className="success-icon">✅</div>
              <h2>Order Confirmed!</h2>
              <p>Thank you for choosing Dune Tourist Camp.</p>
              <Link to="/" className="btn-gold" style={{ marginTop: '2rem' }}>
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Checkout;
