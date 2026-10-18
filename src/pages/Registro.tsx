import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { FORTEPIANO_KEYS } from '../storage/claves'
import { Region, Comuna, Usuario } from '../types'
import { REGIONES_INICIALES, COMUNAS_INICIALES } from '../data/seed'
import {
  validarRun,
  validarCorreo,
  validarPassword,
  textoRequerido
} from '../utils/validaciones'
import Swal from '../utils/alertas'

export default function Registro() {
  const navigate = useNavigate()

  const [regiones, setRegiones] = useState<Region[]>([])
  const [comunas, setComunas] = useState<Comuna[]>([])

  const [formData, setFormData] = useState({
    run: '',
    fechaNacimiento: '',
    nombre: '',
    apellidos: '',
    correo: '',
    password: '',
    regionId: '',
    comunaId: '',
    direccion: ''
  })

  const [tocado, setTocado] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const rawRegiones = localStorage.getItem(FORTEPIANO_KEYS.regiones)
      const rawComunas = localStorage.getItem(FORTEPIANO_KEYS.comunas)
      setRegiones(rawRegiones ? JSON.parse(rawRegiones) : REGIONES_INICIALES)
      setComunas(rawComunas ? JSON.parse(rawComunas) : COMUNAS_INICIALES)
    } catch {
      setRegiones(REGIONES_INICIALES)
      setComunas(COMUNAS_INICIALES)
    }
  }, [])

  const comunasFiltradas = comunas.filter(
    (c) => c.regionId === Number(formData.regionId)
  )

  const handleChange = (campo: string, valor: string) => {
    setFormData((prev) => {
      const actual = { ...prev, [campo]: valor }
      if (campo === 'regionId') {
        actual.comunaId = ''
      }
      return actual
    })
  }

  const handleBlur = (campo: string) => {
    setTocado((prev) => ({ ...prev, [campo]: true }))
  }

  // Comprobar si el RUN ya existe
  const obtenerUsuarios = (): Usuario[] => {
    try {
      const raw = localStorage.getItem(FORTEPIANO_KEYS.usuarios)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  const runLimpio = formData.run.toUpperCase().trim()
  const runFormatoValido = validarRun(runLimpio)
  const runEsDuplicado = runFormatoValido && obtenerUsuarios().some((u) => u.run.toUpperCase().trim() === runLimpio)
  const runValido = runFormatoValido && !runEsDuplicado

  const nombreValido = textoRequerido(formData.nombre, 50)
  const apellidosValido = textoRequerido(formData.apellidos, 100)
  const correoValido = validarCorreo(formData.correo)
  const passwordValido = validarPassword(formData.password)
  const regionValida = formData.regionId !== ''
  const comunaValida = formData.comunaId !== ''
  const direccionValida = textoRequerido(formData.direccion, 300)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const todosTocados: Record<string, boolean> = {
      run: true,
      fechaNacimiento: true,
      nombre: true,
      apellidos: true,
      correo: true,
      password: true,
      regionId: true,
      comunaId: true,
      direccion: true
    }
    setTocado(todosTocados)

    if (
      !runValido ||
      !nombreValido ||
      !apellidosValido ||
      !correoValido ||
      !passwordValido ||
      !regionValida ||
      !comunaValida ||
      !direccionValida
    ) {
      Swal.fire('Revisa el formulario', 'Existen campos obligatorios o invalidos.', 'error')
      return
    }

    const nuevoUsuario: Usuario = {
      run: runLimpio,
      nombre: formData.nombre.trim(),
      apellidos: formData.apellidos.trim(),
      correo: formData.correo.trim(),
      password: formData.password,
      fechaNacimiento: formData.fechaNacimiento || '',
      rolId: 3, // Cliente
      regionId: Number(formData.regionId),
      comunaId: Number(formData.comunaId),
      direccion: formData.direccion.trim(),
      estado: 'Activo'
    }

    const usuarios = obtenerUsuarios()
    usuarios.push(nuevoUsuario)
    localStorage.setItem(FORTEPIANO_KEYS.usuarios, JSON.stringify(usuarios))

    Swal.fire('Correcto', 'Usuario registrado correctamente.', 'success').then(() => {
      navigate('/login')
    })
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="auth-card p-4 p-md-5">
            <h1 className="h3 mb-4 text-center">
              Crear cuenta en <span className="text-accent">Forte & Piano</span>
            </h1>

            <Form noValidate onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Group controlId="runRegistro">
                    <Form.Label>RUN (sin puntos ni guion)</Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={9}
                      placeholder="Ej: 123456785"
                      value={formData.run}
                      onChange={(e) => handleChange('run', e.target.value)}
                      onBlur={() => handleBlur('run')}
                      isValid={tocado.run && runValido}
                      isInvalid={tocado.run && !runValido}
                    />
                    <Form.Control.Feedback type="invalid">
                      {runEsDuplicado
                        ? 'El RUN ingresado ya se encuentra registrado.'
                        : 'RUN invalido. Debe tener entre 7 y 9 caracteres y digito verificador correcto.'}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group controlId="fechaNacimientoRegistro">
                    <Form.Label>Fecha de nacimiento</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
                      onBlur={() => handleBlur('fechaNacimiento')}
                    />
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group controlId="nombreRegistro">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={50}
                      value={formData.nombre}
                      onChange={(e) => handleChange('nombre', e.target.value)}
                      onBlur={() => handleBlur('nombre')}
                      isValid={tocado.nombre && nombreValido}
                      isInvalid={tocado.nombre && !nombreValido}
                    />
                    <Form.Control.Feedback type="invalid">
                      El nombre es obligatorio (maximo 50 caracteres).
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group controlId="apellidosRegistro">
                    <Form.Label>Apellidos</Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={100}
                      value={formData.apellidos}
                      onChange={(e) => handleChange('apellidos', e.target.value)}
                      onBlur={() => handleBlur('apellidos')}
                      isValid={tocado.apellidos && apellidosValido}
                      isInvalid={tocado.apellidos && !apellidosValido}
                    />
                    <Form.Control.Feedback type="invalid">
                      Los apellidos son obligatorios (maximo 100 caracteres).
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group controlId="correoRegistro">
                    <Form.Label>Correo</Form.Label>
                    <Form.Control
                      type="email"
                      maxLength={100}
                      placeholder="usuario@gmail.com"
                      value={formData.correo}
                      onChange={(e) => handleChange('correo', e.target.value)}
                      onBlur={() => handleBlur('correo')}
                      isValid={tocado.correo && correoValido}
                      isInvalid={tocado.correo && !correoValido}
                    />
                    <Form.Control.Feedback type="invalid">
                      Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group controlId="passwordRegistro">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      maxLength={10}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      onBlur={() => handleBlur('password')}
                      isValid={tocado.password && passwordValido}
                      isInvalid={tocado.password && !passwordValido}
                    />
                    <Form.Control.Feedback type="invalid">
                      La contrasena debe tener entre 4 y 10 caracteres.
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group controlId="regionRegistro">
                    <Form.Label>Región</Form.Label>
                    <Form.Select
                      value={formData.regionId}
                      onChange={(e) => handleChange('regionId', e.target.value)}
                      onBlur={() => handleBlur('regionId')}
                      isValid={tocado.regionId && regionValida}
                      isInvalid={tocado.regionId && !regionValida}
                    >
                      <option value="">Seleccione una región</option>
                      {regiones.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nombre}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Selecciona una region.
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group controlId="comunaRegistro">
                    <Form.Label>Comuna</Form.Label>
                    <Form.Select
                      value={formData.comunaId}
                      onChange={(e) => handleChange('comunaId', e.target.value)}
                      onBlur={() => handleBlur('comunaId')}
                      disabled={!formData.regionId}
                      isValid={tocado.comunaId && comunaValida}
                      isInvalid={tocado.comunaId && !comunaValida}
                    >
                      <option value="">
                        {formData.regionId
                          ? 'Seleccione una comuna'
                          : 'Seleccione una region primero'}
                      </option>
                      {comunasFiltradas.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Selecciona una comuna.
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div className="col-12">
                  <Form.Group controlId="direccionRegistro">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={300}
                      value={formData.direccion}
                      onChange={(e) => handleChange('direccion', e.target.value)}
                      onBlur={() => handleBlur('direccion')}
                      isValid={tocado.direccion && direccionValida}
                      isInvalid={tocado.direccion && !direccionValida}
                    />
                    <Form.Control.Feedback type="invalid">
                      La direccion es obligatoria (maximo 300 caracteres).
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>

              <Button type="submit" className="btn btn-accent w-100 mt-4">
                Registrar
              </Button>

              <p className="text-center mt-3 mb-0 small text-muted">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-accent">
                  Inicia sesión
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </section>
  )
}
