import { useState, FormEvent } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { FORTEPIANO_KEYS } from '../storage/claves'
import { useColeccion } from '../storage/useColeccion'
import { Mensaje } from '../types'
import { textoRequerido, validarCorreo } from '../utils/validaciones'
import { alertaExito, alertaError } from '../utils/alertas'

export default function Contacto() {
  const { datos: contactos, guardar } = useColeccion<Mensaje>(FORTEPIANO_KEYS.contactos)

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [comentario, setComentario] = useState('')

  const [tocado, setTocado] = useState({
    nombre: false,
    correo: false,
    comentario: false
  })

  const nombreValido = textoRequerido(nombre, 100)
  const correoValido = validarCorreo(correo)
  const comentarioValido = textoRequerido(comentario, 500)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Marcar todos los campos como tocados
    setTocado({
      nombre: true,
      correo: true,
      comentario: true
    })

    if (!nombreValido || !correoValido || !comentarioValido) {
      alertaError('Revisa el formulario', 'Existen campos obligatorios o inválidos.')
      return
    }

    const nuevoMensaje: Mensaje = {
      nombre: nombre.trim(),
      correo: correo.trim(),
      comentario: comentario.trim(),
      fecha: new Date().toISOString().slice(0, 10)
    }

    guardar([...contactos, nuevoMensaje])

    alertaExito('Mensaje enviado', 'Gracias por escribirnos, te responderemos pronto.')

    // Limpiar formulario y estados tocados
    setNombre('')
    setCorreo('')
    setComentario('')
    setTocado({
      nombre: false,
      correo: false,
      comentario: false
    })
  }

  return (
    <section className="py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={7}>
            <h1 className="section-title">Contacto</h1>
            <p className="mb-4">¿Tienes dudas o comentarios?</p>
            <div className="auth-card p-4 p-md-5">
              <Form noValidate onSubmit={handleSubmit}>
                {/* Campo Nombre */}
                <Form.Group className="mb-3" controlId="nombreContacto">
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

                {/* Campo Correo */}
                <Form.Group className="mb-3" controlId="correoContacto">
                  <Form.Label>Correo</Form.Label>
                  <Form.Control
                    type="email"
                    maxLength={100}
                    placeholder="usuario@gmail.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    onBlur={() => setTocado((prev) => ({ ...prev, correo: true }))}
                    isValid={tocado.correo && correoValido}
                    isInvalid={tocado.correo && !correoValido}
                  />
                  <Form.Control.Feedback type="invalid">
                    Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Campo Comentario */}
                <Form.Group className="mb-4" controlId="comentarioContacto">
                  <Form.Label>Comentario</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    maxLength={500}
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    onBlur={() => setTocado((prev) => ({ ...prev, comentario: true }))}
                    isValid={tocado.comentario && comentarioValido}
                    isInvalid={tocado.comentario && !comentarioValido}
                  />
                  <Form.Control.Feedback type="invalid">
                    El comentario es obligatorio (máximo 500 caracteres).
                  </Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" className="btn btn-accent w-100">
                  Enviar
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
