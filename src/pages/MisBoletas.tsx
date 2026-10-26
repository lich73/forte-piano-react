import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Table, Badge, Button, Row, Col, Alert } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'
import { useBoletas } from '../hooks/useBoletas'
import { formatearPrecio } from '../utils/formato'
import { Boleta } from '../types'
import { imprimirBoletaHtml } from '../utils/impresion'

export default function MisBoletas() {
  const { sesion } = useAuth()
  const { boletas, obtenerBoletasPorCliente } = useBoletas()
  const [correoFiltro, setCorreoFiltro] = useState('')

  // Si hay sesión iniciada, buscar por su RUN y correo; si no, permitir buscar por correo
  const boletasUsuario = sesion
    ? obtenerBoletasPorCliente(sesion.run || sesion.correo)
    : correoFiltro.trim()
    ? boletas.filter(
        (b) => b.clienteCorreo.toLowerCase() === correoFiltro.trim().toLowerCase()
      )
    : []

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

  return (
    <section className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="section-title mb-1">Mis Boletas y Compras</h1>
          <p className="text-muted">Consulta y descarga los comprobantes de tus compras realizadas.</p>
        </div>
        <Link to="/productos" className="btn btn-outline-accent">
          <i className="bi bi-arrow-left me-1"></i> Ir a la tienda
        </Link>
      </div>

      {!sesion && (
        <Card className="bg-forte-panel border-secondary mb-4 p-3">
          <Card.Body>
            <Card.Title className="h5 text-accent mb-2">Consulta de compras para invitados</Card.Title>
            <p className="small text-muted mb-3">
              ¿Compraste como invitado? Ingresa el correo electrónico que utilizaste al pagar para ver tus boletas:
            </p>
            <Row className="g-2">
              <Col sm={8} md={6}>
                <input
                  type="email"
                  className="form-control"
                  placeholder="ejemplo@correo.cl"
                  value={correoFiltro}
                  onChange={(e) => setCorreoFiltro(e.target.value)}
                />
              </Col>
              <Col sm={4} md={3}>
                <Button variant="accent" className="w-100" onClick={() => {}}>
                  <i className="bi bi-search me-1"></i> Buscar
                </Button>
              </Col>
            </Row>
            <div className="mt-3">
              <small className="text-muted">
                ¿Tienes una cuenta registrada?{' '}
                <Link to="/login" className="text-accent">
                  Inicia sesión aquí
                </Link>{' '}
                para ver todo tu historial automáticamente.
              </small>
            </div>
          </Card.Body>
        </Card>
      )}

      {boletasUsuario.length === 0 ? (
        <Alert variant="secondary" className="bg-forte-panel border-secondary text-center py-5">
          <i className="bi bi-receipt display-4 text-muted mb-3 d-block"></i>
          <h2 className="h5 text-light">No registras compras ni boletas emitidas aún</h2>
          <p className="text-muted">Cuando realices una compra en Forte & Piano, tu boleta aparecerá aquí automáticamente.</p>
          <Link to="/productos" className="btn btn-accent mt-2">
            Explorar catálogo
          </Link>
        </Alert>
      ) : (
        <Card className="bg-forte-panel border-secondary shadow-sm">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover variant="dark" className="mb-0 align-middle">
                <thead>
                  <tr className="border-secondary text-muted">
                    <th>Folio</th>
                    <th>Fecha</th>
                    <th>Artículos</th>
                    <th>Medio de Pago</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th className="text-end">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {boletasUsuario.map((b) => (
                    <tr key={b.id} className="border-secondary">
                      <td className="fw-bold text-accent">N° {b.folio}</td>
                      <td>{b.fecha}</td>
                      <td>
                        <span title={b.items.map((i) => `${i.cantidad}x ${i.nombre}`).join(', ')}>
                          {b.items.reduce((acc, i) => acc + i.cantidad, 0)} unidades ({b.items.length} productos)
                        </span>
                      </td>
                      <td>{b.metodoPago}</td>
                      <td className="fw-bold">{formatearPrecio(b.total)}</td>
                      <td>
                        <Badge bg={b.estado === 'Emitida' ? 'success' : 'danger'}>
                          {b.estado}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <Button
                          variant="outline-accent"
                          size="sm"
                          onClick={() => verDetalleBoleta(b)}
                          title="Ver Boleta Electrónica"
                        >
                          <i className="bi bi-eye me-1"></i> Ver Boleta
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </section>
  )
}
