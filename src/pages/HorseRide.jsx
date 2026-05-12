import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/horse.css';

const HorseRide = () => {
  const { addToCart } = useCart();
  const [peopleCount, setPeopleCount] = useState(1);
  const [selectedExperience, setSelectedExperience] = useState(null);

  const experiences = [
    {
      id: 101,
      title: "Sunset Ride - 1 Hour",
      price: 35,
      image: "Horse Ride.jpg",
      description: "Experience the magical Mongolian sunset on horseback. Perfect for beginners.",
      duration: "1 hour",
      maxPeople: 8
    },
    {
      id: 102,
      title: "Steppe Explorer - 2 Hours",
      price: 60,
      image: "Horse Ride.jpg",
      description: "Explore the vast steppe and visit a nearby nomadic family. Includes tea ceremony.",
      duration: "2 hours",
      maxPeople: 6
    },
    {
      id: 103,
      title: "Half Day Adventure",
      price: 110,
      image: "Horse Ride.jpg",
      description: "Full steppe experience with lunch at a traditional nomadic camp. For experienced riders.",
      duration: "4 hours",
      maxPeople: 4
    }
  ];

  const handleBooking = () => {
    if (!selectedExperience) return;

    addToCart({
      ...selectedExperience,
      title: `${selectedExperience.title} (${peopleCount} People)`,
      quantity: 1,
      price: selectedExperience.price * peopleCount,
      image: `/${selectedExperience.image}`
    });
  };

  return (
    <div className="horse-page">
      <main>
        <section className="horse-hero">
          <div className="container hero-content-left">
            <nav className="breadcrumbs">
              <a href="/">Home</a> <span>&gt;</span> 
              <span className="current">Horse Riding</span>
            </nav>
            <h1>Horse Riding Adventures</h1>
            <p className="tagline">Explore the vast Mongolian steppe on horseback like a true nomad</p>
          </div>
        </section>

        <div className="container main-content-area">
          <section className="quick-info-grid">
            <div className="info-card">
              <span className="info-icon">
                <img src="/clock.png" alt="Duration" />
              </span>
              <div>
                <span className="info-label">Duration</span>
                <span className="info-value">1–3 hours</span>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon">
                <img src="/chicken.png" alt="Level" />
              </span>
              <div>
                <span className="info-label">Level</span>
                <span className="info-value">Beginner-friendly</span>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon">
                <img src="/shield.png" alt="Safety" />
              </span>
              <div>
                <span className="info-label">Includes</span>
                <span className="info-value">Helmet + Guide</span>
              </div>
            </div>
          </section>

          <div className="selection-booking-grid">
            <div className="selection-side">
              <div className="section-title-group">
                <h2>Choose Your Experience</h2>
                <p>Select the perfect horseback riding adventure for your skill level</p>
              </div>

              <div className="experience-list">
                {experiences.map(exp => (
                  <div 
                    key={exp.id} 
                    className={`exp-card ${selectedExperience?.id === exp.id ? 'active' : ''}`}
                    onClick={() => setSelectedExperience(exp)}
                  >
                    <div className="exp-header">
                      <h3>{exp.title}</h3>
                      <span className="exp-price">${exp.price}</span>
                    </div>
                    <p className="exp-desc">{exp.description}</p>
                    <div className="exp-meta">
                      <span> {exp.duration}</span>
                      <span> Max {exp.maxPeople} people</span>
                      <span className="per-person">per person</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="content-section card-box safety-section">
                <h3>Safety Information</h3>
                <ul className="dot-list">
                  <li>Weight limit: 220 lbs (100 kg)</li>
                  <li>Minimum age: 8 years old (children must be accompanied by adults)</li>
                  <li>Please wear comfortable clothing and closed-toe shoes</li>
                  <li>Helmets are provided and must be worn</li>
                  <li>Tours may be cancelled due to severe weather</li>
                </ul>
              </div>
            </div>

            <aside className="booking-sidebar">
              <div className="booking-card">
                <h3>Book Your Ride</h3>
                <div className="booking-form">
                  <div className="form-group">
                    <label> Select Date</label>
                    <input type="date" defaultValue="2026-07-15" />
                  </div>

                  <div className="form-group">
                    <label> Select Time</label>
                    <select defaultValue="10:00 AM">
                      <option>Choose time slot</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="05:00 PM (Sunset)">05:00 PM (Sunset)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label> Number of People</label>
                    <input 
                      type="number" 
                      value={peopleCount} 
                      min="1" 
                      max={selectedExperience?.maxPeople || 1}
                      onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
                    />
                    <span className="input-hint">
                      Maximum {selectedExperience?.maxPeople || 0} people
                    </span>
                  </div>
                  
                  <div className="price-summary">
                    <div className="price-line">
                      <span>Rate per person</span>
                      <span>${selectedExperience?.price || 0}</span>
                    </div>

                    <div className="total-line">
                      <span>Total</span>
                      <span>${(selectedExperience?.price || 0) * peopleCount}</span>
                    </div>
                  </div>

                  <button 
                    className="btn-gold" 
                    style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', fontWeight: 700 }}
                    onClick={handleBooking}
                    disabled={!selectedExperience}
                  >
                    Book This Experience
                  </button>

                  <p className="cancellation-policy">
                    Free cancellation up to 24 hours before the ride
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HorseRide;