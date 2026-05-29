/**
 * Өрөөний дэлгэрэнгүй хуудас (Room Detail Page) - Baaska
 * Тухайн нэг өрөөний мэдээлэл, зураг, үнэ, тоноглол болон сэтгэгдлийг харуулна.
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMemo } from 'react';
import { useCart } from '@/src/context/CartContext';
import CommentSection from '@/src/components/CommentSection';
import '@/src/styles/room-details.css';

export default function RoomDetailsPage() {
  const { id } = useParams(); // URL-аас өрөөний ID-г авах
  const router = useRouter(); // Хуудас шилжүүлэхэд ашиглана
  const searchParams = useSearchParams(); // URL-аас огноог уншихад ашиглана
  const { addToCart } = useCart(); // Сагсанд нэмэх контекст

  const [room, setRoom] = useState(null); // Өрөөний өгөгдөл
  const [loading, setLoading] = useState(true); // Ачаалж буй төлөв
  const [selectedImage, setSelectedImage] = useState(null); // Lightbox-д харуулах зураг

  // URL-аас огноог авах
  const checkin = searchParams.get('checkin');
  const checkout = searchParams.get('checkout');

  // Хоногийн тоог огнооноос хамааран тооцоолох (useMemo)
  const nights = useMemo(() => {
    if (!checkin || !checkout) return 1;
    const d1 = new Date(checkin);
    const d2 = new Date(checkout);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 1;
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkin, checkout]);

  // Өрөөний мэдээллийг серверээс татах
  useEffect(() => {
    async function fetchRoom() {
      try {
        const res = await fetch('/api/rooms');
        const data = await res.json();
        const found = data.find((item) => item.id === parseInt(id));
        setRoom(found);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchRoom();
  }, [id]);

  // Ачаалж байх үед харуулах текст
  if (loading) return (
    <div style={{ paddingTop: '200px', textAlign: 'center', background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--primary)' }}>
      <div className="container">Loading accommodation details...</div>
    </div>
  );

  // Өрөө олдоогүй үед харуулах текст
  if (!room) return (
    <div style={{ paddingTop: '200px', textAlign: 'center', background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      <div className="container">
        <h2>Room not found</h2>
        <Link href="/rooms" className="btn-gold" style={{ marginTop: '20px' }}>Back to Rooms</Link>
      </div>
    </div>
  );

  // Сагсанд нэмэх функц (хоногийн тоогоор үнийг бодож нэмнэ)
  const handleBookNow = () => {
    const totalPrice = room.price * nights;
    addToCart({
      ...room,
      type: 'ROOM',
      title: `${room.title} (${nights} night${nights > 1 ? 's' : ''})`,
      quantity: 1,
      price: totalPrice,
      bookingDates: { checkin, checkout, nights },
    });
    router.push('/checkout');
  };

  // Зургийн URL-г зөв хэлбэрт оруулах
  const getImgUrl = (path) => {
    if (!path) return '/ger.jpg';
    return path.startsWith('/') ? path : `/${path}`;
  };

  return (
    <div className="room-detail-page">
      <main className="room-details-container">
        <div className="container">
          {/* Breadcrumbs болон гарчиг */}
          <div className="room-details-header">
            <nav className="breadcrumbs" style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', marginBottom: '15px', color: 'var(--text-secondary)' }}>
              <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <Link href="/rooms" style={{ color: 'inherit', textDecoration: 'none' }}>Rooms</Link>
              <span>/</span>
              <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{room.title}</span>
            </nav>
            <h1 className="room-title">{room.title}</h1>
            <div className="room-meta-info">
              <span>⭐ {room.rating || 5.0}</span>
              <span className="dot">•</span>
              <span>👤 {room.maxAdults} Adults · {room.maxChildren} Children</span>
            </div>
          </div>

          {/* GALLERY - 1 том, 2 жижиг зургийн бүтэц */}
          <div className="room-details-gallery">
            {/* Үндсэн зураг */}
            <div className="gallery-main-frame" onClick={() => setSelectedImage(getImgUrl(room.image))}>
              <img src={getImgUrl(room.image)} alt={room.title} onError={(e) => { e.target.src = '/ger.jpg'; }} />
            </div>

            {/* Баруун талын туслах зургууд */}
            <div className="gallery-side-frame">
              <div className="gallery-thumb" onClick={() => setSelectedImage(getImgUrl(room.image2 || room.image))}>
                <img src={getImgUrl(room.image2 || room.image)} alt="view 2" onError={(e) => { e.target.src = '/ger.jpg'; }} />
              </div>
              <div className="gallery-thumb" onClick={() => setSelectedImage(getImgUrl(room.image3 || room.image))}>
                <img src={getImgUrl(room.image3 || room.image)} alt="view 3" onError={(e) => { e.target.src = '/ger.jpg'; }} />
              </div>
            </div>
          </div>

          <div className="room-details-content">
            {/* Зүүн тал: Тайлбар болон Тоноглолууд */}
            <div className="content-left-col">
              <section className="room-section">
                <h2>Description</h2>
                <p>{room.description}</p>
              </section>
              <section className="room-section">
                <h2>Amenities</h2>
                <div className="amenities-grid">
                  {room.wifi && <div className="amenity-item"><div className="icon-box">📶</div><span>WiFi</span></div>}
                  {room.heating && <div className="amenity-item"><div className="icon-box">🔥</div><span>Heating</span></div>}
                  {room.airConditioning && <div className="amenity-item"><div className="icon-box">❄️</div><span>Air Conditioning</span></div>}
                  {room.breakfast && <div className="amenity-item"><div className="icon-box">🍳</div><span>Breakfast Included</span></div>}
                  {room.kitchen && <div className="amenity-item"><div className="icon-box">🍽️</div><span>Kitchen</span></div>}
                </div>
              </section>
            </div>

            {/* Баруун тал: Захиалгын карт (Sticky) */}
            <div className="content-right-col">
              <div className="sticky-booking-card">
                <div className="booking-price-header">
                  <span className="amount">{(room.price * nights).toLocaleString()}₮</span>
                  <span className="per" style={{ color: 'var(--text-secondary)' }}>{nights > 1 ? `/ ${nights} nights` : '/ night'}</span>
                </div>
                <div className="booking-box">
                  <div className="booking-item">
                    <label>Stay Policy</label>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Check-in 14:00 | Check-out 11:00</div>
                  </div>
                </div>
                <button onClick={handleBookNow} className="reserve-button">Book Now</button>
                <p className="hint">No immediate payment required</p>
              </div>
            </div>
          </div>

          {/* Сэтгэгдлийн хэсэг */}
          <div className="review-section-wrapper" style={{ marginTop: '4rem', padding: '3rem', background: 'var(--bg-secondary)', borderRadius: '2rem', border: '1px solid var(--border-color)' }}>
            <CommentSection type="room" targetId={room.id} />
          </div>
        </div>
      </main>

      {/* Lightbox: Зургийг томоор үзэх */}
      {selectedImage && (
        <div className="image-lightbox" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Preview" />
          <span className="close-x">&times;</span>
        </div>
      )}
    </div>
  );
}
