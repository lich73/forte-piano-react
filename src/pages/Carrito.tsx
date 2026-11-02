import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useUsuarios } from '../hooks/useUsuarios'
import { useTablasMaestras } from '../hooks/useTablasMaestras'
import {
  formatearPrecio,
  tieneOfertaActiva,
  obtenerPrecioEfectivo,
  obtenerPorcentajeDescuento
} from '../utils/formato'
import {
  limpiarRun,
  validarRun,
  obtenerMensajeErrorRun,
  validarCorreo,
  textoRequerido
} from '../utils/validaciones'
import { ModalidadEntrega, DatosCheckout } from '../types'

export default function Carrito() {
  const { itemsConDetalle, total, cambiarCantidad, eliminar, vaciar, finalizarCompra } = useCart()
  const { sesion, actualizarPerfil } = useAuth()
  const { obtenerUsuarioPorRun } = useUsuarios()
  const {
    regiones,
    obtenerComunasPorRegion,
    obtenerNombreRegion,
    obtenerNombreComuna
  } = useTablasMaestras()

  // 1. Estado de Datos del Perfil del Cliente (Comprador)
  const [editandoPerfil, setEditandoPerfil] = useState(false)
  const [clienteRun, setClienteRun] = useState('')
  const [clienteNombre, setClienteNombre] = useState('')
  const [clienteApellidos, setClienteApellidos] = useState('')
  const [clienteCorreo, setClienteCorreo] = useState('')
  const [perfilRegionId, setPerfilRegionId] = useState('')
  const [perfilComunaId, setPerfilComunaId] = useState('')
  const [perfilDireccion, setPerfilDireccion] = useState('')

  // 2. Estado de Datos Específicos de Despacho / Entrega (separados del perfil)
  const [modalidadEntrega, setModalidadEntrega] = useState<ModalidadEntrega>(
    sesion ? 'perfil' : 'otra_direccion'
  )
  const [envioDestinatario, setEnvioDestinatario] = useState('')
  const [envioTelefono, setEnvioTelefono] = useState('')
  const [envioRegionId, setEnvioRegionId] = useState('')
  const [envioComunaId, setEnvioComunaId] = useState('')
  const [envioDireccion, setEnvioDireccion] = useState('')
  const [envioReferencia, setEnvioReferencia] = useState('')
  const [metodoPago, setMetodoPago] = useState('Webpay Plus / Tarjeta de Débito')

  const [tocado, setTocado] = useState<Record<string, boolean>>({})

  // Cargar datos del perfil del usuario autenticado
  useEffect(() => {
    if (sesion) {
      const usuarioDb = obtenerUsuarioPorRun(sesion.run)
      setClienteRun(usuarioDb?.run || sesion.run)
      setClienteNombre(usuarioDb?.nombre || sesion.nombre)
      setClienteApellidos(usuarioDb?.apellidos || sesion.apellidos)
      setClienteCorreo(usuarioDb?.correo || sesion.correo)
      setPerfilRegionId(usuarioDb?.regionId ? String(usuarioDb.regionId) : '1')
      setPerfilComunaId(usuarioDb?.comunaId ? String(usuarioDb.comunaId) : '1')
      setPerfilDireccion(usuarioDb?.direccion || '')
      setEnvioDestinatario(
        `${usuarioDb?.nombre || sesion.nombre} ${usuarioDb?.apellidos || sesion.apellidos}`.trim()
      )
      setModalidadEntrega('perfil')
    } else {
      setModalidadEntrega('otra_direccion')
    }
  }, [sesion, obtenerUsuarioPorRun])

  const comunasPerfilDisponibles = perfilRegionId ? obtenerComunasPorRegion(perfilRegionId) : []
  const comunasEnvioDisponibles = envioRegionId ? obtenerComunasPorRegion(envioRegionId) : []

  // Validaciones de Datos del Cliente
  const runClienteValido = validarRun(clienteRun)
  const nombreClienteValido = textoRequerido(clienteNombre, 50)
  const apellidosClienteValido = textoRequerido(clienteApellidos, 100)
  const correoClienteValido = validarCorreo(clienteCorreo)
  const perfilRegionValida = Boolean(perfilRegionId)
  const perfilComunaValida = Boolean(perfilComunaId)
  const perfilDireccionValida = textoRequerido(perfilDireccion, 300)

  // Validaciones de Datos de Despacho según modalidad
  const destinatarioValido = textoRequerido(envioDestinatario, 100)
  const envioRegionValida = modalidadEntrega === 'otra_direccion' ? Boolean(envioRegionId) : true
  const envioComunaValida = modalidadEntrega === 'otra_direccion' ? Boolean(envioComunaId) : true
  const envioDireccionValida =
    modalidadEntrega === 'otra_direccion' ? textoRequerido(envioDireccion, 300) : true

  const handleGuardarCambiosPerfil = () => {
    setTocado((prev) => ({
      ...prev,
      clienteNombre: true,
      clienteApellidos: true,
      clienteCorreo: true,
      perfilRegionId: true,
      perfilComunaId: true,
      perfilDireccion: true
    }))

    if (
      !nombreClienteValido ||
      !apellidosClienteValido ||
      !correoClienteValido ||
      !perfilRegionValida ||
      !perfilComunaValida ||
      !perfilDireccionValida
    ) {
      Swal.fire(
        'Datos incompletos',
        'Por favor verifica tu nombre, apellidos, correo (@duoc.cl, @profesor.duoc.cl o @gmail.com) y dirección de perfil.',
        'warning'
      )
      return
    }

    const ok = actualizarPerfil({
      nombre: clienteNombre,
      apellidos: clienteApellidos,
      correo: clienteCorreo,
      regionId: Number(perfilRegionId),
      comunaId: Number(perfilComunaId),
      direccion: perfilDireccion
    })

    if (ok) {
      setEditandoPerfil(false)
      Swal.fire({
        title: 'Perfil actualizado',
        text: 'Tus datos personales se actualizaron en tu cuenta.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      })
    }
  }

  const handleProcederCompra = () => {
    setTocado({
      clienteRun: true,
      clienteNombre: true,
      clienteApellidos: true,
      clienteCorreo: true,
      perfilRegionId: true,
      perfilComunaId: true,
      perfilDireccion: true,
      envioDestinatario: true,
      envioRegionId: true,
      envioComunaId: true,
      envioDireccion: true
    })

    if (!runClienteValido || !nombreClienteValido || !apellidosClienteValido || !correoClienteValido) {
      Swal.fire(
        'Revisa los datos del comprador',
        'Asegúrate de ingresar un RUN con dígito verificador válido, nombre, apellidos y correo autorizado.',
        'error'
      )
      return
    }

    if (modalidadEntrega === 'perfil' && (!perfilRegionValida || !perfilComunaValida || !perfilDireccionValida)) {
      Swal.fire(
        'Dirección de perfil incompleta',
        'Completa la dirección de tu perfil o selecciona ingresar otra dirección de despacho.',
        'error'
      )
      return
    }

    if (
      modalidadEntrega === 'otra_direccion' &&
      (!destinatarioValido || !envioRegionValida || !envioComunaValida || !envioDireccionValida)
    ) {
      Swal.fire(
        'Revisa la dirección de despacho',
        'Debes indicar quién recibe, la región, comuna y dirección donde deseas recibir tu pedido.',
        'error'
      )
      return
    }

    // Construir objeto de despacho diferenciado de los datos del perfil
    let datosEnvioFinal: DatosCheckout['datosEnvio']

    if (modalidadEntrega === 'retiro_tienda') {
      datosEnvioFinal = {
        modalidad: 'retiro_tienda',
        destinatario: envioDestinatario.trim() || `${clienteNombre.trim()} ${clienteApellidos.trim()}`,
        telefono: envioTelefono.trim() || undefined,
        regionNombre: 'Región Metropolitana',
        comunaNombre: 'Providencia',
        direccion: 'Casa Matriz Forte & Piano - Av. Providencia 1234',
        referencia: envioReferencia.trim() || 'Retiro presencial en tienda con cédula de identidad'
      }
    } else if (modalidadEntrega === 'perfil') {
      datosEnvioFinal = {
        modalidad: 'perfil',
        destinatario: envioDestinatario.trim() || `${clienteNombre.trim()} ${clienteApellidos.trim()}`,
        telefono: envioTelefono.trim() || undefined,
        regionId: Number(perfilRegionId),
        regionNombre: obtenerNombreRegion(Number(perfilRegionId)),
        comunaId: Number(perfilComunaId),
        comunaNombre: obtenerNombreComuna(Number(perfilComunaId)),
        direccion: perfilDireccion.trim(),
        referencia: envioReferencia.trim() || undefined
      }
    } else {
      datosEnvioFinal = {
        modalidad: 'otra_direccion',
        destinatario: envioDestinatario.trim(),
        telefono: envioTelefono.trim() || undefined,
        regionId: Number(envioRegionId),
        regionNombre: obtenerNombreRegion(Number(envioRegionId)),
        comunaId: Number(envioComunaId),
        comunaNombre: obtenerNombreComuna(Number(envioComunaId)),
        direccion: envioDireccion.trim(),
        referencia: envioReferencia.trim() || undefined
      }
    }

    // Si el usuario autenticado dejó abierta la edición de su perfil, sincronizarla también
    if (sesion && editandoPerfil) {
      actualizarPerfil({
        nombre: clienteNombre,
        apellidos: clienteApellidos,
        correo: clienteCorreo,
        regionId: Number(perfilRegionId),
        comunaId: Number(perfilComunaId),
        direccion: perfilDireccion
      })
      setEditandoPerfil(false)
    }

    finalizarCompra({
      clienteRun: limpiarRun(clienteRun),
      clienteNombre: clienteNombre.trim(),
      clienteApellidos: clienteApellidos.trim(),
      clienteCorreo: clienteCorreo.trim(),
      metodoPago,
      datosEnvio: datosEnvioFinal
    })
  }

  const handleVaciar = () => {
    Swal.fire({
      title: '¿Vaciar carrito?',
      text: 'Se eliminarán todos los productos de tu carrito.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        vaciar()
        Swal.fire({
          title: 'Carrito vacío',
          text: 'Se han eliminado todos los productos.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
      }
    })
  }

  if (itemsConDetalle.length === 0) {
    return (
      <section className="container py-5">
        <h1 className="section-title">Carrito de compras y Checkout</h1>
        <div id="carritoVacio" className="text-center py-5">
          <i className="bi bi-cart-x display-1 text-muted"></i>
          <p className="text-muted mt-3">Tu carrito esta vacio.</p>
          <Link to="/productos" className="btn btn-accent">
            Ver catalogo
          </Link>
        </div>
      </section>
    )
  }

  const subtotalNeto = Math.round(total / 1.19)
  const iva = total - subtotalNeto

  return (
    <section className="container py-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="section-title mb-1">Carrito de compras y Checkout</h1>
          <p className="text-muted mb-0">
            Revisa tus instrumentos, confirma tus datos personales y elige dónde recibir tu pedido.
          </p>
        </div>
        <Link to="/productos" className="btn btn-outline-accent btn-sm">
          <i className="bi bi-arrow-left me-1"></i> Seguir comprando
        </Link>
      </div>

      <div className="row g-4">
        {/* Columna izquierda: Productos + Datos del Cliente + Dirección de Despacho */}
        <div className="col-lg-8">
          {/* 1. Listado de productos en el carrito */}
          <Card className="bg-forte-panel border-secondary mb-4">
            <Card.Header className="bg-transparent border-secondary d-flex justify-content-between align-items-center py-3">
              <h2 className="h5 mb-0 text-light">
                <i className="bi bi-bag-check text-accent me-2"></i>1. Instrumentos seleccionados
              </h2>
              <Badge bg="secondary">{itemsConDetalle.length} producto(s)</Badge>
            </Card.Header>
            <Card.Body id="carritoContenedor">
              {itemsConDetalle.map((item) => {
                const prod = item.producto
                const rutaImagen = prod?.imagen
                  ? prod.imagen.startsWith('/')
                    ? prod.imagen
                    : `/img/${prod.imagen}`
                  : '/img/logo.png'

                const urlDetalle = `/producto-detalle?codigo=${encodeURIComponent(item.codigo)}`

                return (
                  <div
                    key={item.codigo}
                    className="border-bottom border-secondary pb-3 mb-3 last-border-0"
                  >
                    <div className="row align-items-center g-3">
                      <div className="col-3 col-md-2">
                        <Link to={urlDetalle}>
                          <img
                            src={rutaImagen}
                            className="img-fluid rounded"
                            alt={prod?.nombre ?? item.codigo}
                            style={{ maxHeight: '70px', objectFit: 'contain' }}
                          />
                        </Link>
                      </div>

                      <div className="col-9 col-md-4">
                        <h3 className="h6 mb-1">
                          <Link to={urlDetalle} className="text-decoration-none text-light">
                            {prod?.nombre ?? item.codigo}
                          </Link>
                        </h3>
                        <p className="small text-muted mb-0">
                          {tieneOfertaActiva(prod) ? (
                            <>
                              <span className="text-accent fw-semibold me-1">
                                {formatearPrecio(obtenerPrecioEfectivo(prod))} c/u
                              </span>
                              <del className="me-1">{formatearPrecio(prod?.precio ?? 0)}</del>
                              <Badge bg="danger">-{obtenerPorcentajeDescuento(prod)}%</Badge>
                            </>
                          ) : (
                            <>{formatearPrecio(prod?.precio ?? 0)} c/u</>
                          )}
                        </p>
                      </div>

                      <div className="col-6 col-md-3 d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-accent cart-qty-btn"
                          onClick={() => cambiarCantidad(item.codigo, -1)}
                          title="Disminuir cantidad"
                        >
                          -
                        </button>
                        <span className="fw-bold px-2">{item.cantidad}</span>
                        <button
                          type="button"
                          className="btn btn-outline-accent cart-qty-btn"
                          onClick={() => cambiarCantidad(item.codigo, 1)}
                          title="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>

                      <div className="col-4 col-md-2">
                        <span className="fw-bold text-accent">{formatearPrecio(item.subtotal)}</span>
                      </div>

                      <div className="col-2 col-md-1 text-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => eliminar(item.codigo)}
                          title="Eliminar producto"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </Card.Body>
          </Card>

          {/* 2. Datos del Perfil del Cliente (Facturación / Comprador) */}
          <Card className="bg-forte-panel border-secondary mb-4" id="seccionPerfilCheckout">
            <Card.Header className="bg-transparent border-secondary d-flex justify-content-between align-items-center flex-wrap gap-2 py-3">
              <div>
                <h2 className="h5 mb-0 text-light">
                  <i className="bi bi-person-vcard text-accent me-2"></i>2. Datos del Perfil del Cliente (Comprador)
                </h2>
                <small className="text-muted">
                  Datos personales para la emisión de tu Boleta Electrónica (independientes de la dirección de envío).
                </small>
              </div>
              {sesion ? (
                <div className="d-flex align-items-center gap-2">
                  <Badge bg="success">Cuenta conectada</Badge>
                  <Button
                    variant={editandoPerfil ? 'outline-warning' : 'outline-accent'}
                    size="sm"
                    id="btnEditarPerfilCheckout"
                    onClick={() => setEditandoPerfil((prev) => !prev)}
                  >
                    <i className={`bi ${editandoPerfil ? 'bi-x-lg' : 'bi-pencil-square'} me-1`}></i>
                    {editandoPerfil ? 'Cancelar edición' : 'Editar mis datos personales'}
                  </Button>
                </div>
              ) : (
                <Badge bg="info" text="dark">
                  Comprando como invitado
                </Badge>
              )}
            </Card.Header>
            <Card.Body>
              {!sesion && (
                <Alert variant="secondary" className="bg-dark border-secondary text-light py-2 small mb-3">
                  <i className="bi bi-info-circle text-accent me-2"></i>
                  ¿Tienes cuenta en Forte & Piano?{' '}
                  <Link to="/login" className="text-accent fw-bold">
                    Inicia sesión aquí
                  </Link>{' '}
                  para cargar tus datos y dirección de perfil automáticamente.
                </Alert>
              )}

              <Row className="g-3">
                <Col md={4}>
                  <Form.Group controlId="checkoutClienteRun">
                    <Form.Label className="small text-muted mb-1">RUN del Comprador</Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={12}
                      placeholder="Ej: 12345678-5"
                      value={clienteRun}
                      readOnly={Boolean(sesion)}
                      onChange={(e) => setClienteRun(e.target.value)}
                      onBlur={() => setTocado((prev) => ({ ...prev, clienteRun: true }))}
                      isValid={tocado.clienteRun && runClienteValido}
                      isInvalid={tocado.clienteRun && !runClienteValido}
                    />
                    <Form.Control.Feedback type="invalid">
                      {obtenerMensajeErrorRun(clienteRun)}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="checkoutClienteNombre">
                    <Form.Label className="small text-muted mb-1">Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={50}
                      value={clienteNombre}
                      readOnly={Boolean(sesion) && !editandoPerfil}
                      onChange={(e) => setClienteNombre(e.target.value)}
                      onBlur={() => setTocado((prev) => ({ ...prev, clienteNombre: true }))}
                      isValid={tocado.clienteNombre && nombreClienteValido}
                      isInvalid={tocado.clienteNombre && !nombreClienteValido}
                    />
                    <Form.Control.Feedback type="invalid">
                      El nombre es obligatorio.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="checkoutClienteApellidos">
                    <Form.Label className="small text-muted mb-1">Apellidos</Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={100}
                      value={clienteApellidos}
                      readOnly={Boolean(sesion) && !editandoPerfil}
                      onChange={(e) => setClienteApellidos(e.target.value)}
                      onBlur={() => setTocado((prev) => ({ ...prev, clienteApellidos: true }))}
                      isValid={tocado.clienteApellidos && apellidosClienteValido}
                      isInvalid={tocado.clienteApellidos && !apellidosClienteValido}
                    />
                    <Form.Control.Feedback type="invalid">
                      Los apellidos son obligatorios.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="checkoutClienteCorreo">
                    <Form.Label className="small text-muted mb-1">Correo electrónico (Boleta)</Form.Label>
                    <Form.Control
                      type="email"
                      maxLength={100}
                      placeholder="cliente@gmail.com"
                      value={clienteCorreo}
                      readOnly={Boolean(sesion) && !editandoPerfil}
                      onChange={(e) => setClienteCorreo(e.target.value)}
                      onBlur={() => setTocado((prev) => ({ ...prev, clienteCorreo: true }))}
                      isValid={tocado.clienteCorreo && correoClienteValido}
                      isInvalid={tocado.clienteCorreo && !correoClienteValido}
                    />
                    <Form.Control.Feedback type="invalid">
                      Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {sesion && (
                  <Col md={6}>
                    <Form.Group controlId="checkoutPerfilDireccionResumen">
                      <Form.Label className="small text-muted mb-1">
                        Dirección registrada en tu perfil
                      </Form.Label>
                      <Form.Control
                        type="text"
                        maxLength={300}
                        value={perfilDireccion}
                        readOnly={!editandoPerfil}
                        onChange={(e) => setPerfilDireccion(e.target.value)}
                        isInvalid={tocado.perfilDireccion && !perfilDireccionValida}
                      />
                    </Form.Group>
                  </Col>
                )}

                {sesion && editandoPerfil && (
                  <>
                    <Col md={6}>
                      <Form.Group controlId="checkoutPerfilRegion">
                        <Form.Label className="small text-muted mb-1">Región de tu perfil</Form.Label>
                        <Form.Select
                          value={perfilRegionId}
                          onChange={(e) => {
                            setPerfilRegionId(e.target.value)
                            setPerfilComunaId('')
                          }}
                        >
                          <option value="">Selecciona región</option>
                          {regiones.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.nombre}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="checkoutPerfilComuna">
                        <Form.Label className="small text-muted mb-1">Comuna de tu perfil</Form.Label>
                        <Form.Select
                          value={perfilComunaId}
                          disabled={!perfilRegionId}
                          onChange={(e) => setPerfilComunaId(e.target.value)}
                        >
                          <option value="">Selecciona comuna</option>
                          {comunasPerfilDisponibles.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nombre}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={12} className="text-end">
                      <Button
                        variant="accent"
                        size="sm"
                        id="btnGuardarPerfilCheckout"
                        onClick={handleGuardarCambiosPerfil}
                      >
                        <i className="bi bi-check2-circle me-1"></i> Guardar cambios en mi perfil
                      </Button>
                    </Col>
                  </>
                )}
              </Row>
            </Card.Body>
          </Card>

          {/* 3. Selección de Dirección y Modalidad de Despacho (Datos específicos de envío) */}
          <Card className="bg-forte-panel border-secondary" id="seccionDespachoCheckout">
            <Card.Header className="bg-transparent border-secondary py-3">
              <h2 className="h5 mb-0 text-light">
                <i className="bi bi-truck text-accent me-2"></i>3. Dirección y Modalidad de Despacho
              </h2>
              <small className="text-muted">
                Selecciona dónde deseas recibir tu pedido. Puedes usar la dirección de tu perfil, enviar a otra dirección distinta o retirar en tienda.
              </small>
            </Card.Header>
            <Card.Body>
              {/* Selector de modalidad */}
              <Row className="g-3 mb-4">
                {sesion && (
                  <Col md={4}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setModalidadEntrega('perfil')}
                      onKeyDown={(e) => e.key === 'Enter' && setModalidadEntrega('perfil')}
                      className={`p-3 rounded border h-100 ${
                        modalidadEntrega === 'perfil'
                          ? 'border-warning bg-dark'
                          : 'border-secondary'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <strong className="text-light">
                          <i className="bi bi-house-check text-accent me-2"></i>Mi dirección de perfil
                        </strong>
                        <Form.Check
                          type="radio"
                          name="modalidadEntrega"
                          checked={modalidadEntrega === 'perfil'}
                          onChange={() => setModalidadEntrega('perfil')}
                          aria-label="Usar mi dirección de perfil"
                        />
                      </div>
                      <small className="text-muted d-block">
                        Despachar a la dirección guardada en tu cuenta de cliente.
                      </small>
                    </div>
                  </Col>
                )}

                <Col md={sesion ? 4 : 6}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setModalidadEntrega('otra_direccion')}
                    onKeyDown={(e) => e.key === 'Enter' && setModalidadEntrega('otra_direccion')}
                    className={`p-3 rounded border h-100 ${
                      modalidadEntrega === 'otra_direccion'
                        ? 'border-warning bg-dark'
                        : 'border-secondary'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <strong className="text-light">
                        <i className="bi bi-geo-alt text-accent me-2"></i>Otra dirección de envío
                      </strong>
                      <Form.Check
                        type="radio"
                        name="modalidadEntrega"
                        checked={modalidadEntrega === 'otra_direccion'}
                        onChange={() => setModalidadEntrega('otra_direccion')}
                        aria-label="Ingresar otra dirección de envío"
                      />
                    </div>
                    <small className="text-muted d-block">
                      Indica una dirección específica para este pedido (casa, estudio, regalo, etc.).
                    </small>
                  </div>
                </Col>

                <Col md={sesion ? 4 : 6}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setModalidadEntrega('retiro_tienda')}
                    onKeyDown={(e) => e.key === 'Enter' && setModalidadEntrega('retiro_tienda')}
                    className={`p-3 rounded border h-100 ${
                      modalidadEntrega === 'retiro_tienda'
                        ? 'border-warning bg-dark'
                        : 'border-secondary'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <strong className="text-light">
                        <i className="bi bi-shop text-accent me-2"></i>Retiro en tienda
                      </strong>
                      <Form.Check
                        type="radio"
                        name="modalidadEntrega"
                        checked={modalidadEntrega === 'retiro_tienda'}
                        onChange={() => setModalidadEntrega('retiro_tienda')}
                        aria-label="Retiro en tienda"
                      />
                    </div>
                    <small className="text-muted d-block">
                      Retira sin costo en Casa Matriz (Av. Providencia 1234, Santiago).
                    </small>
                  </div>
                </Col>
              </Row>

              {/* Contenido según la modalidad de entrega elegida */}
              {modalidadEntrega === 'perfil' && sesion && (
                <div className="p-3 rounded bg-dark border border-secondary mb-3">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                      <span className="badge bg-secondary mb-2">Dirección de tu perfil seleccionada</span>
                      <p className="mb-1 fw-bold text-light">
                        <i className="bi bi-pin-map-fill text-accent me-2"></i>
                        {perfilDireccion || 'Sin dirección registrada'}
                      </p>
                      <p className="mb-0 small text-muted">
                        {obtenerNombreComuna(Number(perfilComunaId))},{' '}
                        {obtenerNombreRegion(Number(perfilRegionId))}
                      </p>
                    </div>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => setModalidadEntrega('otra_direccion')}
                    >
                      Enviar a otra dirección
                    </Button>
                  </div>
                </div>
              )}

              {modalidadEntrega === 'retiro_tienda' && (
                <div className="p-3 rounded bg-dark border border-secondary mb-3">
                  <span className="badge bg-success mb-2">Retiro Presencial Sin Costo</span>
                  <p className="mb-1 fw-bold text-light">
                    <i className="bi bi-building text-accent me-2"></i>
                    Sala de Ventas Forte & Piano — Av. Providencia 1234, Providencia, Región Metropolitana
                  </p>
                  <p className="mb-0 small text-muted">
                    Horario de retiro: Lunes a Sábado de 10:00 a 19:30 hrs. Presentar boleta electrónica y cédula de identidad.
                  </p>
                </div>
              )}

              {modalidadEntrega === 'otra_direccion' && (
                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <Form.Group controlId="envioRegion">
                      <Form.Label className="small text-muted mb-1">Región de despacho</Form.Label>
                      <Form.Select
                        value={envioRegionId}
                        onChange={(e) => {
                          setEnvioRegionId(e.target.value)
                          setEnvioComunaId('')
                        }}
                        onBlur={() => setTocado((prev) => ({ ...prev, envioRegionId: true }))}
                        isValid={tocado.envioRegionId && envioRegionValida}
                        isInvalid={tocado.envioRegionId && !envioRegionValida}
                      >
                        <option value="">Selecciona región de envío</option>
                        {regiones.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.nombre}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Selecciona la región donde recibirás el pedido.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="envioComuna">
                      <Form.Label className="small text-muted mb-1">Comuna de despacho</Form.Label>
                      <Form.Select
                        value={envioComunaId}
                        disabled={!envioRegionId}
                        onChange={(e) => setEnvioComunaId(e.target.value)}
                        onBlur={() => setTocado((prev) => ({ ...prev, envioComunaId: true }))}
                        isValid={tocado.envioComunaId && envioComunaValida}
                        isInvalid={tocado.envioComunaId && !envioComunaValida}
                      >
                        <option value="">
                          {envioRegionId ? 'Selecciona comuna de envío' : 'Elige una región primero'}
                        </option>
                        {comunasEnvioDisponibles.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombre}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Selecciona la comuna de despacho.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group controlId="envioDireccion">
                      <Form.Label className="small text-muted mb-1">
                        Dirección exacta de despacho (Calle, número, depto/casa)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        maxLength={300}
                        placeholder="Ej: Av. Las Condes 4560, Depto 802"
                        value={envioDireccion}
                        onChange={(e) => setEnvioDireccion(e.target.value)}
                        onBlur={() => setTocado((prev) => ({ ...prev, envioDireccion: true }))}
                        isValid={tocado.envioDireccion && envioDireccionValida}
                        isInvalid={tocado.envioDireccion && !envioDireccionValida}
                      />
                      <Form.Control.Feedback type="invalid">
                        Ingresa la dirección donde deseas recibir tu pedido.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {/* Datos de quién recibe e instrucciones adicionales */}
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="envioDestinatario">
                    <Form.Label className="small text-muted mb-1">
                      Nombre de quien recibe / retira el pedido
                    </Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={100}
                      placeholder="Nombre completo del receptor"
                      value={envioDestinatario}
                      onChange={(e) => setEnvioDestinatario(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="envioTelefono">
                    <Form.Label className="small text-muted mb-1">
                      Teléfono de contacto para el despacho (opcional)
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      maxLength={20}
                      placeholder="+56 9 1234 5678"
                      value={envioTelefono}
                      onChange={(e) => setEnvioTelefono(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group controlId="envioReferencia">
                    <Form.Label className="small text-muted mb-1">
                      Indicaciones adicionales de entrega (opcional)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={200}
                      placeholder="Ej: Dejar en conserjería, llamar antes de llegar, timbre 2B..."
                      value={envioReferencia}
                      onChange={(e) => setEnvioReferencia(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>

        {/* Columna derecha: Resumen del pedido y Pago */}
        <div className="col-lg-4">
          <div id="carritoResumen" className="bg-forte-panel rounded p-4 border border-secondary sticky-top" style={{ top: '90px' }}>
            <h3 className="h5 mb-3">Resumen de Compra</h3>

            <div className="d-flex justify-content-between small text-muted mb-2">
              <span>Subtotal Neto</span>
              <span>{formatearPrecio(subtotalNeto)}</span>
            </div>
            <div className="d-flex justify-content-between small text-muted mb-2">
              <span>I.V.A. (19%)</span>
              <span>{formatearPrecio(iva)}</span>
            </div>
            <div className="d-flex justify-content-between small text-muted mb-3 pb-2 border-bottom border-secondary">
              <span>Despacho</span>
              <span className="text-success fw-semibold">Gratis</span>
            </div>

            <div className="mb-3">
              <Form.Group controlId="metodoPagoCheckout">
                <Form.Label className="small text-muted mb-1">Medio de pago</Form.Label>
                <Form.Select
                  size="sm"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                >
                  <option value="Webpay Plus / Tarjeta de Débito">Webpay Plus / Tarjeta de Débito</option>
                  <option value="Webpay Plus / Tarjeta de Crédito">Webpay Plus / Tarjeta de Crédito</option>
                  <option value="Transferencia Bancaria Electrónica">Transferencia Bancaria Electrónica</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold">Total a Pagar</span>
              <span className="fw-bold text-accent fs-4" id="carritoTotal">
                {formatearPrecio(total)}
              </span>
            </div>

            <button
              type="button"
              id="btnFinalizarCompra"
              className="btn btn-accent w-100 mb-2 py-2 fw-semibold"
              onClick={handleProcederCompra}
            >
              <i className="bi bi-credit-card me-2"></i>Finalizar compra
            </button>
            <button
              type="button"
              className="btn btn-outline-danger w-100 btn-sm"
              onClick={handleVaciar}
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
