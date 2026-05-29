'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useCart } from '@/src/context/CartContext';
import { useLanguage } from '@/src/context/LanguageContext';
import CommentSection from '@/src/components/CommentSection';

export default function RestaurantPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();

  const { t, lang } = useLanguage();

  const categories = useMemo(() => [
    { key: 'all',       label: t.restaurant.catAll },
    { key: 'MAIN_DISH', label: t.restaurant.catMain },
    { key: 'DRINK',     label: t.restaurant.catDrink },
    { key: 'DESSERT',   label: t.restaurant.catDessert },
    { key: 'DAIRY',     label: t.restaurant.catDairy },
    { key: 'SHOP',      label: t.restaurant.catShop },
  ], [t]);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/foods');
        const data = await res.json();
        setMenuItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return menuItems;
    return menuItems.filter(item => {
      const cats = item.category ? item.category.split(',') : [];
      return cats.includes(activeCategory);
    });
  }, [menuItems, activeCategory]);

  const totalItems = useMemo(
    () => menuItems.reduce((acc, _item) => acc + 1, 0),
    [menuItems]
  );

  const getQty = useCallback((id) => quantities[id] || 1, [quantities]);

  const changeQty = useCallback((id, delta, stock) => {
    setQuantities(prev => {
      const cur = prev[id] || 1;
      const next = Math.min(Math.max(1, cur + delta), stock);
      return { ...prev, [id]: next };
    });
  }, []);

  const handleAddToCart = useCallback(
    (item) => {
      const qty = quantities[item.id] || 1;
      addToCart({ ...item, type: 'FOOD', quantity: qty });
      setQuantities(prev => ({ ...prev, [item.id]: 1 }));
    },
    [addToCart, quantities]
  );

  if (loading) return (
    <div className="restaurant-page">
      <div className="restaurant-skeleton-hero" />
      <div className="container">
        <div className="menu-section">
          <div className="section-head section-padding">
            <div className="skel skel-title" />
            <div className="skel skel-sub" />
          </div>
          <div className="menu-filters">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skel skel-pill" />
            ))}
          </div>
          <ul className="menu-grid">
            {[...Array(6)].map((_, i) => (
              <li key={i} className="menu-card">
                <div className="skel skel-card-img" />
                <div className="menu-info">
                  <div className="skel skel-line" />
                  <div className="skel skel-line skel-line--short" />
                  <div className="skel skel-price" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="restaurant-page">
      <section className="restaurant-hero">
        <div className="container hero-content-left">
          <nav className="breadcrumbs">
            <a href="/">Home</a> <span>&gt;</span>
            <span className="current">{t.nav.restaurant}</span>
          </nav>
          <h1>{t.restaurant.heroTitle}</h1>
          <p className="tagline">{t.restaurant.heroTagline}</p>
        </div>
      </section>

      <div className="container">
        <section id="menu" className="menu-section">
          <div className="section-head section-padding">
            <h2>{t.restaurant.menuTitle}</h2>
            <p className="subtitle">
              {totalItems} {t.restaurant.menuSubtitle}
            </p>
          </div>

          <div className="menu-filters">
            {categories.map(cat => (
              <button
                key={cat.key}
                className={`filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <ul className="menu-grid">
            {filteredItems.map(item => {
              const qty = getQty(item.id);
              const outOfStock = item.stock <= 0;
              return (
                <li key={item.id} className="menu-card">
                  <article>
                    <figure className="img-container">
                      <img
                        src={
                          item.image
                            ? item.image.startsWith('/') ? item.image : `/${item.image}`
                            : '/placeholder-food.jpg'
                        }
                        alt={item.title}
                        className="menu-img"
                        onError={(e) => { e.target.src = '/placeholder-food.jpg'; }}
                      />
                    </figure>
                    <div className="menu-info">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>

                      <div className="menu-meta-badges">
                        {item.size && (
                          <span className="meta-badge meta-badge--size">
                            📏 {item.size}
                          </span>
                        )}
                        <span className={`meta-badge ${outOfStock ? 'meta-badge--empty' : 'meta-badge--stock'}`}>
                          {outOfStock
                            ? (lang === 'MN' ? 'Дууссан' : 'Out of stock')
                            : (lang === 'MN' ? `${item.stock} ш үлдсэн` : `${item.stock} left`)}
                        </span>
                      </div>

                      <div className="menu-footer">
                        <span className="price">{item.price.toLocaleString()}₮</span>
                        {outOfStock ? (
                          <button className="add-to-cart add-to-cart--disabled" disabled>
                            {lang === 'MN' ? 'Дууссан' : 'Sold out'}
                          </button>
                        ) : (
                          <div className="qty-row">
                            <div className="qty-ctrl">
                              <button
                                className="qty-btn"
                                onClick={() => changeQty(item.id, -1, item.stock)}
                                disabled={qty <= 1}
                              >−</button>
                              <span className="qty-num">{qty}</span>
                              <button
                                className="qty-btn"
                                onClick={() => changeQty(item.id, +1, item.stock)}
                                disabled={qty >= item.stock}
                              >+</button>
                            </div>
                            <button
                              className="add-to-cart"
                              onClick={() => handleAddToCart(item)}
                            >
                              {t.common.addToCart}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>

          {filteredItems.length === 0 && (
            <div className="menu-empty-state">
              <div className="menu-empty-icon">🍽️</div>
              <h3 className="menu-empty-title">{t.common.noItems}</h3>
              <p className="menu-empty-sub">
                {activeCategory !== 'all'
                  ? (lang === 'MN' ? 'Өөр ангилал сонгоно уу' : 'Try selecting a different category')
                  : ''}
              </p>
              {activeCategory !== 'all' && (
                <button className="btn-gold" onClick={() => setActiveCategory('all')}>
                  {t.restaurant.catAll}
                </button>
              )}
            </div>
          )}
        </section>

        <div
          className="review-section-wrapper"
          style={{
            marginTop: '5rem',
            padding: '4rem 2rem',
            background: 'var(--bg-secondary)',
            borderRadius: '2.5rem',
            border: '1px solid var(--border-color)',
          }}
        >
          <CommentSection type="food" targetId={1} />
        </div>
      </div>

      <section className="about-kitchen section-padding alternate-bg">
        <div className="container small-container">
          <h2>{t.restaurant.aboutTitle}</h2>
          <p className="intro">{t.restaurant.aboutIntro}</p>
          <p>{t.restaurant.aboutText}</p>
        </div>
      </section>
    </div>
  );
}
