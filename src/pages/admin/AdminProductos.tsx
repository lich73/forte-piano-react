import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useProductos } from '../../hooks/useProductos'
import { useAuth } from '../../context/AuthContext'
import { useTablasMaestras } from '../../hooks/useTablasMaestras'
import { DataTable, Columna } from '../../components/common/DataTable'
import { Producto } from '../../types'
import { formatearPrecio } from '../../utils/formato'
import { confirmarAccion, alertaExito } from '../../utils/alertas'

export default function AdminProductos() {
  const { productos, eliminarProducto } = useProductos()
  const { sesion } = useAuth()
  const { obtenerNombreCategoria } = useTablasMaestras()

  const soloLectura = sesion?.rolId === 2

  const verProductoAdmin = (producto: Producto) => {
    const rutaImagen = producto.imagen
      ? producto.imagen.startsWith('/')
        ? producto.imagen
        : `/img/${producto.imagen}`
      : '/img/logo.png'

    Swal.fire({
      title: producto.nombre,
      html: `
        <img src="${rutaImagen}" class="img-fluid mb-3 rounded" style="max-height: 160px; object-fit: contain;"><br>
        <div class="text-start text-light">
          <p class="mb-1"><strong>Código:</strong> ${producto.codigo}</p>
          <p class="mb-1"><strong>Categoría:</strong> ${obtenerNombreCategoria(producto.categoriaId)}</p>
          <p class="mb-1"><strong>Precio:</strong> ${formatearPrecio(producto.precio)}</p>
          <p class="mb-1"><strong>Stock:</strong> ${producto.stock}</p>
          <p class="mb-1"><strong>Stock crítico:</strong> ${producto.stockCritico != null ? producto.stockCritico : '-'}</p>
          <p class="mb-0"><strong>Descripción:</strong> ${producto.descripcion || '-'}</p>
        </div>
      `,
      confirmButtonText: 'Cerrar'
    })
  }

  const handleEliminar = async (codigo: string) => {
    const confirmacion = await confirmarAccion(
      '¿Eliminar producto?',
      'Esta acción no se puede deshacer.',
      'Eliminar',
      'Cancelar'
    )

    if (confirmacion.isConfirmed) {
      eliminarProducto(codigo)
      alertaExito('Eliminado', 'El producto fue eliminado correctamente.')
    }
  }

  const columnas: Columna<Producto>[] = useMemo(
    () => [
      {
        encabezado: 'Código',
        render: (p) => p.codigo,
        ordenarPor: (p) => p.codigo
      },
      {
        encabezado: 'Imagen',
        render: (p) => {
          const ruta = p.imagen
            ? p.imagen.startsWith('/')
              ? p.imagen
              : `/img/${p.imagen}`
            : '/img/logo.png'
          return (
            <img
              src={ruta}
              alt={p.nombre}
              height={40}
              className="rounded"
              style={{ objectFit: 'contain', maxWidth: '60px' }}
            />
          )
        }
      },
      {
        encabezado: 'Nombre',
        render: (p) => p.nombre,
        ordenarPor: (p) => p.nombre
      },
      {
        encabezado: 'Categoría',
        render: (p) => obtenerNombreCategoria(p.categoriaId),
        ordenarPor: (p) => obtenerNombreCategoria(p.categoriaId)
      },
      {
        encabezado: 'Precio',
        render: (p) => formatearPrecio(p.precio),
        ordenarPor: (p) => p.precio
      },
      {
        encabezado: 'Stock',
        render: (p) => {
          const critico = p.stockCritico != null && p.stock <= p.stockCritico
          return (
            <span className={critico ? 'stock-critico' : ''}>
              {p.stock}
              {critico && (
                <i
                  className="bi bi-exclamation-triangle-fill ms-1"
                  title="Stock crítico alcanzado"
                />
              )}
            </span>
          )
        },
        ordenarPor: (p) => p.stock
      },
      {
        encabezado: 'Estado',
        render: (p) => (
          <Badge bg={p.estado === 'Activo' ? 'success' : 'secondary'}>
            {p.estado}
          </Badge>
        ),
        ordenarPor: (p) => p.estado
      },
      {
        encabezado: 'Acciones',
        className: 'text-nowrap',
        render: (p) => (
          <div className="d-flex gap-1">
            <Button
              size="sm"
              variant="outline-accent"
              onClick={() => verProductoAdmin(p)}
              title="Ver detalle"
              aria-label={`Ver producto ${p.nombre}`}
            >
              <i className="bi bi-eye" />
            </Button>
            {!soloLectura && (
              <>
                <Link
                  to={`/admin/productos/form?codigo=${encodeURIComponent(p.codigo)}`}
                  className="btn btn-sm btn-outline-light"
                  title="Editar producto"
                  aria-label={`Editar producto ${p.nombre}`}
                >
                  <i className="bi bi-pencil" />
                </Link>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => handleEliminar(p.codigo)}
                  title="Eliminar producto"
                  aria-label={`Eliminar producto ${p.nombre}`}
                >
                  <i className="bi bi-trash" />
                </Button>
              </>
            )}
          </div>
        )
      }
    ],
    [soloLectura, obtenerNombreCategoria]
  )

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h1 className="section-title mb-0">Catálogo</h1>
        {!soloLectura && (
          <Link
            to="/admin/productos/form"
            id="btnNuevoProducto"
            className="btn btn-accent"
          >
            <i className="bi bi-plus-lg me-1" />
            Nuevo instrumento musical
          </Link>
        )}
      </div>

      <div className="bg-forte-panel rounded p-3 shadow-sm">
        <DataTable<Producto>
          filas={productos}
          columnas={columnas}
          filaKey={(p) => p.codigo}
          itemsPorPaginaInicial={5}
          criterioBusqueda={(p, termino) => {
            const cat = obtenerNombreCategoria(p.categoriaId).toLowerCase()
            return (
              p.codigo.toLowerCase().includes(termino) ||
              p.nombre.toLowerCase().includes(termino) ||
              cat.includes(termino) ||
              p.estado.toLowerCase().includes(termino)
            )
          }}
        />
      </div>
    </div>
  )
}
