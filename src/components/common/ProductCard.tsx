import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Badge, Button } from 'react-bootstrap'
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
  const esStockCritico = !agotado && producto.stockCritico != null && producto.stock <= producto.stockCritico
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
    <Card className="h-100 card-forte-hover">
      <Link to={urlDetalle}>
        <Card.Img
          variant="top"
          src={rutaImagen}
          className="p-2"
          alt={producto.nombre}
          style={{ height: '200px', objectFit: 'contain' }}
        />
      </Link>
      <Card.Body
        className="d-flex flex-column"
        style={{ cursor: 'pointer' }}
        onClick={handleCardClick}
      >
        <Badge className="badge-categoria align-self-start mb-2">
          {obtenerNombreCategoria(producto.categoriaId)}
        </Badge>
        <Card.Title as="h3" className="h6">
          <Link to={urlDetalle} className="text-decoration-none text-light">
            {producto.nombre}
          </Link>
        </Card.Title>
        <Card.Text className="fw-bold text-accent mb-2">
          {formatearPrecio(producto.precio)}
        </Card.Text>
        <div className="small mb-3">
          {agotado ? (
            <Badge bg="danger">Sin stock</Badge>
          ) : esStockCritico ? (
            <Badge bg="warning" text="dark" className="d-inline-flex align-items-center gap-1">
              <i className="bi bi-exclamation-triangle-fill"></i> ¡Stock Crítico: {producto.stock}!
            </Badge>
          ) : (
            <span className="text-muted">Stock: {producto.stock}</span>
          )}
        </div>
        <div className="mt-auto d-flex gap-2">
          <Link
            to={urlDetalle}
            className="btn btn-outline-accent btn-sm flex-fill text-center"
            onClick={(e) => e.stopPropagation()}
          >
            Ver detalle
          </Link>
          <Button
            type="button"
            className="btn-accent btn-sm flex-fill"
            disabled={agotado}
            onClick={handleAgregar}
            title={agotado ? 'Sin stock' : 'Añadir al carrito'}
          >
            <i className="bi bi-cart-plus"></i>
          </Button>
        </div>
      </Card.Body>
    </Card>
  )

  if (mostrarColumna) {
    return <div className="col-sm-6 col-lg-3">{cardContent}</div>
  }

  return cardContent
}

export default ProductCard
