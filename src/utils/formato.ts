/**
 * Formatea un valor numérico como moneda chilena (CLP), por ejemplo: $699.990
 */
export function formatearPrecio(valor: number | string): string {
  const numero = Number(valor)
  if (isNaN(numero)) return '$0'
  return '$' + numero.toLocaleString('es-CL')
}

export default formatearPrecio
