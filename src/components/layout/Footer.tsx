import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="forte-footer py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <span className="brand-text fs-5">FORTE & PIANO</span>
            <p className="mt-2 mb-0">Tu tienda de música de confianza.</p>
          </div>
          <div className="col-md-4">
            <h6 className="text-white">Navegación</h6>
            <ul className="list-unstyled">
              <li><Link to="/productos">Catálogo</Link></li>
              <li><Link to="/servicios">Servicios</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="text-white">Síguenos</h6>
            <div className="fs-4 d-flex gap-3">
              <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
              <a href="#" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
            </div>
          </div>
        </div>
        <hr className="border-secondary my-4" />
        <p className="text-center mb-0 small">&copy; 2026 Forte & Piano</p>
      </div>
    </footer>
  )
}
export default Footer
