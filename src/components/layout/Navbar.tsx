import { Link, NavLink } from 'react-router-dom'
import { Navbar as BsNavbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

interface NavbarProps {
  totalCarrito?: number
}

export function Navbar({ totalCarrito = 0 }: NavbarProps) {
  const { sesion, logout } = useAuth()

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
                <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="navAdminItem">
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
                <NavDropdown
                  id="navUsuario"
                  title={
                    <>
                      <i className="bi bi-person-circle fs-5 me-1"></i>
                      <span id="navUsuarioNombre">{sesion.nombre}</span>
                    </>
                  }
                  align="end"
                  menuVariant="dark"
                >
                  <NavDropdown.Item
                    as="button"
                    className="text-danger"
                    id="btnCerrarSesion"
                    onClick={() => logout()}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i> Cerrar sesión
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </BsNavbar.Collapse>
        </Container>
      </BsNavbar>
    </header>
  )
}

export default Navbar
