import { NavLink, Link } from 'react-router-dom'
import { Offcanvas } from 'react-bootstrap'

interface AdminOffcanvasProps {
  show: boolean
  onHide: () => void
  rolId?: number
}

export function AdminOffcanvas({ show, onHide, rolId = 1 }: AdminOffcanvasProps) {
  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="start"
      data-bs-theme="dark"
      className="text-bg-dark"
      id="adminOffcanvas"
    >
      <Offcanvas.Header closeButton closeVariant="white">
        <Offcanvas.Title>Menú administrativo</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <nav className="nav flex-column">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={onHide}
          >
            <i className="bi bi-speedometer2 me-2"></i>Panel principal
          </NavLink>
          <NavLink
            to="/admin/productos"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={onHide}
          >
            <i className="bi bi-controller me-2"></i>Catálogo
          </NavLink>
          {rolId === 1 && (
            <NavLink
              to="/admin/usuarios"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              id="offcanvasUsuariosLink"
              onClick={onHide}
            >
              <i className="bi bi-people me-2"></i>Usuarios
            </NavLink>
          )}
          <hr className="border-secondary my-3" />
          <Link to="/" className="nav-link" onClick={onHide}>
            <i className="bi bi-box-arrow-left me-2"></i>Volver a la tienda
          </Link>
        </nav>
      </Offcanvas.Body>
    </Offcanvas>
  )
}
export default AdminOffcanvas
