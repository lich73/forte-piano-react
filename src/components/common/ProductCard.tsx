import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Producto } from '../../types'
import { useCart } from '../../context/CartContext'
import { formatearPrecio } from '../../utils/formato'
import { useTablasMaestras } from '../../hooks/useTablasMaestras'

interface ProductCardProps {
  producto: Producto
  mostrarColumna?: boolean
}

export function ProductCard({ producto, mostrarColumna = false }: ProductCardProps) {
  const navigate = useNavigate()
  const { agregar } = useCart()
  const { obtenerNombreCategoria } = useTablasMaestras()

  const agotado = producto.stock <= 0
  const urlDetalle = `/producto-detalle?codigo=${encodeURIComponent(producto.codigo)}`
  const rutaImagen = producto.imagen
    ? producto.imagen.startsWith('/')
      ? producto.imagen
      : `/img/${producto.imagen}`
    : '/img/logo.png'

  const handleCardClick = () => {
    navigate(urlDetalle)
  }

  const handleAgregar = (e: React.MouseEvent) => {
    e.stopPropagation()
    agregar(producto.codigo, 1)
  }

  const cardContent = (
    <div className="card h-100 card-forte-hover">
      <Link to={urlDetalle}>
        <img
          src={rutaImagen}
          className="card-img-top p-2"
          alt={producto.nombre}
          style={{ height: '200px', objectFit: 'contain' }}
        />
      </Link>
      <div
        className="card-body d-flex flex-column"
        style={{ cursor: 'pointer' }}
        onClick={handleCardClick}
      >
        <span className="badge bg-secondary align-self-start mb-2">
          {obtenerNombreCategoria(producto.categoriaId)}
        </span>
        <h3 className="h6">
          <Link to={urlDetalle} className="text-decoration-none text-light">
            {producto.nombre}
          </Link>
        </h3>
        <p className="fw-bold text-accent mb-2">{formatearPrecio(producto.precio)}</p>
        <p className="small text-muted mb-3">
          {agotado ? (
            <span className="badge bg-danger">Sin stock</span>
          ) : (
            `Stock: ${producto.stock}`
          )}
        </p>
        <div className="mt-auto d-flex gap-2">
          <Link
            to={urlDetalle}
            className="btn btn-outline-accent btn-sm flex-fill text-center"
            onClick={(e) => e.stopPropagation()}
          >
            Ver detalle
          </Link>
          <button
            type="button"
            className="btn btn-accent btn-sm flex-fill"
            disabled={agotado}
            onClick={handleAgregar}
            title={agotado ? 'Sin stock' : 'Añadir al carrito'}
          >
            <i className="bi bi-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>
  )

  if (mostrarColumna) {
    return <div className="col-sm-6 col-lg-3">{cardContent}</div>
  }

  return cardContent
}

export default ProductCard
