'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { useCart } from '@/src/context/CartContext';
import { useLanguage } from '@/src/context/LanguageContext';
import CommentSection from '@/src/components/CommentSection';

const TIME_SLOTS = ['09:00', '11:00', '13:00', '15:00', '17:00'];

export default function HorseRidePage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const [peopleCount, setPeopleCount] = useState(0);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);

  // Morin aylaliig fetch hiih
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/adventures');
        const data = await res.json();
        setExperiences(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  //Zahialgiin medeelel fetch

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    }
    fetchOrders();
  }, []);

  //Zahialsan tsag tootsoh logic

  const reservedTimes = useMemo(() => {
    if (!selectedExperience || !selectedDate) return new Set();

    const reserved = new Set();

    orders.forEach((order) => {
      if (order.status === 'CANCELLED') return;
      (order.items || []).forEach((item) => {
        if (
          item.itemType === 'ADVENTURE' &&
          item.itemId === selectedExperience.id &&
          item.checkin === selectedDate &&
          item.checkout
        ) {
          reserved.add(item.checkout);
        }
      });
    });

    return reserved;
  }, [orders, selectedExperience, selectedDate]);


  //Zahialgagui tsag bodoh

  const availableTimes = useMemo(
    () => TIME_SLOTS.filter((slot) => !reservedTimes.has(slot)),
    [reservedTimes]
  );

  useEffect(() => {
    if (availableTimes.length === 0) {
      setSelectedTime('');
      return;
    }
    if (!availableTimes.includes(selectedTime)) {
      setSelectedTime(availableTimes[0]);
    }
  }, [availableTimes, selectedTime]);

  // useMemo — Niit uniig people count oorchlogdohod l dahin bodno
  const totalPrice = useMemo(
    () => (selectedExperience?.price || 0) * peopleCount,
    [selectedExperience, peopleCount]
  );

 
  //ADD TO CART

  const handleAddToCart = useCallback(() => {
    if (!selectedExperience || !selectedTime) return;

    addToCart({
      ...selectedExperience,
      type: 'ADVENTURE',
      title: `${selectedExperience.title} (${peopleCount} People)`,
      price: totalPrice,
      quantity: 1,
      bookingDates: {
        checkin: selectedDate,
        checkout: selectedTime,
        time: selectedTime,
      },
    });
  }, [selectedExperience, peopleCount, totalPrice, selectedDate, selectedTime, addToCart]);

  /*
  BOOK NOW - Add to cart hiih function duudaj baigaa, daraa ni checkout ruu yvuulna
  */

  const handleBookNow = useCallback(() => {
    if (!selectedExperience) return;

    handleAddToCart();

    router.push('/checkout');
  }, [selectedExperience, handleAddToCart, router]);

  /*
  LOADING-Backend ees data avaad irtel haragdana.
  */

  if (loading)
    return (
      <div className="loading-state">
        {t.common.loading}
      </div>
    );

  /*
  RENDER-Undsen UI. Experience songoogui bol button haana. Comment sectioniig zowhon experience songogdson uyd harulna.
  */

  return (
    <div className="horse-page">
      <main>
        {/* HERO */}

        <section className="horse-hero">
          <div className="container hero-content-left">
            <nav className="breadcrumbs">
              <a href="/">Home</a>

              <span>&gt;</span>

              <span className="current">
                {t.horse.breadcrumb}
              </span>
            </nav>

            <h1>{t.horse.heroTitle}</h1>

            <p className="tagline">{t.horse.heroTagline}</p>
          </div>
        </section>

        {/* MAIN */}

        <div className="container main-content-area">
          {/* QUICK INFO */}

          <section className="quick-info-grid">
            <div className="info-card">
              <span className="info-icon">
                <img
                  src="/clock.png"
                  alt="Duration"
                />
              </span>

              <div>
                <span className="info-label">{t.horse.durationLabel}</span>
                <span className="info-value">{t.horse.durationValue}</span>
              </div>
            </div>

            <div className="info-card">
              <span className="info-icon">
                <img
                  src="/chicken.png"
                  alt="Level"
                />
              </span>

              <div>
                <span className="info-label">{t.horse.levelLabel}</span>
                <span className="info-value">{t.horse.levelValue}</span>
              </div>
            </div>

            <div className="info-card">
              <span className="info-icon">
                <img
                  src="/shield.png"
                  alt="Safety"
                />
              </span>

              <div>
                <span className="info-label">
                  {t.horse.includesLabel}
                </span>

                <span className="info-value">
                  {t.horse.includesValue}
                </span>
              </div>
            </div>
          </section>

          {/* GRID */}

          <div className="selection-booking-grid">
            {/* LEFT */}

            <div className="selection-side">
              <div className="section-title-group">
                <h2>{t.horse.chooseExp}</h2>

                <p>{t.horse.chooseSubtitle}</p>
              </div>

              {/* EXPERIENCE LIST */}

              <div className="experience-list">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className={`exp-card ${
                      selectedExperience?.id === exp.id ? 'active' : ''
                    }`}
                    onClick={() => setSelectedExperience(exp)}
                  >
                    <div className="exp-image-side">
                      <img
                        src={
                          exp.image
                            ? exp.image.startsWith(
                                '/'
                              )
                              ? exp.image
                              : `/${exp.image}`
                            : '/horse.jpg'
                        }
                        alt={exp.title}
                        onError={(e) => {
                          e.target.src =
                            '/horse.jpg';
                        }}
                      />
                    </div>

                    <div className="exp-info-side">
                      <div className="exp-header">
                        <h3>{exp.title}</h3>

                        <span className="exp-price">
                          {exp.price.toLocaleString()}
                          ₮
                        </span>
                      </div>

                      <p className="exp-desc">
                        {exp.description}
                      </p>

                      <div className="exp-meta">
                        <span>{t.common.perPerson}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* SAFETY */}

              <div className="content-section card-box safety-section">
                <h3>{t.horse.safetyTitle}</h3>

                <ul className="dot-list">
                  <li>{t.horse.safety1}</li>
                  <li>{t.horse.safety2}</li>
                  <li>{t.horse.safety3}</li>
                  <li>{t.horse.safety4}</li>
                </ul>
              </div>

              {/* COMMENTS */}

              <div
                className="review-section-wrapper"
                style={{
                  marginTop: '5rem',

                  padding: '3rem',

                  background:
                    'var(--bg-secondary)',

                  borderRadius: '2rem',

                  border:
                    '1px solid var(--border-color)',
                }}
              >
                {selectedExperience && (
                  <CommentSection
                    type="adventure"
                    targetId={
                      selectedExperience.id
                    }
                  />
                )}
              </div>
            </div>

            {/* RIGHT */}

            <aside className="booking-sidebar">
              <div className="booking-card">
                <h3>{t.horse.bookYourRide}</h3>

                <div className="booking-form">
                  <div className="form-group">
                    <label>
                      {t.horse.peopleCount}{' '}
                      ({t.horse.maxPeople}:{' '}
                      {selectedExperience?.maxPersons || 10})
                    </label>

                    <input
                      type="number"
                      value={peopleCount}
                      min="1"
                      max={
                        selectedExperience?.maxPersons ||
                        10
                      }
                      onChange={(e) => {
                        const val =
                          parseInt(
                            e.target.value
                          ) || 1;

                        const max =
                          selectedExperience?.maxPersons ||
                          10;

                        setPeopleCount(
                          val > max
                            ? max
                            : val
                        );
                      }}
                    />

                    {peopleCount >=
                      (selectedExperience?.maxPersons ||
                        10) && (
                      <p
                        style={{
                          color:
                            'var(--primary)',

                          fontSize:
                            '0.8rem',

                          marginTop:
                            '5px',
                        }}
                      >
                        {t.horse.maxWarningPre}{' '}
                        {selectedExperience?.maxPersons}{' '}
                        {t.horse.maxWarningSuf}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>{t.horse.dateLabel}</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t.horse.timeLabel}</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      disabled={availableTimes.length === 0}
                    >
                      <option value="">{t.horse.chooseTimeSlot}</option>
                      {availableTimes.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    {availableTimes.length === 0 && (
                      <p className="help-text">
                        {t.horse.noTimesAvailable}
                      </p>
                    )}
                  </div>

                  {/* PRICE */}

                  <div className="price-summary">
                    <div className="total-line">
                      <span>{t.common.total}</span>

                      <span>
                        {totalPrice.toLocaleString()}₮
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="booking-actions">
                    <button
                      className="btn-gold booking-btn"
                      onClick={handleAddToCart}
                      disabled={!selectedExperience || !selectedTime}
                    >
                      {t.common.addToCart}
                    </button>

                    <button
                      className="btn-gold booking-btn"
                      onClick={handleBookNow}
                      disabled={!selectedExperience || !selectedTime}
                    >
                      {t.common.payNow}
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}