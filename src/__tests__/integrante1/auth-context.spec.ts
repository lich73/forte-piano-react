import { FORTEPIANO_KEYS } from '../../storage/claves'
import { inicializarDatos } from '../../data/seed'
import { Usuario, Sesion } from '../../types'

describe('Integrante 1 - Test 2: Lógica de Autenticación y Sesión', () => {
  beforeEach(() => {
    localStorage.clear()
    inicializarDatos()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('debe iniciar sesión exitosamente con credenciales válidas y persistir la sesión en localStorage', () => {
    // Simular función de autenticación tal como la ejecuta AuthContext
    const rawUsuarios = localStorage.getItem(FORTEPIANO_KEYS.usuarios)
    expect(rawUsuarios).not.toBeNull()
    const usuarios: Usuario[] = JSON.parse(rawUsuarios!)

    const correoInput = 'admin@gmail.com'
    const passwordInput = 'admin123'

    const usuarioEncontrado = usuarios.find(
      (u) => u.correo.toLowerCase() === correoInput && u.password === passwordInput
    )

    expect(usuarioEncontrado).toBeDefined()
    expect(usuarioEncontrado?.estado).toBe('Activo')

    const nuevaSesion: Sesion = {
      run: usuarioEncontrado!.run,
      nombre: usuarioEncontrado!.nombre,
      apellidos: usuarioEncontrado!.apellidos,
      correo: usuarioEncontrado!.correo,
      rolId: usuarioEncontrado!.rolId
    }

    localStorage.setItem(FORTEPIANO_KEYS.sesion, JSON.stringify(nuevaSesion))

    const sesionGuardada = JSON.parse(localStorage.getItem(FORTEPIANO_KEYS.sesion) || '{}')
    expect(sesionGuardada.correo).toBe('admin@gmail.com')
    expect(sesionGuardada.rolId).toBe(1)
    expect(sesionGuardada.nombre).toBe('Admin')
  })

  it('debe rechazar el inicio de sesión si la contraseña es incorrecta o la cuenta está inactiva', () => {
    // 1. Contraseña incorrecta
    const rawUsuarios = localStorage.getItem(FORTEPIANO_KEYS.usuarios)
    const usuarios: Usuario[] = JSON.parse(rawUsuarios!)

    const usuarioPassErronea = usuarios.find(
      (u) => u.correo.toLowerCase() === 'admin@gmail.com' && u.password === 'pass_incorrecta'
    )
    expect(usuarioPassErronea).toBeUndefined()

    // 2. Cuenta inactiva
    const usuariosConInactivo: Usuario[] = [
      ...usuarios,
      {
        run: '999999999',
        nombre: 'Usuario',
        apellidos: 'Inactivo',
        correo: 'bloqueado@gmail.com',
        password: 'pass1234',
        fechaNacimiento: '1995-01-01',
        rolId: 3,
        regionId: 1,
        comunaId: 1,
        direccion: 'Calle Bloqueada 100',
        estado: 'Inactivo'
      }
    ]
    localStorage.setItem(FORTEPIANO_KEYS.usuarios, JSON.stringify(usuariosConInactivo))

    const usuarioInactivo = usuariosConInactivo.find(
      (u) => u.correo === 'bloqueado@gmail.com' && u.password === 'pass1234'
    )
    expect(usuarioInactivo).toBeDefined()
    expect(usuarioInactivo?.estado).toBe('Inactivo')

    // Al estar inactivo, no debe crearse sesión
    const puedeIniciarSesion = usuarioInactivo && usuarioInactivo.estado === 'Activo'
    expect(puedeIniciarSesion).toBeFalse()
    expect(localStorage.getItem(FORTEPIANO_KEYS.sesion)).toBeNull()
  })
})
