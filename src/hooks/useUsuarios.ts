import { useCallback } from 'react'
import { FORTEPIANO_KEYS } from '../storage/claves'
import { useColeccion } from '../storage/useColeccion'
import { Usuario } from '../types'

/**
 * Hook para consultar y gestionar los usuarios del sistema.
 */
export function useUsuarios() {
  const { datos: usuarios, guardar, recargar } = useColeccion<Usuario>(FORTEPIANO_KEYS.usuarios)

  const obtenerUsuarioPorRun = useCallback(
    (run: string): Usuario | undefined => {
      const limpio = run.toUpperCase().trim()
      return usuarios.find((u) => u.run.toUpperCase().trim() === limpio)
    },
    [usuarios]
  )

  const guardarUsuario = useCallback(
    (usuario: Usuario) => {
      guardar((prev) => {
        const runNormalizado = usuario.run.toUpperCase().trim()
        const index = prev.findIndex((u) => u.run.toUpperCase().trim() === runNormalizado)
        if (index >= 0) {
          const actualizados = [...prev]
          actualizados[index] = usuario
          return actualizados
        }
        return [...prev, usuario]
      })
    },
    [guardar]
  )

  const eliminarUsuario = useCallback(
    (run: string) => {
      const runNormalizado = run.toUpperCase().trim()
      guardar((prev) => prev.filter((u) => u.run.toUpperCase().trim() !== runNormalizado))
    },
    [guardar]
  )

  return {
    usuarios,
    obtenerUsuarioPorRun,
    guardarUsuario,
    eliminarUsuario,
    recargar
  }
}

export default useUsuarios
