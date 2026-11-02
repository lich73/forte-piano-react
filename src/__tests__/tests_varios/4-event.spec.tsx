import { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../../context/CartContext'
import { ProductCard } from '../../components/common/ProductCard'
import { inicializarDatos, PRODUCTOS_INICIALES } from '../../data/seed'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('Tests Varios - 4. Categoría: EVENT (Eventos)', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    localStorage.clear()
    inicializarDatos()
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
    // 1. Tomar un producto inicial del catálogo (Yamaha P-45 Negro, código PD-001)
    const productoDemo = PRODUCTOS_INICIALES.find((p) => p.codigo === 'PD-001')!

    await act(async () => {
      root.render(
        <MemoryRouter>
          <CartProvider>
            <ProductCard producto={productoDemo} />
          </CartProvider>
        </MemoryRouter>
      )
    })

    // 2. Disparar el evento click sobre el botón de añadir al carrito
    const botonAgregar = container.querySelector('button[title="Añadir al carrito"]') as HTMLButtonElement
    expect(botonAgregar).not.toBeNull()

    await act(async () => {
      botonAgregar.click()
    })

    // 3. Verificar que el evento agregó el producto al carrito en localStorage
    const carritoGuardado = JSON.parse(localStorage.getItem('fortepiano_carrito') || '[]')
    expect(carritoGuardado.length).toBe(1)
    expect(carritoGuardado[0].codigo).toBe('PD-001')
    expect(carritoGuardado[0].cantidad).toBe(1)
  })
})
