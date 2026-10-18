import { useCallback } from 'react'
import { FORTEPIANO_KEYS } from '../storage/claves'
import { useColeccion } from '../storage/useColeccion'
import { Producto } from '../types'
import { useTablasMaestras } from './useTablasMaestras'

/**
 * Hook para gestionar los productos, filtros de catálogo y destacados.
 */
export function useProductos() {
  const { datos: productos, guardar, recargar } = useColeccion<Producto>(FORTEPIANO_KEYS.productos)
  const { obtenerNombreCategoria } = useTablasMaestras()

  const obtenerProducto = useCallback(
    (codigo: string): Producto | undefined => {
      return productos.find((p) => p.codigo === codigo)
    },
    [productos]
  )

  const destacados = useCallback(
    (cantidad = 5): Producto[] => {
      return productos.filter((p) => p.estado === 'Activo').slice(0, cantidad)
    },
    [productos]
  )

  const filtrarProductos = useCallback(
    (texto?: string, categoriaId?: number | string): Producto[] => {
      let resultado = productos.filter((p) => p.estado === 'Activo')

      if (texto && texto.trim().length > 0) {
        const query = texto.toLowerCase().trim()
        resultado = resultado.filter((p) => p.nombre.toLowerCase().includes(query))
      }

      if (categoriaId != null && categoriaId !== '') {
        const catIdNum = Number(categoriaId)
        resultado = resultado.filter((p) => p.categoriaId === catIdNum)
      }

      return resultado
    },
    [productos]
  )

  const guardarProducto = useCallback(
    (producto: Producto) => {
      guardar((prev) => {
        const index = prev.findIndex((p) => p.codigo === producto.codigo)
        if (index >= 0) {
          const actualizados = [...prev]
          actualizados[index] = producto
          return actualizados
        }
        return [...prev, producto]
      })
    },
    [guardar]
  )

  const eliminarProducto = useCallback(
    (codigo: string) => {
      guardar((prev) => prev.filter((p) => p.codigo !== codigo))
    },
    [guardar]
  )

  return {
    productos,
    destacados,
    obtenerProducto,
    filtrarProductos,
    guardarProducto,
    eliminarProducto,
    obtenerNombreCategoria,
    recargar
  }
}

export default useProductos
