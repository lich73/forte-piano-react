import { NavLink, Link } from 'react-router-dom'

interface AdminSidebarProps {
  rolId?: number
}

export function AdminSidebar({ rolId = 1 }: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar h-100">
      <h6 className="text-uppercase text-muted small mb-3">Panel administrativo</h6>
      <nav className="nav flex-column">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-speedometer2 me-2"></i>Panel principal
        </NavLink>
        <NavLink
          to="/admin/productos"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-controller me-2"></i>Catálogo
        </NavLink>
        {rolId === 1 && (
          <NavLink
            to="/admin/usuarios"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="sidebarUsuariosLink"
          >
            <i className="bi bi-people me-2"></i>Usuarios
          </NavLink>
        )}
        <hr className="border-secondary my-3" />
        <Link to="/" className="nav-link">
          <i className="bi bi-box-arrow-left me-2"></i>Volver a la tienda
        </Link>
      </nav>
    </aside>
  )
}
export default AdminSidebar
