import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  authApi,
  eliminarSesion,
  eliminarTokenJwt,
  guardarSesion,
  guardarTokenJwt,
  mensajeDeError,
  obtenerSesionGuardada,
  obtenerTokenJwt
} from '../services/api'
import type { RegistroRequest, Sesion } from '../types'

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
  cargando: boolean
  login: (correo: string, password: string) => Promise<LoginResultado>
  registro: (datos: RegistroRequest) => Promise<LoginResultado>
  logout: () => void
  actualizarPerfil: (datos: DatosActualizacionPerfil) => Promise<boolean>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Una sesión guardada sin JWT es residue de la versión anterior (localStorage-only).
  // No debe dar acceso a la app: se descarta antes del primer render.
  const [sesion, setSesion] = useState<Sesion | null>(() =>
    obtenerTokenJwt() ? obtenerSesionGuardada() : null
  )
  const [cargando, setCargando] = useState(() => Boolean(obtenerTokenJwt()))

  const aplicarSesion = (nuevaSesion: Sesion) => {
    guardarSesion(nuevaSesion)
    setSesion(nuevaSesion)
  }

  const cerrarSesion = () => {
    eliminarTokenJwt()
    eliminarSesion()
    setSesion(null)
  }

  // Al recargar (F5) se valida el JWT contra /auth/me en lugar de confiar en localStorage.
  useEffect(() => {
    const alExpirar = () => cerrarSesion()
    window.addEventListener('fortepiano_sesion_expirada', alExpirar)

    if (!obtenerTokenJwt()) {
      // Limpia la sesión huérfana para que no aparezca como "logueado" en la UI.
      cerrarSesion()
      setCargando(false)
      return () => window.removeEventListener('fortepiano_sesion_expirada', alExpirar)
    }

    let activo = true
    authApi
      .me()
      .then((datos) => {
        if (activo) aplicarSesion(datos)
      })
      .catch(() => {
        if (activo) cerrarSesion()
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
      window.removeEventListener('fortepiano_sesion_expirada', alExpirar)
    }
  }, [])

  const login = async (correo: string, password: string): Promise<LoginResultado> => {
    try {
      const respuesta = await authApi.login(correo, password)
      if (!respuesta.exito || !respuesta.token || !respuesta.sesion) {
        return { exito: false, mensaje: respuesta.mensaje || 'No fue posible iniciar sesión.' }
      }
      guardarTokenJwt(respuesta.token)
      aplicarSesion(respuesta.sesion)
      return { exito: true, sesion: respuesta.sesion }
    } catch (e) {
      const mensaje = mensajeDeError(e)
      if (mensaje.toLowerCase().includes('inactiva') || mensaje.toLowerCase().includes('deshabilitada')) {
        return { exito: false, mensaje: 'Tu cuenta se encuentra deshabilitada. Contacta a un administrador.' }
      }
      return { exito: false, mensaje }
    }
  }

  const registro = async (datos: RegistroRequest): Promise<LoginResultado> => {
    try {
      const respuesta = await authApi.registro(datos)
      if (respuesta.token && respuesta.sesion) {
        guardarTokenJwt(respuesta.token)
        aplicarSesion(respuesta.sesion)
      }
      return {
        exito: true,
        sesion: respuesta.sesion,
        mensaje: respuesta.mensaje || 'Usuario registrado correctamente.'
      }
    } catch (e) {
      return { exito: false, mensaje: mensajeDeError(e) }
    }
  }

  const logout = () => cerrarSesion()

  const actualizarPerfil = async (datos: DatosActualizacionPerfil): Promise<boolean> => {
    try {
      const actualizada = await authApi.actualizarPerfil(datos)
      aplicarSesion(actualizada)
      return true
    } catch {
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{ sesion, cargando, login, registro, logout, actualizarPerfil }}
    >
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
