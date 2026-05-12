import { useState } from 'react';
import { Link } from 'react-router-dom';

const PANELS = [
  {
    id: 1,
    label: 'Horse Ride',
    category: 'Adventure',
    title: 'Horse Riding Adventure',
    description: 'Explore the vast Mongolian steppe on horseback with experienced local guides',
    image: '/Horse Ride.jpg',
    link: '/horse',
  },
  {
    id: 2,
    label: 'Cuisine',
    category: 'Food',
    title: 'Traditional Cuisine',
    description: 'Savor authentic Mongolian dishes and flavors prepared by skilled local chefs',
    image: '/Khorkhog.jpg',
    link: '/restaurant',
  },
  {
    id: 3,
    label: 'Dairy Shop',
    category: 'Shop',
    title: 'Artisan Dairy Shop',
    description: 'Handcrafted traditional dairy products made from fresh nomadic milk daily',
    image: '/urum.jpg',
    link: '/restaurant',
  },
];

const AccordionGallery = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="discover-section">
      <div className="accordion-gallery">
        <div className="accordion-title-overlay">
          <p className="accordion-title-eyebrow">Our Top Experiences</p>
          <h2 className="accordion-title-main">Discover the Best<br />of Dune Camp</h2>
        </div>

        {PANELS.map((item, index) => (
          <Link
            key={item.id}
            to={item.link}
            className={`accordion-panel${activeIndex === index ? ' active' : ''}`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              className="accordion-bg"
              style={{ backgroundImage: `url("${item.image}")` }}
            />
            <div className="accordion-overlay" />

            <div className="accordion-label">
              <div className="accordion-label-dot" />
              <span className="accordion-label-text">{item.label}</span>
              <div className="accordion-label-dot" />
            </div>

            <div className="accordion-content">
              <span className="accordion-category-tag">{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="accordion-footer">
                <span className="accordion-explore-btn">Explore →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AccordionGallery;
