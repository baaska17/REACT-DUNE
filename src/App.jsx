import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import RoomDetails from './pages/RoomDetails'
import HorseRide from './pages/HorseRide'
import Restaurant from './pages/Restaurant'
import Checkout from './pages/Checkout'

import './index.css'
import './styles/Home.css'
import './styles/res.css'
import './styles/room.css'
import './styles/horse.css'

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app-wrapper">
          <Header />
          <CartDrawer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/horse" element={<HorseRide />} />
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  )
}

export default App
