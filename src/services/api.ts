import { FORTEPIANO_KEYS } from '../storage/claves'
import type {
  ApiErrorDto,
  AuthResponse,
  Boleta,
  Categoria,
  CheckoutRequest,
  Comuna,
  DashboardResumenDto,
  Mensaje,
  Noticia,
  Producto,
  Region,
  RegistroRequest,
  ReintentoPagoRequest,
  Rol,
  Sesion,
  Usuario
} from '../types'

/**
 * URL base del backend Spring Boot.
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

export function guardarSesion(sesion: Sesion): void {
  localStorage.setItem(FORTEPIANO_KEYS.sesion, JSON.stringify(sesion))
}

export function eliminarSesion(): void {
  localStorage.removeItem(FORTEPIANO_KEYS.sesion)
}

export function obtenerSesionGuardada(): Sesion | null {
  try {
    const raw = localStorage.getItem(FORTEPIANO_KEYS.sesion)
    return raw ? (JSON.parse(raw) as Sesion) : null
  } catch {
    return null
  }
}

/** Error enriquecido con el cuerpo devuelto por el backend. */
export class ApiError extends Error {
  readonly status: number
  readonly detalles?: string[]

  constructor(mensaje: string, status: number, detalles?: string[]) {
    super(mensaje)
    this.name = 'ApiError'
    this.status = status
    this.detalles = detalles
  }
}

export function mensajeDeError(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'No fue posible comunicarse con el servidor.'
}

/**
 * Cliente HTTP centralizado. Adjunta el JWT cuando existe y limpia la sesión ante un 401.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = obtenerTokenJwt()
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {})
  }

  // Solo las peticiones con cuerpo necesitan JSON; en GET/DELETE esto evita un
  // preflight CORS innecesario.
  const tieneContentType = Object.keys(headers).some(
    (clave) => clave.toLowerCase() === 'content-type'
  )
  if (options.body !== undefined && !tieneContentType) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  let response: Response
  try {
    response = await fetch(url, { ...options, headers })
  } catch {
    throw new ApiError(
      'No se pudo conectar con el backend. Revisa que esté ejecutándose en ' +
        API_BASE_URL,
      0
    )
  }

  if (!response.ok) {
    // 401 = token inválido; 403 sin token = sesión huérfana del localStorage antiguo.
    // En ambos casos la UI debe volver a pedir login en lugar de seguir "logueada".
    if (response.status === 401 || (response.status === 403 && !token)) {
      eliminarTokenJwt()
      eliminarSesion()
      window.dispatchEvent(new CustomEvent('fortepiano_sesion_expirada'))
    }

    const errorData = (await response.json().catch(() => ({}))) as ApiErrorDto & {
      mensaje?: string
    }
    // Los paréntesis son importantes: sin ellos el operador || gana sobre ?:
    // y cualquier mensaje del backend se reemplazaba por el texto de sesión.
    const mensaje =
      errorData.message ||
      errorData.mensaje ||
      errorData.error ||
      (response.status === 401 || response.status === 403
        ? 'Tu sesión no tiene permisos para esta operación o ha expirado. Vuelve a iniciar sesión.'
        : `Error HTTP ${response.status} al comunicarse con el servidor.`)

    throw new ApiError(mensaje, response.status, errorData.detalles)
  }

  if (response.status === 204) {
    return undefined as unknown as T
  }

  return (await response.json()) as T
}

function conQuery(path: string, params?: Record<string, unknown>): string {
  if (!params) return path
  const query = new URLSearchParams()
  Object.entries(params).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') {
      query.append(clave, String(valor))
    }
  })
  const sufijo = query.toString()
  return sufijo ? `${path}?${sufijo}` : path
}

function cuerpo(method: string, body?: unknown): RequestInit {
  return { method, body: body === undefined ? undefined : JSON.stringify(body) }
}

/** Autenticación y perfil. */
export const authApi = {
  login: (correo: string, password: string) =>
    apiFetch<AuthResponse>('/auth/login', cuerpo('POST', { correo, password })),
  registro: (datos: RegistroRequest) =>
    apiFetch<AuthResponse>('/auth/registro', cuerpo('POST', datos)),
  me: () => apiFetch<Sesion>('/auth/me'),
  actualizarPerfil: (datos: {
    nombre: string
    apellidos: string
    correo: string
    regionId: number
    comunaId: number
    direccion: string
  }) => apiFetch<Sesion>('/auth/perfil', cuerpo('PUT', datos))
}

/** Catálogo de productos. */
export const productosApi = {
  listar: (filtros?: { texto?: string; categoriaId?: number; enOferta?: boolean }) =>
    apiFetch<Producto[]>(conQuery('/productos', filtros)),
  obtener: (codigo: string) =>
    apiFetch<Producto>(`/productos/${encodeURIComponent(codigo)}`),
  crear: (producto: Producto) => apiFetch<Producto>('/productos', cuerpo('POST', producto)),
  actualizar: (codigo: string, producto: Producto) =>
    apiFetch<Producto>(`/productos/${encodeURIComponent(codigo)}`, cuerpo('PUT', producto)),
  eliminar: (codigo: string) =>
    apiFetch<void>(`/productos/${encodeURIComponent(codigo)}`, cuerpo('DELETE'))
}

/** Categorías, regiones, comunas y roles. */
export const catalogosApi = {
  categorias: () => apiFetch<Categoria[]>('/categorias'),
  crearCategoria: (nombre: string) =>
    apiFetch<Categoria>('/categorias', cuerpo('POST', { nombre })),
  eliminarCategoria: (id: number) => apiFetch<void>(`/categorias/${id}`, cuerpo('DELETE')),
  regiones: () => apiFetch<Region[]>('/regiones'),
  comunas: (regionId?: number) => apiFetch<Comuna[]>(conQuery('/comunas', { regionId })),
  roles: () => apiFetch<Rol[]>('/roles')
}

/** Noticias del blog. */
export const noticiasApi = {
  listar: () => apiFetch<Noticia[]>('/noticias'),
  obtener: (slug: string) => apiFetch<Noticia>(`/noticias/${encodeURIComponent(slug)}`)
}

/** Mensajes de contacto. */
export const contactosApi = {
  enviar: (mensaje: { nombre: string; correo: string; comentario: string }) =>
    apiFetch<Mensaje | { mensaje: string }>('/contactos', cuerpo('POST', mensaje)),
  listar: () => apiFetch<Mensaje[]>('/contactos')
}

/** Boletas, checkout y pago. */
export const boletasApi = {
  checkout: (datos: CheckoutRequest) =>
    apiFetch<Boleta>('/boletas/checkout', cuerpo('POST', datos)),
  listar: (clienteRun?: string) => apiFetch<Boleta[]>(conQuery('/boletas', { clienteRun })),
  misBoletas: (clienteRun?: string, correo?: string) =>
    apiFetch<Boleta[]>(conQuery('/boletas/mis-boletas', { clienteRun, correo })),
  obtener: (id: string) => apiFetch<Boleta>(`/boletas/${encodeURIComponent(id)}`),
  reintentar: (id: string, datos: ReintentoPagoRequest) =>
    apiFetch<Boleta>(`/boletas/${encodeURIComponent(id)}/reintentar-pago`, cuerpo('PUT', datos)),
  anular: (id: string) =>
    apiFetch<Boleta>(`/boletas/${encodeURIComponent(id)}/anular`, cuerpo('PUT'))
}

/** Usuarios (solo administrador). */
export const usuariosApi = {
  listar: () => apiFetch<Usuario[]>('/usuarios'),
  crear: (usuario: Usuario) => apiFetch<Usuario>('/usuarios', cuerpo('POST', usuario)),
  actualizar: (run: string, usuario: Usuario) =>
    apiFetch<Usuario>(`/usuarios/${encodeURIComponent(run)}`, cuerpo('PUT', usuario)),
  eliminar: (run: string) =>
    apiFetch<void>(`/usuarios/${encodeURIComponent(run)}`, cuerpo('DELETE'))
}

/** Métricas del panel administrativo. */
export const dashboardApi = {
  resumen: () => apiFetch<DashboardResumenDto>('/dashboard/resumen')
}

/** Cliente genérico de compatibilidad. */
export const apiClient = {
  get: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body: unknown) =>
    apiFetch<T>(endpoint, cuerpo('POST', body)),
  put: <T>(endpoint: string, body?: unknown) => apiFetch<T>(endpoint, cuerpo('PUT', body)),
  delete: <T>(endpoint: string) => apiFetch<T>(endpoint, cuerpo('DELETE'))
}

export default apiClient
