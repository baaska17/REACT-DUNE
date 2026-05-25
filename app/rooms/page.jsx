'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useCart } from '@/src/context/CartContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function RoomsContent() {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomStates, setRoomStates] = useState({});

  const checkin =
    searchParams.get('checkin') || 'Not selected';

  const checkout =
    searchParams.get('checkout') || 'Not selected';

  const guests =
    searchParams.get('guests') || '1';

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch('/api/rooms');

        const data = await res.json();

        setRooms(data);

        const initialStates = {};

        data.forEach((room) => {
          initialStates[room.id] = {
            adults: 1,
            children: 0,
          };
        });

        setRoomStates(initialStates);
      } catch (error) {
        console.error(
          'Failed to fetch rooms:',
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, []);

  // useMemo — хонуудын тоог checkin/checkout өөрчлөгдөхөд л дахин тооцно
  // Lecture: "useMemo: cache expensive computation, only recalculates when deps change"
  const nights = useMemo(() => {
    if (
      !checkin || !checkout ||
      checkin === 'Not selected' ||
      checkout === 'Not selected'
    ) return 1;
    const d1 = new Date(checkin);
    const d2 = new Date(checkout);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 1;
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkin, checkout]);

  // useCallback — функцийн reference тогтворжуулна
  // Lecture: "useCallback: memoize a function reference"
  const updateCount = useCallback((roomId, type, delta, max) => {
    setRoomStates((prev) => {
      const current = prev[roomId][type];
      const next = current + delta;
      if (type === 'adults' && (next < 1 || next > (max || 10))) return prev;
      if (type === 'children' && next < 0) return prev;
      return { ...prev, [roomId]: { ...prev[roomId], [type]: next } };
    });
  }, []);

  const handleAddToCart = useCallback((room) => {
    const state = roomStates[room.id];
    const totalPrice = room.price * nights;

    addToCart({
      ...room,
      type: 'ROOM',
      title: `${room.title} (${nights} night${nights > 1 ? 's' : ''}: ${state.adults} Adults, ${state.children} Children)`,
      quantity: 1,
      price: totalPrice,
      bookingDates: { checkin, checkout, nights },
    });
  }, [roomStates, nights, checkin, checkout, addToCart]);

  if (loading)
    return (
      <div className="loading-state">
        {t.common.loading}
      </div>
    );

  return (
    <div className="rooms-page">
      <main className="container room-selection-container">
        <section className="selection-header">
          <h1>{t.rooms.pageTitle}</h1>

          <div className="booking-summary">
            <div>
              <strong>{t.common.checkIn}:</strong>{' '}
              <span className="summary-value">{checkin}</span>
            </div>
            <div>
              <strong>{t.common.checkOut}:</strong>{' '}
              <span className="summary-value">{checkout}</span>
            </div>
            <div>
              <strong>{t.common.guests}:</strong>{' '}
              <span className="summary-value">{guests}</span>
            </div>
          </div>
        </section>

        <div className="room-content-grid single-column">
          <div className="room-list">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="room-card glass-panel"
              >
                <div className="room-image-side">
                  <img
                    src={
                      room.image
                        ? room.image.startsWith(
                            '/'
                          )
                          ? room.image
                          : `/${room.image}`
                        : '/ger.jpg'
                    }
                    alt={room.title}
                    onError={(e) => {
                      e.target.src =
                        '/ger.jpg';
                    }}
                  />

                  <Link
                    href={`/rooms/${room.id}`}
                    className="room-details-btn"
                  >
                    {t.rooms.roomDetails}
                  </Link>
                </div>

                <div className="room-info-side">
                  <div className="room-details-top">
                    <h2>{room.title}</h2>

                    {room.breakfast && (
                      <span className="badge-included">
                        {t.rooms.breakfastBadge}
                      </span>
                    )}

                    <p
                      className="room-description-short"
                      style={{
                        color: '#888',
                        margin: '10px 0',
                      }}
                    >
                      {room.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        gap: '15px',
                        flexWrap: 'wrap',
                        marginTop: '10px',
                        color: '#ccc',
                        fontSize: '0.95rem',
                      }}
                    >
                      {room.wifi && (
                        <span>✓ WiFi</span>
                      )}

                      {room.heating && (
                        <span>✓ Heating</span>
                      )}

                      {room.airConditioning && (
                        <span>
                          ✓ Air Conditioning
                        </span>
                      )}

                      {room.kitchen && (
                        <span>✓ Kitchen</span>
                      )}
                    </div>
                  </div>

                  <div className="room-controls">
                    <div className="counter-group">
                      <label>{t.common.adults}</label>

                      <div className="counter">
                        <button
                          className="minus"
                          onClick={() =>
                            updateCount(
                              room.id,
                              'adults',
                              -1,
                              room.maxAdults
                            )
                          }
                        >
                          -
                        </button>

                        <span className="count">
                          {roomStates[room.id]
                            ?.adults || 1}
                        </span>

                        <button
                          className="plus"
                          onClick={() =>
                            updateCount(
                              room.id,
                              'adults',
                              1,
                              room.maxAdults
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="counter-group">
                      <label>{t.common.children}</label>

                      <div className="counter">
                        <button
                          className="minus"
                          onClick={() =>
                            updateCount(
                              room.id,
                              'children',
                              -1
                            )
                          }
                        >
                          -
                        </button>

                        <span className="count">
                          {roomStates[room.id]
                            ?.children || 0}
                        </span>

                        <button
                          className="plus"
                          onClick={() =>
                            updateCount(
                              room.id,
                              'children',
                              1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className="btn-gold"
                      onClick={() => handleAddToCart(room)}
                    >
                      {t.common.bookRoom}
                    </button>
                  </div>
                </div>

                <div className="room-price-side">
                  <div className="price-display">
                    <span className="total-price">
                      {room.price.toLocaleString()}
                      ₮
                    </span>

                    <span className="per-night">
                      {t.common.perNight}
                    </span>

                    <div
                      style={{
                        marginTop: '15px',
                        color: '#888',
                        fontSize: '0.9rem',
                      }}
                    >
                      {t.rooms.maxAdults} {room.maxAdults} {t.rooms.adultsLabel}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function RoomsPage() {
  const { t } = useLanguage();

  return (
    <Suspense
      fallback={
        <div className="loading-state">
          {t.common.loading}
        </div>
      }
    >
      <RoomsContent />
    </Suspense>
  );
}