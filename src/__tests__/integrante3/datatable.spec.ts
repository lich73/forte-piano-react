import React, { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import DataTable, { Columna } from '../../components/common/DataTable'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

interface InstrumentoPrueba {
  id: string
  nombre: string
  categoria: string
  precio: number
}

describe('Integrante 3 - Test 5: Componente DataTable (Búsqueda y Ordenación)', () => {
  let container: HTMLDivElement
  let root: Root

  const datosPrueba: InstrumentoPrueba[] = [
    { id: '1', nombre: 'Piano de Cola Steinway', categoria: 'Acústico', precio: 25000000 },
    { id: '2', nombre: 'Guitarra Eléctrica Fender', categoria: 'Cuerda', precio: 850000 },
    { id: '3', nombre: 'Teclado Digital Roland', categoria: 'Digital', precio: 620000 },
    { id: '4', nombre: 'Batería Acústica Yamaha', categoria: 'Percusión', precio: 1200000 }
  ]

  const columnasPrueba: Columna<InstrumentoPrueba>[] = [
    {
      encabezado: 'Nombre',
      render: (fila) => fila.nombre,
      ordenarPor: (fila) => fila.nombre
    },
    {
      encabezado: 'Categoría',
      render: (fila) => fila.categoria,
      ordenarPor: (fila) => fila.categoria
    },
    {
      encabezado: 'Precio',
      render: (fila) => `$${fila.precio}`,
      ordenarPor: (fila) => fila.precio
    }
  ]

  const cambiarValorInput = (input: HTMLInputElement, valor: string) => {
    const propDescriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
    if (propDescriptor && propDescriptor.set) {
      propDescriptor.set.call(input, valor)
    } else {
      input.value = valor
    }
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => {
      root.unmount()
    })
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })

  it('1. El filtro de búsqueda por texto debe reducir la lista de registros a solo aquellos que coincidan con el término ingresado', async () => {
    await act(async () => {
      root.render(
        React.createElement(DataTable<InstrumentoPrueba>, {
          filas: datosPrueba,
          columnas: columnasPrueba,
          filaKey: (fila) => fila.id,
          itemsPorPaginaInicial: 10
        })
      )
    })

    // Inicialmente se deben listar los 4 registros en la tabla
    let filasRenderizadas = container.querySelectorAll('tbody tr')
    expect(filasRenderizadas.length).toBe(4)

    const inputBusqueda = container.querySelector('input[type="search"]') as HTMLInputElement
    expect(inputBusqueda).not.toBeNull()

    // Filtrar por término específico que coincide con 1 elemento: "Fender"
    await act(async () => {
      cambiarValorInput(inputBusqueda, 'Fender')
    })

    filasRenderizadas = container.querySelectorAll('tbody tr')
    expect(filasRenderizadas.length).toBe(1)
    expect(filasRenderizadas[0].textContent).toContain('Guitarra Eléctrica Fender')

    // Filtrar por término que no existe
    await act(async () => {
      cambiarValorInput(inputBusqueda, 'Violín Inexistente')
    })

    filasRenderizadas = container.querySelectorAll('tbody tr')
    expect(filasRenderizadas.length).toBe(1)
    expect(filasRenderizadas[0].textContent).toContain('Sin resultados encontrados')

    // Al limpiar la búsqueda debe restablecer los registros completos
    await act(async () => {
      cambiarValorInput(inputBusqueda, '')
    })

    filasRenderizadas = container.querySelectorAll('tbody tr')
    expect(filasRenderizadas.length).toBe(4)
  })

  it('2. El ordenamiento por columna debe alternar ascendentemente y descendentemente según la columna seleccionada', async () => {
    await act(async () => {
      root.render(
        React.createElement(DataTable<InstrumentoPrueba>, {
          filas: datosPrueba,
          columnas: columnasPrueba,
          filaKey: (fila) => fila.id,
          itemsPorPaginaInicial: 10
        })
      )
    })

    // Localizar el encabezado "Nombre" (índice 0)
    const encabezados = container.querySelectorAll('thead th')
    const thNombre = encabezados[0] as HTMLTableCellElement
    expect(thNombre.textContent).toContain('Nombre')

    // Primer clic: Orden ascendente ('asc') por Nombre
    // Alfabético: Batería -> Guitarra -> Piano -> Teclado
    await act(async () => {
      thNombre.click()
    })

    let celdasPrimerColumna = Array.from(container.querySelectorAll('tbody tr td:first-child')).map(
      (td) => td.textContent?.trim()
    )

    expect(celdasPrimerColumna[0]).toBe('Batería Acústica Yamaha')
    expect(celdasPrimerColumna[1]).toBe('Guitarra Eléctrica Fender')
    expect(celdasPrimerColumna[2]).toBe('Piano de Cola Steinway')
    expect(celdasPrimerColumna[3]).toBe('Teclado Digital Roland')

    // Segundo clic en el mismo encabezado: Orden descendente ('desc') por Nombre
    // Alfabético inverso: Teclado -> Piano -> Guitarra -> Batería
    await act(async () => {
      thNombre.click()
    })

    celdasPrimerColumna = Array.from(container.querySelectorAll('tbody tr td:first-child')).map(
      (td) => td.textContent?.trim()
    )

    expect(celdasPrimerColumna[0]).toBe('Teclado Digital Roland')
    expect(celdasPrimerColumna[1]).toBe('Piano de Cola Steinway')
    expect(celdasPrimerColumna[2]).toBe('Guitarra Eléctrica Fender')
    expect(celdasPrimerColumna[3]).toBe('Batería Acústica Yamaha')
  })
})
