import { useCallback } from 'react'
import { usuariosApi } from '../services/api'
import type { Usuario } from '../types'
import { limpiarRun, validarRun } from '../utils/validaciones'
import { useApiLista } from './useApiLista'

export interface OpcionesUsuarios {
  /** Si es false no se llama a /usuarios (endpoint exclusivo de ADMIN). */
  activo?: boolean
}

/** Usuarios obtenidos desde /api/v1/usuarios (requiere rol ADMIN). */
export function useUsuarios(opciones: OpcionesUsuarios = {}) {
  const { activo = true } = opciones
  const { datos: usuarios, cargando, error, recargar, setDatos } = useApiLista<Usuario>(
    () => usuariosApi.listar(),
    'usuarios',
    activo
  )

  const obtenerUsuarioPorRun = useCallback(
    (run: string): Usuario | undefined => {
      const limpio = limpiarRun(run)
      return usuarios.find((u) => limpiarRun(u.run) === limpio)
    },
    [usuarios]
  )

  const guardarUsuario = useCallback(
    async (usuario: Usuario): Promise<boolean> => {
      if (!validarRun(usuario.run)) return false

      const runNormalizado = limpiarRun(usuario.run)
      const usuarioNormalizado = { ...usuario, run: runNormalizado }
      const existe = usuarios.some((u) => limpiarRun(u.run) === runNormalizado)

      try {
        const guardado = existe
          ? await usuariosApi.actualizar(runNormalizado, usuarioNormalizado)
          : await usuariosApi.crear(usuarioNormalizado)

        setDatos((prev) => {
          const index = prev.findIndex((u) => limpiarRun(u.run) === runNormalizado)
          if (index >= 0) {
            const actualizados = [...prev]
            actualizados[index] = guardado
            return actualizados
          }
          return [guardado, ...prev]
        })
        return true
      } catch {
        return false
      }
    },
    [usuarios, setDatos]
  )

  const eliminarUsuario = useCallback(
    async (run: string): Promise<boolean> => {
      const runNormalizado = limpiarRun(run)
      try {
        await usuariosApi.eliminar(runNormalizado)
        setDatos((prev) => prev.filter((u) => limpiarRun(u.run) !== runNormalizado))
        return true
      } catch {
        return false
      }
    },
    [setDatos]
  )

  return {
    usuarios,
    cargando,
    error,
    obtenerUsuarioPorRun,
    guardarUsuario,
    eliminarUsuario,
    recargar
  }
}

export default useUsuarios
