import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/room-details.css';

const RoomDetails = () => {
  const { id } = useParams();

  // In a real app, you'd fetch this from a JSON or API
  const roomsData = {
    301: {
      title: "Traditional Mongolian Ger",
      price: 85,
      description: "Experience the authentic nomadic lifestyle in our traditional Mongolian Ger. Made with natural materials, it provides a unique atmosphere while keeping you warm and comfortable.",
      features: ["Traditional Furniture", "Natural Insulation", "Central Stove", "WiFi Access", "Breakfast Included"],
      images: ["/trade-ger.jpg", "/ger_1.jpg", "/ger_2.jpg"]
    },
    302: {
      title: "Luxury Ger Suite",
      price: 145,
      description: "Our Luxury Ger Suite combines tradition with modern comfort. Featuring premium bedding, climate control, and expanded space, it's the perfect choice for a high-end nomadic experience.",
      features: ["Premium Bedding", "En-suite Bathroom Style", "Mini Bar", "Air Conditioning", "WiFi Access", "Breakfast Included"],
      images: ["/ger.jpg", "/ger_suite_2.jpg", "/ger_suite_3.jpg"]
    },
    303: {
      title: "Wooden Tiny House",
      price: 120,
      description: "A cozy and modern wooden tiny house situated in the heart of nature. Perfect for those who want a bit more privacy and a modern touch while enjoying the steppe views.",
      features: ["Panoramic Windows", "Private Kitchenette", "Modern Interior", "Heating", "WiFi Access", "Breakfast Included"],
      images: ["/wooden-house.webp", "/wooden-1.webp", "/wooden-2.jpg"]
    }
  };

  const room = roomsData[id];

  if (!room) return <div className="container">Room not found</div>;

  return (
    <div className="room-details-page">
      <section className="room-details-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${room.images[0]})` }}>
        <div className="container">
          <nav className="breadcrumbs">
            <Link to="/">Home</Link> <span>&gt;</span> 
            <Link to="/rooms">Rooms</Link> <span>&gt;</span>
            <span className="current">{room.title}</span>
          </nav>
          <h1>{room.title}</h1>
        </div>
      </section>

      <div className="container room-details-grid">
        <div className="main-content">
          <section className="room-gallery">
            {room.images.map((img, idx) => (
              <img key={idx} src={img} alt={`${room.title} ${idx + 1}`} />
            ))}
          </section>
          
          <section className="room-description glass-panel">
            <h2>About this Room</h2>
            <p>{room.description}</p>
            
            <h3>Key Features</h3>
            <ul className="features-list">
              {room.features.map((f, i) => <li key={i}>✓ {f}</li>)}
            </ul>
          </section>
        </div>

        <aside className="booking-sidebar">
          <div className="booking-card glass-panel">
            <div className="price-tag">
              <span className="amount">${room.price}</span>
              <span className="label">per night</span>
            </div>
            <p className="room-note">Best price guaranteed for direct booking</p>
            <Link to="/rooms" className="btn-gold book-btn">Check Availability</Link>
            <div className="booking-perks">
              <p>✓ Instant confirmation</p>
              <p>✓ Free WiFi</p>
              <p>✓ Free parking</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RoomDetails;
