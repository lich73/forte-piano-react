import { Link } from 'react-router-dom'
import { Row, Col, Card, ListGroup } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useProductos } from '../../hooks/useProductos'
import { useUsuarios } from '../../hooks/useUsuarios'
import { useColeccion } from '../../storage/useColeccion'
import { FORTEPIANO_KEYS } from '../../storage/claves'
import { Mensaje } from '../../types'
import { useTablasMaestras } from '../../hooks/useTablasMaestras'

export default function AdminDashboard() {
  const { sesion } = useAuth()
  const { productos } = useProductos()
  const { usuarios } = useUsuarios()
  const { datos: contactos } = useColeccion<Mensaje>(FORTEPIANO_KEYS.contactos)
  const { obtenerNombreRol } = useTablasMaestras()

  const nombreRol = sesion ? obtenerNombreRol(sesion.rolId) : ''
  const esVendedor = sesion?.rolId === 2

  const criticos = productos.filter(
    (p) => p.stockCritico != null && p.stock <= p.stockCritico
  )

  return (
    <div>
      <h1 className="section-title">Panel principal</h1>
      <p className="text-muted" id="bienvenidaAdmin">
        {sesion
          ? `Bienvenido, ${sesion.nombre} (${nombreRol})`
          : 'Bienvenido al panel administrativo'}
      </p>

      {/* Tarjetas de resumen */}
      <Row className="g-4 mt-2">
        {/* Catálogo */}
        <Col md={4}>
          <Card className="admin-summary-card p-4 position-relative">
            <i className="bi bi-controller fs-2 text-accent" />
            <h3 className="h2 mt-2 mb-0" id="totalProductos">
              {productos.length}
            </h3>
            <p className="text-muted mb-0">Catálogo registrados</p>
            <Link to="/admin/productos" className="stretched-link" aria-label="Ir a productos" />
          </Card>
        </Col>

        {/* Usuarios (Oculto para rol Vendedor: rolId === 2) */}
        {!esVendedor && (
          <Col md={4} id="cardUsuarios">
            <Card className="admin-summary-card p-4 position-relative">
              <i className="bi bi-people fs-2 text-accent" />
              <h3 className="h2 mt-2 mb-0" id="totalUsuarios">
                {usuarios.length}
              </h3>
              <p className="text-muted mb-0">Usuarios registrados</p>
              <Link to="/admin/usuarios" className="stretched-link" aria-label="Ir a usuarios" />
            </Card>
          </Col>
        )}

        {/* Mensajes de contacto */}
        <Col md={4}>
          <Card className="admin-summary-card p-4">
            <i className="bi bi-envelope fs-2 text-accent" />
            <h3 className="h2 mt-2 mb-0" id="totalMensajes">
              {contactos.length}
            </h3>
            <p className="text-muted mb-0">Mensajes de contacto</p>
          </Card>
        </Col>
      </Row>

      {/* Alerta de Stock Crítico */}
      <Row className="g-4 mt-1">
        <Col md={6}>
          <Card className="p-4">
            <h3 className="h5 mb-3">
              <i className="bi bi-exclamation-triangle-fill text-danger me-2" />
              Stock crítico
            </h3>
            <ListGroup variant="flush" id="listaStockCritico">
              {criticos.length === 0 ? (
                <ListGroup.Item className="bg-transparent text-muted px-0">
                  Sin alertas de stock por el momento.
                </ListGroup.Item>
              ) : (
                criticos.map((producto) => (
                  <ListGroup.Item
                    key={producto.codigo}
                    className="bg-transparent d-flex justify-content-between align-items-center px-0 text-light border-secondary"
                  >
                    <span>{producto.nombre}</span>
                    <span className="stock-critico">
                      Stock: {producto.stock}
                    </span>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
