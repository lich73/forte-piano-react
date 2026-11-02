import { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../../context/CartContext'
import Productos from '../../pages/Productos'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('Tests Varios - 3. Categoría: STATE (Estado)', () => {
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

  it('Debe actualizar el estado "soloOfertas" en Productos al alternar el botón de filtro', async () => {
    // 1. Renderizar la página de catálogo (estado inicial: soloOfertas = false)
    await act(async () => {
      root.render(
        <MemoryRouter>
          <CartProvider>
            <Productos />
          </CartProvider>
        </MemoryRouter>
      )
    })

    const botonFiltro = container.querySelector('#btnFiltroOfertas') as HTMLButtonElement
    expect(botonFiltro).not.toBeNull()
    expect(botonFiltro.textContent).toContain('Ver productos en oferta')

    // 2. Cambiar el estado interno haciendo clic en el botón (soloOfertas pasa a true)
    await act(async () => {
      botonFiltro.click()
    })

    // 3. Verificar que el nuevo estado actualizó el texto del botón en la interfaz
    expect(botonFiltro.textContent).toContain('Viendo solo ofertas')
  })
})

