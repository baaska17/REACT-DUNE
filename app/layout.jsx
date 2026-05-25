import { headers } from 'next/headers';
import '../src/index.css'
import '../src/App.css'
import '../src/styles/Home.css'
import '../src/styles/res.css'
import '../src/styles/room.css'
import '../src/styles/horse.css'
import '../src/styles/checkout.css'
import './globals.css'

import Header from '../src/components/Header'
import Footer from '../src/components/Footer'
import CartDrawer from '../src/components/CartDrawer'
import BottomNav from '../src/components/BottomNav'
import { CartProvider } from '../src/context/CartContext'
import { ThemeProvider } from '../src/context/ThemeContext'
import { LanguageProvider } from '../src/context/LanguageContext'

export const metadata = {
  title: 'Dune Tourist Camp',
  description: 'Authentic Nomadic Luxury in Mongolia',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',   // iOS safe area (notch, home indicator)
}

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const is3001 = host.includes(':3001');

  return (
    <html lang="en">
      <body>
        <LanguageProvider>
        <ThemeProvider>
          <CartProvider>
            <div className="app-wrapper">
              {/* Хэрэв 3001 порт биш бол Header болон CartDrawer-г харуулна */}
              {!is3001 && <Header />}
              {!is3001 && <CartDrawer />}
              
              <main>{children}</main>
              
              {/* Хэрэв 3001 порт биш бол Footer-г харуулна */}
              {!is3001 && <Footer />}
              {!is3001 && <BottomNav />}
            </div>
          </CartProvider>
        </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
