'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { useCart } from '@/src/context/CartContext';
import { useLanguage } from '@/src/context/LanguageContext';
import CommentSection from '@/src/components/CommentSection';

export default function HorseRidePage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const [peopleCount, setPeopleCount] =
    useState(1);

  const [
    selectedExperience,
    setSelectedExperience,
  ] = useState(null);

  const [experiences, setExperiences] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  /*
  ========================================
  FETCH ADVENTURES
  ========================================
  */

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          '/api/adventures'
        );

        const data = await res.json();

        setExperiences(data);

        if (data.length > 0) {
          setSelectedExperience(data[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // useMemo — нийт үнийг peopleCount өөрчлөгдөхөд л дахин тооцно
  // Lecture: "useMemo: only recalculates when deps change"
  const totalPrice = useMemo(
    () => (selectedExperience?.price || 0) * peopleCount,
    [selectedExperience, peopleCount]
  );

  /*
  ========================================
  ADD TO CART
  useCallback — функцийн reference тогтворжуулна
  Lecture: "useCallback: memoize a function reference"
  ========================================
  */

  const handleAddToCart = useCallback(() => {
    if (!selectedExperience) return;

    addToCart({
      ...selectedExperience,

      type: 'ADVENTURE',

      title: `${selectedExperience.title} (${peopleCount} People)`,

      price: totalPrice,

      quantity: 1,
    });
  }, [selectedExperience, peopleCount, totalPrice, addToCart]);

  /*
  ========================================
  BOOK NOW
  ========================================
  */

  const handleBookNow = useCallback(() => {
    if (!selectedExperience) return;

    handleAddToCart();

    router.push('/checkout');
  }, [selectedExperience, handleAddToCart, router]);

  /*
  ========================================
  LOADING
  ========================================
  */

  if (loading)
    return (
      <div className="loading-state">
        {t.common.loading}
      </div>
    );

  /*
  ========================================
  RENDER
  ========================================
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
                      selectedExperience?.id ===
                      exp.id
                        ? 'active'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedExperience(
                        exp
                      )
                    }
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
                      onClick={
                        handleAddToCart
                      }
                      disabled={
                        !selectedExperience
                      }
                    >
                      {t.common.addToCart}
                    </button>

                    <button
                      className="btn-gold booking-btn"
                      onClick={handleBookNow}
                      disabled={!selectedExperience}
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