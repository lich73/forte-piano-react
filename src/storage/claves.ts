/**
 * Claves de localStorage permitidas en la aplicación.
 *
 * Solo se guardan datos locales del navegador:
 * - carrito: selección temporal del usuario.
 * - sesion: datos de la sesión autenticada.
 * - jwtToken: token que autoriza las llamadas a /api/v1.
 *
 * Los datos de dominio (usuarios, productos, categorías, boletas, etc.)
 * viven exclusivamente en MySQL y se leen desde el backend.
 */
export const FORTEPIANO_KEYS = {
  carrito: 'fortepiano_carrito',
  sesion: 'fortepiano_sesion',
  jwtToken: 'fortepiano_jwt_token'
} as const
