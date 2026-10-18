import { useState, useEffect, FormEvent } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Form, Row, Col, Button } from 'react-bootstrap'
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

  const [tocado, setTocado] = useState({
    codigo: false,
    nombre: false,
    descripcion: false,
    precio: false,
    stock: false,
    stockCritico: false,
    categoriaId: false
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
      } else {
        alertaError('Error', 'El instrumento musical no fue encontrado.').then(() => {
          navigate('/admin/productos')
        })
      }
    }
  }, [codigoParam, obtenerProducto, navigate])

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    setTocado({
      codigo: true,
      nombre: true,
      descripcion: true,
      precio: true,
      stock: true,
      stockCritico: true,
      categoriaId: true
    })

    if (
      !codigoValido ||
      !nombreValido ||
      !descripcionValida ||
      !precioValido ||
      !stockValido ||
      !stockCriticoValido ||
      !categoriaValida
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
      estado
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
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                min={0}
                step={1}
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
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
                onChange={(e) => setCategoriaId(e.target.value)}
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
