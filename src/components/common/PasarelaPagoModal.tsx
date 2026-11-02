import { useState, useEffect } from 'react'
import { Modal, Button, Form, Badge, Alert, Row, Col, Spinner } from 'react-bootstrap'
import { DatosCheckout, ResultadoPasarela, Boleta } from '../../types'
import { formatearPrecio } from '../../utils/formato'

interface PasarelaPagoModalProps {
  show: boolean
  onHide: () => void
  total: number
  datosCheckout: DatosCheckout | null
  onProcesarResultado: (
    resultado: ResultadoPasarela,
     pedidoActualId?: string
  ) => { exito: boolean; boleta?: Boleta; mensaje: string }
}

export function PasarelaPagoModal({
  show,
  onHide,
  total,
  datosCheckout,
  onProcesarResultado
}: PasarelaPagoModalProps) {
  const [escenarioSeleccionado, setEscenarioSeleccionado] =
    useState<ResultadoPasarela>('exitoso')
  const [procesando, setProcesando] = useState(false)
  const [resultadoActual, setResultadoActual] = useState<{
    tipo: ResultadoPasarela
    mensaje: string
    boleta?: Boleta
  } | null>(null)
  const [pedidoTemporalId, setPedidoTemporalId] = useState<string | undefined>(undefined)

  // Datos simulados de tarjeta para realismo visual
  const [numeroTarjeta, setNumeroTarjeta] = useState('4532 •••• •••• 8891')
  const [cuotas, setCuotas] = useState('Sin cuotas (Débito / Contado)')

  useEffect(() => {
    if (show) {
      setEscenarioSeleccionado('exitoso')
      setProcesando(false)
      setResultadoActual(null)
      setPedidoTemporalId(datosCheckout?.boletaExistenteId)
    }
  }, [show, datosCheckout])

  const ejecutarSimulacion = (escenario: ResultadoPasarela) => {
    setEscenarioSeleccionado(escenario)
    setProcesando(true)
    setResultadoActual(null)

    setTimeout(() => {
      const respuesta = onProcesarResultado(escenario, pedidoTemporalId)
      if (respuesta.boleta) {
        setPedidoTemporalId(respuesta.boleta.id)
      }
      setProcesando(false)
      setResultadoActual({
        tipo: escenario,
        mensaje: respuesta.mensaje,
        boleta: respuesta.boleta
      })
    }, 550)
  }

  return (
    <Modal
      show={show}
      onHide={procesando ? undefined : onHide}
      centered
      size="lg"
      backdrop="static"
      contentClassName="bg-forte-panel text-light border-secondary"
    >
      <Modal.Header closeButton={!procesando} className="border-secondary">
        <Modal.Title className="h5 d-flex align-items-center gap-2">
          <i className="bi bi-shield-lock-fill text-accent fs-4"></i>
          <div>
            <span>Pasarela de Pago Simulada — FortePay / Webpay Plus</span>
            <small className="d-block text-muted fw-normal" style={{ fontSize: '0.78rem' }}>
              Entorno de evaluación académica con control manual de transacción
            </small>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* Resumen superior de la orden */}
        <div className="p-3 rounded bg-dark border border-secondary mb-4">
          <Row className="align-items-center g-2">
            <Col md={7}>
              <div className="small text-muted">Comercio: Forte & Piano SpA (RUT: 76.543.210-3)</div>
              <div className="fw-semibold text-light">
                Cliente: {datosCheckout?.clienteNombre} {datosCheckout?.clienteApellidos} (
                {datosCheckout?.clienteRun})
              </div>
              <div className="small text-muted">
                Medio: {datosCheckout?.metodoPago || 'Webpay Plus / Tarjeta de Débito'}
              </div>
              {datosCheckout?.datosEnvio && (
                <div className="small text-info mt-1">
                  <i className="bi bi-geo-alt-fill me-1"></i>
                  Despacho: {datosCheckout.datosEnvio.direccion},{' '}
                  {datosCheckout.datosEnvio.comunaNombre}
                </div>
              )}
            </Col>
            <Col md={5} className="text-md-end">
              <div className="small text-muted">Monto total de la transacción</div>
              <div className="fs-3 fw-bold text-accent">{formatearPrecio(total)}</div>
              {resultadoActual?.boleta && (
                <Badge
                  bg={
                    resultadoActual.boleta.estado === 'Emitida'
                      ? 'success'
                      : resultadoActual.boleta.estado === 'Pendiente'
                      ? 'warning'
                      : 'danger'
                  }
                  text={resultadoActual.boleta.estado === 'Pendiente' ? 'dark' : 'light'}
                >
                  Pedido N° {resultadoActual.boleta.folio} — Estado: {resultadoActual.boleta.estado}
                </Badge>
              )}
            </Col>
          </Row>
        </div>

        {/* Datos simulados de medio de pago */}
        <Row className="g-3 mb-4">
          <Col md={6}>
            <Form.Group controlId="pasarelaTarjeta">
              <Form.Label className="small text-muted mb-1">
                Tarjeta / Instrumento de pago simulado
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                value={numeroTarjeta}
                onChange={(e) => setNumeroTarjeta(e.target.value)}
                disabled={procesando}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="pasarelaCuotas">
              <Form.Label className="small text-muted mb-1">Modalidad de cobro</Form.Label>
              <Form.Select
                size="sm"
                value={cuotas}
                onChange={(e) => setCuotas(e.target.value)}
                disabled={procesando}
              >
                <option value="Sin cuotas (Débito / Contado)">Sin cuotas (Débito / Contado)</option>
                <option value="3 cuotas sin interés">3 cuotas sin interés</option>
                <option value="6 cuotas sin interés">6 cuotas sin interés</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Selector manual del resultado de la transacción (Requerimiento académico) */}
        <div className="p-3 rounded border border-warning mb-4" style={{ background: 'rgba(197, 160, 89, 0.08)' }}>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
            <h6 className="mb-0 text-accent fw-bold">
              <i className="bi bi-sliders me-2"></i>
              Simulador de Transacción (Selección manual para Estudiante / Profesor)
            </h6>
            <Badge bg="warning" text="dark">
              Control de Escenarios
            </Badge>
          </div>
          <p className="small text-muted mb-3">
            Selecciona manualmente el escenario que deseas simular para comprobar el comportamiento del sistema y la actualización del estado del pedido:
          </p>

          <Row className="g-3">
            {/* Escenario 1: Pago exitoso */}
            <Col md={4}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => !procesando && setEscenarioSeleccionado('exitoso')}
                onKeyDown={(e) => e.key === 'Enter' && !procesando && setEscenarioSeleccionado('exitoso')}
                className={`p-3 rounded border h-100 ${
                  escenarioSeleccionado === 'exitoso'
                    ? 'border-success bg-dark shadow-sm'
                    : 'border-secondary'
                }`}
                style={{ cursor: procesando ? 'not-allowed' : 'pointer' }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold text-success">
                    <i className="bi bi-check-circle-fill me-1"></i> 1. Pago exitoso
                  </span>
                  <Form.Check
                    type="radio"
                    name="escenarioPago"
                    id="radioPagoExitoso"
                    checked={escenarioSeleccionado === 'exitoso'}
                    onChange={() => setEscenarioSeleccionado('exitoso')}
                    disabled={procesando}
                  />
                </div>
                <small className="text-muted d-block">
                  Confirma el cobro, descuenta stock, emite la boleta y cambia estado a <strong>Emitida</strong>.
                </small>
              </div>
            </Col>

            {/* Escenario 2: Pago rechazado */}
            <Col md={4}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => !procesando && setEscenarioSeleccionado('rechazado')}
                onKeyDown={(e) => e.key === 'Enter' && !procesando && setEscenarioSeleccionado('rechazado')}
                className={`p-3 rounded border h-100 ${
                  escenarioSeleccionado === 'rechazado'
                    ? 'border-danger bg-dark shadow-sm'
                    : 'border-secondary'
                }`}
                style={{ cursor: procesando ? 'not-allowed' : 'pointer' }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold text-danger">
                    <i className="bi bi-x-octagon-fill me-1"></i> 2. Pago rechazado
                  </span>
                  <Form.Check
                    type="radio"
                    name="escenarioPago"
                    id="radioPagoRechazado"
                    checked={escenarioSeleccionado === 'rechazado'}
                    onChange={() => setEscenarioSeleccionado('rechazado')}
                    disabled={procesando}
                  />
                </div>
                <small className="text-muted d-block">
                  Informa rechazo bancario, no descuenta stock y registra el pedido como <strong>Rechazada</strong>.
                </small>
              </div>
            </Col>

            {/* Escenario 3: Intentar más tarde */}
            <Col md={4}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => !procesando && setEscenarioSeleccionado('intentar_mas_tarde')}
                onKeyDown={(e) =>
                  e.key === 'Enter' && !procesando && setEscenarioSeleccionado('intentar_mas_tarde')
                }
                className={`p-3 rounded border h-100 ${
                  escenarioSeleccionado === 'intentar_mas_tarde'
                    ? 'border-warning bg-dark shadow-sm'
                    : 'border-secondary'
                }`}
                style={{ cursor: procesando ? 'not-allowed' : 'pointer' }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold text-warning">
                    <i className="bi bi-clock-history me-1"></i> 3. Intentar más tarde
                  </span>
                  <Form.Check
                    type="radio"
                    name="escenarioPago"
                    id="radioIntentarMasTarde"
                    checked={escenarioSeleccionado === 'intentar_mas_tarde'}
                    onChange={() => setEscenarioSeleccionado('intentar_mas_tarde')}
                    disabled={procesando}
                  />
                </div>
                <small className="text-muted d-block">
                  Simula falla temporal de conexión, deja el pedido en estado <strong>Pendiente</strong> y permite reintentar.
                </small>
              </div>
            </Col>
          </Row>
        </div>

        {/* Estado de procesamiento */}
        {procesando && (
          <div className="text-center py-4">
            <Spinner animation="border" variant="warning" className="mb-2" />
            <p className="mb-0 text-light fw-semibold">
              Comunicando con el centro autorizador bancario...
            </p>
            <small className="text-muted">Por favor no cierres esta ventana.</small>
          </div>
        )}

        {/* Resultado de la simulación dentro de la pasarela */}
        {!procesando && resultadoActual && (
          <div id="resultadoPasarelaBox">
            {resultadoActual.tipo === 'rechazado' && (
              <Alert variant="danger" className="bg-dark border-danger text-light mb-0">
                <div className="d-flex align-items-start gap-3">
                  <i className="bi bi-x-circle-fill text-danger fs-2"></i>
                  <div className="flex-grow-1">
                    <h5 className="text-danger mb-1">Pago Rechazado — Transacción no completada</h5>
                    <p className="small mb-2">{resultadoActual.mensaje}</p>
                    {resultadoActual.boleta && (
                      <div className="small text-muted mb-2">
                        Orden N° <strong>{resultadoActual.boleta.folio}</strong> actualizada a estado:{' '}
                        <Badge bg="danger">{resultadoActual.boleta.estado}</Badge>
                      </div>
                    )}
                    <div className="d-flex gap-2 flex-wrap mt-2">
                      <Button
                        size="sm"
                        variant="outline-success"
                        onClick={() => ejecutarSimulacion('exitoso')}
                      >
                        <i className="bi bi-arrow-repeat me-1"></i> Reintentar como Pago Exitoso
                      </Button>
                      <Button size="sm" variant="outline-light" onClick={onHide}>
                        Volver al Checkout
                      </Button>
                    </div>
                  </div>
                </div>
              </Alert>
            )}

            {resultadoActual.tipo === 'intentar_mas_tarde' && (
              <Alert variant="warning" className="bg-dark border-warning text-light mb-0">
                <div className="d-flex align-items-start gap-3">
                  <i className="bi bi-exclamation-triangle-fill text-warning fs-2"></i>
                  <div className="flex-grow-1">
                    <h5 className="text-warning mb-1">
                      Problema Temporal — Por favor intenta más tarde
                    </h5>
                    <p className="small mb-2">{resultadoActual.mensaje}</p>
                    {resultadoActual.boleta && (
                      <div className="small text-muted mb-2">
                        Orden N° <strong>{resultadoActual.boleta.folio}</strong> registrada en estado:{' '}
                        <Badge bg="warning" text="dark">
                          {resultadoActual.boleta.estado}
                        </Badge>
                      </div>
                    )}
                    <div className="d-flex gap-2 flex-wrap mt-2">
                      <Button
                        size="sm"
                        variant="warning"
                        id="btnReintentarPagoPasarela"
                        onClick={() => ejecutarSimulacion('exitoso')}
                      >
                        <i className="bi bi-arrow-clockwise me-1"></i> Reintentar pago ahora (Exitoso)
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-warning"
                        onClick={() => ejecutarSimulacion('intentar_mas_tarde')}
                      >
                        Simular nuevo reintento fallido
                      </Button>
                      <Button size="sm" variant="outline-light" onClick={onHide}>
                        Intentar más tarde
                      </Button>
                    </div>
                  </div>
                </div>
              </Alert>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-secondary d-flex justify-content-between">
        <Button variant="outline-secondary" onClick={onHide} disabled={procesando}>
          Cancelar y volver
        </Button>
        <Button
          variant="accent"
          id="btnConfirmarSimulacionPago"
          onClick={() => ejecutarSimulacion(escenarioSeleccionado)}
          disabled={procesando}
        >
          <i className="bi bi-credit-card-2-front me-2"></i>
          Procesar Pago ({
            escenarioSeleccionado === 'exitoso'
              ? 'Simular Pago Exitoso'
              : escenarioSeleccionado === 'rechazado'
              ? 'Simular Pago Rechazado'
              : 'Simular Intentar Más Tarde'
          })
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PasarelaPagoModal
