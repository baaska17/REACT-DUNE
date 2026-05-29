/**
 * Нүүр хуудас (Home Page) - Baaska
 * Энэ хуудас нь вэбсайтын үндсэн нүүр хэсэг бөгөөд Hero section,
 * Үйлчилгээнүүдийн галерей, Захиалгын форм зэргийг агуулна.
 */

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import AccordionGallery from '../src/components/AccordionGallery';
import BookingForm from '../src/components/BookingForm';

export default async function Home() {
  // HTTP headers-аас домэйн нэрийг авч байна
  const headersList = await headers();
  const host = headersList.get('host') || '';
  
  // Хэрэв 3001 порт дээр (Админ порт) орж ирвэл шууд Админ руу шилжүүлнэ
  if (host.includes(':3001')) {
    redirect('/admin');
  }

  return (
    <div className="home-page">
      {/* 1. HERO SECTION: Видео фон болон үндсэн гарчиг */}
      <section className="hero">
        {/* YouTube видеог арын фон болгон ашиглаж байна (дуугүй, автоматаар тогтоно) */}
        <div className="hero-video-bg">
          <iframe
            src="https://www.youtube.com/embed/h9gb8dmZnvA?autoplay=1&mute=1&loop=1&playlist=h9gb8dmZnvA&controls=0&rel=0&modestbranding=1&playsinline=1&showinfo=0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Dune Tourist Camp"
          />
        </div>

        {/* Видеон дээрх текстийг уншигдахуйц болгох харанхуй давхарга */}
        <div className="hero-overlay" />

        {/* Төв хэсгийн текстүүд */}
        <div className="hero-content">
          <p className="subtitle">Nomadic Camp</p>
          <h1>Authentic Nomadic Luxury</h1>
          <p className="tagline">Where tradition meets timeless luxury</p>
        </div>

        {/* Доошоо гүйлгэхийг сануулах сум */}
        <div className="hero-scroll-hint">
          <span className="hero-scroll-label">Our Top Experiences</span>
          <div className="hero-scroll-arrow">↓</div>
        </div>
      </section>

      {/* 2. DISCOVERY & BOOKING: Галерей болон Захиалгын хэсэг */}
      <section className="discovery-booking-wrapper">
        <div className="container combined-container">
          {/* Зүүн тал: Үйлчилгээнүүдийн интерактив галерей */}
          <div className="discovery-side">
            <AccordionGallery />
          </div>
          
          {/* Баруун тал: Шууд захиалга өгөх босоо форм */}
          <div className="booking-side">
            <div className="booking-card vertical-booking">
              <p className="booking-eyebrow">Plan Your Stay</p>
              <h2 className="booking-headline">Reserve Your Escape</h2>
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE: Давуу талуудыг харуулах хэсэг */}
      <section className="why-choose section-padding">
        <h2>Why Choose Dune Tourist Camp</h2>
        <p className="subtitle">Experience authentic Mongolian hospitality with modern comfort</p>

        <div className="features-wide">
          {/* Давуу талууд тус бүрийг карт хэлбэрээр харуулна */}
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

        {/* Итгэл төрүүлэх тэмдэглэгээнүүд */}
        <div className="trust-badges">
          <span>✓ Instant confirmation</span>
          <span>✓ 24/7 support</span>
          <span>✓ Best price guarantee</span>
          <span>✓ Free cancellation</span>
        </div>

        {/* Өрөөнүүдийн жагсаалт руу шилжих товч */}
        <a href="/rooms" className="check-availability-btn btn-gold">
          Check Availability →
        </a>
      </section>

      {/* 4. FIND US: Газрын зураг бүхий хэсэг */}
      <section className="find-us section-padding">
        <h2>Find Us</h2>
        <p className="subtitle">Visit us in the heart of the Mongolian steppe</p>

        <div className="find-us-container container">
          <div className="map-container">
            {/* Google Maps дээр шууд нээх товч */}
            <a href="https://www.google.com/maps/search/?api=1&query=47.342603,101.779341" target="_blank" rel="noreferrer" className="open-maps btn-white">
              <span>↗️</span> Open in Maps
            </a>
            {/* Суулгасан Google Map */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3823.400262992267!2d101.77934091879791!3d47.3426030670344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2smn!4v1773724902196!5m2!1sen!2smn"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
