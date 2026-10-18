import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { useProductos } from '../hooks/useProductos'
import { useTablasMaestras } from '../hooks/useTablasMaestras'
import { useCart } from '../context/CartContext'
import { formatearPrecio } from '../utils/formato'

export default function ProductoDetalle() {
  const [searchParams] = useSearchParams()
  const codigo = searchParams.get('codigo') ?? ''
  const { obtenerProducto } = useProductos()
  const { obtenerNombreCategoria } = useTablasMaestras()
  const { agregar } = useCart()

  const producto = obtenerProducto(codigo)
  const [cantidad, setCantidad] = useState(1)

  if (!producto) {
    return (
      <section className="container py-5">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/productos' }}>
            Catálogo
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Detalle</Breadcrumb.Item>
        </Breadcrumb>
        <div className="text-center py-5">
          <i className="bi bi-exclamation-circle display-1 text-muted"></i>
          <h2 className="h4 text-muted mt-3">Producto no encontrado</h2>
          <p className="text-muted">El código solicitado no corresponde a ningún producto activo.</p>
          <Link to="/productos" className="btn btn-accent mt-2">
            Volver al catálogo
          </Link>
        </div>
      </section>
    )
  }

  const agotado = producto.stock <= 0
  const rutaImagen = producto.imagen
    ? producto.imagen.startsWith('/')
      ? producto.imagen
      : `/img/${producto.imagen}`
    : '/img/logo.png'

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = parseInt(e.target.value, 10)
    if (isNaN(valor) || valor < 1) {
      setCantidad(1)
    } else if (valor > producto.stock) {
      setCantidad(producto.stock)
    } else {
      setCantidad(valor)
    }
  }

  const handleAgregar = () => {
    if (agotado) return
    agregar(producto.codigo, cantidad)
  }

  return (
    <section className="container py-5">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/productos' }}>
          Catálogo
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{producto.nombre}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="row g-4" id="detalleProducto">
        <div className="col-md-5">
          <img
            src={rutaImagen}
            className="img-fluid rounded bg-forte-panel p-3 w-100"
            alt={producto.nombre}
            style={{ maxHeight: '420px', objectFit: 'contain' }}
          />
        </div>
        <div className="col-md-7">
          <span className="badge bg-secondary mb-2">
            {obtenerNombreCategoria(producto.categoriaId)}
          </span>
          <h1 className="h3">{producto.nombre}</h1>
          <p className="text-muted">{producto.descripcion || 'Sin descripción disponible.'}</p>
          <p className="display-6 text-accent">{formatearPrecio(producto.precio)}</p>
          <p>
            {agotado ? (
              <span className="badge bg-danger">Sin stock</span>
            ) : (
              <span className="badge bg-success">Stock disponible: {producto.stock}</span>
            )}
          </p>

          <div className="d-flex align-items-center gap-3 my-3">
            <label htmlFor="cantidadDetalle" className="form-label mb-0">
              Cantidad
            </label>
            <input
              type="number"
              id="cantidadDetalle"
              className="form-control"
              style={{ width: '90px' }}
              value={cantidad}
              min={1}
              max={Math.max(producto.stock, 1)}
              disabled={agotado}
              onChange={handleCantidadChange}
            />
          </div>

          <button
            type="button"
            className="btn btn-accent btn-lg"
            disabled={agotado}
            onClick={handleAgregar}
          >
            <i className="bi bi-cart-plus me-2"></i> Añadir al carrito
          </button>
        </div>
      </div>
    </section>
  )
}
