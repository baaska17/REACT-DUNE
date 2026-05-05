import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content container">
        <div className="footer-section">
          <h4>LOCATION</h4>
          <p>
            <a href="https://www.google.com/maps/search/?api=1&query=47.342603,101.779341" target="_blank" rel="noreferrer">
              Tsenkher Sum, Arkhangay<br />Province, Mongolia
            </a>
          </p>
        </div>
        <div className="footer-section">
          <h4>EMAIL</h4>
          <p>
            <a href="mailto:info@dunetouristcamp.com">info@dunetouristcamp.com</a>
          </p>
        </div>
        <div className="footer-section">
          <h4>PHONE</h4>
          <p>
            <a href="tel:+97612345678">+976 1234 5678</a>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Dune Tourist Camp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
