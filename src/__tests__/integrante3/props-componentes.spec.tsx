import { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../../context/CartContext'
import { NewsCard } from '../../components/common/NewsCard'
import { ProductCard } from '../../components/common/ProductCard'
import { DataTable } from '../../components/common/DataTable'
import { Noticia, Producto } from '../../types'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('Pruebas de Props en Componentes React (Jasmine + Karma)', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    localStorage.clear()
    localStorage.setItem('fortepiano_categorias', JSON.stringify([{ id: 1, nombre: 'Guitarras y Bajos' }]))
    localStorage.setItem('fortepiano_carrito', JSON.stringify([]))
  })

  afterEach(async () => {
    if (root) {
      await act(async () => {
        root.unmount()
      })
    }
    if (container && container.parentNode) {
      document.body.removeChild(container)
    }
    localStorage.clear()
  })

  // Test 1: Props en NewsCard
  it('NewsCard debe recibir props "noticia" y renderizar título, fecha, resumen y enlace slug en el DOM', async () => {
    const mockNoticia: Noticia = {
      id: 101,
      titulo: 'Nueva Guitarra Fender Stratocaster',
      resumen: 'Lanzamiento exclusivo en Forte & Piano con pastillas vintage.',
      imagen: 'noticia1.jpg',
      fecha: '26 de Octubre, 2026',
      slug: 'nueva-stratocaster-2026'
    }

    await act(async () => {
      root.render(
        <MemoryRouter>
          <NewsCard noticia={mockNoticia} />
        </MemoryRouter>
      )
    })

    expect(container.textContent).toContain('Nueva Guitarra Fender Stratocaster')
    expect(container.textContent).toContain('26 de Octubre, 2026')
    expect(container.textContent).toContain('Lanzamiento exclusivo en Forte & Piano')

    const link = container.querySelector('a[href="/blog/nueva-stratocaster-2026"]')
    expect(link).not.toBeNull()
  })

  // Test 2: Props en ProductCard con Stock Normal
  it('ProductCard debe recibir prop "producto" y renderizar nombre, precio y stock normal', async () => {
    const mockProducto: Producto = {
      codigo: 'GUI-TEST-01',
      nombre: 'Guitarra Acústica Yamaha F310',
      descripcion: 'Guitarra con excelente sonido',
      precio: 189990,
      stock: 12,
      stockCritico: 3,
      categoriaId: 1,
      imagen: 'f310.jpg',
      estado: 'Activo'
    }

    await act(async () => {
      root.render(
        <MemoryRouter>
          <CartProvider>
            <ProductCard producto={mockProducto} />
          </CartProvider>
        </MemoryRouter>
      )
    })

    expect(container.textContent).toContain('Guitarra Acústica Yamaha F310')
    expect(container.textContent).toContain('$189.990')
    expect(container.textContent).toContain('Stock: 12')
    expect(container.textContent).not.toContain('Stock Crítico')
  })

  // Test 3: Props condicionales en ProductCard cuando el stock es crítico
  it('ProductCard debe reaccionar a la prop "producto" renderizando badge de advertencia cuando stock <= stockCritico', async () => {
    const mockCritico: Producto = {
      codigo: 'GUI-TEST-02',
      nombre: 'Bajo Ibanez GSR200',
      descripcion: 'Bajo de 4 cuerdas activo',
      precio: 249990,
      stock: 2,
      stockCritico: 4,
      categoriaId: 1,
      imagen: 'gsr200.jpg',
      estado: 'Activo'
    }

    await act(async () => {
      root.render(
        <MemoryRouter>
          <CartProvider>
            <ProductCard producto={mockCritico} />
          </CartProvider>
        </MemoryRouter>
      )
    })

    expect(container.textContent).toContain('Bajo Ibanez GSR200')
    expect(container.textContent).toContain('¡Stock Crítico: 2!')
  })

  // Test 4: Props en DataTable (filas, columnas, filaKey)
  it('DataTable debe recibir props "filas" y "columnas" y renderizar la tabla dinámica en el DOM', async () => {
    interface InstrumentoDemo {
      codigo: string
      nombre: string
      precio: number
    }

    const mockFilas: InstrumentoDemo[] = [
      { codigo: 'TEC-001', nombre: 'Teclado Casio CT-S300', precio: 149990 },
      { codigo: 'PER-002', nombre: 'Batería Roland TD-02K', precio: 399990 }
    ]

    const mockColumnas = [
      { encabezado: 'Código', render: (f: InstrumentoDemo) => f.codigo },
      { encabezado: 'Instrumento', render: (f: InstrumentoDemo) => f.nombre },
      { encabezado: 'Precio', render: (f: InstrumentoDemo) => `$${f.precio}` }
    ]

    await act(async () => {
      root.render(
        <DataTable<InstrumentoDemo>
          filas={mockFilas}
          columnas={mockColumnas}
          filaKey={(f) => f.codigo}
        />
      )
    })

    expect(container.textContent).toContain('Teclado Casio CT-S300')
    expect(container.textContent).toContain('TEC-001')
    expect(container.textContent).toContain('$149990')
    expect(container.textContent).toContain('Batería Roland TD-02K')
    expect(container.textContent).toContain('PER-002')
    expect(container.textContent).toContain('$399990')
  })
})
