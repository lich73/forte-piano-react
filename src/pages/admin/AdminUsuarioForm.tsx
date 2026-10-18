import { useState, useEffect, FormEvent } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { useUsuarios } from '../../hooks/useUsuarios'
import { useTablasMaestras } from '../../hooks/useTablasMaestras'
import { Usuario } from '../../types'
import {
  validarRun,
  validarCorreo,
  validarPassword,
  textoRequerido
} from '../../utils/validaciones'
import { alertaExito, alertaError } from '../../utils/alertas'

export default function AdminUsuarioForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const runParam = searchParams.get('run')

  const { usuarios, obtenerUsuarioPorRun, guardarUsuario } = useUsuarios()
  const { roles, regiones, obtenerComunasPorRegion } = useTablasMaestras()

  const esEdicion = Boolean(runParam)

  const [run, setRun] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [rolId, setRolId] = useState('')
  const [regionId, setRegionId] = useState('')
  const [comunaId, setComunaId] = useState('')
  const [direccion, setDireccion] = useState('')
  const [estado, setEstado] = useState<'Activo' | 'Inactivo'>('Activo')

  const [tocado, setTocado] = useState({
    run: false,
    nombre: false,
    apellidos: false,
    correo: false,
    password: false,
    rolId: false,
    regionId: false,
    comunaId: false,
    direccion: false
  })

  // Cargar usuario si es edición
  useEffect(() => {
    if (runParam) {
      const u = obtenerUsuarioPorRun(runParam)
      if (u) {
        setRun(u.run)
        setNombre(u.nombre)
        setApellidos(u.apellidos)
        setCorreo(u.correo)
        setPassword(u.password)
        setFechaNacimiento(u.fechaNacimiento || '')
        setRolId(String(u.rolId))
        setRegionId(String(u.regionId))
        setComunaId(String(u.comunaId))
        setDireccion(u.direccion)
        setEstado(u.estado)
      } else {
        alertaError('Error', 'El usuario especificado no fue encontrado.').then(() => {
          navigate('/admin/usuarios')
        })
      }
    }
  }, [runParam, obtenerUsuarioPorRun, navigate])

  // Comunas disponibles para la región seleccionada
  const comunasDisponibles = regionId ? obtenerComunasPorRegion(regionId) : []

  // Validaciones
  const runValido =
    validarRun(run) &&
    !usuarios.some(
      (u) =>
        u.run.toUpperCase().trim() === run.toUpperCase().trim() &&
        u.run.toUpperCase().trim() !== runParam?.toUpperCase().trim()
    )

  const nombreValido = textoRequerido(nombre, 50)
  const apellidosValido = textoRequerido(apellidos, 100)
  const correoValido = validarCorreo(correo)
  const passwordValido = validarPassword(password)
  const rolValido = Boolean(rolId && rolId !== '')
  const regionValida = Boolean(regionId && regionId !== '')
  const comunaValida = Boolean(comunaId && comunaId !== '')
  const direccionValida = textoRequerido(direccion, 300)

  const handleCambioRegion = (nuevaRegionId: string) => {
    setRegionId(nuevaRegionId)
    setComunaId('') // Reiniciar comuna al cambiar región
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    setTocado({
      run: true,
      nombre: true,
      apellidos: true,
      correo: true,
      password: true,
      rolId: true,
      regionId: true,
      comunaId: true,
      direccion: true
    })

    if (
      !runValido ||
      !nombreValido ||
      !apellidosValido ||
      !correoValido ||
      !passwordValido ||
      !rolValido ||
      !regionValida ||
      !comunaValida ||
      !direccionValida
    ) {
      alertaError('Revisa el formulario', 'Existen campos obligatorios o inválidos.')
      return
    }

    const usuarioGuardar: Usuario = {
      run: run.toUpperCase().trim(),
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      correo: correo.trim(),
      password,
      fechaNacimiento: fechaNacimiento || '',
      rolId: Number(rolId),
      regionId: Number(regionId),
      comunaId: Number(comunaId),
      direccion: direccion.trim(),
      estado
    }

    guardarUsuario(usuarioGuardar)

    alertaExito('Correcto', 'Usuario guardado correctamente.').then(() => {
      navigate('/admin/usuarios')
    })
  }

  return (
    <div>
      <h1 className="section-title" id="tituloFormularioUsuario">
        {esEdicion ? 'Editar usuario' : 'Nuevo usuario'}
      </h1>

      <Form
        id="formularioUsuario"
        noValidate
        onSubmit={handleSubmit}
        className="bg-forte-panel rounded p-4 shadow-sm"
      >
        <Row className="g-3">
          {/* RUN */}
          <Col md={4}>
            <Form.Group controlId="runUsuario">
              <Form.Label>RUN (sin puntos ni guión)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: 123456785"
                maxLength={9}
                value={run}
                readOnly={esEdicion}
                onChange={(e) => setRun(e.target.value)}
                onBlur={() => setTocado((prev) => ({ ...prev, run: true }))}
                isValid={tocado.run && runValido}
                isInvalid={tocado.run && !runValido}
              />
              <Form.Control.Feedback type="invalid">
                RUN inválido o ya registrado.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Nombre */}
          <Col md={4}>
            <Form.Group controlId="nombreUsuario">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                maxLength={50}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onBlur={() => setTocado((prev) => ({ ...prev, nombre: true }))}
                isValid={tocado.nombre && nombreValido}
                isInvalid={tocado.nombre && !nombreValido}
              />
              <Form.Control.Feedback type="invalid">
                Obligatorio (máximo 50 caracteres).
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Apellidos */}
          <Col md={4}>
            <Form.Group controlId="apellidosUsuario">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                maxLength={100}
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                onBlur={() => setTocado((prev) => ({ ...prev, apellidos: true }))}
                isValid={tocado.apellidos && apellidosValido}
                isInvalid={tocado.apellidos && !apellidosValido}
              />
              <Form.Control.Feedback type="invalid">
                Obligatorio (máximo 100 caracteres).
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Correo */}
          <Col md={6}>
            <Form.Group controlId="correoUsuario">
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
                Solo @duoc.cl, @profesor.duoc.cl o @gmail.com.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Contraseña */}
          <Col md={6}>
            <Form.Group controlId="passwordUsuario">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="text"
                maxLength={10}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTocado((prev) => ({ ...prev, password: true }))}
                isValid={tocado.password && passwordValido}
                isInvalid={tocado.password && !passwordValido}
              />
              <Form.Control.Feedback type="invalid">
                Entre 4 y 10 caracteres.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Fecha de nacimiento */}
          <Col md={4}>
            <Form.Group controlId="fechaNacimientoUsuario">
              <Form.Label>Fecha de nacimiento</Form.Label>
              <Form.Control
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
              />
            </Form.Group>
          </Col>

          {/* Rol */}
          <Col md={4}>
            <Form.Group controlId="rolUsuario">
              <Form.Label>Tipo de usuario</Form.Label>
              <Form.Select
                value={rolId}
                onChange={(e) => setRolId(e.target.value)}
                onBlur={() => setTocado((prev) => ({ ...prev, rolId: true }))}
                isValid={tocado.rolId && rolValido}
                isInvalid={tocado.rolId && !rolValido}
              >
                <option value="">Selecciona un tipo de usuario</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Selecciona un tipo de usuario.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Estado */}
          <Col md={4}>
            <Form.Group controlId="estadoUsuario">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={estado}
                onChange={(e) => setEstado(e.target.value as 'Activo' | 'Inactivo')}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Región */}
          <Col md={6}>
            <Form.Group controlId="regionUsuario">
              <Form.Label>Región</Form.Label>
              <Form.Select
                value={regionId}
                onChange={(e) => handleCambioRegion(e.target.value)}
                onBlur={() => setTocado((prev) => ({ ...prev, regionId: true }))}
                isValid={tocado.regionId && regionValida}
                isInvalid={tocado.regionId && !regionValida}
              >
                <option value="">Selecciona una región</option>
                {regiones.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.nombre}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Selecciona una región.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Comuna (dependiente de región) */}
          <Col md={6}>
            <Form.Group controlId="comunaUsuario">
              <Form.Label>Comuna</Form.Label>
              <Form.Select
                value={comunaId}
                disabled={!regionId}
                onChange={(e) => setComunaId(e.target.value)}
                onBlur={() => setTocado((prev) => ({ ...prev, comunaId: true }))}
                isValid={tocado.comunaId && comunaValida}
                isInvalid={tocado.comunaId && !comunaValida}
              >
                <option value="">
                  {regionId ? 'Selecciona una comuna' : 'Selecciona una región primero'}
                </option>
                {comunasDisponibles.map((com) => (
                  <option key={com.id} value={com.id}>
                    {com.nombre}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Selecciona una comuna.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Dirección */}
          <Col xs={12}>
            <Form.Group controlId="direccionUsuario">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                maxLength={300}
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                onBlur={() => setTocado((prev) => ({ ...prev, direccion: true }))}
                isValid={tocado.direccion && direccionValida}
                isInvalid={tocado.direccion && !direccionValida}
              />
              <Form.Control.Feedback type="invalid">
                Obligatoria (máximo 300 caracteres).
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex gap-2 mt-4">
          <Button type="submit" className="btn btn-accent">
            Guardar
          </Button>
          <Link to="/admin/usuarios" className="btn btn-outline-light">
            Cancelar
          </Link>
        </div>
      </Form>
    </div>
  )
}
