'use client';

import { useState, useCallback } from 'react';

/*
========================================
PURE HELPERS — component-аас гадна тодорхойлно
State ашиглахгүй тул дахин render-д шинэ функц үүсгэхгүй
Lecture: "Pure functions — same input, same output, no side effects"
========================================
*/
const STATUS_LABELS = {
  PENDING:   'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const STATUS_COLORS = {
  CONFIRMED: '#4ade80',
  COMPLETED: '#3b82f6',
  CANCELLED: '#f87171',
  PENDING:   '#C5A059',
};

function getStatusLabel(status) {
  return STATUS_LABELS[status] || status;
}

function getStatusColor(status) {
  return STATUS_COLORS[status] || '#C5A059';
}

export default function OrderTrackPage() {
  const [trackingCode, setTrackingCode] = useState('');
  const [order, setOrder]               = useState(null);
  const [searched, setSearched]         = useState(false);
  const [loading, setLoading]           = useState(false);

  /*
  ========================================
  SEARCH ORDER
  useCallback — функцийн reference тогтворжуулна
  Lecture: "useCallback: memoize a function reference"
  ========================================
  */
  const handleSearch = useCallback(async () => {
    // "DUNE-42" → "42" гэж prefix арилгана
    const cleanId = trackingCode.replace('DUNE-', '').trim();
    if (!cleanId) return;

    setLoading(true);
    setSearched(true);

    try {
      const res  = await fetch(`/api/orders/${cleanId}`);
      const data = await res.json();

      if (res.ok && !data.error) {
        setOrder(data);
      } else {
        setOrder(null);
      }
    } catch (error) {
      console.error('Order fetch failed:', error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [trackingCode]); // trackingCode өөрчлөгдөхөд л шинэ функц үүснэ

  return (
    <div
      className="order-track-page"
      style={{ paddingTop: '120px', minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <div className="container" style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1.25rem' }}>

        {/* HEADER */}
        <h1 style={{ color: 'var(--primary)', textAlign: 'center', fontSize: '2.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Track Order
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '2.5rem', color: 'var(--text-secondary)' }}>
          Enter your tracking ID to check your booking status
        </p>

        {/* SEARCH */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '3rem' }}>
          <input
            type="text"
            placeholder="Tracking ID (e.g. DUNE-1)"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{
              flex: 1, padding: '14px 16px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: '12px', fontSize: '1rem', outline: 'none',
            }}
          />
          <button
            className="btn-gold"
            onClick={handleSearch}
            disabled={loading}
            style={{ padding: '0 28px', borderRadius: '12px' }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* RESULT */}
        {searched && (
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
            {order ? (
              <div>
                {/* TOP ROW — order id + status badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>
                    DUNE-{order.id}
                  </h2>
                  <span style={{
                    padding: '8px 16px', borderRadius: '50px',
                    background: `${getStatusColor(order.status)}22`,
                    color: getStatusColor(order.status),
                    fontWeight: '700', fontSize: '0.85rem', border: `1px solid ${getStatusColor(order.status)}44`,
                  }}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                {/* INFO GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                  {[
                    { label: 'Customer',     value: order.customerName },
                    { label: 'Phone',        value: order.phone },
                    { label: 'Date',         value: new Date(order.createdAt).toLocaleDateString() },
                    { label: 'Total Amount', value: `${order.totalAmount.toLocaleString()}₮`, accent: true },
                  ].map(({ label, value, accent }) => (
                    <div key={label}>
                      <p style={{ color: 'var(--text-secondary)', margin: '0 0 4px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                      <p style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: accent ? 'var(--primary)' : 'var(--text-primary)' }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* ITEMS — map() ашиглана */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-secondary)' }}>
                    Ordered Items
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {order.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                          {item.title} × {item.quantity}
                        </span>
                        <span style={{ color: 'var(--primary)', fontWeight: '700' }}>
                          {(item.price * item.quantity).toLocaleString()}₮
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
                <h3 style={{ color: '#f87171', marginBottom: '0.5rem' }}>Order Not Found</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Please check your tracking ID and try again.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
