import { useCallback } from 'react'
import { FORTEPIANO_KEYS } from '../storage/claves'
import { useColeccion } from '../storage/useColeccion'
import { Usuario } from '../types'
import { limpiarRun } from '../utils/validaciones'

/**
 * Hook para consultar y gestionar los usuarios del sistema.
 */
export function useUsuarios() {
  const { datos: usuarios, guardar, recargar } = useColeccion<Usuario>(FORTEPIANO_KEYS.usuarios)

  const obtenerUsuarioPorRun = useCallback(
    (run: string): Usuario | undefined => {
      const limpio = limpiarRun(run)
      return usuarios.find((u) => limpiarRun(u.run) === limpio)
    },
    [usuarios]
  )

  const guardarUsuario = useCallback(
    (usuario: Usuario) => {
      guardar((prev) => {
        const runNormalizado = limpiarRun(usuario.run)
        const usuarioNormalizado = { ...usuario, run: runNormalizado }
        const index = prev.findIndex((u) => limpiarRun(u.run) === runNormalizado)
        if (index >= 0) {
          const actualizados = [...prev]
          actualizados[index] = usuarioNormalizado
          return actualizados
        }
        return [...prev, usuarioNormalizado]
      })
    },
    [guardar]
  )

  const eliminarUsuario = useCallback(
    (run: string) => {
      const runNormalizado = limpiarRun(run)
      guardar((prev) => prev.filter((u) => limpiarRun(u.run) !== runNormalizado))
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
