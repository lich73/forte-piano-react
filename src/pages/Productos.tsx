import { useState, useMemo } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { useProductos } from '../hooks/useProductos'
import { useTablasMaestras } from '../hooks/useTablasMaestras'
import { ProductCard } from '../components/common/ProductCard'

export default function Productos() {
  const { productos } = useProductos()
  const { categorias } = useTablasMaestras()

  const [busqueda, setBusqueda] = useState('')
  const [categoriaId, setCategoriaId] = useState('')

  const productosFiltrados = useMemo(() => {
    let resultado = productos.filter((p) => p.estado === 'Activo')

    if (busqueda.trim().length > 0) {
      const q = busqueda.toLowerCase().trim()
      resultado = resultado.filter((p) => p.nombre.toLowerCase().includes(q))
    }

    if (categoriaId !== '') {
      const idNum = Number(categoriaId)
      resultado = resultado.filter((p) => p.categoriaId === idNum)
    }

    return resultado
  }, [productos, busqueda, categoriaId])

  return (
    <section className="container py-5">
      <h1 className="section-title">Catalogo de instrumentos musicales</h1>

      <div className="row g-3 mb-4 bg-forte-panel p-3 rounded">
        <div className="col-md-8">
          <InputGroup className="forte-search-group">
            <InputGroup.Text id="iconoBusqueda">
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              id="buscadorProductos"
              placeholder="Buscar instrumento musical por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar instrumento musical por nombre"
              aria-describedby="iconoBusqueda"
            />
          </InputGroup>
        </div>
        <div className="col-md-4">
          <Form.Select
            id="filtroCategoria"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
          >
            <option value="">Todas las categorias</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>

      <div className="row g-4" id="catalogoContenedor">
        {productosFiltrados.length === 0 ? (
          <div className="col-12">
            <p className="text-muted text-center py-5">
              No se encontraron productos con esos criterios.
            </p>
          </div>
        ) : (
          productosFiltrados.map((producto) => (
            <div key={producto.codigo} className="col-sm-6 col-lg-3">
              <ProductCard producto={producto} />
            </div>
          ))
        )}
      </div>
    </section>
  )
}
