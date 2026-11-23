import { useCallback, useEffect, useRef, useState } from 'react'
import { mensajeDeError } from '../services/api'

/**
 * Carga una colección desde la API y expone estados de carga/error.
 * `activo = false` evita la petición (útil para endpoints exclusivos de otro rol).
 */
export function useApiLista<T>(cargar: () => Promise<T[]>, clave?: string, activo = true) {
  const cargarRef = useRef(cargar)
  cargarRef.current = cargar

  const [datos, setDatos] = useState<T[]>([])
  const [cargando, setCargando] = useState(activo)
  const [error, setError] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    if (!activo) {
      setDatos([])
      setError(null)
      setCargando(false)
      return
    }

    setCargando(true)
    setError(null)
    try {
      setDatos(await cargarRef.current())
    } catch (e) {
      setDatos([])
      setError(mensajeDeError(e))
    } finally {
      setCargando(false)
    }
  }, [clave, activo])

  useEffect(() => {
    void recargar()
  }, [recargar])

  return { datos, cargando, error, recargar, setDatos }
}

export default useApiLista
