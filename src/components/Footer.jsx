'use client';
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t, lang } = useLanguage();

  const navLinks = [
    { href: '/',            label: t.nav.home },
    { href: '/horse',       label: t.nav.horse },
    { href: '/restaurant',  label: t.nav.restaurant },
    { href: '/rooms',       label: t.nav.rooms },
    { href: '/order-track', label: t.nav.trackOrder },
  ];

  return (
    <footer className="footer">
      {/* Gold gradient top divider */}
      <div className="footer-divider" />

      <div className="footer-inner container">

        {/* ── Col 1: Brand ── */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/logo.jpg" alt="Dune" className="footer-logo-img" />
            <span>Dune Tourist Camp</span>
          </div>
          <p className="footer-tagline">{t.footer.tagline}</p>
          <div className="footer-socials">
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Facebook">
              {/* Facebook icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Instagram">
              {/* Instagram icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="YouTube">
              {/* YouTube icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.5C5.12 20 12 20 12 20s6.88 0 8.59-.5a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
              </svg>
            </a>
          </div>
        </div>


        {/* ── Col 3: Contact ── */}
        <div className="footer-col">
          <h4>{t.footer.contact}</h4>
          <ul className="footer-contact-list">
            <li>
              <span className="contact-icon">📍</span>
              <a href="https://www.google.com/maps/search/?api=1&query=47.342603,101.779341" target="_blank" rel="noreferrer">
                Tsenkher Sum, Arkhangay<br/>Province, Mongolia
              </a>
            </li>
            <li>
              <span className="contact-icon">✉️</span>
              <a href="mailto:info@dunetouristcamp.com">info@dunetouristcamp.com</a>
            </li>
            <li>
              <span className="contact-icon">📞</span>
              <a href="tel:+97612345678">+976 1234 5678</a>
            </li>
          </ul>
        </div>


      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Dune Tourist Camp. {t.footer.rights}</p>
        <div className="footer-bottom-links">
          <span>{lang === 'MN' ? 'Нууцлал' : 'Privacy'}</span>
          <span>{lang === 'MN' ? 'Нөхцөл' : 'Terms'}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
