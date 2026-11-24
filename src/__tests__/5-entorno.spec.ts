import { FORTEPIANO_KEYS } from '../storage/claves'

describe('Tests Varios - 5. Categoría: TEST ENTORNO', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('Debe verificar que el entorno del navegador (window, document, localStorage) está disponible', () => {
    expect(typeof window).toBe('object')
    expect(typeof document).toBe('object')
    expect(typeof localStorage).toBe('object')
  })

  it('Debe permitir en localStorage solo las claves de carrito, sesión y JWT', () => {
    const clavesPermitidas: string[] = [
      'fortepiano_carrito',
      'fortepiano_sesion',
      'fortepiano_jwt_token'
    ]

    const clavesActuales: string[] = [...Object.values(FORTEPIANO_KEYS)]

    expect(clavesActuales.sort()).toEqual(clavesPermitidas.sort())
  })

  it('No debe sembrar datos de dominio en localStorage', () => {
    // Los datos de dominio viven en MySQL y se leen desde /api/v1.
    const clavesProhibidas = [
      'fortepiano_usuarios',
      'fortepiano_productos',
      'fortepiano_categorias',
      'fortepiano_regiones',
      'fortepiano_comunas',
      'fortepiano_roles',
      'fortepiano_boletas',
      'fortepiano_blog',
      'fortepiano_contactos'
    ]

    clavesProhibidas.forEach((clave) => {
      expect(localStorage.getItem(clave)).toBeNull()
    })
  })
})
