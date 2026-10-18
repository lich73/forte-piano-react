import { FORTEPIANO_KEYS } from '../storage/claves'
import { useColeccion } from '../storage/useColeccion'
import { Categoria, Region, Comuna, Rol } from '../types'

/**
 * Hook para consultar las tablas maestras del sistema:
 * Categorías, Regiones, Comunas y Roles.
 */
export function useTablasMaestras() {
  const { datos: categorias } = useColeccion<Categoria>(FORTEPIANO_KEYS.categorias)
  const { datos: regiones } = useColeccion<Region>(FORTEPIANO_KEYS.regiones)
  const { datos: comunas } = useColeccion<Comuna>(FORTEPIANO_KEYS.comunas)
  const { datos: roles } = useColeccion<Rol>(FORTEPIANO_KEYS.roles)

  const obtenerNombreCategoria = (categoriaId: number | string): string => {
    const cat = categorias.find((c) => c.id === Number(categoriaId))
    return cat ? cat.nombre : 'Sin categoría'
  }

  const obtenerNombreRol = (rolId: number | string): string => {
    const rol = roles.find((r) => r.id === Number(rolId))
    return rol ? rol.nombre : ''
  }

  const obtenerComunasPorRegion = (regionId: number | string): Comuna[] => {
    return comunas.filter((c) => c.regionId === Number(regionId))
  }

  return {
    categorias,
    regiones,
    comunas,
    roles,
    obtenerNombreCategoria,
    obtenerNombreRol,
    obtenerComunasPorRegion
  }
}

export default useTablasMaestras
