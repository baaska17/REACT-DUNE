'use client';

import { useState, useEffect } from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import Link from 'next/link';

import { useCart } from '@/src/context/CartContext';

import CommentSection from '@/src/components/CommentSection';

import '@/src/styles/room-details.css';

export default function RoomDetailsPage() {
  const { id } = useParams();

  const router = useRouter();

  const { addToCart } = useCart();

  const [room, setRoom] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [selectedImage, setSelectedImage] =
    useState(null);

  /*
  ========================================
  FETCH ROOM
  ========================================
  */

  useEffect(() => {
    async function fetchRoom() {
      try {
        const res = await fetch(
          '/api/rooms'
        );

        const data = await res.json();

        const found = data.find(
          (item) =>
            item.id === parseInt(id)
        );

        setRoom(found);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchRoom();
  }, [id]);

  /*
  ========================================
  LOADING
  ========================================
  */

  if (loading)
    return (
      <div
        style={{
          paddingTop: '200px',
          textAlign: 'center',
          background:
            'var(--bg-primary)',
          minHeight: '100vh',
          color: 'var(--primary)',
        }}
      >
        <div className="container">
          Loading accommodation
          details...
        </div>
      </div>
    );

  /*
  ========================================
  ROOM NOT FOUND
  ========================================
  */

  if (!room)
    return (
      <div
        style={{
          paddingTop: '200px',
          textAlign: 'center',
          background:
            'var(--bg-primary)',
          minHeight: '100vh',
          color:
            'var(--text-primary)',
        }}
      >
        <div className="container">
          <h2>Room not found</h2>

          <Link
            href="/rooms"
            className="btn-gold"
            style={{
              marginTop: '20px',
            }}
          >
            Back to Rooms
          </Link>
        </div>
      </div>
    );

  /*
  ========================================
  BOOK ROOM
  ========================================
  */

  const handleBookNow = () => {
    addToCart({
      ...room,

      type: 'ROOM',

      quantity: 1,
    });

    router.push('/checkout');
  };

  /*
  ========================================
  IMAGE URL
  ========================================
  */

  const getImgUrl = (path) => {
    if (!path) return '/back.jpg';

    return path.startsWith('/')
      ? path
      : `/${path}`;
  };

  /*
  ========================================
  RENDER
  ========================================
  */

  return (
    <div className="room-detail-page">
      <main className="room-details-container">
        <div className="container">
          {/* HEADER */}

          <div className="room-details-header">
            <nav
              className="breadcrumbs"
              style={{
                display: 'flex',
                gap: '8px',
                fontSize: '0.9rem',
                marginBottom: '15px',
                color:
                  'var(--text-secondary)',
              }}
            >
              <Link
                href="/"
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                Home
              </Link>

              <span>/</span>

              <Link
                href="/rooms"
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                Rooms
              </Link>

              <span>/</span>

              <span
                style={{
                  color: 'var(--primary)',
                  fontWeight: '600',
                }}
              >
                {room.title}
              </span>
            </nav>

            <h1 className="room-title">
              {room.title}
            </h1>

            <div className="room-meta-info">
              <span>
                ⭐ {room.rating || 5.0}
              </span>

              <span className="dot">
                •
              </span>

              <span>
                👤 {room.maxAdults}{' '}
                Adults ·{' '}
                {room.maxChildren}{' '}
                Children
              </span>
            </div>
          </div>

          {/* GALLERY */}

          <div className="room-details-gallery">
            <div
              className="gallery-main-frame"
              onClick={() =>
                setSelectedImage(
                  getImgUrl(room.image)
                )
              }
            >
              <img
                src={getImgUrl(
                  room.image
                )}
                alt={room.title}
                onError={(e) => {
                  e.target.src =
                    '/back.jpg';
                }}
              />
            </div>

            <div className="gallery-side-frame">
              <div
                className="gallery-thumb"
                onClick={() =>
                  setSelectedImage(
                    getImgUrl(room.image)
                  )
                }
              >
                <img
                  src={getImgUrl(
                    room.image
                  )}
                  alt="view 1"
                />
              </div>

              <div
                className="gallery-thumb"
                onClick={() =>
                  setSelectedImage(
                    getImgUrl(room.image)
                  )
                }
              >
                <img
                  src={getImgUrl(
                    room.image
                  )}
                  alt="view 2"
                />
              </div>
            </div>
          </div>

          {/* CONTENT */}

          <div className="room-details-content">
            {/* LEFT */}

            <div className="content-left-col">
              {/* DESCRIPTION */}

              <section className="room-section">
                <h2>Description</h2>

                <p>
                  {room.description}
                </p>
              </section>

              {/* AMENITIES */}

              <section className="room-section">
                <h2>Amenities</h2>

                <div className="amenities-grid">
                  {room.wifi && (
                    <div className="amenity-item">
                      <div className="icon-box">
                        📶
                      </div>

                      <span>WiFi</span>
                    </div>
                  )}

                  {room.heating && (
                    <div className="amenity-item">
                      <div className="icon-box">
                        🔥
                      </div>

                      <span>
                        Heating
                      </span>
                    </div>
                  )}

                  {room.airConditioning && (
                    <div className="amenity-item">
                      <div className="icon-box">
                        ❄️
                      </div>

                      <span>
                        Air Conditioning
                      </span>
                    </div>
                  )}

                  {room.breakfast && (
                    <div className="amenity-item">
                      <div className="icon-box">
                        🍳
                      </div>

                      <span>
                        Breakfast Included
                      </span>
                    </div>
                  )}

                  {room.kitchen && (
                    <div className="amenity-item">
                      <div className="icon-box">
                        🍽️
                      </div>

                      <span>
                        Kitchen
                      </span>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* RIGHT */}

            <div className="content-right-col">
              <div
                className="sticky-booking-card"
                style={{
                  background:
                    'var(--bg-secondary)',

                  color:
                    'var(--text-primary)',

                  border:
                    '1px solid var(--border-color)',
                }}
              >
                {/* PRICE */}

                <div className="booking-price-header">
                  <span className="amount">
                    {room.price.toLocaleString()}
                    ₮
                  </span>

                  <span
                    className="per"
                    style={{
                      color:
                        'var(--text-secondary)',
                    }}
                  >
                    / night
                  </span>
                </div>

                {/* POLICY */}

                <div
                  className="booking-box"
                  style={{
                    background:
                      'rgba(255,255,255,0.04)',

                    border:
                      '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="booking-item">
                    <label>
                      Stay Policy
                    </label>

                    <div
                      style={{
                        color:
                          'var(--text-secondary)',

                        fontSize:
                          '0.9rem',
                      }}
                    >
                      Check-in 14:00 |
                      Check-out 11:00
                    </div>
                  </div>
                </div>

                {/* BUTTON */}

                <button
                  onClick={handleBookNow}
                  className="reserve-button"
                >
                  Book Now
                </button>

                {/* HINT */}

                <p
                  className="hint"
                  style={{
                    color:
                      'var(--text-secondary)',
                  }}
                >
                  No immediate payment
                  required
                </p>
              </div>
            </div>
          </div>

          {/* COMMENTS */}

          <div
            className="review-section-wrapper"
            style={{
              marginTop: '4rem',

              padding: '3rem',

              background:
                'var(--bg-secondary)',

              borderRadius: '2rem',

              border:
                '1px solid var(--border-color)',
            }}
          >
            <CommentSection
              type="room"
              targetId={room.id}
            />
          </div>
        </div>
      </main>

      {/* LIGHTBOX */}

      {selectedImage && (
        <div
          className="image-lightbox"
          onClick={() =>
            setSelectedImage(null)
          }
        >
          <img
            src={selectedImage}
            alt="Preview"
          />

          <span className="close-x">
            &times;
          </span>
        </div>
      )}
    </div>
  );
}