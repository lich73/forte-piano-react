import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Table, Badge, Button, Alert } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'
import { useBoletas } from '../hooks/useBoletas'
import { generarHtmlBoleta, mostrarModalBoletaEmitida } from '../context/CartContext'
import { PasarelaPagoModal } from '../components/common/PasarelaPagoModal'
import { formatearPrecio } from '../utils/formato'
import { Boleta, DatosCheckout, ResultadoPasarela } from '../types'
import { imprimirBoletaHtml } from '../utils/impresion'

export default function MisBoletas() {
  const { sesion } = useAuth()
  const { boletas, cargando, error, reintentarPagoBoleta, recargar } = useBoletas({
    soloMias: true,
    clienteRun: sesion?.run,
    correo: sesion?.correo,
    // Sin sesión no hay RUN/correo con los que filtrar: no se llama a la API.
    activo: Boolean(sesion)
  })
  const [boletaParaReintento, setBoletaParaReintento] = useState<Boleta | null>(null)

  // El backend filtra /boletas/mis-boletas por los query params clienteRun/correo.
  const boletasUsuario = boletas

  const verDetalleBoleta = (boleta: Boleta) => {
    const boletaHtml = generarHtmlBoleta(boleta)

    Swal.fire({
      title: `Boleta / Pedido N° ${boleta.folio}`,
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

  const handleResultadoReintento = async (resultado: ResultadoPasarela) => {
    if (!boletaParaReintento) {
      return { exito: false, mensaje: 'No hay pedido seleccionado.' }
    }
    const res = await reintentarPagoBoleta(boletaParaReintento.id, resultado)
    if (res.exito && res.boleta) {
      setBoletaParaReintento(null)
      setTimeout(() => {
        mostrarModalBoletaEmitida(res.boleta!)
      }, 150)
    }
    return res
  }

  const checkoutDesdeBoleta: DatosCheckout | null = boletaParaReintento
    ? {
        clienteRun: boletaParaReintento.clienteRun || '123456785',
        clienteNombre: boletaParaReintento.clienteNombre,
        clienteApellidos: '',
        clienteCorreo: boletaParaReintento.clienteCorreo,
        metodoPago: boletaParaReintento.metodoPago,
        boletaExistenteId: boletaParaReintento.id,
        datosEnvio: boletaParaReintento.datosEnvio || {
          modalidad: 'retiro_tienda',
          destinatario: boletaParaReintento.clienteNombre,
          regionNombre: 'Región Metropolitana',
          comunaNombre: 'Providencia',
          direccion: 'Av. Providencia 1234'
        }
      }
    : null

  return (
    <section className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="section-title mb-1">Mis Boletas y Compras</h1>
          <p className="text-muted">
            Consulta el estado de tus pedidos, descarga tus boletas o reintenta pagos pendientes.
          </p>
        </div>
        <Link to="/productos" className="btn btn-outline-accent">
          <i className="bi bi-arrow-left me-1"></i> Ir a la tienda
        </Link>
      </div>

      {!sesion && (
        <Card className="bg-forte-panel border-secondary mb-4 p-3">
          <Card.Body>
            <Card.Title className="h5 text-accent mb-2">Consulta de compras</Card.Title>
            <p className="small text-muted mb-2">
              Inicia sesión para consultar tus boletas directamente desde el servidor.
            </p>
            <Link to="/login" className="btn btn-accent btn-sm">
              <i className="bi bi-box-arrow-in-right me-1"></i> Iniciar sesión
            </Link>
          </Card.Body>
        </Card>
      )}

      {cargando && (
        <Alert variant="info" className="bg-forte-panel border-secondary">
          Cargando tus boletas desde el servidor...
        </Alert>
      )}

      {!cargando && error && (
        <Alert variant="warning" className="bg-forte-panel border-secondary">
          {error}{' '}
          <Button variant="link" size="sm" onClick={() => void recargar()}>
            Reintentar
          </Button>
        </Alert>
      )}

      {!cargando && !error && boletasUsuario.length === 0 ? (
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
                    <th>Despacho / Destino</th>
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
                      <td>
                        {b.datosEnvio ? (
                          <small className="d-block text-light">
                            {b.datosEnvio.direccion}, {b.datosEnvio.comunaNombre}
                          </small>
                        ) : (
                          <small className="text-muted">Estándar</small>
                        )}
                      </td>
                      <td>{b.metodoPago}</td>
                      <td className="fw-bold">{formatearPrecio(b.total)}</td>
                      <td>
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
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          {(b.estado === 'Pendiente' || b.estado === 'Rechazada') && (
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => setBoletaParaReintento(b)}
                              title="Reintentar pago en pasarela"
                            >
                              <i className="bi bi-arrow-repeat me-1"></i> Reintentar Pago
                            </Button>
                          )}
                          <Button
                            variant="outline-accent"
                            size="sm"
                            onClick={() => verDetalleBoleta(b)}
                            title="Ver Boleta Electrónica"
                          >
                            <i className="bi bi-eye me-1"></i> Ver Detalle
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      <PasarelaPagoModal
        show={Boolean(boletaParaReintento)}
        onHide={() => setBoletaParaReintento(null)}
        total={boletaParaReintento?.total ?? 0}
        datosCheckout={checkoutDesdeBoleta}
        onProcesarResultado={handleResultadoReintento}
      />
    </section>
  )
}
