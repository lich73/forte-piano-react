import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { catalogosApi, mensajeDeError } from '../services/api'
import type { Categoria, Comuna, Region, Rol } from '../types'

/**
 * Caché compartida de tablas maestras. Sin ella, cada ProductCard hacía
 * sus propios 4 GET: con 8 tarjetas eso significaba ~32 peticiones idénticas.
 */
type ClaveTabla = 'categorias' | 'regiones' | 'comunas' | 'roles'

interface EstadoTabla {
  datos: unknown[]
  cargando: boolean
  error: string | null
  cargada: boolean
}

const estadoInicial = (): EstadoTabla => ({
  datos: [],
  cargando: false,
  error: null,
  cargada: false
})

const estados: Record<ClaveTabla, EstadoTabla> = {
  categorias: estadoInicial(),
  regiones: estadoInicial(),
  comunas: estadoInicial(),
  roles: estadoInicial()
}

const cargadores: Record<ClaveTabla, () => Promise<unknown[]>> = {
  categorias: () => catalogosApi.categorias(),
  regiones: () => catalogosApi.regiones(),
  comunas: () => catalogosApi.comunas(),
  roles: () => catalogosApi.roles()
}

const claves: ClaveTabla[] = ['categorias', 'regiones', 'comunas', 'roles']
const cargasEnCurso: Partial<Record<ClaveTabla, Promise<void>>> = {}
const suscriptores = new Set<() => void>()

function notificar() {
  suscriptores.forEach((suscriptor) => suscriptor())
}

function suscribir(suscriptor: () => void) {
  suscriptores.add(suscriptor)
  return () => {
    suscriptores.delete(suscriptor)
  }
}

const obtenerInstantanea: Record<ClaveTabla, () => EstadoTabla> = {
  categorias: () => estados.categorias,
  regiones: () => estados.regiones,
  comunas: () => estados.comunas,
  roles: () => estados.roles
}

function cargarTabla(clave: ClaveTabla, forzar = false): Promise<void> {
  const enCurso = cargasEnCurso[clave]
  if (!forzar) {
    if (enCurso) return enCurso
    if (estados[clave].cargada) return Promise.resolve()
  }

  estados[clave] = { ...estados[clave], cargando: true, error: null }
  notificar()

  const promesa = cargadores[clave]()
    .then((datos) => {
      estados[clave] = { datos, cargando: false, error: null, cargada: true }
      notificar()
    })
    .catch((error) => {
      estados[clave] = {
        datos: [],
        cargando: false,
        error: mensajeDeError(error),
        cargada: false
      }
      notificar()
    })

  cargasEnCurso[clave] = promesa
  void promesa.then(() => {
    if (cargasEnCurso[clave] === promesa) {
      delete cargasEnCurso[clave]
    }
  })
  return promesa
}

function recargarTablas() {
  claves.forEach((clave) => {
    void cargarTabla(clave, true)
  })
}

function usarTabla<T>(clave: ClaveTabla) {
  const estado = useSyncExternalStore(suscribir, obtenerInstantanea[clave])

  useEffect(() => {
    void cargarTabla(clave)
  }, [clave])

  return {
    datos: estado.datos as T[],
    cargando: estado.cargando,
    error: estado.error
  }
}

/**
 * Tablas maestras obtenidas desde el backend: categorías, regiones, comunas y roles.
 * Los IDs son los reales de MySQL (por ejemplo, RM = 13), no los de la semilla antigua.
 */
export function useTablasMaestras() {
  const categoriasLista = usarTabla<Categoria>('categorias')
  const regionesLista = usarTabla<Region>('regiones')
  const comunasLista = usarTabla<Comuna>('comunas')
  const rolesLista = usarTabla<Rol>('roles')

  const { datos: categorias } = categoriasLista
  const { datos: regiones } = regionesLista
  const { datos: comunas } = comunasLista
  const { datos: roles } = rolesLista

  const obtenerNombreCategoria = (categoriaId: number | string): string => {
    const cat = categorias.find((c) => c.id === Number(categoriaId))
    return cat ? cat.nombre : 'Sin categoría'
  }

  const obtenerNombreRol = (rolId: number | string): string => {
    const rol = roles.find((r) => r.id === Number(rolId))
    return rol ? rol.nombre : ''
  }

  const obtenerNombreRegion = (regionId: number | string): string => {
    const region = regiones.find((r) => r.id === Number(regionId))
    return region ? region.nombre : '-'
  }

  const obtenerNombreComuna = (comunaId: number | string): string => {
    const comuna = comunas.find((c) => c.id === Number(comunaId))
    return comuna ? comuna.nombre : '-'
  }

  const obtenerComunasPorRegion = (regionId: number | string): Comuna[] =>
    comunas.filter((c) => c.regionId === Number(regionId))

  const guardarCategoria = useCallback(async (nombre: string): Promise<boolean> => {
    try {
      await catalogosApi.crearCategoria(nombre.trim())
      recargarTablas()
      return true
    } catch {
      return false
    }
  }, [])

  const eliminarCategoria = useCallback(async (id: number): Promise<boolean> => {
    try {
      await catalogosApi.eliminarCategoria(id)
      recargarTablas()
      return true
    } catch {
      return false
    }
  }, [])

  return {
    categorias,
    regiones,
    comunas,
    roles,
    cargando:
      categoriasLista.cargando ||
      regionesLista.cargando ||
      comunasLista.cargando ||
      rolesLista.cargando,
    error:
      categoriasLista.error ||
      regionesLista.error ||
      comunasLista.error ||
      rolesLista.error,
    obtenerNombreCategoria,
    obtenerNombreRol,
    obtenerNombreRegion,
    obtenerNombreComuna,
    obtenerComunasPorRegion,
    guardarCategoria,
    eliminarCategoria,
    recargar: recargarTablas
  }
}

export default useTablasMaestras
