import { useState, useEffect, FormEvent } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Form, Row, Col, Button, Card } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useProductos } from '../../hooks/useProductos'
import { useAuth } from '../../context/AuthContext'
import { useTablasMaestras } from '../../hooks/useTablasMaestras'
import { Producto } from '../../types'
import {
  textoRequerido,
  numeroEnRango,
  enteroEnRango
} from '../../utils/validaciones'
import { alertaExito, alertaError } from '../../utils/alertas'
import { generarCodigoPorCategoria } from '../../utils/codigos'
import { formatearPrecio } from '../../utils/formato'

export default function AdminProductoForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const codigoParam = searchParams.get('codigo')

  const { productos, obtenerProducto, guardarProducto } = useProductos()
  const { sesion } = useAuth()
  const { categorias } = useTablasMaestras()

  const esEdicion = Boolean(codigoParam)

  // Rol vendedor (rolId === 2) no tiene permisos de edición o creación
  useEffect(() => {
    if (sesion && sesion.rolId === 2) {
      Swal.fire({
        title: 'Acceso restringido',
        text: 'Tu rol no permite crear o editar instrumentos musicales.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        navigate('/admin/productos', { replace: true })
      })
    }
  }, [sesion, navigate])

  const [codigo, setCodigo] = useState('')
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [stockCritico, setStockCritico] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [imagen, setImagen] = useState('')
  const [estado, setEstado] = useState<'Activo' | 'Inactivo'>('Activo')

  // Campos de oferta
  const [enOferta, setEnOferta] = useState(false)
  const [porcentajeDescuento, setPorcentajeDescuento] = useState('')
  const [precioOferta, setPrecioOferta] = useState('')

  const [tocado, setTocado] = useState({
    codigo: false,
    nombre: false,
    descripcion: false,
    precio: false,
    stock: false,
    stockCritico: false,
    categoriaId: false,
    oferta: false
  })

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (codigoParam) {
      const prod = obtenerProducto(codigoParam)
      if (prod) {
        setCodigo(prod.codigo)
        setNombre(prod.nombre)
        setDescripcion(prod.descripcion || '')
        setPrecio(String(prod.precio))
        setStock(String(prod.stock))
        setStockCritico(prod.stockCritico != null ? String(prod.stockCritico) : '')
        setCategoriaId(String(prod.categoriaId))
        setImagen(prod.imagen || '')
        setEstado(prod.estado)
        setEnOferta(Boolean(prod.enOferta))
        setPorcentajeDescuento(
          prod.porcentajeDescuento && prod.porcentajeDescuento > 0
            ? String(prod.porcentajeDescuento)
            : ''
        )
        setPrecioOferta(
          prod.precioOferta != null && prod.precioOferta > 0
            ? String(prod.precioOferta)
            : ''
        )
      } else {
        alertaError('Error', 'El instrumento musical no fue encontrado.').then(() => {
          navigate('/admin/productos')
        })
      }
    }
  }, [codigoParam, obtenerProducto, navigate])

  const handlePorcentajeChange = (nuevoPorcentaje: string) => {
    setPorcentajeDescuento(nuevoPorcentaje)
    const pNormal = Number(precio)
    const porc = Number(nuevoPorcentaje)
    if (!isNaN(pNormal) && pNormal > 0 && !isNaN(porc) && porc > 0 && porc < 100) {
      setPrecioOferta(String(Math.round(pNormal * (1 - porc / 100))))
    }
  }

  const handlePrecioOfertaChange = (nuevoPrecioOferta: string) => {
    setPrecioOferta(nuevoPrecioOferta)
    const pNormal = Number(precio)
    const pOferta = Number(nuevoPrecioOferta)
    if (!isNaN(pNormal) && pNormal > 0 && !isNaN(pOferta) && pOferta > 0 && pOferta < pNormal) {
      setPorcentajeDescuento(String(Math.round(((pNormal - pOferta) / pNormal) * 100)))
    }
  }

  // Validaciones
  const codigoValido =
    textoRequerido(codigo, null) &&
    codigo.trim().length >= 3 &&
    !productos.some(
      (p) => p.codigo === codigo.trim() && p.codigo !== codigoParam
    )

  const nombreValido = textoRequerido(nombre, 100)
  const descripcionValida = !descripcion || descripcion.trim().length <= 500
  const precioValido = numeroEnRango(precio, 0)
  const stockValido = enteroEnRango(stock, 0)
  const stockCriticoValido = !stockCritico || enteroEnRango(stockCritico, 0)
  const categoriaValida = Boolean(categoriaId && categoriaId !== '')

  const precioNum = Number(precio)
  const precioOfertaNum = Number(precioOferta)
  const porcentajeNum = Number(porcentajeDescuento)

  const ofertaValida =
    !enOferta ||
    (precioValido &&
      precioNum > 0 &&
      !isNaN(precioOfertaNum) &&
      precioOfertaNum > 0 &&
      precioOfertaNum < precioNum &&
      !isNaN(porcentajeNum) &&
      porcentajeNum >= 1 &&
      porcentajeNum <= 99)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    setTocado({
      codigo: true,
      nombre: true,
      descripcion: true,
      precio: true,
      stock: true,
      stockCritico: true,
      categoriaId: true,
      oferta: true
    })

    if (
      !codigoValido ||
      !nombreValido ||
      !descripcionValida ||
      !precioValido ||
      !stockValido ||
      !stockCriticoValido ||
      !categoriaValida ||
      !ofertaValida
    ) {
      alertaError('Revisa el formulario', 'Existen campos obligatorios o inválidos.')
      return
    }

    const productoGuardar: Producto = {
      codigo: codigo.trim(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: Number(precio),
      stock: Number(stock),
      stockCritico: stockCritico ? Number(stockCritico) : null,
      categoriaId: Number(categoriaId),
      imagen: imagen.trim() || 'logo.png',
      estado,
      enOferta,
      porcentajeDescuento: enOferta ? Math.round(porcentajeNum) : 0,
      precioOferta: enOferta ? Math.round(precioOfertaNum) : null
    }

    guardarProducto(productoGuardar)

    let mensajeExtra = ''
    if (
      productoGuardar.stockCritico != null &&
      productoGuardar.stock <= productoGuardar.stockCritico
    ) {
      mensajeExtra = ' El stock está en o bajo el nivel crítico.'
    }

    alertaExito('Correcto', 'Producto guardado correctamente.' + mensajeExtra).then(() => {
      navigate('/admin/productos')
    })
  }

  return (
    <div>
      <h1 className="section-title" id="tituloFormularioProducto">
        {esEdicion ? 'Editar producto' : 'Nuevo instrumento musical'}
      </h1>

      <Form
        id="formularioProducto"
        noValidate
        onSubmit={handleSubmit}
        className="bg-forte-panel rounded p-4 shadow-sm"
      >
        <Row className="g-3">
          {/* Código */}
          <Col md={4}>
            <Form.Group controlId="codigoProducto">
              <Form.Label>Código</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: NG-009"
                value={codigo}
                readOnly={esEdicion}
                onChange={(e) => setCodigo(e.target.value)}
                onBlur={() => setTocado((prev) => ({ ...prev, codigo: true }))}
                isValid={tocado.codigo && codigoValido}
                isInvalid={tocado.codigo && !codigoValido}
              />
              <Form.Control.Feedback type="invalid">
                Código obligatorio, mínimo 3 caracteres y único.
              </Form.Control.Feedback>
              {!esEdicion && (
                <Form.Text className="text-muted">
                  Se sugiere automáticamente al elegir la categoría.
                </Form.Text>
              )}
            </Form.Group>
          </Col>

          {/* Nombre */}
          <Col md={8}>
            <Form.Group controlId="nombreProducto">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                maxLength={100}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onBlur={() => setTocado((prev) => ({ ...prev, nombre: true }))}
                isValid={tocado.nombre && nombreValido}
                isInvalid={tocado.nombre && !nombreValido}
              />
              <Form.Control.Feedback type="invalid">
                El nombre es obligatorio (máximo 100 caracteres).
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Descripción */}
          <Col xs={12}>
            <Form.Group controlId="descripcionProducto">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                maxLength={500}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                onBlur={() => setTocado((prev) => ({ ...prev, descripcion: true }))}
                isValid={tocado.descripcion && descripcionValida}
                isInvalid={tocado.descripcion && !descripcionValida}
              />
              <Form.Control.Feedback type="invalid">
                Máximo 500 caracteres.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Precio */}
          <Col md={3}>
            <Form.Group controlId="precioProducto">
              <Form.Label>Precio normal ($)</Form.Label>
              <Form.Control
                type="number"
                min={0}
                step={1}
                value={precio}
                onChange={(e) => {
                  const nuevoPrecio = e.target.value
                  setPrecio(nuevoPrecio)
                  const pNum = Number(nuevoPrecio)
                  const porc = Number(porcentajeDescuento)
                  if (enOferta && pNum > 0 && porc > 0 && porc < 100) {
                    setPrecioOferta(String(Math.round(pNum * (1 - porc / 100))))
                  }
                }}
                onBlur={() => setTocado((prev) => ({ ...prev, precio: true }))}
                isValid={tocado.precio && precioValido}
                isInvalid={tocado.precio && !precioValido}
              />
              <Form.Control.Feedback type="invalid">
                El precio debe ser mayor o igual a 0.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Stock */}
          <Col md={3}>
            <Form.Group controlId="stockProducto">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                min={0}
                step={1}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                onBlur={() => setTocado((prev) => ({ ...prev, stock: true }))}
                isValid={tocado.stock && stockValido}
                isInvalid={tocado.stock && !stockValido}
              />
              <Form.Control.Feedback type="invalid">
                El stock debe ser un entero mayor o igual a 0.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Stock Crítico */}
          <Col md={3}>
            <Form.Group controlId="stockCriticoProducto">
              <Form.Label>Stock crítico</Form.Label>
              <Form.Control
                type="number"
                min={0}
                step={1}
                value={stockCritico}
                onChange={(e) => setStockCritico(e.target.value)}
                onBlur={() => setTocado((prev) => ({ ...prev, stockCritico: true }))}
                isValid={tocado.stockCritico && stockCriticoValido}
                isInvalid={tocado.stockCritico && !stockCriticoValido}
              />
              <Form.Control.Feedback type="invalid">
                Debe ser un entero mayor o igual a 0.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Categoría */}
          <Col md={3}>
            <Form.Group controlId="categoriaProducto">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={categoriaId}
                onChange={(e) => {
                  const nuevaCatId = e.target.value
                  setCategoriaId(nuevaCatId)
                  if (!esEdicion && nuevaCatId) {
                    const catObj = categorias.find((c) => c.id === Number(nuevaCatId))
                    const codigoSugerido = generarCodigoPorCategoria(
                      nuevaCatId,
                      catObj?.nombre,
                      productos
                    )
                    setCodigo(codigoSugerido)
                    setTocado((prev) => ({ ...prev, codigo: true, categoriaId: true }))
                  }
                }}
                onBlur={() => setTocado((prev) => ({ ...prev, categoriaId: true }))}
                isValid={tocado.categoriaId && categoriaValida}
                isInvalid={tocado.categoriaId && !categoriaValida}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Selecciona una categoría.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Imagen */}
          <Col md={8}>
            <Form.Group controlId="imagenProducto">
              <Form.Label>Imagen (ruta dentro de static/img o public/img)</Form.Label>
              <Form.Control
                type="text"
                placeholder="productos/mi-instrumento.webp"
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
              />
            </Form.Group>
          </Col>

          {/* Estado */}
          <Col md={4}>
            <Form.Group controlId="estadoProducto">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={estado}
                onChange={(e) => setEstado(e.target.value as 'Activo' | 'Inactivo')}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Sección de Ofertas y Descuentos */}
          <Col xs={12}>
            <Card className="bg-dark border-secondary mt-2">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div>
                    <h2 className="h6 mb-1 text-accent">
                      <i className="bi bi-tag-fill me-2" />
                      Gestión de Oferta y Promoción
                    </h2>
                    <small className="text-muted">
                      Marca el instrumento en oferta e indica su porcentaje de descuento o precio promocional.
                    </small>
                  </div>
                  <Form.Check
                    type="switch"
                    id="enOfertaProducto"
                    label="Producto en oferta"
                    checked={enOferta}
                    onChange={(e) => {
                      const activo = e.target.checked
                      setEnOferta(activo)
                      if (activo && !porcentajeDescuento && Number(precio) > 0) {
                        setPorcentajeDescuento('15')
                        setPrecioOferta(String(Math.round(Number(precio) * 0.85)))
                      }
                    }}
                    className="fw-semibold text-light"
                  />
                </div>

                {enOferta && (
                  <Row className="g-3 mt-1">
                    <Col md={4}>
                      <Form.Group controlId="porcentajeDescuentoProducto">
                        <Form.Label>Porcentaje de descuento (%)</Form.Label>
                        <Form.Control
                          type="number"
                          min={1}
                          max={99}
                          step={1}
                          placeholder="Ej: 15"
                          value={porcentajeDescuento}
                          onChange={(e) => handlePorcentajeChange(e.target.value)}
                          onBlur={() => setTocado((prev) => ({ ...prev, oferta: true }))}
                          isValid={tocado.oferta && ofertaValida}
                          isInvalid={tocado.oferta && !ofertaValida}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group controlId="precioOfertaProducto">
                        <Form.Label>Precio oferta ($)</Form.Label>
                        <Form.Control
                          type="number"
                          min={1}
                          step={1}
                          placeholder="Ej: 390990"
                          value={precioOferta}
                          onChange={(e) => handlePrecioOfertaChange(e.target.value)}
                          onBlur={() => setTocado((prev) => ({ ...prev, oferta: true }))}
                          isValid={tocado.oferta && ofertaValida}
                          isInvalid={tocado.oferta && !ofertaValida}
                        />
                        <Form.Control.Feedback type="invalid">
                          El precio oferta debe ser mayor a 0 y menor al precio normal ({formatearPrecio(precio || 0)}).
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={4} className="d-flex align-items-center">
                      {ofertaValida && precioNum > 0 && (
                        <div className="p-2 rounded border border-warning w-100 small">
                          <div className="text-muted">
                            Normal: <del>{formatearPrecio(precioNum)}</del>
                          </div>
                          <div className="fw-bold text-accent">
                            Oferta: {formatearPrecio(precioOfertaNum)} (-{Math.round(porcentajeNum)}%)
                          </div>
                        </div>
                      )}
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="d-flex gap-2 mt-4">
          <Button type="submit" className="btn btn-accent">
            Guardar
          </Button>
          <Link to="/admin/productos" className="btn btn-outline-light">
            Cancelar
          </Link>
        </div>
      </Form>
    </div>
  )
}
