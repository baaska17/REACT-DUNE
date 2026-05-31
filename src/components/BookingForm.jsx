/**
 * Захиалгын Хайлтын Форм (Booking Form) - Baaska
 * Хэрэглэгч орох, гарах огноо болон зочдын тоог сонгож өрөө хайх хэрэгсэл.
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

function BookingFormContent() {
  const router = useRouter(); // Хуудас шилжүүлэх (navigation)
  const searchParams = useSearchParams(); // URL-аас одоо байгаа огноонуудыг унших
  const { t } = useLanguage();

  // Формын утгуудыг хадгалах state (анхны утгыг URL эсвэл өнөөдрийн огноогоор авна)
  const [dates, setDates] = useState({
    checkin: searchParams.get('checkin') || new Date().toISOString().split('T')[0],
    checkout: searchParams.get('checkout') || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    guests: searchParams.get('guests') || '1'
  });

  // URL-ын параметрүүд өөрчлөгдөх үед (жишээ нь: Back дарах) дотоод state-ийг шинэчлэх
  useEffect(() => {
    const checkin = searchParams.get('checkin');
    const checkout = searchParams.get('checkout');
    const guests = searchParams.get('guests');

    if (checkin || checkout || guests) {
      setDates(prev => ({
        checkin: checkin || prev.checkin,
        checkout: checkout || prev.checkout,
        guests: guests || prev.guests
      }));
    }
  }, [searchParams]);

  // Хайх товч дарах үед URL-ыг шинэчилж /rooms хуудас руу шилжүүлэх
  const handleSearch = () => {
    const params = new URLSearchParams({
      checkin: dates.checkin,
      checkout: dates.checkout,
      guests: dates.guests
    });
    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <div className="booking-form-vertical">
      {/* Орох огноо сонгох */}
      <div className="booking-field">
        <label htmlFor="b-checkin">Check-in</label>
        <input
          type="date"
          id="b-checkin"
          value={dates.checkin}
          onChange={(e) => setDates({...dates, checkin: e.target.value})}
        />
      </div>

      {/* Гарах огноо сонгох */}
      <div className="booking-field">
        <label htmlFor="b-checkout">Check-out</label>
        <input
          type="date"
          id="b-checkout"
          value={dates.checkout}
          onChange={(e) => setDates({...dates, checkout: e.target.value})}
        />
      </div>

      {/* Зочдын тоо сонгох */}
      <div className="booking-field">
        <label htmlFor="b-guests">Guests</label>
        <select
          id="b-guests"
          value={dates.guests}
          onChange={(e) => setDates({...dates, guests: e.target.value})}
        >
          <option value="1">1 Guest</option>
          <option value="2">2 Guests</option>
          <option value="3">3 Guests</option>
          <option value="4">4+ Guests</option>
        </select>
      </div>

      {/* Шинэчлэх/Хайх товч */}
      <button
        onClick={handleSearch}
        className="booking-search-btn-gold"
        style={{ width: '100%', border: 'none', cursor: 'pointer' }}
      >{t.common.searchBtn}
      </button>
    </div>
  );
}

// Үндсэн экспортолж буй компонент (Suspense ашиглаж Next.js-ийн useSearchParams алдаанаас сэргийлнэ)
export default function BookingForm() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <BookingFormContent />
    </Suspense>
  );
}
