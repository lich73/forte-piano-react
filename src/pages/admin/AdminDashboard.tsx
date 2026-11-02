import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Card, ListGroup, Badge, ProgressBar } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useProductos } from '../../hooks/useProductos'
import { useUsuarios } from '../../hooks/useUsuarios'
import { useBoletas } from '../../hooks/useBoletas'
import { useColeccion } from '../../storage/useColeccion'
import { FORTEPIANO_KEYS } from '../../storage/claves'
import { Mensaje, EstadoPedido } from '../../types'
import { useTablasMaestras } from '../../hooks/useTablasMaestras'
import { formatearPrecio, tieneOfertaActiva } from '../../utils/formato'

interface SegmentoDonut {
  estado: EstadoPedido
  etiqueta: string
  cantidad: number
  porcentaje: number
  color: string
  badgeBg: string
}

export default function AdminDashboard() {
  const { sesion } = useAuth()
  const { productos } = useProductos()
  const { usuarios } = useUsuarios()
  const { boletas } = useBoletas()
  const { datos: contactos } = useColeccion<Mensaje>(FORTEPIANO_KEYS.contactos)
  const { obtenerNombreRol } = useTablasMaestras()

  const nombreRol = sesion ? obtenerNombreRol(sesion.rolId) : ''
  const esVendedor = sesion?.rolId === 2

  const criticos = useMemo(
    () =>
      productos.filter(
        (p) => p.stockCritico != null && p.stock <= p.stockCritico
      ),
    [productos]
  )

  // 1. Ventas totales y cantidad de pedidos
  const boletasEmitidas = useMemo(
    () => boletas.filter((b) => b.estado === 'Emitida'),
    [boletas]
  )

  const ventasTotales = useMemo(
    () => boletasEmitidas.reduce((acc, b) => acc + b.total, 0),
    [boletasEmitidas]
  )

  const unidadesVendidas = useMemo(
    () =>
      boletasEmitidas.reduce(
        (acc, b) => acc + b.items.reduce((sum, item) => sum + item.cantidad, 0),
        0
      ),
    [boletasEmitidas]
  )

  const productosEnOferta = useMemo(
    () => productos.filter((p) => tieneOfertaActiva(p)).length,
    [productos]
  )

  // 2. Distribución de pedidos por estado (Donut SVG)
  const distribucionEstados = useMemo<SegmentoDonut[]>(() => {
    const total = boletas.length
    const definiciones: Array<{
      estado: EstadoPedido
      etiqueta: string
      color: string
      badgeBg: string
    }> = [
      { estado: 'Emitida', etiqueta: 'Emitidas (Pagadas)', color: '#198754', badgeBg: 'success' },
      { estado: 'Pendiente', etiqueta: 'Pendientes de Pago', color: '#ffc107', badgeBg: 'warning' },
      { estado: 'Rechazada', etiqueta: 'Rechazadas', color: '#dc3545', badgeBg: 'danger' },
      { estado: 'Anulada', etiqueta: 'Anuladas', color: '#6c757d', badgeBg: 'secondary' }
    ]

    return definiciones.map((def) => {
      const cantidad = boletas.filter((b) => b.estado === def.estado).length
      const porcentaje = total > 0 ? Math.round((cantidad / total) * 100) : 0
      return {
        ...def,
        cantidad,
        porcentaje
      }
    })
  }, [boletas])

  // 3. Productos más vendidos (Unidades e ingresos)
  const productosMasVendidos = useMemo(() => {
    const acumulado: Record<
      string,
      { codigo: string; nombre: string; unidades: number; ingresos: number }
    > = {}

    boletasEmitidas.forEach((b) => {
      b.items.forEach((item) => {
        if (!acumulado[item.codigo]) {
          acumulado[item.codigo] = {
            codigo: item.codigo,
            nombre: item.nombre,
            unidades: 0,
            ingresos: 0
          }
        }
        acumulado[item.codigo].unidades += item.cantidad
        acumulado[item.codigo].ingresos += item.subtotal
      })
    })

    return Object.values(acumulado)
      .sort((a, b) => b.unidades - a.unidades || b.ingresos - a.ingresos)
      .slice(0, 5)
  }, [boletasEmitidas])

  const maxUnidadesVendidas = useMemo(
    () =>
      productosMasVendidos.length > 0
        ? Math.max(...productosMasVendidos.map((p) => p.unidades), 1)
        : 1,
    [productosMasVendidos]
  )

  // 4. Productos con mayor stock (Gráfico de columnas SVG)
  const productosMayorStock = useMemo(() => {
    return [...productos]
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 6)
  }, [productos])

  const maxStockDisponible = useMemo(
    () =>
      productosMayorStock.length > 0
        ? Math.max(...productosMayorStock.map((p) => p.stock), 1)
        : 1,
    [productosMayorStock]
  )

  // Cálculo de segmentos para el Donut SVG (r = 60, circunferencia ≈ 376.99)
  const radioDonut = 60
  const circunferenciaDonut = 2 * Math.PI * radioDonut
  let acumuladoOffset = 0

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div>
          <h1 className="section-title mb-1">Panel principal y estadísticas</h1>
          <p className="text-muted mb-0" id="bienvenidaAdmin">
            {sesion
              ? `Bienvenido, ${sesion.nombre} (${nombreRol})`
              : 'Bienvenido al panel administrativo'}
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/boletas" className="btn btn-outline-accent btn-sm">
            <i className="bi bi-receipt me-1" /> Ver Pedidos ({boletas.length})
          </Link>
          <Link to="/admin/reportes" className="btn btn-accent btn-sm">
            <i className="bi bi-bar-chart-line me-1" /> Reporte Detallado
          </Link>
        </div>
      </div>

      {/* KPIs principales: Ventas Totales, Cantidad de Pedidos, Catálogo, Usuarios, Mensajes */}
      <Row className="g-3 mt-1">
        {/* Ventas Totales */}
        <Col sm={6} xl={3}>
          <Card className="admin-summary-card p-3 h-100 border-secondary position-relative">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small text-uppercase">Ventas Totales</span>
                <h3 className="h3 text-accent mt-1 mb-1" id="ventasTotalesDashboard">
                  {formatearPrecio(ventasTotales)}
                </h3>
                <small className="text-success">
                  <i className="bi bi-check-circle me-1" />
                  {boletasEmitidas.length} pagadas ({unidadesVendidas} u.)
                </small>
              </div>
              <i className="bi bi-cash-stack fs-2 text-accent" />
            </div>
            <Link to="/admin/boletas" className="stretched-link" aria-label="Ir a boletas" />
          </Card>
        </Col>

        {/* Cantidad de Pedidos */}
        <Col sm={6} xl={3}>
          <Card className="admin-summary-card p-3 h-100 border-secondary position-relative">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small text-uppercase">Cantidad de Pedidos</span>
                <h3 className="h3 text-light mt-1 mb-1" id="cantidadPedidosDashboard">
                  {boletas.length}
                </h3>
                <small className="text-muted">
                  {boletas.filter((b) => b.estado === 'Pendiente').length} pendientes &bull;{' '}
                  {boletas.filter((b) => b.estado === 'Rechazada').length} rechazados
                </small>
              </div>
              <i className="bi bi-bag-check fs-2 text-accent" />
            </div>
            <Link to="/admin/boletas" className="stretched-link" aria-label="Ir a pedidos" />
          </Card>
        </Col>

        {/* Catálogo */}
        <Col sm={6} xl={esVendedor ? 3 : 2}>
          <Card className="admin-summary-card p-3 h-100 border-secondary position-relative">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small text-uppercase">Catálogo</span>
                <h3 className="h3 mt-1 mb-1" id="totalProductos">
                  {productos.length}
                </h3>
                <small className="text-danger">
                  <i className="bi bi-fire me-1" />
                  {productosEnOferta} en oferta
                </small>
              </div>
              <i className="bi bi-music-note-beamed fs-2 text-accent" />
            </div>
            <Link to="/admin/productos" className="stretched-link" aria-label="Ir a productos" />
          </Card>
        </Col>

        {/* Usuarios (Oculto para rol Vendedor: rolId === 2) */}
        {!esVendedor && (
          <Col sm={6} xl={2} id="cardUsuarios">
            <Card className="admin-summary-card p-3 h-100 border-secondary position-relative">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <span className="text-muted small text-uppercase">Usuarios</span>
                  <h3 className="h3 mt-1 mb-1" id="totalUsuarios">
                    {usuarios.length}
                  </h3>
                  <small className="text-muted">Registrados</small>
                </div>
                <i className="bi bi-people fs-2 text-accent" />
              </div>
              <Link to="/admin/usuarios" className="stretched-link" aria-label="Ir a usuarios" />
            </Card>
          </Col>
        )}

        {/* Mensajes de contacto */}
        <Col sm={6} xl={esVendedor ? 3 : 2}>
          <Card className="admin-summary-card p-3 h-100 border-secondary">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small text-uppercase">Contactos</span>
                <h3 className="h3 mt-1 mb-1" id="totalMensajes">
                  {contactos.length}
                </h3>
                <small className="text-muted">Mensajes recibidos</small>
              </div>
              <i className="bi bi-envelope fs-2 text-accent" />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Fila de Gráficos Estadísticos 1: Distribución de Pedidos por Estado + Productos Más Vendidos */}
      <Row className="g-4 mt-1">
        {/* Gráfico 1: Distribución de pedidos por estado (Donut SVG) */}
        <Col lg={5}>
          <Card className="p-4 h-100 bg-forte-panel border-secondary" id="graficoDistribucionPedidos">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="h5 mb-0 text-light">
                <i className="bi bi-pie-chart-fill text-accent me-2" />
                Distribución de pedidos por estado
              </h3>
              <Badge bg="secondary">{boletas.length} total</Badge>
            </div>

            {boletas.length === 0 ? (
              <p className="text-muted my-auto text-center py-4">
                No hay pedidos registrados aún.
              </p>
            ) : (
              <Row className="align-items-center g-3 my-auto">
                <Col sm={5} className="text-center">
                  <svg
                    width="160"
                    height="160"
                    viewBox="0 0 160 160"
                    role="img"
                    aria-label="Gráfico de anillo de distribución de pedidos por estado"
                  >
                    <circle
                      cx="80"
                      cy="80"
                      r={radioDonut}
                      fill="transparent"
                      stroke="#2b3035"
                      strokeWidth="22"
                    />
                    {distribucionEstados.map((seg) => {
                      if (seg.cantidad === 0) return null
                      const longitudArco = (seg.cantidad / boletas.length) * circunferenciaDonut
                      const dashArray = `${longitudArco} ${circunferenciaDonut - longitudArco}`
                      const dashOffset = -acumuladoOffset
                      acumuladoOffset += longitudArco

                      return (
                        <circle
                          key={seg.estado}
                          cx="80"
                          cy="80"
                          r={radioDonut}
                          fill="transparent"
                          stroke={seg.color}
                          strokeWidth="22"
                          strokeDasharray={dashArray}
                          strokeDashoffset={dashOffset}
                          transform="rotate(-90 80 80)"
                        >
                          <title>
                            {seg.etiqueta}: {seg.cantidad} ({seg.porcentaje}%)
                          </title>
                        </circle>
                      )
                    })}
                    <text
                      x="80"
                      y="74"
                      textAnchor="middle"
                      fill="#f8f9fa"
                      fontSize="22"
                      fontWeight="bold"
                    >
                      {boletas.length}
                    </text>
                    <text
                      x="80"
                      y="95"
                      textAnchor="middle"
                      fill="#adb5bd"
                      fontSize="11"
                    >
                      Pedidos
                    </text>
                  </svg>
                </Col>

                <Col sm={7}>
                  <div className="d-flex flex-column gap-2">
                    {distribucionEstados.map((seg) => (
                      <div
                        key={seg.estado}
                        className="d-flex justify-content-between align-items-center p-2 rounded bg-dark border border-secondary"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <span
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: seg.color,
                              display: 'inline-block'
                            }}
                          />
                          <span className="small text-light">{seg.etiqueta}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <Badge bg={seg.badgeBg} text={seg.badgeBg === 'warning' ? 'dark' : undefined}>
                            {seg.cantidad}
                          </Badge>
                          <span className="small text-muted" style={{ minWidth: '38px', textAlign: 'right' }}>
                            {seg.porcentaje}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            )}
          </Card>
        </Col>

        {/* Gráfico 2: Productos más vendidos (Barras Horizontales) */}
        <Col lg={7}>
          <Card className="p-4 h-100 bg-forte-panel border-secondary" id="graficoProductosMasVendidos">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="h5 mb-0 text-light">
                <i className="bi bi-trophy-fill text-accent me-2" />
                Productos más vendidos
              </h3>
              <span className="small text-muted">Por unidades e ingresos confirmados</span>
            </div>

            {productosMasVendidos.length === 0 ? (
              <p className="text-muted my-auto text-center py-4">
                Sin ventas confirmadas para graficar.
              </p>
            ) : (
              <div className="d-flex flex-column gap-3 my-auto">
                {productosMasVendidos.map((item, idx) => {
                  const anchoBarra = Math.round((item.unidades / maxUnidadesVendidas) * 100)
                  return (
                    <div key={item.codigo}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="text-truncate pe-2">
                          <Badge bg="secondary" className="me-2">
                            #{idx + 1}
                          </Badge>
                          <span className="fw-semibold text-light">{item.nombre}</span>{' '}
                          <code className="small text-accent">({item.codigo})</code>
                        </div>
                        <div className="text-end text-nowrap">
                          <Badge bg="info" className="me-2">
                            {item.unidades} u.
                          </Badge>
                          <span className="small fw-bold text-accent">
                            {formatearPrecio(item.ingresos)}
                          </span>
                        </div>
                      </div>
                      <div
                        className="w-100 rounded overflow-hidden"
                        style={{ height: '12px', backgroundColor: '#2b3035' }}
                      >
                        <div
                          style={{
                            width: `${anchoBarra}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #d4af37 0%, #f3d060 100%)',
                            transition: 'width 0.4s ease'
                          }}
                          title={`${item.nombre}: ${item.unidades} unidades`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Fila de Gráficos Estadísticos 2: Productos con Mayor Stock + Alerta de Stock Crítico */}
      <Row className="g-4 mt-1">
        {/* Gráfico 3: Productos con mayor stock (Gráfico de Columnas SVG) */}
        <Col lg={7}>
          <Card className="p-4 h-100 bg-forte-panel border-secondary" id="graficoMayorStock">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="h5 mb-0 text-light">
                <i className="bi bi-boxes text-accent me-2" />
                Productos con mayor stock disponible
              </h3>
              <span className="small text-muted">Top {productosMayorStock.length} en bodega</span>
            </div>

            {productosMayorStock.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">No hay productos en inventario.</p>
            ) : (
              <div>
                {/* SVG Column Chart */}
                <div className="w-100 overflow-auto mb-3">
                  <svg
                    width="100%"
                    height="210"
                    viewBox="0 0 540 210"
                    role="img"
                    aria-label="Gráfico de barras de productos con mayor stock"
                  >
                    {/* Líneas guía horizontales */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                      const y = 165 - ratio * 130
                      const valorEscala = Math.round(maxStockDisponible * ratio)
                      return (
                        <g key={i}>
                          <line
                            x1="40"
                            y1={y}
                            x2="520"
                            y2={y}
                            stroke="#343a40"
                            strokeDasharray="3 3"
                          />
                          <text
                            x="32"
                            y={y + 4}
                            textAnchor="end"
                            fill="#adb5bd"
                            fontSize="10"
                          >
                            {valorEscala}
                          </text>
                        </g>
                      )
                    })}

                    {/* Columnas de cada producto */}
                    {productosMayorStock.map((prod, idx) => {
                      const anchoColumna = 44
                      const espacio = 76
                      const x = 58 + idx * espacio
                      const altura = Math.max(
                        Math.round((prod.stock / maxStockDisponible) * 130),
                        4
                      )
                      const y = 165 - altura
                      const enOferta = tieneOfertaActiva(prod)
                      const colorBarra = enOferta ? '#0dcaf0' : '#d4af37'

                      return (
                        <g key={prod.codigo}>
                          <rect
                            x={x}
                            y={y}
                            width={anchoColumna}
                            height={altura}
                            rx="5"
                            fill={colorBarra}
                          >
                            <title>
                              {prod.nombre} ({prod.codigo}): {prod.stock} unidades en stock
                            </title>
                          </rect>
                          <text
                            x={x + anchoColumna / 2}
                            y={y - 6}
                            textAnchor="middle"
                            fill="#f8f9fa"
                            fontSize="11"
                            fontWeight="bold"
                          >
                            {prod.stock}
                          </text>
                          <text
                            x={x + anchoColumna / 2}
                            y="184"
                            textAnchor="middle"
                            fill="#e9ecef"
                            fontSize="11"
                            fontWeight="600"
                          >
                            {prod.codigo}
                          </text>
                          <text
                            x={x + anchoColumna / 2}
                            y="198"
                            textAnchor="middle"
                            fill="#adb5bd"
                            fontSize="9"
                          >
                            {prod.nombre.slice(0, 11)}
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>

                <div className="d-flex flex-wrap justify-content-between align-items-center small text-muted border-top border-secondary pt-2">
                  <div>
                    <span
                      className="d-inline-block rounded me-1"
                      style={{ width: '10px', height: '10px', backgroundColor: '#d4af37' }}
                    />{' '}
                    Precio normal
                    <span
                      className="d-inline-block rounded ms-3 me-1"
                      style={{ width: '10px', height: '10px', backgroundColor: '#0dcaf0' }}
                    />{' '}
                    Producto en oferta
                  </div>
                  <span>
                    Total unidades en catálogo:{' '}
                    <strong className="text-light">
                      {productos.reduce((acc, p) => acc + p.stock, 0)} u.
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </Card>
        </Col>

        {/* Alerta de Stock Crítico */}
        <Col lg={5}>
          <Card className="p-4 h-100 bg-forte-panel border-secondary">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="h5 mb-0">
                <i className="bi bi-exclamation-triangle-fill text-danger me-2" />
                Stock crítico
              </h3>
              <Badge bg={criticos.length > 0 ? 'danger' : 'success'}>
                {criticos.length} alerta(s)
              </Badge>
            </div>
            <ListGroup variant="flush" id="listaStockCritico">
              {criticos.length === 0 ? (
                <ListGroup.Item className="bg-transparent text-muted px-0">
                  Sin alertas de stock por el momento. Todos los instrumentos superan su umbral crítico.
                </ListGroup.Item>
              ) : (
                criticos.map((producto) => (
                  <ListGroup.Item
                    key={producto.codigo}
                    className="bg-transparent d-flex justify-content-between align-items-center px-0 text-light border-secondary"
                  >
                    <div>
                      <span className="fw-semibold">{producto.nombre}</span>
                      <div className="small text-muted">
                        Código: <code>{producto.codigo}</code> &bull; Mínimo: {producto.stockCritico}
                      </div>
                    </div>
                    <span className="stock-critico">
                      Stock: {producto.stock}
                    </span>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>

            {/* Resumen rápido de inventario general */}
            <div className="mt-auto pt-3 border-top border-secondary">
              <div className="d-flex justify-content-between small mb-1">
                <span className="text-muted">Salud de stock del catálogo</span>
                <span className="text-light fw-semibold">
                  {productos.length > 0
                    ? Math.round(((productos.length - criticos.length) / productos.length) * 100)
                    : 100}
                  % óptimo
                </span>
              </div>
              <ProgressBar
                now={
                  productos.length > 0
                    ? Math.round(((productos.length - criticos.length) / productos.length) * 100)
                    : 100
                }
                variant={criticos.length === 0 ? 'success' : 'warning'}
                style={{ height: '8px' }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
