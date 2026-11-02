import { Producto } from '../types'

/**
 * Formatea un valor numérico como moneda chilena (CLP), por ejemplo: $699.990
 */
export function formatearPrecio(valor: number | string): string {
  const numero = Number(valor)
  if (isNaN(numero)) return '$0'
  return '$' + numero.toLocaleString('es-CL')
}

/**
 * Determina si un producto tiene una oferta activa y válida.
 */
export function tieneOfertaActiva(producto?: Producto | null): boolean {
  if (!producto || !producto.enOferta) return false
  if (producto.precioOferta != null && producto.precioOferta > 0 && producto.precioOferta < producto.precio) {
    return true
  }
  if (
    producto.porcentajeDescuento != null &&
    producto.porcentajeDescuento > 0 &&
    producto.porcentajeDescuento < 100
  ) {
    return true
  }
  return false
}

/**
 * Obtiene el precio efectivo de venta (precio oferta si está en oferta activa, o precio normal).
 */
export function obtenerPrecioEfectivo(producto?: Producto | null): number {
  if (!producto) return 0
  if (!tieneOfertaActiva(producto)) return producto.precio

  if (producto.precioOferta != null && producto.precioOferta > 0 && producto.precioOferta < producto.precio) {
    return Math.round(producto.precioOferta)
  }

  if (
    producto.porcentajeDescuento != null &&
    producto.porcentajeDescuento > 0 &&
    producto.porcentajeDescuento < 100
  ) {
    return Math.round(producto.precio * (1 - producto.porcentajeDescuento / 100))
  }

  return producto.precio
}

/**
 * Obtiene el porcentaje de descuento entero de un producto en oferta.
 */
export function obtenerPorcentajeDescuento(producto?: Producto | null): number {
  if (!producto || !tieneOfertaActiva(producto)) return 0
  if (
    producto.porcentajeDescuento != null &&
    producto.porcentajeDescuento > 0 &&
    producto.porcentajeDescuento < 100
  ) {
    return Math.round(producto.porcentajeDescuento)
  }
  const efectivo = obtenerPrecioEfectivo(producto)
  if (producto.precio > 0 && efectivo < producto.precio) {
    return Math.round(((producto.precio - efectivo) / producto.precio) * 100)
  }
  return 0
}

export default formatearPrecio
