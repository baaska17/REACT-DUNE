'use client';

import { useState, useEffect, useReducer, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useCart } from '@/src/context/CartContext';
import { useLanguage } from '@/src/context/LanguageContext';

/*
========================================
FORM REDUCER
Lecture: "useReducer: complex state transitions"
========================================
*/
const FORM_INIT = { fullName: '', email: '', phone: '' };

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD': return { ...state, [action.field]: action.value };
    case 'RESET':     return FORM_INIT;
    default:          return state;
  }
}

/*
========================================
WEEKDAY NAMES
========================================
*/
const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES_MN = ['Ням', 'Дав', 'Мяг', 'Лха', 'Пүр', 'Баа', 'Бям'];

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { lang } = useLanguage();

  // useReducer — form state
  const [formData, dispatch] = useReducer(formReducer, FORM_INIT);

  const [settings, setSettings]           = useState(null);
  const [selectedSplit, setSelectedSplit]  = useState(null);
  const [showOffPeakDetails, setShowOffPeakDetails] = useState(false);
  const [showSuccess, setShowSuccess]      = useState(false);
  const [trackingId, setTrackingId]        = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                  = useState('');

  /*
  ========================================
  FETCH SETTINGS
  Lecture: useEffect — side effects, fetch API
  ========================================
  */
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() =>
        setSettings({
          offPeakDays:     [1, 2, 3],
          offPeakDiscount: 10,
          splitEnabled:    true,
          splitThreshold:  200000,
        })
      );
  }, []);

  /*
  ========================================
  PAYMENT SPLIT SUGGESTION
  useMemo — settings эсвэл cartTotal өөрчлөгдөхөд л дахин тооцно
  Lecture: "useMemo: only recalculates when deps change"
  ========================================
  */
  const splitSuggestion = useMemo(() => {
    if (!settings?.splitEnabled) return null;
    if (cartTotal < settings.splitThreshold) return null;

    return {
      two:   Math.ceil(cartTotal / 2),
      three: Math.ceil(cartTotal / 3),
    };
  }, [settings, cartTotal]);

  /*
  ========================================
  OFF-PEAK DISCOUNT NUDGE
  useMemo — сагсанд байгаа ROOM item-ийн огноог шалгана
  ========================================
  */
  const offPeakSuggestion = useMemo(() => {
    if (!settings?.offPeakDays?.length) return null;

    const roomItems = cartItems.filter((i) => i.type === 'ROOM');
    if (roomItems.length === 0) return null;

    const dayNames  = lang === 'MN' ? DAY_NAMES_MN : DAY_NAMES_EN;
    const firstRoom = roomItems[0];

    // Захиалгын огноо тавигдсан эсэхийг шалгана
    let checkDate = null;
    if (firstRoom.bookingDates?.checkin) {
      const parsed = new Date(firstRoom.bookingDates.checkin);
      if (!isNaN(parsed)) checkDate = parsed;
    }

    // Огноо тавигдсан бол: тухайн өдөр off-peak эсэхийг шалгана
    if (checkDate) {
      const dayOfWeek = checkDate.getDay();
      if (settings.offPeakDays.includes(dayOfWeek)) return null; // аль хэдийн хямд өдөр
    }

    // Off-peak биш өдөр эсвэл огноо тавиагүй — хамгийн ойрын off-peak өдрийг олно
    const fromDay   = checkDate ? checkDate.getDay() : new Date().getDay();
    let nextOffPeak = '';
    for (let i = 1; i <= 7; i++) {
      const next = (fromDay + i) % 7;
      if (settings.offPeakDays.includes(next)) {
        nextOffPeak = dayNames[next];
        break;
      }
    }

    const saving   = Math.round(cartTotal * settings.offPeakDiscount / 100);
    const newTotal = cartTotal - saving;

    return { day: nextOffPeak, saving, newTotal, percent: settings.offPeakDiscount };
  }, [settings, cartItems, cartTotal, lang]);

  /*
  ========================================
  EFFECTIVE TOTAL (after split selection display)
  ========================================
  */
  const displayTotal = useMemo(() => {
    return cartTotal;
  }, [cartTotal]);

  /*
  ========================================
  CONFIRM ORDER
  useCallback — функцийн reference тогтворжуулна
  Lecture: "useCallback: memoize a function reference"
  ========================================
  */
  const handleConfirmOrder = useCallback(async () => {
    if (!formData.fullName || !formData.phone || !formData.email) {
      setError(lang === 'MN' ? 'Бүх талбарыг бөглөнө үү' : 'Please fill all required fields');
      return;
    }
    if (cartItems.length === 0) {
      setError(lang === 'MN' ? 'Сагс хоосон байна' : 'Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.fullName,
          email:        formData.email,
          phone:        formData.phone,
          totalAmount:  cartTotal,
          items:        cartItems,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Order failed');
        return;
      }

      setTrackingId(data.trackingId);
      setShowSuccess(true);
      clearCart();
      localStorage.removeItem('dune_cart');
    } catch {
      setError(lang === 'MN' ? 'Серверт холбогдож чадсангүй' : 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, [formData, cartItems, cartTotal, clearCart, lang]);

  /*
  ========================================
  SUCCESS SCREEN
  ========================================
  */
  if (showSuccess) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'var(--bg-primary)',
          padding: '2rem',
        }}
      >
        <div className="success-modal">
          <div className="success-icon">✅</div>

          <h2 style={{ color: 'var(--primary)' }}>
            {lang === 'MN' ? 'Захиалга баталгаажлаа!' : 'Order Confirmed!'}
          </h2>

          <p>
            {lang === 'MN'
              ? 'Таны захиалга амжилттай илгээгдлээ.'
              : 'Your booking has been submitted successfully.'}
          </p>

          <div
            style={{
              background: 'rgba(197,175,55,0.08)',
              border: '1px solid rgba(197,160,89,0.25)',
              padding: '1.5rem',
              borderRadius: '18px',
              marginBottom: '2rem',
            }}
          >
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
              {lang === 'MN' ? 'Захиалгын дугаар' : 'Tracking ID'}
            </div>
            <div
              style={{
                color: 'var(--primary)',
                fontSize: '2.2rem',
                fontWeight: '800',
                letterSpacing: '3px',
              }}
            >
              {trackingId}
            </div>
          </div>

          <Link href="/" className="btn-gold" style={{ display: 'block', padding: '16px', textDecoration: 'none' }}>
            {lang === 'MN' ? 'Нүүр хуудас руу буцах' : 'Return Home'}
          </Link>
        </div>
      </div>
    );
  }

  /*
  ========================================
  MAIN CHECKOUT PAGE
  ========================================
  */
  return (
    <div className="checkout-page" style={{ paddingTop: '110px' }}>
      <main className="checkout-container container">

        {/* BACK LINK */}
        <div className="back-link">
          <Link href="/">← {lang === 'MN' ? 'Үргэлжлүүлэн хайх' : 'Continue Browsing'}</Link>
        </div>

        <h1>{lang === 'MN' ? 'Захиалга баталгаажуулах' : 'Checkout'}</h1>

        {/* ERROR */}
        {error && (
          <div
            style={{
              background: 'rgba(255,0,0,0.07)',
              border: '1px solid rgba(255,80,80,0.25)',
              color: '#ff6b6b',
              padding: '14px 18px',
              borderRadius: '14px',
              marginBottom: '24px',
              fontWeight: '600',
            }}
          >
            {error}
          </div>
        )}

        {/* SMART NUDGE CARDS — settings ачаалагдсаны дараа харуулна */}
        {settings && (
          <div style={{ marginBottom: '2rem' }}>

            {/* PAYMENT SPLIT NUDGE */}
            {splitSuggestion && (
              <div className="nudge-card">
                <span className="nudge-emoji">💳</span>
                <div style={{ flex: 1 }}>
                  <div className="nudge-title">
                    {lang === 'MN' ? 'Төлбөрөө хуваан төл' : 'Split Your Payment'}
                  </div>
                  <div className="nudge-subtitle">
                    {lang === 'MN'
                      ? `Нийт ${cartTotal.toLocaleString()}₮-ийг тохиромжтой хэсгүүдэд хувааж төлөх боломжтой`
                      : `Break your ₮${cartTotal.toLocaleString()} total into smaller installments`}
                  </div>
                  <div className="split-options">
                    <button
                      className={`split-btn ${selectedSplit === 2 ? 'active' : ''}`}
                      onClick={() => setSelectedSplit(selectedSplit === 2 ? null : 2)}
                    >
                      2 × {splitSuggestion.two.toLocaleString()}₮
                    </button>
                    <button
                      className={`split-btn ${selectedSplit === 3 ? 'active' : ''}`}
                      onClick={() => setSelectedSplit(selectedSplit === 3 ? null : 3)}
                    >
                      3 × {splitSuggestion.three.toLocaleString()}₮
                    </button>
                  </div>
                  {selectedSplit && (
                    <div className="split-info">
                      {lang === 'MN'
                        ? `✓ ${selectedSplit} удаа ${(cartTotal / selectedSplit).toLocaleString()}₮ тус бүр — манай ажилтантай тохиролцоно`
                        : `✓ ${selectedSplit} payments of ~${Math.ceil(cartTotal / selectedSplit).toLocaleString()}₮ — confirm with our staff`}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* OFF-PEAK DISCOUNT NUDGE — teaser first, details on click */}
            {offPeakSuggestion && (
              <div className="nudge-card nudge-card--discount">
                <span className="nudge-emoji">🗓️</span>
                <div style={{ flex: 1 }}>
                  {/* Always visible: teaser headline */}
                  <div className="nudge-title" style={{ color: '#4ade80' }}>
                    {lang === 'MN'
                      ? `${offPeakSuggestion.percent}% хөнгөлөлт авах боломжтой!`
                      : `You could save ${offPeakSuggestion.percent}% on this booking!`}
                  </div>

                  {/* Collapsed: short teaser + reveal button */}
                  {!showOffPeakDetails && (
                    <div className="nudge-teaser">
                      <span className="nudge-teaser-text">
                        {lang === 'MN'
                          ? `Огноогоо өөрчлөн `
                          : `Switch your date and save `}
                        <strong style={{ color: '#4ade80' }}>
                          {offPeakSuggestion.saving.toLocaleString()}₮
                        </strong>
                        {lang === 'MN' ? ` хэмнэх боломжтой` : ``}
                      </span>
                      <button
                        className="nudge-reveal-btn"
                        onClick={() => setShowOffPeakDetails(true)}
                      >
                        {lang === 'MN' ? 'Дэлгэрэнгүй харах →' : 'See how →'}
                      </button>
                    </div>
                  )}

                  {/* Expanded: full details */}
                  {showOffPeakDetails && (
                    <div className="nudge-details">
                      <div className="nudge-subtitle">
                        {lang === 'MN' ? (
                          <>
                            Өрөөгөө <strong>{offPeakSuggestion.day}</strong> гарагт захиалвал{' '}
                            <strong style={{ color: '#4ade80' }}>
                              {offPeakSuggestion.saving.toLocaleString()}₮
                            </strong>{' '}
                            хэмнэгдэж, нийт дүн{' '}
                            <strong>{offPeakSuggestion.newTotal.toLocaleString()}₮</strong>{' '}
                            болно.
                          </>
                        ) : (
                          <>
                            Book for <strong>{offPeakSuggestion.day}</strong> to save{' '}
                            <strong style={{ color: '#4ade80' }}>
                              {offPeakSuggestion.saving.toLocaleString()}₮
                            </strong>{' '}
                            — total drops to{' '}
                            <strong>{offPeakSuggestion.newTotal.toLocaleString()}₮</strong>.
                          </>
                        )}
                      </div>
                      <div className="nudge-savings-row">
                        <div className="nudge-savings-item">
                          <span className="nudge-savings-label">
                            {lang === 'MN' ? 'Одоогийн дүн' : 'Current total'}
                          </span>
                          <span className="nudge-savings-value nudge-savings-old">
                            {cartTotal.toLocaleString()}₮
                          </span>
                        </div>
                        <span className="nudge-savings-arrow">→</span>
                        <div className="nudge-savings-item">
                          <span className="nudge-savings-label">
                            {lang === 'MN' ? offPeakSuggestion.day + ' гарагт' : 'On ' + offPeakSuggestion.day}
                          </span>
                          <span className="nudge-savings-value nudge-savings-new">
                            {offPeakSuggestion.newTotal.toLocaleString()}₮
                          </span>
                        </div>
                      </div>
                      <button
                        className="nudge-collapse-btn"
                        onClick={() => setShowOffPeakDetails(false)}
                      >
                        {lang === 'MN' ? '↑ Хураах' : '↑ Collapse'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TWO-COLUMN GRID */}
        <div className="checkout-grid">

          {/* LEFT — Contact Form */}
          <div>
            <section className="checkout-section glass-panel-light">
              <h2>{lang === 'MN' ? 'Холбоо барих мэдээлэл' : 'Contact Information'}</h2>

              <div className="form-group">
                <label>{lang === 'MN' ? 'Бүтэн нэр *' : 'Full Name *'}</label>
                <input
                  type="text"
                  placeholder={lang === 'MN' ? 'Таны бүтэн нэр' : 'Your full name'}
                  value={formData.fullName}
                  onChange={(e) =>
                    dispatch({ type: 'SET_FIELD', field: 'fullName', value: e.target.value })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{lang === 'MN' ? 'Имэйл *' : 'Email *'}</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>{lang === 'MN' ? 'Утасны дугаар *' : 'Phone *'}</label>
                  <input
                    type="tel"
                    placeholder="+976 ..."
                    value={formData.phone}
                    onChange={(e) =>
                      dispatch({ type: 'SET_FIELD', field: 'phone', value: e.target.value })
                    }
                  />
                </div>
              </div>
            </section>

            {/* CONFIRM BUTTON */}
            <button
              className="confirm-order-btn"
              onClick={handleConfirmOrder}
              disabled={cartItems.length === 0 || loading}
            >
              {loading ? (
                lang === 'MN' ? 'Боловсруулж байна...' : 'Processing...'
              ) : (
                <>
                  <span>{lang === 'MN' ? 'Захиалга баталгаажуулах' : 'Confirm Order'}</span>
                  <span className="confirm-total-label">
                    — {displayTotal.toLocaleString()}₮
                    {selectedSplit ? ` (${selectedSplit}×)` : ''}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT — Order Summary */}
          <aside className="order-summary-side glass-panel-light">
            <h2>{lang === 'MN' ? 'Захиалгын тойм' : 'Order Summary'}</h2>

            <div className="summary-items">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  {lang === 'MN' ? 'Сагс хоосон байна' : 'Your cart is empty'}
                </div>
              ) : (
                /* map() — Lecture: "map(): transform each element" */
                cartItems.map((item, index) => (
                  <div key={index} className="summary-item">
                    <div className="summary-item-left">
                      <h4>{item.title}</h4>
                      <p>
                        <span className={`type-badge type-badge--${item.type?.toLowerCase()}`}>
                          {item.type}
                        </span>
                        {' '}× {item.quantity}
                      </p>
                    </div>
                    <span className="summary-item-price">
                      {(item.price * item.quantity).toLocaleString()}₮
                    </span>
                  </div>
                ))
              )}
            </div>

            <hr />

            <div className="summary-totals">
              <div className="summary-line">
                <span>{lang === 'MN' ? 'Нийт дүн' : 'Subtotal'}</span>
                <span>{cartTotal.toLocaleString()}₮</span>
              </div>

              {selectedSplit && (
                <div className="summary-line" style={{ color: 'var(--primary)' }}>
                  <span>
                    {lang === 'MN' ? `1-р төлбөр (${selectedSplit}-д хувааж)` : `1st installment (÷${selectedSplit})`}
                  </span>
                  <span>{Math.ceil(cartTotal / selectedSplit).toLocaleString()}₮</span>
                </div>
              )}

              <div className="summary-line total">
                <span>{lang === 'MN' ? 'Нийт' : 'Total'}</span>
                <span style={{ color: 'var(--primary)' }}>
                  {displayTotal.toLocaleString()}₮
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
