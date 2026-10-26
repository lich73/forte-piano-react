import { useState, useCallback, useEffect } from 'react'

/**
 * Hook genérico para sincronizar una colección en localStorage con el estado de React.
 * Proporciona `datos`, `guardar` y `recargar` en tiempo real.
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

  const guardar = useCallback(
    (nuevos: T[] | ((prev: T[]) => T[])) => {
      setDatos((prev) => {
        const actualizados = typeof nuevos === 'function' ? (nuevos as (prev: T[]) => T[])(prev) : nuevos
        try {
          localStorage.setItem(clave, JSON.stringify(actualizados))
          // Notificar a todos los componentes de la aplicación en tiempo real
          window.dispatchEvent(
            new CustomEvent('fortepiano_storage_change', { detail: { clave } })
          )
        } catch (err) {
          console.error(`Error guardando colección ${clave} en localStorage:`, err)
        }
        return actualizados
      })
    },
    [clave]
  )

  useEffect(() => {
    const handleStorage = (e: Event) => {
      if (e instanceof StorageEvent) {
        if (e.key === clave || e.key === null) {
          recargar()
        }
      } else if (e.type === 'fortepiano_storage_change') {
        const customEv = e as CustomEvent<{ clave?: string }>
        if (!customEv.detail || customEv.detail.clave === clave) {
          recargar()
        }
      }
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('fortepiano_storage_change', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('fortepiano_storage_change', handleStorage)
    }
  }, [clave, recargar])

  return { datos, guardar, recargar }
}

export default useColeccion
