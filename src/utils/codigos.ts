import { Producto } from '../types'

/**
 * Mapeo de prefijos conocidos por ID de categoría en Forte & Piano.
 */
const PREFIJOS_CATEGORIA: Record<number, string> = {
  1: 'GUI', // Guitarras y Bajos
  2: 'PIA', // Pianos y Teclados
  3: 'BAT', // Baterías y Percusión
  4: 'VIE', // Instrumentos de Viento
  5: 'CUE', // Cuerdas y Arcos
  6: 'AUD'  // Audio y Accesorios
}

/**
 * Genera un código correlativo sugerido para un nuevo instrumento musical según su categoría.
 * Ejemplo: Si la categoría es Guitarras (GUI) y ya existen GUI-001 y GUI-002, genera GUI-003.
 *
 * @param categoriaId Identificador numérico de la categoría
 * @param nombreCategoria Nombre de la categoría (para derivar prefijo si es una categoría nueva)
 * @param productos Lista de productos existentes en el sistema
 */
export function generarCodigoPorCategoria(
  categoriaId: number | string,
  nombreCategoria = '',
  productos: Producto[] = []
): string {
  const catIdNum = Number(categoriaId)
  let prefijo = PREFIJOS_CATEGORIA[catIdNum]

  if (!prefijo) {
    // Si es una categoría personalizada creada dinámicamente, tomamos las 3 primeras letras
    const palabras = nombreCategoria.trim().split(/\s+/)
    if (palabras.length > 0 && palabras[0].length >= 3) {
      prefijo = palabras[0].substring(0, 3).toUpperCase()
    } else {
      prefijo = 'ART'
    }
  }

  // Filtrar productos cuyo código empiece con PREFIJO-
  const patron = new RegExp(`^${prefijo}-(\\d+)`, 'i')
  let maxCorrelativo = 0

  for (const prod of productos) {
    const match = prod.codigo.match(patron)
    if (match) {
      const num = parseInt(match[1], 10)
      if (!isNaN(num) && num > maxCorrelativo) {
        maxCorrelativo = num
      }
    }
  }

  const siguienteNumero = maxCorrelativo + 1
  return `${prefijo}-${String(siguienteNumero).padStart(3, '0')}`
}
