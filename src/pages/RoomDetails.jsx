import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/room-details.css';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(null);

  const roomsData = {
    301: {
      id: 301,
      title: "Traditional Mongolian Ger",
      price: 85,
      description: "Experience the authentic nomadic lifestyle in our traditional Mongolian Ger. Made with natural materials, it provides a unique atmosphere while keeping you warm and comfortable. The circular shape and felt insulation provide a cozy environment unlike any other accommodation.\n\nOur traditional Gers are hand-crafted by local artisans using sustainable wood and organic sheep wool felt, ensuring an eco-friendly stay that respects centuries-old traditions.",
      features: [
        { name: "Traditional Furniture", icon: "🪑" },
        { name: "Natural Insulation", icon: "🐑" },
        { name: "Central Stove", icon: "🔥" },
        { name: "WiFi Access", icon: "🛰️" },
        { name: "Breakfast Included", icon: "🍳" },
        { name: "Eco Friendly", icon: "🌿" }
      ],
      images: ["/trade-ger.jpg", "/ger_1.jpg", "/ger_2.jpg"],
      maxAdults: 4,
      reviews: 24,
      rating: 4.9
    },
    302: {
      id: 302,
      title: "Luxury Ger Suite",
      price: 145,
      description: "Our Luxury Ger Suite combines tradition with modern comfort. Featuring premium bedding, climate control, and expanded space, it's the perfect choice for a high-end nomadic experience. Enjoy the elegance of Mongolian craftsmanship without sacrificing modern luxuries.\n\nThis suite offers a private sanctuary with bespoke interior design, premium linens, and a dedicated service team to ensure your stay in the steppe is nothing short of extraordinary.",
      features: [
        { name: "Premium Bedding", icon: "🛏️" },
        { name: "Climate Control", icon: "🌡️" },
        { name: "Mini Bar", icon: "🍷" },
        { name: "Air Conditioning", icon: "❄️" },
        { name: "WiFi Access", icon: "🛰️" },
        { name: "Breakfast Included", icon: "🍳" }
      ],
      images: ["/ger.jpg", "/ger_suite_2.jpg", "/ger_suite_3.jpg"],
      maxAdults: 2,
      reviews: 18,
      rating: 5.0
    },
    303: {
      id: 303,
      title: "Wooden Tiny House",
      price: 120,
      description: "A cozy and modern wooden tiny house situated in the heart of nature. Perfect for those who want a bit more privacy and a modern touch while enjoying the steppe views. Designed with panoramic windows to let you wake up to the beautiful Mongolian sunrise.\n\nBuilt with sustainable Siberian larch, these tiny houses offer a minimalist yet warm aesthetic, featuring a small loft and a private deck to enjoy the vast Mongolian horizon.",
      features: [
        { name: "Panoramic Windows", icon: "🖼️" },
        { name: "Private Deck", icon: "🪵" },
        { name: "Modern Interior", icon: "✨" },
        { name: "Heating", icon: "🔥" },
        { name: "WiFi Access", icon: "🛰️" },
        { name: "Kitchenette", icon: "🍴" }
      ],
      images: ["/wooden-house.webp", "/wooden-1.webp", "/wooden-2.jpg"],
      maxAdults: 3,
      reviews: 15,
      rating: 4.8
    }
  };

  const room = roomsData[id];

  if (!room) return (
    <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h2>Room not found</h2>
      <Link to="/rooms" className="btn-gold" style={{ marginTop: '20px' }}>Back to Rooms</Link>
    </div>
  );

  const handleBookNow = () => {
    addToCart({
      ...room,
      quantity: 1,
      image: room.images[0]
    });
    navigate('/rooms');
  };

  return (
    <div className="room-detail-page">
      <main className="room-details-container">
        <div className="container">
          
          <div className="room-details-header">
            <nav className="breadcrumbs">
              <Link to="/">Home</Link>
              <span className="separator">/</span>
              <Link to="/rooms">Rooms</Link>
              <span className="separator">/</span>
              <span className="current">{room.title}</span>
            </nav>
            <h1 className="room-title">{room.title}</h1>
            <div className="room-meta-info">
              <span>⭐ {room.rating} ({room.reviews} Reviews)</span>
              <span className="dot">•</span>
              <span>📍 Dune Camp, Mongolia</span>
              <span className="dot">•</span>
              <span>👤 Max {room.maxAdults} Guests</span>
            </div>
          </div>

          <div className="room-details-gallery">
            <div className="gallery-main-frame" onClick={() => setSelectedImage(room.images[0])}>
              <img src={room.images[0]} alt={room.title} />
            </div>
            <div className="gallery-side-frame">
              {room.images.slice(1, 3).map((img, idx) => (
                <div key={idx} className="gallery-thumb" onClick={() => setSelectedImage(img)}>
                  <img src={img} alt={`${room.title} ${idx + 2}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="room-details-content">
            <div className="content-left-col">
              <section className="room-section">
                <h2>Description</h2>
                <p>{room.description}</p>
              </section>

              <section className="room-section">
                <h2>What this place offers</h2>
                <div className="amenities-grid">
                  {room.features.map((feature, i) => (
                    <div key={i} className="amenity-item">
                      <div className="icon-box">{feature.icon}</div>
                      <span>{feature.name}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="room-section">
                <h2>House Rules</h2>
                <ul className="rules-list">
                  <li>🕒 Check-in: After 2:00 PM</li>
                  <li>🕙 Check-out: 11:00 AM</li>
                  <li>🚭 No smoking inside</li>
                  <li>🐾 Pets allowed (with prior notice)</li>
                </ul>
              </section>

              <section className="room-section">
                <h2>Guest Experience</h2>
                <div className="testimonial-card">
                  <div className="testimonial-header">
                    <div className="user-meta">
                      <div className="avatar-circle">{room.id === 302 ? 'S' : 'B'}</div>
                      <div className="user-name">
                        <h3>{room.id === 302 ? 'Sarah Jenkins' : 'Bat-Erdene'}</h3>
                        <p>Stayed in June 2025</p>
                      </div>
                    </div>
                    <div className="stars">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p>
                    {room.id === 302 
                      ? "Absolutely breathtaking! The Luxury Ger Suite exceeded all my expectations. The blend of traditional aesthetics and modern luxury was perfect."
                      : "An incredible experience! Staying in a traditional Ger with all the modern comforts was the highlight of our trip to Mongolia."}
                  </p>
                </div>
              </section>
            </div>

            <div className="content-right-col">
              <div className="sticky-booking-card">
                <div className="booking-price-header">
                  <span className="amount">${room.price}</span>
                  <span className="per">/ night</span>
                </div>
                
                <div className="booking-box">
                  <div className="booking-row">
                    <div className="booking-item">
                      <label>CHECK-IN</label>
                      <div className="val">Apr 29, 2026</div>
                    </div>
                    <div className="booking-item">
                      <label>CHECK-OUT</label>
                      <div className="val">Apr 30, 2026</div>
                    </div>
                  </div>
                  <div className="guest-picker-trigger">
                    <label>GUESTS</label>
                    <div className="val">2 Adults, 1 Child</div>
                  </div>
                </div>

                <button onClick={handleBookNow} className="reserve-button">
                  Reserve Now
                </button>
                
                <p className="hint" style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                  You won't be charged yet
                </p>

                <div className="guarantee" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', color: '#64748b' }}>
                  <span style={{ color: 'var(--primary)' }}>✓</span> Best price guaranteed
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedImage && (
        <div className="image-lightbox" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Preview" />
          <span className="close-x">&times;</span>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
