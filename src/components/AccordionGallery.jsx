import { useState } from 'react';
import { Link } from 'react-router-dom';

const PANELS = [
  {
    id: 1,
    label: 'Horse Ride',
    title: 'Horse Riding',
    description: 'Explore the vast Mongolian steppe on horseback',
    image: '/Horse Ride.jpg',
    link: '/horse',
  },
  {
    id: 2,
    label: 'Cuisine',
    title: 'Traditional Cuisine',
    description: 'Savor authentic Mongolian dishes and flavors',
    image: '/Khorkhog.jpg',
    link: '/restaurant',
  },
  {
    id: 3,
    label: 'Dairy Shop',
    title: 'Artisan Dairy',
    description: 'Handcrafted traditional dairy products',
    image: '/urum.jpg',
    link: '/restaurant',
  },
];

const AccordionGallery = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="discovery-content">
      <div className="discovery-header">
        <p className="discovery-eyebrow">Our Top Experiences</p>
        <h2 className="discovery-title">Discover the Best<br />of Dune Camp</h2>
      </div>

      <div className="accordion-gallery-simplified">
        {PANELS.map((item, index) => (
          <Link
            key={item.id}
            to={item.link}
            className={`accordion-panel-simple${activeIndex === index ? ' active' : ''}`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              className="accordion-bg"
              style={{ backgroundImage: `url("${item.image}")` }}
            />
            <div className="accordion-overlay" />

            {/* Vertical Label (Visible when NOT active) */}
            <div className="accordion-label-simple">
              <span className="accordion-label-text">{item.label}</span>
            </div>

            {/* Content (Visible when active) */}
            <div className="accordion-content-simple">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="accordion-footer">
                <span className="accordion-discover-btn">Discover →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AccordionGallery;
