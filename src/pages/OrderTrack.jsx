import React, { useState } from 'react';
import '../styles/order-track.css';

const OrderTrack = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [orders, setOrders] = useState([]);
  const [searched, setSearched] = useState(false);

  // Mock data for demonstration
  const mockOrders = {
    'ORD-2024-0001': {
      id: 'ORD-2024-0001',
      type: 'room',
      title: 'Deluxe Ger Suite',
      status: 'active',
      checkIn: '2024-06-01',
      checkOut: '2024-06-05',
      phone: '+976 88123456',
      email: 'guest@example.com',
      price: 1500000,
      actions: ['cancel', 'extend', 'changeDate']
    },
    'ORD-2024-0002': {
      id: 'ORD-2024-0002',
      type: 'horse',
      title: 'Horse Riding Adventure',
      status: 'active',
      date: '2024-06-10',
      duration: '8 hours',
      guides: 2,
      phone: '+976 88123456',
      email: 'guest@example.com',
      price: 280000,
      actions: ['cancel', 'changeDate']
    },
    'ORD-2024-0003': {
      id: 'ORD-2024-0003',
      type: 'food',
      title: 'Traditional Mongolian Feast',
      status: 'preparing',
      orderTime: '14:30',
      estimatedTime: '16:00',
      items: ['Khorkhog', 'Buuz', 'Airag'],
      phone: '+976 88123456',
      email: 'guest@example.com',
      price: 185000,
      actions: []
    }
  };

  const handleSearch = () => {
    if (trackingCode.trim()) {
      const order = mockOrders[trackingCode.toUpperCase()];
      if (order) {
        setOrders([order]);
        setSearched(true);
      } else {
        setOrders([]);
        setSearched(true);
      }
    }
  };

  const handleAction = (orderId, action) => {
    alert(`${action.toUpperCase()}: ${orderId}`);
    // Here you would send a request to the backend
  };

  const getStatusLabel = (status) => {
    const labels = {
      'active': 'Идэвхитэй',
      'received': 'Хүлээн авсан',
      'preparing': 'Бэлтгэгдэж байна',
      'ready': 'Бэлэн болсон',
      'in_transit': 'Хүргэлтэд гарсан',
      'delivered': 'Хүргэгдсэн',
      'cancelled': 'Цуцласан'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': '#4CAF50',
      'received': '#2196F3',
      'preparing': '#FF9800',
      'ready': '#9C27B0',
      'in_transit': '#00BCD4',
      'delivered': '#4CAF50',
      'cancelled': '#f44336'
    };
    return colors[status] || '#666';
  };

  return (
    <main className="order-track-page">
      <div className="container">
        <h1>Захиалга Шалгах</h1>
        <p className="subtitle">Өрөө, морь унуулах, хоолны захиалгаа шалгана</p>

        {/* Search Section */}
        <section className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Захиалга шалгах код оруулна (жишээ: ORD-2024-0001)"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="btn-search">
              🔍 Шалгах
            </button>
          </div>
          <p className="help-text">Баталгаажуулалтийн утас эсвэл имэйл дээр ирсэн кодыг оруулна уу</p>
        </section>

        {/* Results */}
        <section className="results-section">
          {searched && orders.length === 0 && (
            <div className="no-results">
              <p>❌ Захиалга олдсонгүй. Кодыг дахин шалгана уу.</p>
            </div>
          )}

          {orders.map(order => (
            <div key={order.id} className={`order-card order-${order.type}`}>
              {/* Header */}
              <div className="order-header">
                <div>
                  <h2>{order.title}</h2>
                  <p className="order-id">Захиалга ID: {order.id}</p>
                </div>
                <div className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                  {getStatusLabel(order.status)}
                </div>
              </div>

              {/* Content based on type */}
              {order.type === 'room' && (
                <div className="order-details">
                  <div className="detail-group">
                    <h3>🏨 Өрөөний Мэдээлэл</h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="label">Ирэх өдөр:</span>
                        <span className="value">{order.checkIn}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Явах өдөр:</span>
                        <span className="value">{order.checkOut}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Хэд хоног:</span>
                        <span className="value">4 өдөр</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Үнэ:</span>
                        <span className="value">{order.price.toLocaleString()} ₮</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for Room */}
                  {order.status === 'active' && (
                    <div className="actions">
                      <button
                        className="btn-action btn-cancel"
                        onClick={() => handleAction(order.id, 'cancel')}
                      >
                        ❌ Цуцлах
                      </button>
                      <button
                        className="btn-action btn-extend"
                        onClick={() => handleAction(order.id, 'extend')}
                      >
                        ➕ Өдөр сунгах
                      </button>
                      <button
                        className="btn-action btn-change"
                        onClick={() => handleAction(order.id, 'change-date')}
                      >
                        📅 Өдөр өөрчлөх
                      </button>
                    </div>
                  )}
                </div>
              )}

              {order.type === 'horse' && (
                <div className="order-details">
                  <div className="detail-group">
                    <h3>🐴 Морь Унуулах Мэдээлэл</h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="label">Өдөр:</span>
                        <span className="value">{order.date}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Үргэлжлэх хугацаа:</span>
                        <span className="value">{order.duration}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Гарц:</span>
                        <span className="value">{order.guides}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Үнэ:</span>
                        <span className="value">{order.price.toLocaleString()} ₮</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for Horse */}
                  {order.status === 'active' && (
                    <div className="actions">
                      <button
                        className="btn-action btn-cancel"
                        onClick={() => handleAction(order.id, 'cancel')}
                      >
                        ❌ Цуцлах
                      </button>
                      <button
                        className="btn-action btn-change"
                        onClick={() => handleAction(order.id, 'change-date')}
                      >
                        📅 Өдөр өөрчлөх
                      </button>
                    </div>
                  )}
                </div>
              )}

              {order.type === 'food' && (
                <div className="order-details">
                  <div className="detail-group">
                    <h3>🍜 Хоолны Захиалга</h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="label">Захиалгын цаг:</span>
                        <span className="value">{order.orderTime}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Сунгасан цаг:</span>
                        <span className="value">{order.estimatedTime}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Хоол:</span>
                        <span className="value">{order.items.join(', ')}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Үнэ:</span>
                        <span className="value">{order.price.toLocaleString()} ₮</span>
                      </div>
                    </div>
                  </div>

                  {/* Food Order Progress */}
                  <div className="food-progress">
                    <h3>Хоолны төлөв</h3>
                    <div className="progress-steps">
                      <div className={`step ${['received', 'preparing', 'ready', 'in_transit', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                        <div className="step-circle">1</div>
                        <p>Хүлээн авсан</p>
                      </div>
                      <div className={`step ${['preparing', 'ready', 'in_transit', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                        <div className="step-circle">2</div>
                        <p>Бэлтгэгдэж байна</p>
                      </div>
                      <div className={`step ${['ready', 'in_transit', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                        <div className="step-circle">3</div>
                        <p>Бэлэн болсон</p>
                      </div>
                      <div className={`step ${['in_transit', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                        <div className="step-circle">4</div>
                        <p>Хүргэлтэд</p>
                      </div>
                      <div className={`step ${order.status === 'delivered' ? 'completed' : ''}`}>
                        <div className="step-circle">5</div>
                        <p>Хүргэгдсэн</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="contact-info">
                <h3>Холбоо барих мэдээлэл</h3>
                <div className="contact-details">
                  <p>📞 {order.phone}</p>
                  <p>📧 {order.email}</p>
                </div>
              </div>
            </div>
          ))}

          {!searched && (
            <div className="welcome-message">
              <h2>👋 Сайн байна уу!</h2>
              <p>Захиалга шалгахын тулд баталгаажуулалтийн утас эсвэл имэйл дээр ирсэн кодыг оруулна уу</p>
              <p className="demo-hint">💡 Үзүүлэх жишээ: ORD-2024-0001, ORD-2024-0002, ORD-2024-0003</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default OrderTrack;
