import { useMemo } from 'react'
import { Card, Row, Col, Table, Badge, ProgressBar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useBoletas } from '../../hooks/useBoletas'
import { useColeccion } from '../../storage/useColeccion'
import { FORTEPIANO_KEYS } from '../../storage/claves'
import { Producto, Categoria } from '../../types'
import { formatearPrecio } from '../../utils/formato'

export default function AdminReportes() {
  const { boletas } = useBoletas()
  const { datos: productos } = useColeccion<Producto>(FORTEPIANO_KEYS.productos)
  const { datos: categorias } = useColeccion<Categoria>(FORTEPIANO_KEYS.categorias)

  // 1. Métricas generales
  const boletasValidas = useMemo(
    () => boletas.filter((b) => b.estado === 'Emitida'),
    [boletas]
  )

  const metricas = useMemo(() => {
    const totalIngresos = boletasValidas.reduce((sum, b) => sum + b.total, 0)
    const totalUnidadesVendidas = boletasValidas.reduce(
      (sum, b) => sum + b.items.reduce((s, i) => s + i.cantidad, 0),
      0
    )
    const productosCriticos = productos.filter(
      (p) => p.stockCritico != null && p.stock <= p.stockCritico
    )

    return {
      totalIngresos,
      totalBoletas: boletasValidas.length,
      totalUnidadesVendidas,
      cantidadCriticos: productosCriticos.length
    }
  }, [boletasValidas, productos])

  // 2. Ranking de productos más vendidos
  const rankingProductos = useMemo(() => {
    const conteo: Record<string, { codigo: string; nombre: string; unidades: number; total: number }> = {}

    boletasValidas.forEach((b) => {
      b.items.forEach((it) => {
        if (!conteo[it.codigo]) {
          conteo[it.codigo] = {
            codigo: it.codigo,
            nombre: it.nombre,
            unidades: 0,
            total: 0
          }
        }
        conteo[it.codigo].unidades += it.cantidad
        conteo[it.codigo].total += it.subtotal
      })
    })

    return Object.values(conteo).sort((a, b) => b.unidades - a.unidades)
  }, [boletasValidas])

  // 3. Productos en Stock Crítico o Agotados
  const inventarioCritico = useMemo(() => {
    return productos
      .filter((p) => p.stock <= (p.stockCritico ?? 3))
      .sort((a, b) => a.stock - b.stock)
  }, [productos])

  // 4. Ventas por Categoría
  const ventasPorCategoria = useMemo(() => {
    const mapaCat: Record<number, { nombre: string; unidades: number; total: number }> = {}

    categorias.forEach((c) => {
      mapaCat[c.id] = { nombre: c.nombre, unidades: 0, total: 0 }
    })

    boletasValidas.forEach((b) => {
      b.items.forEach((it) => {
        const prod = productos.find((p) => p.codigo === it.codigo)
        const catId = prod?.categoriaId || 1
        if (!mapaCat[catId]) {
          mapaCat[catId] = { nombre: 'Otros', unidades: 0, total: 0 }
        }
        mapaCat[catId].unidades += it.cantidad
        mapaCat[catId].total += it.subtotal
      })
    })

    return Object.values(mapaCat).sort((a, b) => b.total - a.total)
  }, [boletasValidas, productos, categorias])

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Reportes de Gestión y Ventas</h1>
          <p className="text-muted mb-0">
            Métricas de comercialización, inventario crítico y rendimiento de catálogo.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <Row className="g-3 mb-4">
        <Col sm={6} lg={3}>
          <Card className="bg-forte-panel border-secondary h-100">
            <Card.Body>
              <div className="text-muted small text-uppercase">Ingresos Totales</div>
              <h3 className="h4 text-accent mt-1 mb-0">
                {formatearPrecio(metricas.totalIngresos)}
              </h3>
              <small className="text-muted">Boletas emitidas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="bg-forte-panel border-secondary h-100">
            <Card.Body>
              <div className="text-muted small text-uppercase">Boletas Emitidas</div>
              <h3 className="h4 text-light mt-1 mb-0">{metricas.totalBoletas}</h3>
              <small className="text-success">Transacciones confirmadas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="bg-forte-panel border-secondary h-100">
            <Card.Body>
              <div className="text-muted small text-uppercase">Instrumentos Vendidos</div>
              <h3 className="h4 text-light mt-1 mb-0">
                {metricas.totalUnidadesVendidas} unidades
              </h3>
              <small className="text-muted">Total de unidades despachadas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card
            className={`bg-forte-panel h-100 ${
              metricas.cantidadCriticos > 0 ? 'border-warning' : 'border-secondary'
            }`}
          >
            <Card.Body>
              <div className="text-muted small text-uppercase">Stock Crítico</div>
              <h3
                className={`h4 mt-1 mb-0 ${
                  metricas.cantidadCriticos > 0 ? 'text-warning' : 'text-light'
                }`}
              >
                {metricas.cantidadCriticos} producto(s)
              </h3>
              <small className="text-muted">Requieren reposición</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Alerta de Stock Crítico */}
      <Card className="bg-forte-panel border-secondary shadow-sm mb-4">
        <Card.Header className="bg-transparent border-secondary d-flex justify-content-between align-items-center">
          <h2 className="h5 mb-0 text-warning d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill"></i> Alertas de Stock Crítico y Reposición
          </h2>
          <Badge bg="warning" text="dark">
            {inventarioCritico.length} en alerta
          </Badge>
        </Card.Header>
        <Card.Body className="p-0">
          {inventarioCritico.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0">
              Todos los productos cuentan con niveles de stock óptimos.
            </p>
          ) : (
            <div className="table-responsive">
              <Table hover variant="dark" className="mb-0 align-middle">
                <thead>
                  <tr className="border-secondary text-muted">
                    <th>Código</th>
                    <th>Instrumento</th>
                    <th>Stock Actual</th>
                    <th>Umbral Crítico</th>
                    <th>Estado de Alerta</th>
                    <th className="text-end">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {inventarioCritico.map((p) => {
                    const agotado = p.stock <= 0
                    return (
                      <tr key={p.codigo} className="border-secondary">
                        <td className="fw-bold text-accent">{p.codigo}</td>
                        <td>{p.nombre}</td>
                        <td className="fw-bold">{p.stock}</td>
                        <td>{p.stockCritico ?? 3}</td>
                        <td>
                          {agotado ? (
                            <Badge bg="danger">AGOTADO</Badge>
                          ) : (
                            <Badge bg="warning" text="dark">
                              STOCK CRÍTICO
                            </Badge>
                          )}
                        </td>
                        <td className="text-end">
                          <Link
                            to={`/admin/productos/form?codigo=${encodeURIComponent(p.codigo)}`}
                            className="btn btn-outline-accent btn-sm"
                          >
                            <i className="bi bi-pencil me-1"></i> Reponer
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <Row className="g-4">
        {/* Top Productos Más Vendidos */}
        <Col lg={7}>
          <Card className="bg-forte-panel border-secondary shadow-sm h-100">
            <Card.Header className="bg-transparent border-secondary">
              <h2 className="h5 mb-0 text-accent">
                <i className="bi bi-trophy me-2"></i>Top Productos Más Vendidos
              </h2>
            </Card.Header>
            <Card.Body className="p-0">
              {rankingProductos.length === 0 ? (
                <p className="text-muted text-center py-4 mb-0">
                  Aún no se registran compras en el sistema.
                </p>
              ) : (
                <div className="table-responsive">
                  <Table hover variant="dark" className="mb-0 align-middle">
                    <thead>
                      <tr className="border-secondary text-muted">
                        <th>#</th>
                        <th>Código</th>
                        <th>Producto</th>
                        <th className="text-center">Unidades</th>
                        <th className="text-end">Recaudado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankingProductos.slice(0, 5).map((prod, index) => (
                        <tr key={prod.codigo} className="border-secondary">
                          <td className="fw-bold text-accent">#{index + 1}</td>
                          <td><code>{prod.codigo}</code></td>
                          <td>{prod.nombre}</td>
                          <td className="text-center">
                            <Badge bg="info">{prod.unidades} u.</Badge>
                          </td>
                          <td className="text-end fw-bold">
                            {formatearPrecio(prod.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Desglose de Ventas por Categoría */}
        <Col lg={5}>
          <Card className="bg-forte-panel border-secondary shadow-sm h-100">
            <Card.Header className="bg-transparent border-secondary">
              <h2 className="h5 mb-0 text-light">
                <i className="bi bi-pie-chart me-2"></i>Ventas por Categoría
              </h2>
            </Card.Header>
            <Card.Body>
              {ventasPorCategoria.length === 0 ? (
                <p className="text-muted text-center py-4 mb-0">
                  Sin ventas por categoría registradas.
                </p>
              ) : (
                ventasPorCategoria.map((cat, idx) => {
                  const porcentaje =
                    metricas.totalIngresos > 0
                      ? Math.round((cat.total / metricas.totalIngresos) * 100)
                      : 0

                  return (
                    <div key={idx} className="mb-3">
                      <div className="d-flex justify-content-between small mb-1">
                        <span className="fw-bold">{cat.nombre}</span>
                        <span className="text-muted">
                          {cat.unidades} u. &bull; {formatearPrecio(cat.total)} ({porcentaje}%)
                        </span>
                      </div>
                      <ProgressBar
                        now={porcentaje}
                        variant={porcentaje > 30 ? 'info' : 'secondary'}
                        style={{ height: '6px' }}
                      />
                    </div>
                  )
                })
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
