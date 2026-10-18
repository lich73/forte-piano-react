import { Link, NavLink } from 'react-router-dom'
import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap'

interface NavbarProps {
  totalCarrito?: number
  sesion?: { nombre: string; rolId: number } | null
  onCerrarSesion?: () => void
}

export function Navbar({ totalCarrito = 0, sesion = null, onCerrarSesion }: NavbarProps) {
  return (
    <header>
      <BsNavbar expand="lg" variant="dark" className="forte-navbar sticky-top">
        <Container>
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
            <img src="/img/logo.png" alt="Logo Forte & Piano" height="38" />
          </Link>
          <Link to="/" className="navbar-brand d-flex gap-2 brand-text">
            Forte & Piano
          </Link>

          <BsNavbar.Toggle aria-controls="navMenu" aria-label="Abrir menu" />

          <BsNavbar.Collapse id="navMenu">
            <Nav className="mx-auto mb-2 mb-lg-0">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                Inicio
              </NavLink>
              <NavLink to="/productos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Catálogo
              </NavLink>
              <NavLink to="/servicios" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Servicios
              </NavLink>
              <NavLink to="/blog" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Blog
              </NavLink>
              <NavLink to="/nosotros" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Nosotros
              </NavLink>
              <NavLink to="/contacto" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Contacto
              </NavLink>
              {sesion && (sesion.rolId === 1 || sesion.rolId === 2) && (
                <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <i className="bi bi-speedometer2 me-1"></i> Administración
                </NavLink>
              )}
            </Nav>

            <Nav className="align-items-lg-center gap-lg-3">
              <Nav.Item>
                <Link to="/carrito" className="nav-link position-relative" title="Carrito">
                  <i className="bi bi-cart3 fs-5"></i>
                  {totalCarrito > 0 && (
                    <span
                      id="carritoBadge"
                      className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle mt-1"
                      style={{ fontSize: '0.70rem' }}
                    >
                      {totalCarrito}
                    </span>
                  )}
                </Link>
              </Nav.Item>

              {!sesion ? (
                <Nav.Item id="navInvitado">
                  <div className="d-flex align-items-center gap-2">
                    <Link to="/login" className="btn btn-outline-light btn-sm">
                      Iniciar sesión
                    </Link>
                    <Link to="/registro" className="btn btn-accent btn-sm">
                      Registrarse
                    </Link>
                  </div>
                </Nav.Item>
              ) : (
                <Nav.Item className="dropdown" id="navUsuario">
                  <span className="nav-link dropdown-toggle text-light" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-person-circle fs-5 me-1"></i>
                    <span>{sesion.nombre}</span>
                  </span>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={(e) => {
                          e.preventDefault()
                          onCerrarSesion?.()
                        }}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i> Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </Nav.Item>
              )}
            </Nav>
          </BsNavbar.Collapse>
        </Container>
      </BsNavbar>
    </header>
  )
}
export default Navbar
