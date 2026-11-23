import { FORTEPIANO_KEYS } from '../storage/claves'

/**
 * URL base del Backend en Spring Boot.
 * Por defecto apunta a http://localhost:8080/api/v1 (configurable mediante VITE_API_URL en .env).
 */
export const API_BASE_URL: string =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL ||
  'http://localhost:8080/api/v1'

export function obtenerTokenJwt(): string | null {
  return localStorage.getItem(FORTEPIANO_KEYS.jwtToken)
}

export function guardarTokenJwt(token: string): void {
  localStorage.setItem(FORTEPIANO_KEYS.jwtToken, token)
}

export function eliminarTokenJwt(): void {
  localStorage.removeItem(FORTEPIANO_KEYS.jwtToken)
}

export interface ApiErrorResponse {
  mensaje?: string
  message?: string
  error?: string
  status?: number
}

/**
 * Cliente HTTP centralizado para comunicarse con la API REST de Spring Boot (/api/v1/...).
 * Adjunta automáticamente el encabezado Authorization: Bearer <token> si existe sesión activa.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = obtenerTokenJwt()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {})
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (!response.ok) {
    if (response.status === 401) {
      eliminarTokenJwt()
    }
    const errorData: ApiErrorResponse = await response.json().catch(() => ({}))
    const mensajeError =
      errorData.mensaje ||
      errorData.message ||
      errorData.error ||
      `Error HTTP ${response.status} al comunicarse con el servidor.`
    throw new Error(mensajeError)
  }

  if (response.status === 204) {
    return undefined as unknown as T
  }

  return (await response.json()) as T
}

export const apiClient = {
  get: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body: unknown) =>
    apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body?: unknown) =>
    apiFetch<T>(endpoint, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined
    }),
  delete: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: 'DELETE' })
}
