export const DOMINIOS_CORREO_VALIDOS = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com']

export function validarCorreo(correo: string): boolean {
  if (!correo || correo.length === 0 || correo.length > 100) return false
  const correoLower = correo.toLowerCase().trim()
  return DOMINIOS_CORREO_VALIDOS.some((dominio) => correoLower.endsWith(dominio))
}

export function validarPassword(password: string): boolean {
  return typeof password === 'string' && password.length >= 4 && password.length <= 10
}

/**
 * Valida un RUN chileno sin puntos ni guión (ej: 123456785 o 12345678K) usando el algoritmo módulo 11.
 */
export function validarRun(run: string): boolean {
  if (!run) return false
  const limpio = run.toUpperCase().trim()
  if (limpio.length < 7 || limpio.length > 9) return false

  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)

  if (!/^[0-9]+$/.test(cuerpo)) return false
  if (!/^[0-9K]$/.test(dv)) return false

  let suma = 0
  let multiplicador = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }

  const resto = 11 - (suma % 11)
  let dvEsperado: string
  if (resto === 11) dvEsperado = '0'
  else if (resto === 10) dvEsperado = 'K'
  else dvEsperado = String(resto)

  return dv === dvEsperado
}

export function textoRequerido(valor: string | undefined | null, maximo?: number | null): boolean {
  if (!valor || valor.trim().length === 0) return false
  if (maximo != null && valor.trim().length > maximo) return false
  return true
}

export function numeroEnRango(valor: unknown, minimo: number): boolean {
  const numero = Number(valor)
  if (isNaN(numero)) return false
  return numero >= minimo
}

export function enteroEnRango(valor: unknown, minimo: number): boolean {
  const numero = Number(valor)
  if (isNaN(numero)) return false
  return Number.isInteger(numero) && numero >= minimo
}
