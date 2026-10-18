import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

interface LayoutProps {
  totalCarrito?: number
}

export function Layout({ totalCarrito }: LayoutProps) {
  return (
    <>
      <Navbar totalCarrito={totalCarrito} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout
