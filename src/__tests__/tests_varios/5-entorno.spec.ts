import { inicializarDatos } from '../../data/seed'
import { FORTEPIANO_KEYS } from '../../storage/claves'

describe('Tests Varios - 5. Categoría: TEST ENTORNO', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('Debe verificar que el entorno del navegador (window, document, localStorage) y la semilla inicial funcionan correctamente', () => {
    // 1. Verificar que los objetos globales del entorno DOM están disponibles
    expect(typeof window).toBe('object')
    expect(typeof document).toBe('object')
    expect(typeof localStorage).toBe('object')

    // 2. Ejecutar la inicialización de datos del entorno de Forte & Piano
    inicializarDatos()

    // 3. Comprobar que las colecciones base se cargaron en localStorage
    const roles = JSON.parse(localStorage.getItem(FORTEPIANO_KEYS.roles) || '[]')
    const productos = JSON.parse(localStorage.getItem(FORTEPIANO_KEYS.productos) || '[]')
    const usuarios = JSON.parse(localStorage.getItem(FORTEPIANO_KEYS.usuarios) || '[]')

    expect(roles.length).toBeGreaterThan(0)
    expect(productos.length).toBeGreaterThan(0)
    expect(usuarios.length).toBeGreaterThan(0)
  })
})

