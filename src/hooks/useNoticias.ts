import { useCallback } from 'react'
import { noticiasApi } from '../services/api'
import type { Noticia } from '../types'
import { useApiLista } from './useApiLista'

/** Noticias del blog obtenidas desde GET /api/v1/noticias. */
export function useNoticias() {
  const { datos: noticias, cargando, error, recargar } = useApiLista<Noticia>(() =>
    noticiasApi.listar()
  )

  const ultimas = useCallback(
    (cantidad = 3): Noticia[] => noticias.slice(0, cantidad),
    [noticias]
  )

  const obtenerNoticia = useCallback(
    (slug: string): Noticia | undefined => noticias.find((n) => n.slug === slug),
    [noticias]
  )

  return { noticias, cargando, error, ultimas, obtenerNoticia, recargar }
}

export default useNoticias
