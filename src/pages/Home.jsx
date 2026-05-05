import React from 'react'
import ActivityCard from '../components/ActivityCard'
import activitiesData from '../activities.json'

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <p className="subtitle">Nomadic Camp</p>
          <h1>Authentic Nomadic Luxury</h1>
          <p className="tagline">Where tradition meets timeless luxury</p>
        </div>
      </section>

      <section className="main-container container">
        <div className="glass-panel" id="activities-container">
          <div className="activities-grid">
            {activitiesData.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>

        <aside className="glass-panel booking-panel">
          <h3>Book Your Stay</h3>
          <div className="input-group">
            <label htmlFor="check-in-date">Check-in</label>
            <input type="date" id="check-in-date" />
          </div>
          <div className="input-group">
            <label htmlFor="check-out-date">Check-out</label>
            <input type="date" id="check-out-date" />
          </div>
          <button className="search-btn btn-gold">
            <span>🔍</span> Search
          </button>
        </aside>
      </section>

      <section className="why-choose section-padding">
        <h2>Why Choose Dune Tourist Camp</h2>
        <p className="subtitle">Experience authentic Mongolian hospitality with modern comfort</p>

        <div className="features-wide">
          <div className="feature-box">
            <div className="icon-circle">🍃</div>
            <h3>Untamed Freshness</h3>
            <p>Enjoy the pure and refreshing air of the Mongolian steppe</p>
          </div>
          <div className="feature-box">
            <div className="icon-circle">🏔️</div>
            <h3>Beautiful Nature</h3>
            <p>Immerse yourself in the stunning landscapes of Mongolia</p>
          </div>
          <div className="feature-box">
            <div className="icon-circle">🛰️</div>
            <h3>Starlink</h3>
            <p>Stay connected with high-speed internet powered by Starlink</p>
          </div>
          <div className="feature-box">
            <div className="icon-circle">🏀</div>
            <h3>Sports Court</h3>
            <p>Enjoy basketball and volleyball in the wild</p>
          </div>
        </div>

        <div className="trust-badges">
          <span>✓ Instant confirmation</span>
          <span className="dot">•</span>
          <span>✓ 24/7 support</span>
          <span className="dot">•</span>
          <span>✓ Best price guarantee</span>
        </div>

        <button className="check-availability-btn btn-gold">
          Check Availability <span>→</span>
        </button>
      </section>

      <section className="find-us section-padding">
        <h2>Find Us</h2>
        <p className="subtitle">Visit us in the heart of the Mongolian steppe</p>

        <div className="find-us-container container">
          <div className="map-container">
            <a href="https://www.google.com/maps/search/?api=1&query=47.342603,101.779341" target="_blank" rel="noreferrer" className="open-maps btn-white">
              <span>↗️</span> Open in Maps
            </a>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3823.400262992267!2d101.77934091879791!3d47.3426030670344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2smn!4v1773724902196!5m2!1sen!2smn"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
