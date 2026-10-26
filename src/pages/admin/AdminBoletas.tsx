import { useMemo } from 'react'
import { Card, Row, Col, Badge, Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useBoletas } from '../../hooks/useBoletas'
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
    const totalAnuladas = boletas.filter((b) => b.estado === 'Anulada').length

    return { totalRecaudado, totalIva, totalEmitidas, totalAnuladas }
  }, [boletas])

  const verDetalleBoleta = (boleta: Boleta) => {
    const filasHtml = boleta.items
      .map(
        (it) => `
        <tr style="border-bottom: 1px solid #cbd5e1;">
          <td style="padding: 7px 6px; color: #0f172a !important; font-weight: bold;">${it.cantidad}x</td>
          <td style="padding: 7px 6px; color: #0f172a !important;">
            <strong style="color: #0f172a !important; display: block; font-size: 13px;">${it.nombre}</strong>
            <small style="color: #475569 !important; font-size: 11px;">Código: ${it.codigo}</small>
          </td>
          <td style="padding: 7px 6px; text-align: right; font-weight: bold; color: #0f172a !important;">
            ${formatearPrecio(it.subtotal)}
          </td>
        </tr>
      `
      )
      .join('')

    const boletaHtml = `
      <div id="boletaImprimible" style="text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #0f172a !important; background: #ffffff !important; padding: 18px; border: 1px dashed #94a3b8; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 14px; border-bottom: 2px solid #0d233a; padding-bottom: 10px;">
          <h4 class="boleta-empresa" style="margin: 0; font-size: 18px; color: #0d233a !important; font-weight: 800;">FORTE & PIANO SpA</h4>
          <p class="boleta-subtitulo" style="margin: 3px 0; font-size: 12px; color: #334155 !important;">R.U.T.: 76.543.210-K &bull; Venta de Instrumentos Musicales</p>
          <p class="boleta-subtitulo" style="margin: 2px 0; font-size: 12px; color: #334155 !important;">Av. Providencia 1234, Santiago &bull; contacto@fortepiano.cl</p>
          <div class="boleta-folio-box" style="display: inline-block; border: 2px solid #0056b3 !important; background: #f0f7ff !important; padding: 6px 16px; margin-top: 8px; border-radius: 4px;">
            <span style="font-weight: 800; color: #0056b3 !important; font-size: 14px;">BOLETA ELECTRÓNICA N° ${boleta.folio}</span>
          </div>
        </div>

        <div class="boleta-info-box" style="font-size: 12px; margin-bottom: 14px; background: #f8fafc !important; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
          <p style="margin: 3px 0; color: #1e293b !important;"><strong style="color: #0f172a !important;">Fecha de emisión:</strong> ${boleta.fecha}</p>
          <p style="margin: 3px 0; color: #1e293b !important;"><strong style="color: #0f172a !important;">Cliente:</strong> ${boleta.clienteNombre}</p>
          ${boleta.clienteRun ? `<p style="margin: 3px 0; color: #1e293b !important;"><strong style="color: #0f172a !important;">R.U.T. Cliente:</strong> ${boleta.clienteRun}</p>` : ''}
          <p style="margin: 3px 0; color: #1e293b !important;"><strong style="color: #0f172a !important;">Correo:</strong> ${boleta.clienteCorreo}</p>
          <p style="margin: 3px 0; color: #1e293b !important;"><strong style="color: #0f172a !important;">Medio de pago:</strong> ${boleta.metodoPago}</p>
          <p style="margin: 3px 0; color: #1e293b !important;"><strong style="color: #0f172a !important;">Estado:</strong> ${boleta.estado}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 14px;">
          <thead>
            <tr style="background: #f1f5f9 !important; border-bottom: 2px solid #94a3b8; text-align: left;">
              <th style="padding: 7px 6px; color: #0f172a !important; font-weight: 700;">Cant.</th>
              <th style="padding: 7px 6px; color: #0f172a !important; font-weight: 700;">Descripción</th>
              <th style="padding: 7px 6px; text-align: right; color: #0f172a !important; font-weight: 700;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${filasHtml}
          </tbody>
        </table>

        <div class="boleta-totales" style="border-top: 1px dashed #94a3b8; padding-top: 10px; font-size: 13px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #1e293b !important;">Subtotal Neto:</span>
            <span style="color: #0f172a !important; font-weight: 600;">${formatearPrecio(boleta.subtotalNeto)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #1e293b !important;">19% I.V.A.:</span>
            <span style="color: #0f172a !important; font-weight: 600;">${formatearPrecio(boleta.iva)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; border-top: 2px solid #0d233a; padding-top: 8px; margin-top: 6px;">
            <span style="color: #0d233a !important;">TOTAL PAGADO:</span>
            <span class="boleta-total-pagado" style="color: #0056b3 !important; font-size: 17px; font-weight: 800;">${formatearPrecio(boleta.total)}</span>
          </div>
        </div>

        <p class="boleta-footer-aviso" style="text-align: center; font-size: 11px; color: #475569 !important; margin: 14px 0 0 0;">
          El IVA de esta boleta ha sido retenido según normativa vigente del SII.<br/>
          ¡Gracias por tu compra en Forte & Piano!
        </p>
      </div>
    `

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
          <Badge bg={b.estado === 'Emitida' ? 'success' : 'danger'}>
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
          <h1 className="h3 mb-1">Gestión de Boletas de Venta</h1>
          <p className="text-muted mb-0">
            Registro global de boletas electrónicas emitidas en Forte & Piano.
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
              <small className="text-muted">Total recaudado</small>
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
              <div className="text-muted small text-uppercase">Boletas Anuladas</div>
              <h3 className="h4 text-danger mt-1 mb-0">{stats.totalAnuladas}</h3>
              <small className="text-muted">Operaciones canceladas</small>
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
          String(b.folio).includes(q)
        }
      />
    </div>
  )
}
