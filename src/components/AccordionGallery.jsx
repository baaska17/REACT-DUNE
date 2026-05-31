'use client'; // Next.js-ийн Client Component гэдгийг тодорхойлно. Хэрэглэгчийн талд ажиллах React hook-үүд ашиглах боломжийг олгоно.
import { useState } from 'react'; // Төлөв (state) удирдах React hook.
import Link from 'next/link'; // Хуудас хооронд шилжих компонент.
import { useLanguage } from '../context/LanguageContext';

// Галерейд харагдах мэдээллүүдийн жагсаалт (Array).
const PANELS = [
  {
    id: 1,
    label: 'Horse Ride', // Карт хумигдсан үед харагдах босоо текст.
    title: 'Horse Riding', // Карт дэлгэгдсэн үед харагдах үндсэн гарчиг.
    description: 'Explore the vast Mongolian steppe on horseback', // Богино тайлбар.
    image: '/Horse Ride.jpg', // Арын дэвсгэр зургийн зам.
    link: '/horse', // Дарсан үед шилжих холбоос.
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
  // activeIndex: Одоо хулгана дээр нь байгаа картын дугаарыг (index) хадгалах төлөв.
  // Анхны утга нь null буюу ямар ч карт идэвхжээгүй байна.
  const [activeIndex, setActiveIndex] = useState(null);
  const { t } = useLanguage();

  return (
    <div className="discovery-content">
      {/* Хэсгийн толгой мэдээлэл: Жижиг гарчиг болон үндсэн гарчиг */}
      <div className="discovery-header">
        <p className="discovery-eyebrow">{t.home.topExperiences}</p>
        <h2 className="discovery-title">
          {t.home.discoverTitleLine1}
          <br />
          {t.home.discoverTitleLine2}
        </h2>
      </div>

      {/* Аккордион галерейн үндсэн контейнер */}
      <div className="accordion-gallery-simplified">
        {/* PANELS өгөгдлийг map ашиглан нэг бүрчлэн гүйлгэж харуулна */}
        {PANELS.map((item, index) => (
          <Link
            key={item.id} // Жагсаалтын элемент бүрт байх ёстой давтагдашгүй ID.
            href={item.link} // Холбоос.
            // Хэрэв энэ картын индекс activeIndex-тэй таарч байвал 'active' класс нэмэгдэнэ.
            className={`accordion-panel-simple${activeIndex === index ? ' active' : ''}`}
            // Хулгана карт дээр очих үед тухайн индексийг идэвхтэй болгож хадгална.
            onMouseEnter={() => setActiveIndex(index)}
            // Хулгана картнаас холдох үед идэвхтэй индексийг null болгож цэвэрлэнэ.
            onMouseLeave={() => setActiveIndex(null)}
          >
            {/* Картын арын дэвсгэр зураг */}
            <div
              className="accordion-bg"
              style={{ backgroundImage: `url("${item.image}")` }}
            />
            {/* Зургийг бараантуулж текст тод харагдуулах давхарга */}
            <div className="accordion-overlay" />

            {/* Босоо шошго текст (Карт идэвхгүй үед харагдана) */}
            <div className="accordion-label-simple">
              <span className="accordion-label-text">{item.label}</span>
            </div>

            {/* Картын дэлгэрэнгүй агуулга (Карт идэвхтэй/дэлгэгдсэн үед харагдана) */}
            <div className="accordion-content-simple">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="accordion-footer">
                {/* Дэлгэрэнгүй товчлуур (харагдах байдал) */}
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
