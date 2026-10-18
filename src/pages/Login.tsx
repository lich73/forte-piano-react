import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { validarCorreo, validarPassword } from '../utils/validaciones'
import Swal from '../utils/alertas'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [tocado, setTocado] = useState({ correo: false, password: false })

  const correoValido = validarCorreo(correo)
  const passwordValido = validarPassword(password)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTocado({ correo: true, password: true })

    if (!correoValido || !passwordValido) {
      Swal.fire('Revisa el formulario', 'Correo o contrasena con formato invalido.', 'error')
      return
    }

    const res = login(correo, password)
    if (!res.exito) {
      if (res.mensaje?.includes('deshabilitada')) {
        Swal.fire('Cuenta inactiva', res.mensaje, 'warning')
      } else {
        Swal.fire('Credenciales incorrectas', res.mensaje || 'El correo o la contrasena no coinciden.', 'error')
      }
      return
    }

    Swal.fire('Bienvenido', 'Inicio de sesion correcto.', 'success').then(() => {
      if (res.sesion && (res.sesion.rolId === 1 || res.sesion.rolId === 2)) {
        navigate('/admin')
      } else {
        navigate('/')
      }
    })
  }

  return (
    <section className="container py-5 min-vh-70 d-flex align-items-center">
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-5">
          <div className="auth-card p-4 p-md-5 text-center">
            <img src="/img/logo.png" alt="Forte & Piano" height="70" className="mb-3" />
            <h1 className="h3 mb-4">Iniciar sesión</h1>

            <Form noValidate className="text-start" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="correoLogin">
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
                  Ingresa un correo valido (@duoc.cl, @profesor.duoc.cl o @gmail.com).
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="passwordLogin">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  maxLength={10}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTocado((prev) => ({ ...prev, password: true }))}
                  isValid={tocado.password && passwordValido}
                  isInvalid={tocado.password && !passwordValido}
                />
                <Form.Control.Feedback type="invalid">
                  La contrasena debe tener entre 4 y 10 caracteres.
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" className="btn btn-accent w-100">
                Iniciar sesión
              </Button>
            </Form>

            <p className="mt-4 mb-0 small text-muted">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-accent">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
