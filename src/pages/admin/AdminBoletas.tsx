import { useMemo } from 'react'
import { Card, Row, Col, Badge, Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useBoletas } from '../../hooks/useBoletas'
import { generarHtmlBoleta } from '../../context/CartContext'
import { DataTable, Columna } from '../../components/common/DataTable'
import { formatearPrecio } from '../../utils/formato'
import { Boleta } from '../../types'
import { imprimirBoletaHtml } from '../../utils/impresion'

export default function AdminBoletas() {
  const { boletas, anularBoleta } = useBoletas()

  // Estadísticas generales
  const stats = useMemo(() => {
    const totalRecaudado = boletas
      .filter((b) => b.estado === 'Emitida')
      .reduce((sum, b) => sum + b.total, 0)

    const totalIva = boletas
      .filter((b) => b.estado === 'Emitida')
      .reduce((sum, b) => sum + b.iva, 0)

    const totalEmitidas = boletas.filter((b) => b.estado === 'Emitida').length
    const totalPendientesORechazadas = boletas.filter(
      (b) => b.estado === 'Pendiente' || b.estado === 'Rechazada' || b.estado === 'Anulada'
    ).length

    return { totalRecaudado, totalIva, totalEmitidas, totalPendientesORechazadas }
  }, [boletas])

  const verDetalleBoleta = (boleta: Boleta) => {
    const boletaHtml = generarHtmlBoleta(boleta)

    Swal.fire({
      title: `Boleta Electrónica N° ${boleta.folio}`,
      html: boletaHtml,
      width: '600px',
      showCancelButton: true,
      confirmButtonText: '<i class="bi bi-printer"></i> Imprimir',
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#0056b3',
      willClose: () => {
        document.body.classList.remove('swal2-shown', 'swal2-height-auto')
        document.body.style.overflow = ''
      },
      didClose: () => {
        document.body.classList.remove('swal2-shown', 'swal2-height-auto')
        document.body.style.overflow = ''
      }
    }).then((res) => {
      if (res.isConfirmed) {
        setTimeout(() => {
          imprimirBoletaHtml(boletaHtml, boleta.folio)
        }, 150)
      }
    })
  }

  const handleAnular = (boleta: Boleta) => {
    Swal.fire({
      title: `¿Anular Boleta N° ${boleta.folio}?`,
      text: 'Esta acción cambiará el estado de la boleta a Anulada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    }).then((res) => {
      if (res.isConfirmed) {
        anularBoleta(boleta.id)
        Swal.fire('Boleta Anulada', `La boleta N° ${boleta.folio} fue anulada.`, 'success')
      }
    })
  }

  const columnas: Columna<Boleta>[] = useMemo(
    () => [
      {
        encabezado: 'Folio',
        render: (b) => <strong className="text-accent">N° {b.folio}</strong>,
        ordenarPor: (b) => b.folio
      },
      {
        encabezado: 'Fecha',
        render: (b) => b.fecha,
        ordenarPor: (b) => b.fecha
      },
      {
        encabezado: 'Cliente',
        render: (b) => (
          <div>
            <div>{b.clienteNombre}</div>
            <small className="text-muted">{b.clienteCorreo}</small>
            {b.clienteRun && <div className="text-muted small">RUT: {b.clienteRun}</div>}
          </div>
        ),
        ordenarPor: (b) => b.clienteNombre
      },
      {
        encabezado: 'Despacho',
        render: (b) =>
          b.datosEnvio ? (
            <div className="small">
              <div>{b.datosEnvio.direccion}</div>
              <span className="text-muted">{b.datosEnvio.comunaNombre}</span>
            </div>
          ) : (
            <span className="text-muted small">Tienda / Estándar</span>
          )
      },
      {
        encabezado: 'Artículos',
        render: (b) => (
          <span title={b.items.map((i) => `${i.cantidad}x ${i.nombre}`).join(', ')}>
            {b.items.reduce((acc, i) => acc + i.cantidad, 0)} u. ({b.items.length} prod.)
          </span>
        ),
        ordenarPor: (b) => b.items.length
      },
      {
        encabezado: 'Total',
        render: (b) => <strong>{formatearPrecio(b.total)}</strong>,
        ordenarPor: (b) => b.total
      },
      {
        encabezado: 'Estado',
        render: (b) => (
          <Badge
            bg={
              b.estado === 'Emitida'
                ? 'success'
                : b.estado === 'Pendiente'
                ? 'warning'
                : b.estado === 'Rechazada'
                ? 'danger'
                : 'secondary'
            }
            text={b.estado === 'Pendiente' ? 'dark' : 'light'}
          >
            {b.estado}
          </Badge>
        ),
        ordenarPor: (b) => b.estado
      },
      {
        encabezado: 'Acciones',
        className: 'text-nowrap',
        render: (b) => (
          <div className="d-flex gap-1">
            <Button
              size="sm"
              variant="outline-accent"
              onClick={() => verDetalleBoleta(b)}
              title="Ver detalle e imprimir"
            >
              <i className="bi bi-eye" />
            </Button>
            {b.estado === 'Emitida' && (
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => handleAnular(b)}
                title="Anular boleta"
              >
                <i className="bi bi-x-circle" />
              </Button>
            )}
          </div>
        )
      }
    ],
    []
  )

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Gestión de Boletas y Pedidos</h1>
          <p className="text-muted mb-0">
            Registro global de boletas electrónicas, despachos y estados de pago en Forte & Piano.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <Row className="g-3 mb-4">
        <Col sm={6} lg={3}>
          <Card className="bg-forte-panel border-secondary h-100">
            <Card.Body>
              <div className="text-muted small text-uppercase">Ventas Netas + IVA</div>
              <h3 className="h4 text-accent mt-1 mb-0">{formatearPrecio(stats.totalRecaudado)}</h3>
              <small className="text-muted">Total recaudado (Emitidas)</small>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="bg-forte-panel border-secondary h-100">
            <Card.Body>
              <div className="text-muted small text-uppercase">Boletas Emitidas</div>
              <h3 className="h4 text-light mt-1 mb-0">{stats.totalEmitidas}</h3>
              <small className="text-success">Transacciones exitosas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="bg-forte-panel border-secondary h-100">
            <Card.Body>
              <div className="text-muted small text-uppercase">IVA Recaudado (19%)</div>
              <h3 className="h4 text-light mt-1 mb-0">{formatearPrecio(stats.totalIva)}</h3>
              <small className="text-muted">Débito fiscal estimado</small>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="bg-forte-panel border-secondary h-100">
            <Card.Body>
              <div className="text-muted small text-uppercase">Pendientes / Rechazadas / Anuladas</div>
              <h3 className="h4 text-warning mt-1 mb-0">{stats.totalPendientesORechazadas}</h3>
              <small className="text-muted">Operaciones no concretadas</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla con DataTable */}
      <DataTable<Boleta>
        filas={boletas}
        columnas={columnas}
        filaKey={(b) => b.id}
        itemsPorPaginaInicial={10}
        criterioBusqueda={(b, q) =>
          b.clienteNombre.toLowerCase().includes(q) ||
          b.clienteCorreo.toLowerCase().includes(q) ||
          b.estado.toLowerCase().includes(q) ||
          String(b.folio).includes(q)
        }
      />
    </div>
  )
}
