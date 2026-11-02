import { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { NewsCard } from '../../components/common/NewsCard'
import { Noticia } from '../../types'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('Tests Varios - 2. Categoría: PROPS', () => {
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

  it('Debe recibir la prop "noticia" en NewsCard y mostrar su título, fecha y resumen', async () => {
    // 1. Preparar los datos que enviaremos por props
    const noticiaDePrueba: Noticia = {
      id: 1,
      titulo: 'Concierto de Piano Clásico en Santiago',
      resumen: 'Evento gratuito para estudiantes y amantes de la música.',
      imagen: 'blog/piano.webp',
      fecha: '2026-11-02',
      slug: 'concierto-piano'
    }

    // 2. Renderizar el componente pasándole la prop "noticia"
    await act(async () => {
      root.render(
        <MemoryRouter>
          <NewsCard noticia={noticiaDePrueba} />
        </MemoryRouter>
      )
    })

    // 3. Verificar que los datos de la prop se muestran en pantalla
    expect(container.textContent).toContain('Concierto de Piano Clásico en Santiago')
    expect(container.textContent).toContain('2026-11-02')
    expect(container.textContent).toContain('Evento gratuito para estudiantes y amantes de la música.')
  })
})

