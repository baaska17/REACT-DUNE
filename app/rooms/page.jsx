'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useCart } from '@/src/context/CartContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import BookingForm from '@/src/components/BookingForm';

function RoomsContent() {
  const { addToCart } = useCart(); // Сагсанд нэмэх функц
  const { t } = useLanguage(); // Орчуулгын текстүүд
  const searchParams = useSearchParams(); // URL-аас хайлтын утгуудыг авах

  const [rooms, setRooms] = useState([]); // Өрөөний өгөгдлүүд
  const [orders, setOrders] = useState([]); // Бүх захиалгууд (үлдэгдэл тооцоход ашиглана)
  const [loading, setLoading] = useState(true); // Ачаалж буй төлөв
  const [roomStates, setRoomStates] = useState({}); // Өрөө бүрийн хүн амны тоо (state)

  // URL-аас захиалгын мэдээллийг унших
  const checkin = searchParams.get('checkin') || 'Not selected';
  const checkout = searchParams.get('checkout') || 'Not selected';
  const guests = searchParams.get('guests') || '1';

  // Өгөгдлүүдийг API-аас татах
  useEffect(() => {
    async function fetchData() {
      try {
        const [roomsRes, ordersRes] = await Promise.all([
          fetch('/api/rooms'),
          fetch('/api/orders')
        ]);

        const roomsData = await roomsRes.json();
        const ordersData = await ordersRes.json();

        setRooms(roomsData);
        setOrders(ordersData);

        // Өрөө бүрийн анхны хүн амны тоог 1 насанд хүрэгчээр тохируулах
        const initialStates = {};
        roomsData.forEach((room) => {
          initialStates[room.id] = { adults: 1, children: 0 };
        });
        setRoomStates(initialStates);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // useMemo ашиглан хоногийн тоог тооцоолох (огноо өөрчлөгдөхөд л дахин ажиллана)
  const nights = useMemo(() => {
    if (!checkin || !checkout || checkin === 'Not selected' || checkout === 'Not selected') return 1;
    const d1 = new Date(checkin);
    const d2 = new Date(checkout);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 1;
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkin, checkout]);

  // Сонгосон огноонд тухайн өрөө хэдэн ширхэг сул байгааг тооцоолох
  const getAvailableCount = useCallback((room) => {
    if (checkin === 'Not selected' || checkout === 'Not selected') return room.totalUnits;

    const selStart = new Date(checkin);
    const selEnd = new Date(checkout);

    const bookedCount = orders.reduce((total, order) => {
      if (order.status === 'CANCELLED') return total;

      const overlappingItems = (order.items || []).filter(item => {
        if (item.itemType !== 'ROOM' || item.itemId !== room.id || !item.checkin || !item.checkout) return false;
        const orderStart = new Date(item.checkin);
        const orderEnd = new Date(item.checkout);
        // Огноо давхцаж буй эсэхийг шалгах logic
        return selStart < orderEnd && selEnd > orderStart;
      });

      return total + overlappingItems.reduce((s, i) => s + i.quantity, 0);
    }, 0);

    return Math.max(0, room.totalUnits - bookedCount);
  }, [checkin, checkout, orders]);

  // Насанд хүрэгч, хүүхдийн тоог өөрчлөх функц
  const updateCount = useCallback((roomId, type, delta, max) => {
    setRoomStates((prev) => {
      const current = prev[roomId][type];
      const next = current + delta;
      if (type === 'adults' && (next < 1 || next > (max || 10))) return prev;
      if (type === 'children' && next < 0) return prev;
      return { ...prev, [roomId]: { ...prev[roomId], [type]: next } };
    });
  }, []);

  // Сагсанд нэмэх үйлдэл
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

  // Админ панел дээр сонгосон үндсэн зургийг авах
  const getActiveImage = (room) => {
    if (room.mainImageIndex === 2 && room.image2) return room.image2;
    if (room.mainImageIndex === 3 && room.image3) return room.image3;
    return room.image;
  };

  if (loading) return <div className="loading-state">{t.common.loading}</div>;

  return (
    <div className="rooms-page">
      <main className="container room-selection-container">
        {/* Хуудасны толгой хэсэг болон хайлтын форм */}
        <section className="selection-header">
          <h1>{t.rooms.pageTitle}</h1>
          <div className="rooms-booking-container">
            <BookingForm />
          </div>
        </section>

        {/* Өрөөнүүдийн жагсаалт */}
        <div className="room-content-grid single-column">
          <div className="room-list">
            {rooms.map((room) => (
              <div key={room.id} className="room-card glass-panel">
                {/* Зургийн хэсэг */}
                <div className="room-image-side">
                  <img
                    src={getActiveImage(room) ? (getActiveImage(room).startsWith('/') ? getActiveImage(room) : `/${getActiveImage(room)}`) : '/ger.jpg'}
                    alt={room.title}
                    onError={(e) => { e.target.src = '/ger.jpg'; }}
                  />
                  <Link href={`/rooms/${room.id}`} className="room-details-btn">
                    {t.rooms.roomDetails}
                  </Link>
                </div>

                {/* Мэдээллийн хэсэг */}
                <div className="room-info-side">
                  <div className="room-details-top">
                    <h2>{room.title}</h2>
                    {room.breakfast && <span className="badge-included">{t.rooms.breakfastBadge}</span>}
                    <p className="room-description-short">{room.description}</p>

                    {/* Сул байгаа өрөөний тоог харуулах (Badge) */}
                    <div className="availability-badge" style={{
                      fontSize: '0.85rem', fontWeight: '700',
                      color: getAvailableCount(room) > 0 ? '#4ade80' : '#f87171',
                      background: getAvailableCount(room) > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      padding: '4px 10px', borderRadius: '8px', display: 'inline-block', marginBottom: '10px'
                    }}>
                      {getAvailableCount(room)} / {room.totalUnits} {t.common.available || 'available'}
                    </div>

                    {/* Өрөөний тоноглолууд */}
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '10px', color: '#ccc', fontSize: '0.95rem' }}>
                      {room.wifi && <span>✓ WiFi</span>}
                      {room.heating && <span>✓ Heating</span>}
                      {room.airConditioning && <span>✓ Air Conditioning</span>}
                      {room.kitchen && <span>✓ Kitchen</span>}
                    </div>
                  </div>

                  {/* Захиалгын удирдлага (тоолуур болон товч) */}
                  <div className="room-controls">
                    <div className="counter-group">
                      <label>{t.common.adults}</label>
                      <div className="counter">
                        <button className="minus" onClick={() => updateCount(room.id, 'adults', -1, room.maxAdults)}>-</button>
                        <span className="count">{roomStates[room.id]?.adults || 1}</span>
                        <button className="plus" onClick={() => updateCount(room.id, 'adults', 1, room.maxAdults)}>+</button>
                      </div>
                    </div>

                    <div className="counter-group">
                      <label>{t.common.children}</label>
                      <div className="counter">
                        <button className="minus" onClick={() => updateCount(room.id, 'children', -1)}>-</button>
                        <span className="count">{roomStates[room.id]?.children || 0}</span>
                        <button className="plus" onClick={() => updateCount(room.id, 'children', 1)}>+</button>
                      </div>
                    </div>

                    {/* Сул гэр байгаа эсэхээс хамаарч товчийг идэвхжүүлэх/идэвхгүй болгох */}
                    <button
                      className="btn-gold"
                      onClick={() => handleAddToCart(room)}
                      disabled={getAvailableCount(room) <= 0}
                      style={getAvailableCount(room) <= 0 ? { opacity: 0.5, cursor: 'not-allowed', filter: 'grayscale(1)' } : {}}
                    >
                      {getAvailableCount(room) > 0 ? t.common.bookRoom : (t.common.soldOut || 'Sold Out')}
                    </button>
                  </div>
                </div>

                {/* Үнийн хэсэг (хоногийн тоогоор бодож харуулна) */}
                <div className="room-price-side">
                  <div className="price-display">
                    {nights > 1 ? (
                      <>
                        <span className="total-price">{(room.price * nights).toLocaleString()}₮</span>
                        <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>
                          {room.price.toLocaleString()}₮ × {nights} {t.common.nights || 'nights'}
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="total-price">{room.price.toLocaleString()}₮</span>
                        <span className="per-night">{t.common.perNight}</span>
                      </>
                    )}
                    <div style={{ marginTop: '15px', color: '#888', fontSize: '0.9rem' }}>
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
    <Suspense fallback={<div className="loading-state">{t.common.loading}</div>}>
      <RoomsContent />
    </Suspense>
  );
}
