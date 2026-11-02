import React, { createContext, useContext, useState, useEffect } from 'react'
import { FORTEPIANO_KEYS } from '../storage/claves'
import { Sesion, Usuario } from '../types'
import { inicializarDatos } from '../data/seed'
import { limpiarRun } from '../utils/validaciones'

interface LoginResultado {
  exito: boolean
  mensaje?: string
  sesion?: Sesion
}

export interface DatosActualizacionPerfil {
  nombre: string
  apellidos: string
  correo: string
  regionId: number
  comunaId: number
  direccion: string
}

interface AuthContextValue {
  sesion: Sesion | null
  login: (correo: string, password: string) => LoginResultado
  logout: () => void
  actualizarPerfil: (datos: DatosActualizacionPerfil) => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(() => {
    try {
      const sesionGuardada = localStorage.getItem(FORTEPIANO_KEYS.sesion)
      return sesionGuardada ? (JSON.parse(sesionGuardada) as Sesion) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    inicializarDatos()
  }, [])

  const login = (correo: string, password: string): LoginResultado => {
    const rawUsuarios = localStorage.getItem(FORTEPIANO_KEYS.usuarios)
    const usuarios: Usuario[] = rawUsuarios ? JSON.parse(rawUsuarios) : []

    const correoNormalizado = correo.toLowerCase().trim()
    const usuario = usuarios.find(
      (u) => u.correo.toLowerCase().trim() === correoNormalizado && u.password === password
    )

    if (!usuario) {
      return {
        exito: false,
        mensaje: 'El correo o la contrasena no coinciden.'
      }
    }

    if (usuario.estado === 'Inactivo') {
      return {
        exito: false,
        mensaje: 'Tu cuenta se encuentra deshabilitada. Contacta a un administrador.'
      }
    }

    const nuevaSesion: Sesion = {
      run: usuario.run,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
      rolId: usuario.rolId
    }

    localStorage.setItem(FORTEPIANO_KEYS.sesion, JSON.stringify(nuevaSesion))
    setSesion(nuevaSesion)

    return {
      exito: true,
      sesion: nuevaSesion
    }
  }

  const logout = () => {
    localStorage.removeItem(FORTEPIANO_KEYS.sesion)
    setSesion(null)
  }

  const actualizarPerfil = (datos: DatosActualizacionPerfil): boolean => {
    if (!sesion) return false
    try {
      const rawUsuarios = localStorage.getItem(FORTEPIANO_KEYS.usuarios)
      const usuarios: Usuario[] = rawUsuarios ? JSON.parse(rawUsuarios) : []
      const runObjetivo = limpiarRun(sesion.run)

      const actualizados = usuarios.map((u) => {
        if (limpiarRun(u.run) === runObjetivo) {
          return {
            ...u,
            nombre: datos.nombre.trim(),
            apellidos: datos.apellidos.trim(),
            correo: datos.correo.trim(),
            regionId: Number(datos.regionId),
            comunaId: Number(datos.comunaId),
            direccion: datos.direccion.trim()
          }
        }
        return u
      })

      localStorage.setItem(FORTEPIANO_KEYS.usuarios, JSON.stringify(actualizados))
      window.dispatchEvent(
        new CustomEvent('fortepiano_storage_change', {
          detail: { clave: FORTEPIANO_KEYS.usuarios }
        })
      )

      const nuevaSesion: Sesion = {
        ...sesion,
        nombre: datos.nombre.trim(),
        apellidos: datos.apellidos.trim(),
        correo: datos.correo.trim()
      }
      localStorage.setItem(FORTEPIANO_KEYS.sesion, JSON.stringify(nuevaSesion))
      setSesion(nuevaSesion)
      return true
    } catch {
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ sesion, login, logout, actualizarPerfil }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
