import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/room.css';

const Rooms = () => {
  const { addToCart } = useCart();
  const [roomStates, setRoomStates] = useState({
    301: { adults: 1, children: 0 },
    302: { adults: 1, children: 0 },
    303: { adults: 1, children: 0 }
  });

  const rooms = [
    {
      id: 301,
      title: "Traditional Mongolian Ger",
      price: 85,
      image: "trade-ger.jpg",
      maxAdults: 4,
      available: 1,
      features: ["WiFi", "Heating", "Breakfast Included"]
    },
    {
      id: 302,
      title: "Luxury Ger Suite",
      price: 145,
      image: "ger.jpg",
      maxAdults: 2,
      available: 2,
      features: ["WiFi", "Heating", "Air Conditioning", "Breakfast Included"]
    },
    {
      id: 303,
      title: "Wooden Tiny House",
      price: 120,
      image: "wooden-house.webp",
      maxAdults: 3,
      available: 1,
      features: ["WiFi", "Heating", "Kitchen", "Breakfast Included"]
    }
  ];

  const updateCount = (roomId, type, delta, max) => {
    setRoomStates(prev => {
      const current = prev[roomId][type];
      const next = current + delta;
      if (type === 'adults' && (next < 1 || next > max)) return prev;
      if (type === 'children' && next < 0) return prev;
      return {
        ...prev,
        [roomId]: { ...prev[roomId], [type]: next }
      };
    });
  };

  const handleAddToCart = (room) => {
    const state = roomStates[room.id];
    addToCart({
      ...room,
      title: `${room.title} (${state.adults} Adults, ${state.children} Children)`,
      quantity: 1,
      price: room.price,
      image: `/${room.image}`
    });
  };

  return (
    <div className="rooms-page">
      <main className="container room-selection-container">
        <section className="selection-header">
          <h1>Available Accommodations</h1>
          <div className="booking-summary">
            <span><strong>Check-in:</strong> Apr 29, 2026</span>
            <span><strong>Check-out:</strong> Apr 30, 2026</span>
            <span><strong>Nights:</strong> 1</span>
          </div>
        </section>

        <div className="room-content-grid single-column">
          <div className="room-list">
            {rooms.map(room => (
              <div key={room.id} className="room-card glass-panel">
                <div className="room-image-side">
                  <span className="badge-available">{room.available} Available</span>
                  <img src={`/${room.image}`} alt={room.title} />
                  <Link to={`/rooms/${room.id}`} className="room-details-btn">Room Details</Link>
                </div>
                <div className="room-info-side">
                  <div className="room-details-top">
                    <h2>{room.title}</h2>
                    <span className="badge-included">Breakfast Included</span>
                    <ul className="room-features">
                      {room.features.map((feature, index) => (
                        <li key={index}>✓ {feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="room-controls">
                    <div className="counter-group">
                      <label>Adults</label>
                      <div className="counter">
                        <button className="minus" onClick={() => updateCount(room.id, 'adults', -1, room.maxAdults)}>-</button>
                        <span className="count">{roomStates[room.id].adults}</span>
                        <button className="plus" onClick={() => updateCount(room.id, 'adults', 1, room.maxAdults)}>+</button>
                      </div>
                    </div>
                    <div className="counter-group">
                      <label>Children</label>
                      <div className="counter">
                        <button className="minus" onClick={() => updateCount(room.id, 'children', -1)}>-</button>
                        <span className="count">{roomStates[room.id].children}</span>
                        <button className="plus" onClick={() => updateCount(room.id, 'children', 1)}>+</button>
                      </div>
                    </div>
                    <button 
                      className="btn-gold"
                      onClick={() => handleAddToCart(room)}
                    >
                      Book Room
                    </button>
                  </div>
                </div>
                <div className="room-price-side">
                  <div className="price-display">
                    <span className="total-price">${room.price}</span>
                    <span className="per-night">per night</span>
                  </div>
                  <span className="max-guests">Max {room.maxAdults} adults</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Rooms;
