import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/room-details.css';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(null);

  // In a real app, you'd fetch this from a JSON or API
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
    navigate('/rooms'); // Or stay and show a message
  };

  return (
    <div className="room-detail-page">
      <main className="room-details-main">
        {/* Gallery Section */}
        <section className="room-gallery-section">
          <div className="container">
            <div className="room-gallery">
              <div className="gallery-main" onClick={() => setSelectedImage(room.images[0])}>
                <img src={room.images[0]} alt={room.title} />
              </div>
              <div className="gallery-side">
                {room.images.slice(1, 3).map((img, idx) => (
                  <div key={idx} className="gallery-small" onClick={() => setSelectedImage(img)}>
                    <img src={img} alt={`${room.title} ${idx + 2}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Top Info Section */}
        <section className="room-top-section container">
          <div className="room-top-left">
            <nav className="breadcrumbs" style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#888' }}>
              <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link> 
              <span style={{ margin: '0 8px' }}>/</span> 
              <Link to="/rooms" style={{ color: '#888', textDecoration: 'none' }}>Rooms</Link> 
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{room.title}</span>
            </nav>
            <h1 className="room-page-title">{room.title}</h1>
            <div className="room-meta" style={{ display: 'flex', gap: '20px', color: '#666' }}>
              <span>⭐ 4.9 (24 Reviews)</span>
              <span>📍 Dune Camp, Mongolia</span>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="room-content-section container">
          <div className="room-content-grid">
            <div className="room-content-left">
              <div className="content-block">
                <h2>Description</h2>
                <p>{room.description}</p>
              </div>

              <div className="content-block">
                <h2>What this place offers</h2>
                <div className="amenities-grid">
                  {room.features.map((feature, i) => (
                    <div key={i} className="amenity-item">
                      <span className="amenity-check">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="content-block">
                <h2>House Rules</h2>
                <ul className="house-rules">
                  <li>Check-in: After 2:00 PM</li>
                  <li>Check-out: 11:00 AM</li>
                  <li>No smoking inside</li>
                  <li>Pets allowed (please notify in advance)</li>
                </ul>
              </div>

              <div className="content-block">
                <h2>Guest Review</h2>
                <div className="review-card">
                  <div className="review-card-top">
                    <div className="review-user">
                      <div className="review-avatar">B</div>
                      <div className="review-user-meta">
                        <h3>Bat-Erdene</h3>
                        <span>Joined in 2023</span>
                      </div>
                    </div>
                    <div className="review-stars">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p>"An incredible experience! Staying in a traditional Ger with all the modern comforts was the highlight of our trip to Mongolia. The staff was amazing and the breakfast was delicious."</p>
                </div>
              </div>
            </div>

            {/* Sidebar Booking Card */}
            <aside className="room-content-right">
              <div className="booking-card booking-card-desktop">
                <div className="booking-price-row">
                  <span className="booking-price">${room.price}</span>
                  <span className="booking-night">/ night</span>
                </div>
                
                <div className="booking-form">
                  <div className="input-group">
                    <label>DATES</label>
                    <input type="text" readOnly value="Apr 29 - Apr 30, 2026" />
                  </div>
                  <div className="input-group">
                    <label>GUESTS</label>
                    <input type="text" readOnly value="2 Guests" />
                  </div>
                </div>

                <button onClick={handleBookNow} className="room-book-btn">
                  Reserve This Room
                </button>
                
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#888', marginTop: '1rem' }}>
                  You won't be charged yet
                </p>

                <div className="booking-note">
                  <span className="icon">✓</span>
                  <span>Best price guaranteed</span>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      {selectedImage && (
        <div className={`lightbox ${selectedImage ? 'open' : ''}`} onClick={() => setSelectedImage(null)}>
          <span className="lightbox-close">&times;</span>
          <img className="lightbox-content" src={selectedImage} alt="Room Preview" />
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
