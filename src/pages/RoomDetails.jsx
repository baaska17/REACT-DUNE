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
      description: "Experience the authentic nomadic lifestyle in our traditional Mongolian Ger. Made with natural materials, it provides a unique atmosphere while keeping you warm and comfortable. The circular shape and felt insulation provide a cozy environment unlike any other accommodation.",
      features: ["Traditional Furniture", "Natural Insulation", "Central Stove", "WiFi Access", "Breakfast Included"],
      images: ["/trade-ger.jpg", "/ger_1.jpg", "/ger_2.jpg"],
      maxAdults: 4
    },
    302: {
      id: 302,
      title: "Luxury Ger Suite",
      price: 145,
      description: "Our Luxury Ger Suite combines tradition with modern comfort. Featuring premium bedding, climate control, and expanded space, it's the perfect choice for a high-end nomadic experience. Enjoy the elegance of Mongolian craftsmanship without sacrificing modern luxuries.",
      features: ["Premium Bedding", "En-suite Bathroom Style", "Mini Bar", "Air Conditioning", "WiFi Access", "Breakfast Included"],
      images: ["/ger.jpg", "/ger_suite_2.jpg", "/ger_suite_3.jpg"],
      maxAdults: 2
    },
    303: {
      id: 303,
      title: "Wooden Tiny House",
      price: 120,
      description: "A cozy and modern wooden tiny house situated in the heart of nature. Perfect for those who want a bit more privacy and a modern touch while enjoying the steppe views. Designed with panoramic windows to let you wake up to the beautiful Mongolian sunrise.",
      features: ["Panoramic Windows", "Private Kitchenette", "Modern Interior", "Heating", "WiFi Access", "Breakfast Included"],
      images: ["/wooden-house.webp", "/wooden-1.webp", "/wooden-2.jpg"],
      maxAdults: 3
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
          
          {/* 1. TOP NAV & TITLE */}
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
              <span>⭐ 4.9 (24 Reviews)</span>
              <span className="dot">•</span>
              <span>📍 Dune Camp, Mongolia</span>
            </div>
          </div>

          {/* 2. GALLERY */}
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

          {/* 3. MAIN CONTENT */}
          <div className="room-details-content">
            <div className="content-left-col">
              <section className="room-section">
                <h2>Description</h2>
                <p>{room.description}</p>
              </section>

              <section className="room-section">
                <h2>What this place offers</h2>
                <div className="amenities-list">
                  {room.features.map((feature, i) => (
                    <div key={i} className="amenity-tag">
                      <span className="check">✓</span> {feature}
                    </div>
                  ))}
                </div>
              </section>

              <section className="room-section">
                <h2>House Rules</h2>
                <ul className="rules-list">
                  <li>Check-in: After 2:00 PM</li>
                  <li>Check-out: 11:00 AM</li>
                  <li>No smoking inside</li>
                  <li>Pets allowed (please notify in advance)</li>
                </ul>
              </section>

              <section className="room-section">
                <h2>Guest Review</h2>
                <div className="testimonial-card">
                  <div className="testimonial-header">
                    <div className="user-info">
                      <div className="avatar">B</div>
                      <div>
                        <h3>Bat-Erdene</h3>
                        <p>Joined in 2023</p>
                      </div>
                    </div>
                    <div className="stars">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p>"An incredible experience! Staying in a traditional Ger with all the modern comforts was the highlight of our trip to Mongolia."</p>
                </div>
              </section>
            </div>

            {/* SIDEBAR */}
            <div className="content-right-col">
              <div className="sticky-booking-card">
                <div className="price-tag">
                  <span className="amount">${room.price}</span>
                  <span className="per">/ night</span>
                </div>
                
                <div className="booking-fields">
                  <div className="field">
                    <label>DATES</label>
                    <div className="value">Apr 29 - Apr 30, 2026</div>
                  </div>
                  <div className="field">
                    <label>GUESTS</label>
                    <div className="value">2 Guests</div>
                  </div>
                </div>

                <button onClick={handleBookNow} className="reserve-btn">
                  Reserve Now
                </button>
                
                <p className="hint">You won't be charged yet</p>

                <div className="guarantee">
                  <span className="icon">✓</span> Best price guaranteed
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox */}
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
