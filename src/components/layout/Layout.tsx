import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

interface LayoutProps {
  totalCarrito?: number
  sesion?: { nombre: string; rolId: number } | null
  onCerrarSesion?: () => void
}

export function Layout({ totalCarrito, sesion, onCerrarSesion }: LayoutProps) {
  return (
    <>
      <Navbar totalCarrito={totalCarrito} sesion={sesion} onCerrarSesion={onCerrarSesion} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
export default Layout
