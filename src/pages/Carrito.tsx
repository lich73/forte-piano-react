import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useCart } from '../context/CartContext'
import { formatearPrecio } from '../utils/formato'

export default function Carrito() {
  const { itemsConDetalle, total, cambiarCantidad, eliminar, vaciar, finalizarCompra } = useCart()

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
        <h1 className="section-title">Carrito de compras</h1>
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

  return (
    <section className="container py-5">
      <h1 className="section-title">Carrito de compras</h1>

      <div className="row">
        {/* Listado de productos en el carrito */}
        <div className="col-lg-8">
          <div id="carritoContenedor">
            {itemsConDetalle.map((item) => {
              const prod = item.producto
              const rutaImagen = prod?.imagen
                ? prod.imagen.startsWith('/')
                  ? prod.imagen
                  : `/img/${prod.imagen}`
                : '/img/logo.png'

              const urlDetalle = `/producto-detalle?codigo=${encodeURIComponent(item.codigo)}`

              return (
                <div key={item.codigo} className="bg-forte-panel rounded p-3 mb-3">
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
                        {formatearPrecio(prod?.precio ?? 0)} c/u
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
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="col-lg-4">
          <div id="carritoResumen" className="bg-forte-panel rounded p-4">
            <h3 className="h5 mb-3">Resumen</h3>
            <div className="d-flex justify-content-between mb-3">
              <span>Total</span>
              <span className="fw-bold text-accent fs-4" id="carritoTotal">
                {formatearPrecio(total)}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-accent w-100 mb-2"
              onClick={finalizarCompra}
            >
              Finalizar compra
            </button>
            <button
              type="button"
              className="btn btn-outline-danger w-100"
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
