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
 * Normaliza un RUN/RUT chileno eliminando puntos, guiones y espacios, convirtiendo 'k' a 'K'.
 */
export function limpiarRun(run: string): string {
  if (!run || typeof run !== 'string') return ''
  return run.replace(/[.\-\s]/g, '').toUpperCase().trim()
}

/**
 * Calcula el dígito verificador esperado para el cuerpo numérico de un RUN/RUT chileno usando Módulo 11.
 */
export function calcularDigitoVerificador(cuerpo: string): string {
  if (!cuerpo || !/^[0-9]+$/.test(cuerpo)) return ''

  let suma = 0
  let multiplicador = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }

  const resto = 11 - (suma % 11)
  if (resto === 11) return '0'
  if (resto === 10) return 'K'
  return String(resto)
}

/**
 * Formatea un RUN/RUT chileno con puntos y guión (ej: 123456785 -> 12.345.678-5).
 */
export function formatearRun(run: string): string {
  const limpio = limpiarRun(run)
  if (limpio.length < 2) return limpio
  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)
  const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${cuerpoFormateado}-${dv}`
}

/**
 * Valida un RUN/RUT chileno (con o sin puntos y guión, ej: 123456785, 12345678-5 o 12.345.678-K)
 * comprobando su formato y verificando estrictamente el dígito verificador mediante el algoritmo Módulo 11.
 */
export function validarRun(run: string): boolean {
  if (!run || typeof run !== 'string') return false
  const texto = run.trim()
  if (texto.length === 0) return false

  // Verificar que solo contenga dígitos, puntos opcionales, un guión opcional antes del DV, y DV 0-9 o K
  if (!/^[0-9.]+-?[0-9Kk]$/.test(texto)) return false

  const limpio = limpiarRun(texto)
  if (limpio.length < 7 || limpio.length > 9) return false

  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)

  if (!/^[0-9]+$/.test(cuerpo)) return false
  if (Number(cuerpo) < 100000) return false
  if (!/^[0-9K]$/.test(dv)) return false

  const dvEsperado = calcularDigitoVerificador(cuerpo)
  return dv === dvEsperado
}

/**
 * Devuelve un mensaje descriptivo indicando la causa exacta de invalidez del RUN/RUT (ej: dígito verificador erróneo).
 */
export function obtenerMensajeErrorRun(run: string): string {
  if (!run || !run.trim()) {
    return 'El RUN es obligatorio.'
  }
  const limpio = limpiarRun(run)
  if (limpio.length < 7 || limpio.length > 9) {
    return 'El RUN debe tener entre 7 y 9 caracteres (sin contar puntos ni guión).'
  }
  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)
  if (!/^[0-9]+$/.test(cuerpo) || !/^[0-9K]$/.test(dv)) {
    return 'Formato de RUN inválido. Use números y dígito verificador (0-9 o K).'
  }
  const dvEsperado = calcularDigitoVerificador(cuerpo)
  if (dv !== dvEsperado) {
    return `Dígito verificador incorrecto (para el RUN ${cuerpo} corresponde -${dvEsperado}).`
  }
  return 'RUN inválido.'
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
