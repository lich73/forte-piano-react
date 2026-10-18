import { useState, useMemo, ReactNode } from 'react'
import { Table, Pagination, Form, Row, Col } from 'react-bootstrap'

export interface Columna<T> {
  encabezado: string
  render: (fila: T) => ReactNode
  ordenarPor?: (fila: T) => string | number
  className?: string
}

export interface DataTableProps<T> {
  filas: T[]
  columnas: Columna<T>[]
  filaKey: (fila: T) => string
  itemsPorPaginaInicial?: number
  criterioBusqueda?: (fila: T, termino: string) => boolean
}

type DireccionOrden = 'asc' | 'desc' | null

export function DataTable<T>({
  filas,
  columnas,
  filaKey,
  itemsPorPaginaInicial = 5,
  criterioBusqueda
}: DataTableProps<T>) {
  const [busqueda, setBusqueda] = useState('')
  const [columnaOrden, setColumnaOrden] = useState<number | null>(null)
  const [direccionOrden, setDireccionOrden] = useState<DireccionOrden>(null)
  const [paginaActual, setPaginaActual] = useState(1)
  const [itemsPorPagina, setItemsPorPagina] = useState(itemsPorPaginaInicial)

  // 1. Filtrar filas
  const filasFiltradas = useMemo(() => {
    if (!busqueda.trim()) return filas
    const termino = busqueda.toLowerCase().trim()

    if (criterioBusqueda) {
      return filas.filter((fila) => criterioBusqueda(fila, termino))
    }

    // Criterio de búsqueda por defecto: revisar todos los valores de las propiedades del objeto
    return filas.filter((fila) => {
      return Object.values(fila as Record<string, unknown>).some((val) => {
        if (val == null) return false
        return String(val).toLowerCase().includes(termino)
      })
    })
  }, [filas, busqueda, criterioBusqueda])

  // 2. Ordenar filas
  const filasOrdenadas = useMemo(() => {
    if (columnaOrden == null || !direccionOrden) return filasFiltradas
    const col = columnas[columnaOrden]
    if (!col || !col.ordenarPor) return filasFiltradas

    const getter = col.ordenarPor
    return [...filasFiltradas].sort((a, b) => {
      const valA = getter(a)
      const valB = getter(b)

      if (valA == null && valB == null) return 0
      if (valA == null) return direccionOrden === 'asc' ? 1 : -1
      if (valB == null) return direccionOrden === 'asc' ? -1 : 1

      if (typeof valA === 'number' && typeof valB === 'number') {
        return direccionOrden === 'asc' ? valA - valB : valB - valA
      }

      const strA = String(valA).toLowerCase()
      const strB = String(valB).toLowerCase()
      const comp = strA.localeCompare(strB)
      return direccionOrden === 'asc' ? comp : -comp
    })
  }, [filasFiltradas, columnaOrden, direccionOrden, columnas])

  // 3. Paginación
  const totalRegistros = filasOrdenadas.length
  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / itemsPorPagina))

  // Asegurar página válida
  const paginaValida = Math.min(Math.max(1, paginaActual), totalPaginas)

  const indiceInicio = (paginaValida - 1) * itemsPorPagina
  const indiceFin = Math.min(indiceInicio + itemsPorPagina, totalRegistros)
  const filasPaginadas = filasOrdenadas.slice(indiceInicio, indiceFin)

  const handleCambioOrden = (indiceColumna: number) => {
    const col = columnas[indiceColumna]
    if (!col.ordenarPor) return

    if (columnaOrden === indiceColumna) {
      if (direccionOrden === 'asc') setDireccionOrden('desc')
      else if (direccionOrden === 'desc') {
        setColumnaOrden(null)
        setDireccionOrden(null)
      } else {
        setDireccionOrden('asc')
      }
    } else {
      setColumnaOrden(indiceColumna)
      setDireccionOrden('asc')
    }
    setPaginaActual(1)
  }

  const handleBusqueda = (valor: string) => {
    setBusqueda(valor)
    setPaginaActual(1)
  }

  const handleCambioItemsPorPagina = (tamano: number) => {
    setItemsPorPagina(tamano)
    setPaginaActual(1)
  }

  return (
    <div className="datatable-container">
      {/* Barra superior de controles */}
      <Row className="mb-3 align-items-center g-2">
        <Col xs={12} sm={6} className="d-flex align-items-center gap-2">
          <span className="text-muted small">Mostrar</span>
          <Form.Select
            size="sm"
            style={{ width: 'auto' }}
            value={itemsPorPagina}
            onChange={(e) => handleCambioItemsPorPagina(Number(e.target.value))}
            className="bg-dark text-light border-secondary"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </Form.Select>
          <span className="text-muted small">registros</span>
        </Col>
        <Col xs={12} sm={6}>
          <div className="d-flex align-items-center justify-content-sm-end gap-2">
            <span className="text-muted small">Buscar:</span>
            <Form.Control
              type="search"
              size="sm"
              style={{ maxWidth: '220px' }}
              value={busqueda}
              onChange={(e) => handleBusqueda(e.target.value)}
              placeholder="Escribe para buscar..."
              className="bg-dark text-light border-secondary"
            />
          </div>
        </Col>
      </Row>

      {/* Tabla con diseño oscuro */}
      <div className="table-responsive">
        <Table variant="dark" hover className="align-middle mb-0">
          <thead>
            <tr>
              {columnas.map((col, idx) => {
                const esOrdenable = !!col.ordenarPor
                const estaActivo = columnaOrden === idx
                return (
                  <th
                    key={idx}
                    className={`${col.className || ''} ${esOrdenable ? 'user-select-none' : ''}`}
                    style={{ cursor: esOrdenable ? 'pointer' : 'default' }}
                    onClick={() => esOrdenable && handleCambioOrden(idx)}
                  >
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <span>{col.encabezado}</span>
                      {esOrdenable && (
                        <span className="text-muted small">
                          {estaActivo && direccionOrden === 'asc' && (
                            <i className="bi bi-sort-up text-accent" />
                          )}
                          {estaActivo && direccionOrden === 'desc' && (
                            <i className="bi bi-sort-down text-accent" />
                          )}
                          {(!estaActivo || !direccionOrden) && (
                            <i className="bi bi-arrow-down-up opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {filasPaginadas.length === 0 ? (
              <tr>
                <td colSpan={columnas.length} className="text-center py-4 text-muted">
                  {busqueda.trim() ? 'Sin resultados encontrados' : 'No hay información disponible'}
                </td>
              </tr>
            ) : (
              filasPaginadas.map((fila) => (
                <tr key={filaKey(fila)}>{columnas.map((col, idx) => (
                  <td key={idx} className={col.className}>{col.render(fila)}</td>
                ))}</tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Barra inferior: Conteo y Paginación */}
      <Row className="mt-3 align-items-center g-2">
        <Col xs={12} sm={6}>
          <p className="text-muted small mb-0">
            {totalRegistros === 0
              ? 'Mostrando 0 de 0 registros'
              : `Mostrando ${indiceInicio + 1} a ${indiceFin} de ${totalRegistros} registros`}
          </p>
        </Col>
        <Col xs={12} sm={6} className="d-flex justify-content-sm-end">
          {totalPaginas > 1 && (
            <Pagination size="sm" className="mb-0">
              <Pagination.First
                disabled={paginaValida === 1}
                onClick={() => setPaginaActual(1)}
              />
              <Pagination.Prev
                disabled={paginaValida === 1}
                onClick={() => setPaginaActual((prev) => Math.max(1, prev - 1))}
              />

              {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPaginas ||
                    Math.abs(p - paginaValida) <= 1
                )
                .map((p, idx, arr) => {
                  const items: ReactNode[] = []
                  if (idx > 0 && p - arr[idx - 1] > 1) {
                    items.push(<Pagination.Ellipsis key={`el-${p}`} disabled />)
                  }
                  items.push(
                    <Pagination.Item
                      key={p}
                      active={p === paginaValida}
                      onClick={() => setPaginaActual(p)}
                    >
                      {p}
                    </Pagination.Item>
                  )
                  return items
                })}

              <Pagination.Next
                disabled={paginaValida === totalPaginas}
                onClick={() => setPaginaActual((prev) => Math.min(totalPaginas, prev + 1))}
              />
              <Pagination.Last
                disabled={paginaValida === totalPaginas}
                onClick={() => setPaginaActual(totalPaginas)}
              />
            </Pagination>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default DataTable
