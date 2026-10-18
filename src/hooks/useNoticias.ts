import { useCallback } from 'react'
import { FORTEPIANO_KEYS } from '../storage/claves'
import { useColeccion } from '../storage/useColeccion'
import { Noticia } from '../types'

/**
 * Hook para consultar y gestionar las noticias del blog.
 */
export function useNoticias() {
  const { datos: noticias, guardar, recargar } = useColeccion<Noticia>(FORTEPIANO_KEYS.blog)

  const ultimas = useCallback(
    (cantidad = 3): Noticia[] => {
      return noticias.slice(0, cantidad)
    },
    [noticias]
  )

  const obtenerNoticia = useCallback(
    (slug: string): Noticia | undefined => {
      return noticias.find((n) => n.slug === slug)
    },
    [noticias]
  )

  return {
    noticias,
    ultimas,
    obtenerNoticia,
    guardar,
    recargar
  }
}

export default useNoticias
