import { useCallback } from 'react'
import { productosApi } from '../services/api'
import type { Producto } from '../types'
import { useApiLista } from './useApiLista'
import { useTablasMaestras } from './useTablasMaestras'

/**
 * Hook para gestionar los productos del catálogo.
 * Los datos se obtienen desde GET /api/v1/productos (MySQL), nunca desde localStorage.
 */
export function useProductos() {
  const { datos: productos, cargando, error, recargar, setDatos } = useApiLista<Producto>(
    () => productosApi.listar()
  )
  const { obtenerNombreCategoria } = useTablasMaestras()

  const obtenerProducto = useCallback(
    (codigo: string): Producto | undefined => productos.find((p) => p.codigo === codigo),
    [productos]
  )

  const destacados = useCallback(
    (cantidad = 5): Producto[] => productos.filter((p) => p.estado === 'Activo').slice(0, cantidad),
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
    async (producto: Producto, esEdicion?: boolean): Promise<Producto | null> => {
      try {
        const existe =
          esEdicion !== undefined
            ? esEdicion
            : productos.some((p) => p.codigo === producto.codigo)
        const guardado = existe
          ? await productosApi.actualizar(producto.codigo, producto)
          : await productosApi.crear(producto)

        setDatos((prev) => {
          const index = prev.findIndex((p) => p.codigo === guardado.codigo)
          if (index >= 0) {
            const actualizados = [...prev]
            actualizados[index] = guardado
            return actualizados
          }
          return [guardado, ...prev]
        })
        return guardado
      } catch {
        return null
      }
    },
    [productos, setDatos]
  )

  const eliminarProducto = useCallback(
    async (codigo: string): Promise<boolean> => {
      try {
        await productosApi.eliminar(codigo)
        setDatos((prev) => prev.filter((p) => p.codigo !== codigo))
        return true
      } catch {
        return false
      }
    },
    [setDatos]
  )

  return {
    productos,
    cargando,
    error,
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
