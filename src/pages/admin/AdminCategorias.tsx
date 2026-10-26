import React, { useState, useMemo } from 'react'
import { Card, Row, Col, Form, Button, Table, Badge } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { FORTEPIANO_KEYS } from '../../storage/claves'
import { useColeccion } from '../../storage/useColeccion'
import { Categoria, Producto } from '../../types'

export default function AdminCategorias() {
  const { datos: categorias, guardar: guardarCategorias } = useColeccion<Categoria>(
    FORTEPIANO_KEYS.categorias
  )
  const { datos: productos } = useColeccion<Producto>(FORTEPIANO_KEYS.productos)

  const [nombreNueva, setNombreNueva] = useState('')
  const [errorNombre, setErrorNombre] = useState('')

  // Calcular la cantidad de productos por categoría
  const conteoPorCategoria = useMemo(() => {
    const mapa: Record<number, number> = {}
    productos.forEach((p) => {
      mapa[p.categoriaId] = (mapa[p.categoriaId] || 0) + 1
    })
    return mapa
  }, [productos])

  const handleCrearCategoria = (e: React.FormEvent) => {
    e.preventDefault()
    const nombreLimpio = nombreNueva.trim()

    if (!nombreLimpio) {
      setErrorNombre('El nombre de la categoría es obligatorio.')
      return
    }

    if (nombreLimpio.length < 3) {
      setErrorNombre('El nombre debe tener al menos 3 caracteres.')
      return
    }

    const existe = categorias.some(
      (c) => c.nombre.toLowerCase() === nombreLimpio.toLowerCase()
    )

    if (existe) {
      setErrorNombre('Ya existe una categoría con este nombre.')
      return
    }

    const maxId = categorias.reduce((max, c) => (c.id > max ? c.id : max), 0)
    const nuevaCat: Categoria = {
      id: maxId + 1,
      nombre: nombreLimpio
    }

    guardarCategorias((prev) => [...prev, nuevaCat])
    setNombreNueva('')
    setErrorNombre('')

    Swal.fire({
      title: 'Categoría creada',
      text: `La categoría "${nombreLimpio}" se agregó correctamente.`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    })
  }

  const handleEliminarCategoria = (cat: Categoria) => {
    const productosAsociados = conteoPorCategoria[cat.id] || 0
    if (productosAsociados > 0) {
      Swal.fire({
        title: 'No se puede eliminar',
        text: `Esta categoría tiene ${productosAsociados} producto(s) asignado(s). Reasigna los productos antes de eliminarla.`,
        icon: 'warning',
        confirmButtonText: 'Entendido'
      })
      return
    }

    Swal.fire({
      title: `¿Eliminar "${cat.nombre}"?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    }).then((res) => {
      if (res.isConfirmed) {
        guardarCategorias((prev) => prev.filter((c) => c.id !== cat.id))
        Swal.fire('Eliminada', 'La categoría fue eliminada con éxito.', 'success')
      }
    })
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Gestión de Categorías</h1>
          <p className="text-muted mb-0">
            Administra las categorías de instrumentos musicales y accesorios.
          </p>
        </div>
      </div>

      <Row className="g-4">
        {/* Formulario de creación */}
        <Col lg={4}>
          <Card className="bg-forte-panel border-secondary shadow-sm">
            <Card.Header className="bg-transparent border-secondary">
              <h2 className="h5 mb-0 text-accent">
                <i className="bi bi-folder-plus me-2"></i>Nueva Categoría
              </h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleCrearCategoria}>
                <Form.Group className="mb-3" controlId="inputNombreCategoria">
                  <Form.Label>Nombre de la Categoría</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: Sintetizadores y Teclados"
                    value={nombreNueva}
                    onChange={(e) => {
                      setNombreNueva(e.target.value)
                      if (errorNombre) setErrorNombre('')
                    }}
                    isInvalid={Boolean(errorNombre)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorNombre}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Se creará con identificador correlativo automático.
                  </Form.Text>
                </Form.Group>

                <Button type="submit" variant="accent" className="w-100">
                  <i className="bi bi-plus-circle me-1"></i> Crear Categoría
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Tabla de categorías */}
        <Col lg={8}>
          <Card className="bg-forte-panel border-secondary shadow-sm">
            <Card.Header className="bg-transparent border-secondary d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0 text-light">Categorías Existentes</h2>
              <Badge bg="secondary">{categorias.length} categorías</Badge>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover variant="dark" className="mb-0 align-middle">
                  <thead>
                    <tr className="border-secondary text-muted">
                      <th style={{ width: '80px' }}>ID</th>
                      <th>Nombre</th>
                      <th>Instrumentos Asociados</th>
                      <th className="text-end" style={{ width: '120px' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map((cat) => {
                      const count = conteoPorCategoria[cat.id] || 0
                      return (
                        <tr key={cat.id} className="border-secondary">
                          <td className="fw-bold text-accent">#{cat.id}</td>
                          <td>
                            <strong>{cat.nombre}</strong>
                          </td>
                          <td>
                            <Badge bg={count > 0 ? 'info' : 'secondary'}>
                              {count} producto(s)
                            </Badge>
                          </td>
                          <td className="text-end">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleEliminarCategoria(cat)}
                              title={
                                count > 0
                                  ? 'No se puede eliminar con productos asociados'
                                  : 'Eliminar categoría'
                              }
                            >
                              <i className="bi bi-trash" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
