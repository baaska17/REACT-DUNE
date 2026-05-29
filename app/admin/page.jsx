'use client';

import { useEffect, useState, useReducer, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Utensils,
  Bed,
  Mountain,
  ShoppingBag,
  Trash2,
  CheckCircle,
  DollarSign,
  Package,
  Image as ImageIcon,
  Clock,
  ChevronRight,
  Settings,
  RefreshCw,
  Sun,
  Moon,
  MessageSquare,
  Star,
} from 'lucide-react';

/*
========================================
ЗАХИАЛГЫН ТӨЛӨВ
========================================
*/
const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
const STATUS_MN = {
  PENDING:   'Хүлээгдэж буй',
  CONFIRMED: 'Баталгаажсан',
  COMPLETED: 'Дууссан',
  CANCELLED: 'Цуцлагдсан',
};
const STATUS_COLOR = {
  PENDING:   { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24' },
  CONFIRMED: { bg: 'rgba(99,102,241,0.15)',  color: '#818cf8' },
  COMPLETED: { bg: 'rgba(34,197,94,0.15)',   color: '#4ade80' },
  CANCELLED: { bg: 'rgba(239,68,68,0.15)',   color: '#f87171' },
};

/*
========================================
ТОХИРГООНЫ REDUCER
Lecture: "useReducer: complex state transitions"
========================================
*/
const SETTINGS_INIT = {
  offPeakDays: [1, 2, 3, 4],
  offPeakDiscount: 10,
  splitEnabled: true,
  splitThreshold: 50000,
};

function settingsReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_DAY': {
      const days = state.offPeakDays.includes(action.day)
        ? state.offPeakDays.filter((d) => d !== action.day)
        : [...state.offPeakDays, action.day];
      return { ...state, offPeakDays: days };
    }
    case 'SET_FIELD': return { ...state, [action.field]: action.value };
    case 'LOAD':      return { ...state, ...action.payload };
    default:          return state;
  }
}

/*
========================================
THEME — харанхуй / цайвар
========================================
*/
function makeTheme(isDark) {
  return {
    bg:          isDark ? '#070707' : '#f0f2f5',
    sidebar:     isDark ? '#0d0d0d' : '#ffffff',
    card:        isDark ? '#111111' : '#ffffff',
    item:        isDark ? '#181818' : '#f8f9fa',
    border:      isDark ? '#1e1e1e' : '#e5e7eb',
    border2:     isDark ? '#2a2a2a' : '#d1d5db',
    text:        isDark ? '#ffffff' : '#111827',
    textMuted:   isDark ? '#6b7280' : '#9ca3af',
    inputBg:     isDark ? '#181818' : '#ffffff',
    inputBorder: isDark ? '#2a2a2a' : '#d1d5db',
    inputText:   isDark ? '#ffffff' : '#111827',
    accent:      '#C5A059',
  };
}

export default function AdminPage() {
  const router = useRouter();

  const [activeTab, setActiveTab]     = useState('dashboard');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isDark, setIsDark]           = useState(true);
  const [isMobile, setIsMobile]       = useState(false);

  const [rooms, setRooms]           = useState([]);
  const [foods, setFoods]           = useState([]);
  const [adventures, setAdventures] = useState([]);
  const [orders, setOrders]         = useState([]);
  const [comments, setComments]     = useState([]);
  const [stats, setStats]           = useState({ totalSales: 0, pendingOrders: 0, totalItems: 0 });

  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [imageFile2, setImageFile2]       = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);

  const [imageFile3, setImageFile3]       = useState(null);
  const [imagePreview3, setImagePreview3] = useState(null);
  const [isUploading, setIsUploading]   = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [roomForm, setRoomForm] = useState({
    title: '', description: '', price: '', image: '',
    image2: '', image3: '', mainImageIndex: 1,
    wifi: false, heating: false, airConditioning: false,
    breakfast: false, kitchen: false, totalUnits: 1,
    maxAdults: 1, maxChildren: 0, featured: false,
  });
  const [foodForm, setFoodForm] = useState({
    title: '', description: '', price: '', image: '',
    category: ['MAIN_DISH'], size: '', stock: 0, featured: false,
  });
  const [adventureForm, setAdventureForm] = useState({
    title: '', description: '', price: '', image: '',
    maxPersons: 10, featured: false,
  });

  // Edit mode — null = шинэ нэмэх, объект = засаж байгаа item
  const [editingFood, setEditingFood]           = useState(null);
  const [editingRoom, setEditingRoom]           = useState(null);
  const [editingAdventure, setEditingAdventure] = useState(null);

  const [setts, dispatchSetts] = useReducer(settingsReducer, SETTINGS_INIT);

  // Theme persist
  useEffect(() => {
    const saved = localStorage.getItem('admin_theme');
    if (saved) setIsDark(saved === 'dark');
  }, []);

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('admin_theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  const t = makeTheme(isDark);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.port !== '3001') {
      router.replace('/');
      return;
    }
    setIsAuthorized(true);
    fetchData();
    fetchSettings();
  }, [router]);

  const fetchData = async () => {
    try {
      const [roomRes, foodRes, adventureRes, orderRes, commentRes] = await Promise.all([
        fetch('/api/rooms'), fetch('/api/foods'),
        fetch('/api/adventures'), fetch('/api/orders'),
        fetch('/api/comments'),
      ]);
      const [roomData, foodData, adventureData, orderData, commentData] = await Promise.all([
        roomRes.json(), foodRes.json(), adventureRes.json(), orderRes.json(), commentRes.json(),
      ]);

      setRooms(Array.isArray(roomData) ? roomData : []);
      setFoods(Array.isArray(foodData) ? foodData : []);
      setAdventures(Array.isArray(adventureData) ? adventureData : []);
      setOrders(Array.isArray(orderData) ? orderData : []);
      setComments(Array.isArray(commentData) ? commentData : []);

      const totalSales = Array.isArray(orderData)
        ? orderData.reduce((sum, o) => sum + o.totalAmount, 0) : 0;
      const pendingOrders = Array.isArray(orderData)
        ? orderData.filter((o) => o.status === 'PENDING').length : 0;

      setStats({ totalSales, pendingOrders, totalItems: roomData.length + foodData.length + adventureData.length });
    } catch (e) { console.error(e); }
  };

  const fetchSettings = async () => {
    try {
      const res  = await fetch('/api/settings');
      const data = await res.json();
      dispatchSetts({ type: 'LOAD', payload: data });
    } catch (e) { console.error(e); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadImage = async (fileToUpload) => {
    const file = fileToUpload || imageFile;
    if (!file) return null;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res  = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      return data.filename;
    } catch (e) { console.error(e); return null; }
    finally { setIsUploading(false); }
  };

  const FOOD_EMPTY = { title: '', description: '', price: '', image: '', category: ['MAIN_DISH'], size: '', stock: 0, featured: false };
  const ROOM_EMPTY = { title: '', description: '', price: '', image: '', image2: '', image3: '', mainImageIndex: 1, wifi: false, heating: false, airConditioning: false, breakfast: false, kitchen: false, totalUnits: 1, maxAdults: 1, maxChildren: 0, featured: false };
  const ADV_EMPTY  = { title: '', description: '', price: '', image: '', maxPersons: 10, featured: false };

  const startEditFood = (item) => {
    setEditingFood(item);
    const cats = item.category ? item.category.split(',') : ['MAIN_DISH'];
    setFoodForm({ title: item.title, description: item.description, price: item.price, image: item.image, category: cats, size: item.size || '', stock: item.stock || 0, featured: item.featured });
    setImageFile(null); setImagePreview(null);
  };
  const cancelEditFood = () => { setEditingFood(null); setFoodForm(FOOD_EMPTY); setImageFile(null); setImagePreview(null); };

  const startEditRoom = (item) => {
    setEditingRoom(item);
    setRoomForm({
      title: item.title,
      description: item.description,
      price: item.price,
      image: item.image,
      image2: item.image2 || '',
      image3: item.image3 || '',
      mainImageIndex: item.mainImageIndex || 1,
      wifi: item.wifi,
      heating: item.heating,
      airConditioning: item.airConditioning,
      breakfast: item.breakfast,
      kitchen: item.kitchen,
      totalUnits: item.totalUnits || 1,
      maxAdults: item.maxAdults,
      maxChildren: item.maxChildren,
      featured: item.featured
    });
    setImageFile(null); setImagePreview(null);
    setImageFile2(null); setImagePreview2(null);
    setImageFile3(null); setImagePreview3(null);
  };
  const cancelEditRoom = () => {
    setEditingRoom(null);
    setRoomForm(ROOM_EMPTY);
    setImageFile(null); setImagePreview(null);
    setImageFile2(null); setImagePreview2(null);
    setImageFile3(null); setImagePreview3(null);
  };

  const startEditAdventure = (item) => {
    setEditingAdventure(item);
    setAdventureForm({ title: item.title, description: item.description, price: item.price, image: item.image, maxPersons: item.maxPersons, featured: item.featured });
    setImageFile(null); setImagePreview(null);
  };
  const cancelEditAdventure = () => { setEditingAdventure(null); setAdventureForm(ADV_EMPTY); setImageFile(null); setImagePreview(null); };

  const submitRoom = async (e) => {
    e.preventDefault();
    const image  = imageFile ? await uploadImage(imageFile) : roomForm.image;
    const image2 = imageFile2 ? await uploadImage(imageFile2) : roomForm.image2;
    const image3 = imageFile3 ? await uploadImage(imageFile3) : roomForm.image3;

    const url    = editingRoom ? `/api/rooms/${editingRoom.id}` : '/api/rooms';
    const method = editingRoom ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...roomForm, image, image2, image3 }) });
    if (res.ok) { cancelEditRoom(); fetchData(); }
  };

  const submitFood = async (e) => {
    e.preventDefault();
    const image    = imageFile ? await uploadImage() : foodForm.image;
    const category = Array.isArray(foodForm.category) ? foodForm.category.join(',') : foodForm.category;
    const url      = editingFood ? `/api/foods/${editingFood.id}` : '/api/foods';
    const method   = editingFood ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...foodForm, image, category }) });
    if (res.ok) { cancelEditFood(); fetchData(); }
  };

  const submitAdventure = async (e) => {
    e.preventDefault();
    const image  = imageFile ? await uploadImage() : adventureForm.image;
    const url    = editingAdventure ? `/api/adventures/${editingAdventure.id}` : '/api/adventures';
    const method = editingAdventure ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...adventureForm, image }) });
    if (res.ok) { cancelEditAdventure(); fetchData(); }
  };

  const deleteItem = async (type, id) => {
    if (!confirm('Бараа бүрмөсөн устгах уу?')) return;
    const map = { room: '/api/rooms/', food: '/api/foods/', adventure: '/api/adventures/' };
    const res = await fetch(`${map[type]}${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  const deleteComment = useCallback(async (id) => {
    if (!confirm('Сэтгэгдэл устгах уу?')) return;
    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
    if (res.ok) setComments(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateOrderStatus = useCallback(async (id, status) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  }, []);

  const saveSettings = useCallback(async () => {
    const res = await fetch('/api/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(setts),
    });
    if (res.ok) { setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 2500); }
  }, [setts]);

  // useMemo — захиалгуудыг статусаар ангилна
  const ordersByStatus = useMemo(() =>
    ORDER_STATUSES.reduce((acc, s) => {
      acc[s] = orders.filter((o) => o.status === s).length;
      return acc;
    }, {}),
  [orders]);

  if (!isAuthorized) return null;

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: `1px solid ${t.border2}`, background: t.inputBg,
    color: t.inputText, fontSize: '0.9rem',
  };

  // Sidebar item
  const SidebarItem = ({ id, icon: Icon, label, badge }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        display: 'flex', alignItems: 'center', gap: '11px',
        width: '100%', padding: '13px 20px',
        background: activeTab === id
          ? `linear-gradient(90deg, rgba(197,160,89,0.15) 0%, transparent 100%)`
          : 'transparent',
        border: 'none',
        borderLeft: activeTab === id ? '3px solid #C5A059' : '3px solid transparent',
        color: activeTab === id ? '#C5A059' : t.textMuted,
        cursor: 'pointer', textAlign: 'left',
        fontSize: '0.88rem', fontWeight: '600',
        transition: 'all 0.15s',
      }}
    >
      <Icon size={17} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge > 0 && (
        <span style={{ background: '#C5A059', color: '#000', borderRadius: '50px', padding: '1px 8px', fontSize: '0.72rem', fontWeight: '800' }}>
          {badge}
        </span>
      )}
      {activeTab === id && !badge && <ChevronRight size={13} />}
    </button>
  );

  const NAV_ITEMS = [
    { id: 'dashboard',  icon: LayoutDashboard, label: 'Самбар' },
    { id: 'restaurant', icon: Utensils,        label: 'Ресторан' },
    { id: 'rooms',      icon: Bed,             label: 'Өрөөнүүд' },
    { id: 'adventures', icon: Mountain,        label: 'Аялал' },
    { id: 'orders',     icon: ShoppingBag,     label: 'Захиалга', badge: stats.pendingOrders },
    { id: 'comments',   icon: MessageSquare,   label: 'Сэтгэгдэл', badge: comments.length },
    { id: 'settings',   icon: Settings,        label: 'Тохиргоо' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh', background: t.bg, color: t.text, fontFamily: 'Inter, sans-serif' }}>

      {/* ===== SIDEBAR (desktop) ===== */}
      {!isMobile && (
        <aside style={{ width: '255px', background: t.sidebar, borderRight: `1px solid ${t.border}`, position: 'fixed', height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '28px 20px 16px', borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: t.textMuted, marginBottom: '4px' }}>ДЮН ЖУУЛЧНЫ БААЗ</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '800', color: '#C5A059', letterSpacing: '0.06em' }}>УДИРДАХ САМБАР</h2>
              <button onClick={toggleTheme} title={isDark ? 'Цайвар горим' : 'Харанхуй горим'}
                style={{ background: isDark ? '#1e1e1e' : '#f3f4f6', border: `1px solid ${t.border2}`, borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: t.text, display: 'flex', alignItems: 'center', transition: '0.2s' }}>
                {isDark ? <Sun size={15} color="#C5A059" /> : <Moon size={15} color="#6b7280" />}
              </button>
            </div>
          </div>
          <nav style={{ flex: 1, paddingTop: '8px' }}>
            <SidebarItem id="dashboard"  icon={LayoutDashboard} label="Хяналтын самбар" />
            <SidebarItem id="restaurant" icon={Utensils}        label="Ресторан" />
            <SidebarItem id="rooms"      icon={Bed}             label="Өрөөнүүд" />
            <SidebarItem id="adventures" icon={Mountain}        label="Аялалууд" />
            <SidebarItem id="orders"     icon={ShoppingBag}     label="Захиалгууд" badge={stats.pendingOrders} />
            <SidebarItem id="comments"   icon={MessageSquare}   label="Сэтгэгдэл" badge={comments.length} />
            <SidebarItem id="settings"   icon={Settings}        label="Тохиргоо" />
          </nav>
          <div style={{ padding: '16px 20px', borderTop: `1px solid ${t.border}`, fontSize: '0.75rem', color: t.textMuted }}>
            {isDark ? '🌙 Харанхуй горим' : '☀️ Цайвар горим'}
          </div>
        </aside>
      )}

      {/* ===== MOBILE TOP NAV ===== */}
      {isMobile && (
        <header style={{ position: 'sticky', top: 0, zIndex: 100, background: t.sidebar, borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#C5A059' }}>УДИРДАХ САМБАР</span>
            <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
              {isDark ? <Sun size={18} color="#C5A059" /> : <Moon size={18} color="#6b7280" />}
            </button>
          </div>
          <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', borderTop: `1px solid ${t.border}` }}>
            {NAV_ITEMS.map(({ id, icon: Icon, label, badge }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                style={{
                  flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                  padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
                  color: activeTab === id ? '#C5A059' : t.textMuted,
                  borderBottom: activeTab === id ? '2px solid #C5A059' : '2px solid transparent',
                  fontSize: '0.62rem', fontWeight: '700', whiteSpace: 'nowrap', position: 'relative',
                  transition: 'all 0.15s',
                }}>
                <Icon size={16} />
                {label}
                {badge > 0 && (
                  <span style={{ position: 'absolute', top: '6px', right: '6px', background: '#C5A059', color: '#000', borderRadius: '50px', padding: '0 4px', fontSize: '0.6rem', fontWeight: '800', lineHeight: '16px', height: '16px' }}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </header>
      )}

      {/* ===== MAIN ===== */}
      <main style={{ flex: 1, marginLeft: isMobile ? 0 : '255px', padding: isMobile ? '20px 14px' : '44px', minHeight: '100vh' }}>

        {/* ── ХЯНАЛТЫН САМБАР ── */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px' }}>Хяналтын самбар</h1>
            <p style={{ color: t.textMuted, marginBottom: '32px', fontSize: '0.9rem' }}>Дюн жуулчны баазын үйл ажиллагааны тойм</p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: isMobile ? '12px' : '18px', marginBottom: '36px' }}>
              <StatCard t={t} icon={DollarSign} label="Нийт орлого"       value={`${stats.totalSales.toLocaleString()}₮`} accent="#C5A059" />
              <StatCard t={t} icon={Clock}      label="Хүлээгдэж буй"     value={stats.pendingOrders} accent="#fbbf24" />
              <StatCard t={t} icon={Package}    label="Нийт бараа"        value={stats.totalItems}    accent="#818cf8" />
              <StatCard t={t} icon={CheckCircle} label="Системийн төлөв"  value="Хэвийн" accent="#4ade80" />
            </div>

            <div style={{ background: t.card, borderRadius: '18px', padding: '26px', border: `1px solid ${t.border}` }}>
              <h3 style={{ marginBottom: '18px', color: t.textMuted, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Захиалгын төлөвийн задаргаа</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '14px' }}>
                {ORDER_STATUSES.map((s) => (
                  <div key={s} style={{ background: STATUS_COLOR[s].bg, borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: STATUS_COLOR[s].color }}>{ordersByStatus[s] || 0}</div>
                    <div style={{ fontSize: '0.78rem', color: t.textMuted, marginTop: '4px' }}>{STATUS_MN[s]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── РЕСТОРАН ── */}
        {activeTab === 'restaurant' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 400px', gap: isMobile ? '20px' : '36px' }}>
            <InventoryTable t={t} title="Хоолнууд" items={foods} type="food" deleteItem={deleteItem} onEdit={startEditFood} editingId={editingFood?.id} />
            <FormCard t={t} title={editingFood ? `✏️ Засах: ${editingFood.title}` : 'Хоол нэмэх'}>
              <form onSubmit={submitFood} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Field t={t} label="Хоолны нэр"   value={foodForm.title}       onChange={(e) => setFoodForm({ ...foodForm, title: e.target.value })} />
                <FieldArea t={t} label="Тайлбар"   value={foodForm.description} onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })} />
                <Field t={t} label="Үнэ (₮)" type="number" value={foodForm.price} onChange={(e) => setFoodForm({ ...foodForm, price: parseFloat(e.target.value) })} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Field t={t} label="Хэмжээ (жнь: 300мл, Том)" value={foodForm.size} onChange={(e) => setFoodForm({ ...foodForm, size: e.target.value })} placeholder="300мл / Том / 500г" />
                  <Field t={t} label="Тоо ширхэг (нөөц)" type="number" value={foodForm.stock} onChange={(e) => setFoodForm({ ...foodForm, stock: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: t.textMuted }}>Ангилал (олон сонгож болно)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {[
                      { value: 'MAIN_DISH', label: 'Үндсэн хоол' },
                      { value: 'DRINK',     label: 'Ундаа' },
                      { value: 'DESSERT',   label: 'Амттан' },
                      { value: 'DAIRY',     label: 'Цагаан идээ' },
                      { value: 'SHOP',      label: 'Дэлгүүр' },
                    ].map(({ value, label }) => {
                      const cats = Array.isArray(foodForm.category) ? foodForm.category : [foodForm.category];
                      const checked = cats.includes(value);
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            const prev = Array.isArray(foodForm.category) ? foodForm.category : [foodForm.category];
                            const next = checked
                              ? prev.filter(c => c !== value)
                              : [...prev, value];
                            setFoodForm({ ...foodForm, category: next.length > 0 ? next : [value] });
                          }}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: checked ? '1.5px solid #C5A059' : `1.5px solid ${t.border2}`,
                            background: checked ? 'rgba(197,160,89,0.15)' : t.item,
                            color: checked ? '#C5A059' : t.textMuted,
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            fontWeight: '700',
                            transition: '0.15s',
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <ImageUpload t={t} imagePreview={imagePreview} handleImageChange={handleImageChange} />
                <FieldCheck t={t} checked={foodForm.featured} onChange={(e) => setFoodForm({ ...foodForm, featured: e.target.checked })} label="Онцолсон" />
                <SaveBtn isUploading={isUploading} isEditing={!!editingFood} onCancel={cancelEditFood} />
              </form>
            </FormCard>
          </div>
        )}

        {/* ── ӨРӨӨНҮҮД ── */}
        {activeTab === 'rooms' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 400px', gap: isMobile ? '20px' : '36px' }}>
            <InventoryTable t={t} title="Өрөөнүүд" items={rooms} type="room" deleteItem={deleteItem} onEdit={startEditRoom} editingId={editingRoom?.id} />
            <FormCard t={t} title={editingRoom ? `✏️ Засах: ${editingRoom.title}` : 'Өрөө нэмэх'}>
              <form onSubmit={submitRoom} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Field t={t} label="Өрөөний нэр"   value={roomForm.title}       onChange={(e) => setRoomForm({ ...roomForm, title: e.target.value })} />
                <FieldArea t={t} label="Тайлбар"    value={roomForm.description} onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })} />
                <Field t={t} label="Үнэ (₮)" type="number" value={roomForm.price} onChange={(e) => setRoomForm({ ...roomForm, price: parseFloat(e.target.value) })} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <Field t={t} label="Нийт гэр (тоо)" type="number" value={roomForm.totalUnits} onChange={(e) => setRoomForm({ ...roomForm, totalUnits: parseInt(e.target.value) || 1 })} />
                  <Field t={t} label="Насанд хүрэгч" type="number" value={roomForm.maxAdults}   onChange={(e) => setRoomForm({ ...roomForm, maxAdults: parseInt(e.target.value) })} />
                  <Field t={t} label="Хүүхэд"        type="number" value={roomForm.maxChildren} onChange={(e) => setRoomForm({ ...roomForm, maxChildren: parseInt(e.target.value) })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <FieldCheck t={t} checked={roomForm.wifi}           onChange={(e) => setRoomForm({ ...roomForm, wifi: e.target.checked })}           label="WiFi" />
                  <FieldCheck t={t} checked={roomForm.heating}        onChange={(e) => setRoomForm({ ...roomForm, heating: e.target.checked })}        label="Халаалт" />
                  <FieldCheck t={t} checked={roomForm.airConditioning} onChange={(e) => setRoomForm({ ...roomForm, airConditioning: e.target.checked })} label="Агааржуулалт" />
                  <FieldCheck t={t} checked={roomForm.breakfast}      onChange={(e) => setRoomForm({ ...roomForm, breakfast: e.target.checked })}      label="Өглөөний цай" />
                  <FieldCheck t={t} checked={roomForm.kitchen}        onChange={(e) => setRoomForm({ ...roomForm, kitchen: e.target.checked })}        label="Гал тогоо" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <ImageUpload
                    t={t}
                    label="Зураг 1"
                    imagePreview={imagePreview || roomForm.image}
                    handleImageChange={handleImageChange}
                  />
                  <ImageUpload
                    t={t}
                    label="Зураг 2"
                    imagePreview={imagePreview2 || roomForm.image2}
                    handleImageChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setImageFile2(file);
                      const reader = new FileReader();
                      reader.onloadend = () => setImagePreview2(reader.result);
                      reader.readAsDataURL(file);
                    }}
                  />
                  <ImageUpload
                    t={t}
                    label="Зураг 3"
                    imagePreview={imagePreview3 || roomForm.image3}
                    handleImageChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setImageFile3(file);
                      const reader = new FileReader();
                      reader.onloadend = () => setImagePreview3(reader.result);
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: t.textMuted }}>Нүүрэнд харагдах зураг сонгох:</label>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {[1, 2, 3].map((idx) => (
                      <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', color: t.text }}>
                        <input
                          type="radio"
                          name="mainImageIndex"
                          checked={roomForm.mainImageIndex === idx}
                          onChange={() => setRoomForm({ ...roomForm, mainImageIndex: idx })}
                        />
                        Зураг {idx}
                      </label>
                    ))}
                  </div>
                </div>

                <SaveBtn isUploading={isUploading} isEditing={!!editingRoom} onCancel={cancelEditRoom} />
              </form>
            </FormCard>
          </div>
        )}

        {/* ── АЯЛАЛУУД ── */}
        {activeTab === 'adventures' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 400px', gap: isMobile ? '20px' : '36px' }}>
            <InventoryTable t={t} title="Аялалууд" items={adventures} type="adventure" deleteItem={deleteItem} onEdit={startEditAdventure} editingId={editingAdventure?.id} />
            <FormCard t={t} title={editingAdventure ? `✏️ Засах: ${editingAdventure.title}` : 'Аялал нэмэх'}>
              <form onSubmit={submitAdventure} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Field t={t} label="Аяллын нэр"  value={adventureForm.title}       onChange={(e) => setAdventureForm({ ...adventureForm, title: e.target.value })} />
                <FieldArea t={t} label="Тайлбар"  value={adventureForm.description} onChange={(e) => setAdventureForm({ ...adventureForm, description: e.target.value })} />
                <Field t={t} label="Үнэ (₮)" type="number" value={adventureForm.price} onChange={(e) => setAdventureForm({ ...adventureForm, price: parseFloat(e.target.value) })} />
                <Field t={t} label="Хамгийн их хүн" type="number" value={adventureForm.maxPersons} onChange={(e) => setAdventureForm({ ...adventureForm, maxPersons: parseInt(e.target.value) })} />
                <ImageUpload t={t} imagePreview={imagePreview} handleImageChange={handleImageChange} />
                <SaveBtn isUploading={isUploading} isEditing={!!editingAdventure} onCancel={cancelEditAdventure} />
              </form>
            </FormCard>
          </div>
        )}

        {/* ── ЗАХИАЛГУУД ── */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Захиалгууд</h1>
              <button
                onClick={fetchData}
                style={{ background: t.item, border: `1px solid ${t.border2}`, borderRadius: '10px', padding: '7px 13px', color: t.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
              >
                <RefreshCw size={13} /> Шинэчлэх
              </button>
            </div>

            {/* Төлвийн тоочлол */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {ORDER_STATUSES.map((s) => (
                <div key={s} style={{ padding: '5px 14px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: '700', background: STATUS_COLOR[s].bg, color: STATUS_COLOR[s].color }}>
                  {STATUS_MN[s]} ({ordersByStatus[s] || 0})
                </div>
              ))}
            </div>

            {/* Захиалгуудын жагсаалт */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: t.textMuted }}>Захиалга байхгүй байна</div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      background: t.card, border: `1px solid ${t.border}`,
                      borderRadius: '16px', padding: '18px 22px',
                      display: 'grid', gridTemplateColumns: '1fr auto',
                      gap: '14px', alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: '800', fontSize: '0.85rem', color: '#C5A059' }}>#{order.id}</span>
                        <span style={{ fontWeight: '700' }}>{order.customerName}</span>
                        <span style={{ padding: '2px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: '700', background: STATUS_COLOR[order.status]?.bg, color: STATUS_COLOR[order.status]?.color }}>
                          {STATUS_MN[order.status] || order.status}
                        </span>
                      </div>
                      <div style={{ color: t.textMuted, fontSize: '0.8rem', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                        <span>{order.email}</span>
                        <span>{order.phone}</span>
                        <span style={{ color: '#C5A059', fontWeight: '700' }}>{order.totalAmount.toLocaleString()}₮</span>
                        <span>{new Date(order.createdAt).toLocaleDateString('mn-MN')}</span>
                      </div>
                      {order.items?.length > 0 && (
                        <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {order.items.map((item) => (
                            <span key={item.id} style={{ background: t.item, border: `1px solid ${t.border2}`, borderRadius: '7px', padding: '2px 9px', fontSize: '0.73rem', color: t.textMuted }}>
                              {item.title} ×{item.quantity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Төлөв солих dropdown */}
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{
                        background: t.item,
                        border: `1px solid ${STATUS_COLOR[order.status]?.color || t.border2}`,
                        borderRadius: '10px', padding: '9px 13px',
                        color: STATUS_COLOR[order.status]?.color || t.text,
                        cursor: 'pointer', fontWeight: '700',
                        fontSize: '0.82rem', minWidth: '160px',
                      }}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_MN[s]}</option>
                      ))}
                    </select>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── СЭТГЭГДЭЛ ── */}
        {activeTab === 'comments' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Сэтгэгдэл</h1>
              <button
                onClick={fetchData}
                style={{ background: t.item, border: `1px solid ${t.border2}`, borderRadius: '10px', padding: '7px 13px', color: t.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
              >
                <RefreshCw size={13} /> Шинэчлэх
              </button>
            </div>

            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: t.textMuted }}>Сэтгэгдэл байхгүй байна</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {comments.map((c) => {
                  const targetLabel = c.foodId
                    ? `🍽 Хоол #${c.foodId}`
                    : c.roomId
                    ? `🏠 Өрөө #${c.roomId}`
                    : c.adventureId
                    ? `🏔 Аялал #${c.adventureId}`
                    : '—';
                  const stars = '★'.repeat(Math.min(5, Math.max(0, c.rating))) + '☆'.repeat(5 - Math.min(5, Math.max(0, c.rating)));
                  return (
                    <div
                      key={c.id}
                      style={{
                        background: t.card, border: `1px solid ${t.border}`,
                        borderRadius: '14px', padding: '16px 20px',
                        display: 'grid', gridTemplateColumns: '1fr auto',
                        gap: '12px', alignItems: 'start',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: '800', fontSize: '0.88rem', color: '#C5A059' }}>{c.userName}</span>
                          <span style={{ color: '#fbbf24', fontSize: '0.8rem', letterSpacing: '1px' }}>{stars}</span>
                          <span style={{ padding: '2px 9px', background: t.item, border: `1px solid ${t.border2}`, borderRadius: '6px', fontSize: '0.72rem', color: t.textMuted, fontWeight: '700' }}>
                            {targetLabel}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: t.textMuted }}>
                            {new Date(c.createdAt).toLocaleDateString('mn-MN')}
                          </span>
                        </div>
                        <p style={{ color: t.text, fontSize: '0.88rem', margin: 0, lineHeight: '1.5' }}>{c.content}</p>
                      </div>
                      <button
                        onClick={() => deleteComment(c.id)}
                        title="Устгах"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', padding: '7px', borderRadius: '9px', cursor: 'pointer', color: '#f87171', flexShrink: 0 }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ТОХИРГОО ── */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '620px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px' }}>Тохиргоо</h1>
            <p style={{ color: t.textMuted, marginBottom: '32px', fontSize: '0.9rem' }}>Ухаалаг checkout санал болон хөнгөлөлтийн тохиргоо</p>

            {/* Хямд өдрүүд */}
            <SettingsCard t={t} title="Хямд өдрүүд" desc="Эдгээр өдрүүдэд захиалсан үйлчлүүлэгчид доорх хөнгөлөлт авна">
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Ня', 'Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя'].map((name, idx) => (
                  <button
                    key={idx}
                    onClick={() => dispatchSetts({ type: 'TOGGLE_DAY', day: idx })}
                    style={{
                      padding: '9px 16px', borderRadius: '50px',
                      border: setts.offPeakDays.includes(idx) ? '2px solid #C5A059' : `2px solid ${t.border2}`,
                      background: setts.offPeakDays.includes(idx) ? 'rgba(197,160,89,0.15)' : t.item,
                      color: setts.offPeakDays.includes(idx) ? '#C5A059' : t.textMuted,
                      cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem', transition: '0.15s',
                    }}
                  >{name}</button>
                ))}
              </div>
            </SettingsCard>

            {/* Хөнгөлөлтийн хувь */}
            <SettingsCard t={t} title="Хямд өдрийн хөнгөлөлт" desc="Хямд өдрийн захиалгад checkout дээр харуулах хөнгөлөлтийн хувь">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="number" min="1" max="50"
                  value={setts.offPeakDiscount}
                  onChange={(e) => dispatchSetts({ type: 'SET_FIELD', field: 'offPeakDiscount', value: Number(e.target.value) })}
                  style={{ ...inputStyle, width: '100px' }}
                />
                <span style={{ color: t.textMuted }}>%</span>
                <span style={{ color: t.textMuted, fontSize: '0.83rem' }}>
                  ₮500,000 → {(500000 * setts.offPeakDiscount / 100).toLocaleString()}₮ хэмнэнэ
                </span>
              </div>
            </SettingsCard>

            {/* Төлбөр хуваах */}
            <SettingsCard t={t} title="Төлбөр хуваах санал" desc="Нийт дүн хязгаараас давахад хэсэгчлэн төлөх сонголт харуулах">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: setts.splitEnabled ? '16px' : '0' }}>
                <span style={{ color: t.textMuted, fontSize: '0.85rem' }}>Идэвхжүүлэх</span>
                {/* Toggle switch */}
                <label style={{ position: 'relative', width: '46px', height: '25px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={setts.splitEnabled}
                    onChange={(e) => dispatchSetts({ type: 'SET_FIELD', field: 'splitEnabled', value: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{ position: 'absolute', inset: 0, borderRadius: '25px', background: setts.splitEnabled ? '#C5A059' : t.border2, transition: '0.25s' }} />
                  <span style={{ position: 'absolute', top: '3px', left: setts.splitEnabled ? '24px' : '3px', width: '19px', height: '19px', borderRadius: '50%', background: '#fff', transition: '0.25s' }} />
                </label>
              </div>
              {setts.splitEnabled && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label style={{ color: t.textMuted, fontSize: '0.83rem', whiteSpace: 'nowrap' }}>Нийт дүн ≥</label>
                  <input
                    type="number" min="10000" step="10000"
                    value={setts.splitThreshold}
                    onChange={(e) => dispatchSetts({ type: 'SET_FIELD', field: 'splitThreshold', value: Number(e.target.value) })}
                    style={{ ...inputStyle, width: '150px' }}
                  />
                  <span style={{ color: t.textMuted }}>₮ үед харуулах</span>
                </div>
              )}
            </SettingsCard>

            <button
              onClick={saveSettings}
              style={{
                background: settingsSaved ? '#4ade80' : '#C5A059',
                color: '#000', border: 'none', borderRadius: '12px',
                padding: '14px 30px', fontWeight: '800', cursor: 'pointer',
                fontSize: '0.95rem', transition: '0.25s',
              }}
            >
              {settingsSaved ? '✓ Хадгалагдлаа!' : 'Тохиргоо хадгалах'}
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

/* ============================================================
   ДЭД КОМПОНЕНТУУД
   ============================================================ */

function StatCard({ t, icon: Icon, label, value, accent }) {
  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '18px', padding: '22px' }}>
      <Icon color={accent} size={20} />
      <div style={{ marginTop: '18px', color: t.textMuted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      <div style={{ fontSize: '1.7rem', fontWeight: '800', marginTop: '5px', color: t.text }}>{value}</div>
    </div>
  );
}

function InventoryTable({ t, title, items, type, deleteItem, onEdit, editingId }) {
  const getDisplayImg = (item) => {
    if (type === 'room') {
      if (item.mainImageIndex === 2 && item.image2) return item.image2;
      if (item.mainImageIndex === 3 && item.image3) return item.image3;
    }
    return item.image;
  };

  return (
    <section style={{ background: t.card, borderRadius: '22px', padding: '28px', border: `1px solid ${t.border}` }}>
      <h2 style={{ marginBottom: '22px', color: t.text }}>{title}</h2>
      <div>
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: editingId === item.id ? 'rgba(197,160,89,0.07)' : t.item, padding: '13px 14px', borderRadius: '12px', marginBottom: '9px', border: editingId === item.id ? '1px solid rgba(197,160,89,0.4)' : `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', gap: '13px', alignItems: 'center', flex: 1, minWidth: 0 }}>
              <img
                src={getDisplayImg(item).startsWith('/') ? getDisplayImg(item) : `/${getDisplayImg(item)}`}
                alt=""
                style={{ width: '56px', height: '56px', borderRadius: '9px', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: '700', marginBottom: '2px', color: t.text }}>{item.title}</div>
                <div style={{ color: t.textMuted, fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>{item.description}</div>
                {type === 'food' && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                    {item.category && item.category.split(',').map(cat => (
                      <span key={cat} style={{ background: 'rgba(129,140,248,0.12)', color: '#818cf8', borderRadius: '6px', padding: '1px 7px', fontSize: '0.68rem', fontWeight: '700' }}>
                        {cat}
                      </span>
                    ))}
                    {item.size && (
                      <span style={{ background: 'rgba(197,160,89,0.12)', color: '#C5A059', borderRadius: '6px', padding: '1px 8px', fontSize: '0.72rem', fontWeight: '700' }}>
                        📏 {item.size}
                      </span>
                    )}
                    <span style={{ background: item.stock > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: item.stock > 0 ? '#4ade80' : '#f87171', borderRadius: '6px', padding: '1px 8px', fontSize: '0.72rem', fontWeight: '700' }}>
                      📦 {item.stock ?? 0} ш
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '7px', flexShrink: 0 }}>
              <button
                onClick={() => onEdit(item)}
                title="Засах"
                style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.3)', padding: '7px', borderRadius: '9px', cursor: 'pointer', color: '#C5A059' }}
              >
                ✏️
              </button>
              <button
                onClick={() => deleteItem(type, item.id)}
                title="Устгах"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', padding: '7px', borderRadius: '9px', cursor: 'pointer', color: '#f87171' }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '36px', color: t.textMuted, fontSize: '0.88rem' }}>Бараа байхгүй байна</div>
        )}
      </div>
    </section>
  );
}

function FormCard({ t, title, children }) {
  return (
    <section style={{ background: t.card, borderRadius: '22px', padding: '28px', border: `1px solid ${t.border}`, height: 'fit-content' }}>
      <h2 style={{ marginBottom: '22px', color: t.text }}>{title}</h2>
      {children}
    </section>
  );
}

function SettingsCard({ t, title, desc, children }) {
  return (
    <div style={{ background: t.card, borderRadius: '18px', padding: '24px', marginBottom: '18px', border: `1px solid ${t.border}` }}>
      <h3 style={{ color: '#C5A059', marginBottom: '4px', fontSize: '1rem' }}>{title}</h3>
      {desc && <p style={{ color: t.textMuted, fontSize: '0.82rem', marginBottom: '16px' }}>{desc}</p>}
      {children}
    </div>
  );
}

function Field({ t, label, ...props }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.78rem', color: t.textMuted }}>{label}</label>
      <input {...props} style={{ width: '100%', padding: '11px 13px', borderRadius: '9px', border: `1px solid ${t.border2}`, background: t.inputBg, color: t.inputText, fontSize: '0.88rem' }} />
    </div>
  );
}

function FieldArea({ t, label, ...props }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.78rem', color: t.textMuted }}>{label}</label>
      <textarea {...props} style={{ width: '100%', padding: '11px 13px', borderRadius: '9px', border: `1px solid ${t.border2}`, background: t.inputBg, color: t.inputText, fontSize: '0.88rem', minHeight: '82px', resize: 'vertical' }} />
    </div>
  );
}

function FieldCheck({ t, label, ...props }) {
  return (
    <label style={{ display: 'flex', gap: '9px', alignItems: 'center', cursor: 'pointer', fontSize: '0.85rem', color: t.text }}>
      <input type="checkbox" {...props} />
      {label}
    </label>
  );
}

function ImageUpload({ t, imagePreview, handleImageChange, label = "Зураг оруулах" }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.78rem', color: t.textMuted }}>{label}</label>
      <div style={{ border: `2px dashed ${t.border2}`, borderRadius: '14px', padding: '18px', textAlign: 'center', position: 'relative', cursor: 'pointer', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }} />
        {imagePreview
          ? <img src={imagePreview.startsWith('data:') ? imagePreview : (imagePreview.startsWith('/') ? imagePreview : `/${imagePreview}`)} alt="" style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '10px', objectFit: 'cover' }} />
          : <div><ImageIcon size={24} color={t.textMuted} /><div style={{ marginTop: '4px', color: t.textMuted, fontSize: '0.65rem' }}>Сонгох</div></div>
        }
      </div>
    </div>
  );
}

function SaveBtn({ isUploading, isEditing, onCancel }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
      {isEditing && (
        <button type="button" onClick={onCancel}
          style={{ flex: 1, background: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '11px', padding: '13px', fontWeight: '700', cursor: 'pointer', fontSize: '0.88rem' }}>
          Цуцлах
        </button>
      )}
      <button type="submit" disabled={isUploading}
        style={{ flex: 2, background: isEditing ? '#3b82f6' : '#C5A059', color: isEditing ? '#fff' : '#000', border: 'none', borderRadius: '11px', padding: '13px', fontWeight: '800', cursor: 'pointer', fontSize: '0.88rem' }}>
        {isUploading ? 'Оруулж байна...' : isEditing ? '✓ Өөрчлөлт хадгалах' : 'Хадгалах'}
      </button>
    </div>
  );
}
