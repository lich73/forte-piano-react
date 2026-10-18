import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { Layout } from './components/layout/Layout'
import { AdminLayout } from './components/layout/AdminLayout'
import { RutaProtegida } from './components/common/RutaProtegida'

import Home from './pages/Home'
import Productos from './pages/Productos'
import ProductoDetalle from './pages/ProductoDetalle'
import Carrito from './pages/Carrito'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Nosotros from './pages/Nosotros'
import Servicios from './pages/Servicios'
import Blog from './pages/Blog'
import BlogDetalle from './pages/BlogDetalle'
import Contacto from './pages/Contacto'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProductos from './pages/admin/AdminProductos'
import AdminProductoForm from './pages/admin/AdminProductoForm'
import AdminUsuarios from './pages/admin/AdminUsuarios'
import AdminUsuarioForm from './pages/admin/AdminUsuarioForm'

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
        <Routes>
          {/* Rutas de la tienda pública con Layout (Navbar + Outlet + Footer) */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/producto-detalle" element={<ProductoDetalle />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetalle />} />
            <Route path="/contacto" element={<Contacto />} />
          </Route>

          {/* Rutas administrativas protegidas (Roles 1 y 2: Administrador y Vendedor) */}
          <Route element={<RutaProtegida rolesPermitidos={[1, 2]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/productos" element={<AdminProductos />} />
              <Route path="/admin/productos/form" element={<AdminProductoForm />} />

              {/* Rutas exclusivas del rol 1 (Administrador) */}
              <Route element={<RutaProtegida rolesPermitidos={[1]} />}>
                <Route path="/admin/usuarios" element={<AdminUsuarios />} />
                <Route path="/admin/usuarios/form" element={<AdminUsuarioForm />} />
              </Route>
            </Route>
          </Route>

          {/* Ruta comodín */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
