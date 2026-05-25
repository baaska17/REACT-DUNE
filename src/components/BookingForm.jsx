'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingForm() {
  const router = useRouter();
  const [dates, setDates] = useState({
    checkin: new Date().toISOString().split('T')[0],
    checkout: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    guests: '1'
  });

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
      <div className="booking-field">
        <label htmlFor="b-checkin">Check-in</label>
        <input
          type="date"
          id="b-checkin"
          value={dates.checkin}
          onChange={(e) => setDates({...dates, checkin: e.target.value})}
        />
      </div>
      <div className="booking-field">
        <label htmlFor="b-checkout">Check-out</label>
        <input
          type="date"
          id="b-checkout"
          value={dates.checkout}
          onChange={(e) => setDates({...dates, checkout: e.target.value})}
        />
      </div>
      <div className="booking-field">
        <label htmlFor="b-guests">Guests</label>
        <select
          id="b-guests"
          value={dates.guests}
          onChange={(e) => setDates({...dates, guests: e.target.value})}
        >
          <option value="1">1 Guest</option>
          <option value="2">2 Guest</option>
          <option value="3">3 Guest</option>
          <option value="4">4+ Guest</option>
        </select>
      </div>
      <button
        onClick={handleSearch}
        className="booking-search-btn-gold"
        style={{ width: '100%', border: 'none', cursor: 'pointer' }}
      >
        Search Rooms
      </button>
    </div>
  );
}
