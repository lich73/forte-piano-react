import { useState, useCallback } from 'react'

/**
 * Hook genérico para sincronizar una colección en localStorage con el estado de React.
 * Proporciona `datos`, `guardar` y `recargar`.
 */
export function useColeccion<T>(clave: string) {
  const [datos, setDatos] = useState<T[]>(() => {
    try {
      const item = localStorage.getItem(clave)
      return item ? (JSON.parse(item) as T[]) : []
    } catch (err) {
      console.error(`Error leyendo colección ${clave} desde localStorage:`, err)
      return []
    }
  })

  const guardar = useCallback(
    (nuevos: T[] | ((prev: T[]) => T[])) => {
      setDatos((prev) => {
        const actualizados = typeof nuevos === 'function' ? (nuevos as (prev: T[]) => T[])(prev) : nuevos
        try {
          localStorage.setItem(clave, JSON.stringify(actualizados))
        } catch (err) {
          console.error(`Error guardando colección ${clave} en localStorage:`, err)
        }
        return actualizados
      })
    },
    [clave]
  )

  const recargar = useCallback(() => {
    try {
      const item = localStorage.getItem(clave)
      if (item) {
        setDatos(JSON.parse(item) as T[])
      } else {
        setDatos([])
      }
    } catch (err) {
      console.error(`Error recargando colección ${clave}:`, err)
    }
  }, [clave])

  return { datos, guardar, recargar }
}

export default useColeccion
