import { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../context/CartContext'
import { ProductCard } from '../components/common/ProductCard'
import { FORTEPIANO_KEYS } from '../storage/claves'
import type { Producto } from '../types'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

// Producto de prueba local: los datos reales del catálogo vienen de /api/v1.
const PRODUCTO_DEMO: Producto = {
  codigo: 'PD-001',
  nombre: 'Yamaha P-45 Negro',
  descripcion: 'Piano digital de prueba',
  precio: 459990,
  stock: 30,
  stockCritico: 5,
  categoriaId: 2,
  imagen: 'productos/prod-piano-yamaha-p45-negro.webp',
  estado: 'Activo',
  enOferta: false,
  porcentajeDescuento: 0,
  precioOferta: null
}

describe('Tests Varios - 4. Categoría: EVENT (Eventos)', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    localStorage.clear()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => {
      root.unmount()
    })
    container.remove()
    localStorage.clear()
  })

  it('Debe ejecutar el evento onClick del botón "Añadir al carrito" y guardar el producto en el carrito', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <CartProvider productos={[PRODUCTO_DEMO]}>
            <ProductCard producto={PRODUCTO_DEMO} />
          </CartProvider>
        </MemoryRouter>
      )
    })

    // 1. Disparar el evento click sobre el botón de añadir al carrito
    const botonAgregar = container.querySelector('button[title="Añadir al carrito"]') as HTMLButtonElement
    expect(botonAgregar).not.toBeNull()

    await act(async () => {
      botonAgregar.click()
    })

    // 2. Verificar que el evento agregó el producto al carrito en localStorage
    const carritoGuardado = JSON.parse(localStorage.getItem(FORTEPIANO_KEYS.carrito) || '[]')
    expect(carritoGuardado.length).toBe(1)
    expect(carritoGuardado[0].codigo).toBe('PD-001')
    expect(carritoGuardado[0].cantidad).toBe(1)
  })
})
