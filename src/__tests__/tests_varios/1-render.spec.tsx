import { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('Tests Varios - 1. Categoría: RENDER', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  it('Debe renderizar el componente Footer mostrando el nombre de la tienda y sus enlaces', async () => {
    // 1. Renderizar el componente dentro de un router en memoria
    await act(async () => {
      root.render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      )
    })

    // 2. Comprobar que el elemento <footer> existe y muestra los textos esperados
    const footerElement = container.querySelector('footer')
    expect(footerElement).not.toBeNull()
    expect(container.textContent).toContain('FORTE & PIANO')
    expect(container.textContent).toContain('Tu tienda de música de confianza.')
    expect(container.textContent).toContain('Catálogo')
  })
})
