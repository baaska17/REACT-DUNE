import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/res.css';

const Restaurant = () => {
  const [filter, setFilter] = useState('all');
  const { addToCart } = useCart();

  const menuItems = [
    { id: 201, title: "Khorkhog", price: 18, image: "Khorkhog.jpg", category: "main-dishes", description: "Traditional Mongolian barbecue with mutton, vegetables, and hot stones" },
    { id: 202, title: "Buuz", price: 12, image: "buuz.jpg", category: "main-dishes", description: "Steamed dumplings filled with minced meat and onions" },
    { id: 204, title: "Fried Rice with Meat", price: 18, image: "budaataihuurga.jpg", category: "main-dishes", description: "Budaatai huurga - Steamed rice stir-fried with meat and vegetables" },
    { id: 203, title: "Tsuivan", price: 14, image: "tsuivan.jpg", category: "main-dishes", description: "Hand-pulled noodles stir-fried with vegetables and meat" },
    { id: 205, title: "Huushuur", price: 18, image: "huushuur.jpg", category: "main-dishes", description: "Traditional Mongolian fried meat pies" },
    { id: 206, title: "Traditional Meat Platter", price: 18, image: "mah.webp", category: "main-dishes", description: "Assorted boiled meats prepared in nomadic style" },
    { id: 207, title: "Noodle Soup", price: 18, image: "shul.jpg", category: "main-dishes", description: "Guriltai shul - Hearty noodle soup with meat and vegetables" },
    { id: 210, title: "Mongolian Milk Tea", price: 4, image: "SuuteiTsai.jpg", category: "drinks", description: "Suutei tsai - Traditional salted milk tea" },
    { id: 211, title: "Airag", price: 6, image: "airag.jpg", category: "drinks dairy", description: "Fermented mare's milk, a traditional nomadic beverage" },
    { id: 213, title: "Mongolian Yogurt", price: 5, image: "tarag.jpg", category: "dairy desserts", description: "Tarag - Natural fermented yogurt from nomadic livestock" },
    { id: 216, title: "Clotted Cream Skin", price: 6, image: "urum.jpg", category: "dairy desserts", description: "Urum - Traditional thick cream skin formed on boiled milk" },
    { id: 212, title: "Fried Pastries", price: 8, image: "boortsog.jpg", category: "desserts", description: "Boortsog - Traditional Mongolian deep-fried dough" }
  ];

  const filteredItems = filter === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category.includes(filter));

  return (
    <div className="restaurant-page">
      <section className="restaurant-hero">
        <div className="container hero-content-left">
          <nav className="breadcrumbs">
            <a href="/">Home</a> <span>&gt;</span>
            <span className="current">Restaurant</span>
          </nav>
          <h1>Traditional Restaurant</h1>
          <p className="tagline">
            Savor authentic Mongolian cuisine prepared with locally sourced ingredients
          </p>
        </div>
      </section>

      <div className="container">
        <section id="menu" className="menu-section">
          <div className="section-head section-padding">
            <h2>Our Menu</h2>
            <p className="subtitle">Order for room delivery or camp pickup</p>
          </div>
          
          <div className="menu-filters">
            {['all', 'main-dishes', 'drinks', 'desserts', 'dairy'].map(cat => (
              <button 
                key={cat}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

          <ul className="menu-grid">
            {filteredItems.map(item => (
              <li key={item.id} className="menu-card">
                <article>
                  <figure className="img-container">
                    <img src={`/${item.image}`} alt={item.title} className="menu-img" />
                    <button 
                      className="add-to-cart add-to-cart-btn-overlay"
                      onClick={() => addToCart(item)}
                    >
                      <span className="plus">+</span> Add to Cart
                    </button>
                  </figure>
                  <div className="menu-info">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="price">${item.price}</span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="about-kitchen section-padding alternate-bg">
        <div className="container small-container">
          <h2>About Our Kitchen</h2>
          <p className="intro">Celebrating the rich culinary heritage of Mongolia with traditional methods and authentic recipes</p>
          <p>We source our ingredients locally, supporting nomadic families and ensuring the freshest, highest quality produce. From hearty meat dishes to delicate dairy products, experience the true taste of the Mongolian steppe.</p>
        </div>
      </section>
    </div>
  );
};

export default Restaurant;
