import { useCallback } from 'react'
import { FORTEPIANO_KEYS } from '../storage/claves'
import { useColeccion } from '../storage/useColeccion'
import { Boleta, ItemBoleta } from '../types'

export interface DatosNuevaBoleta {
  clienteRun?: string
  clienteNombre: string
  clienteCorreo: string
  items: ItemBoleta[]
  total: number
  metodoPago?: string
}

/**
 * Hook para la emisión, consulta e historial de boletas electrónicas de compras.
 */
export function useBoletas() {
  const { datos: boletas, guardar, recargar } = useColeccion<Boleta>(FORTEPIANO_KEYS.boletas)

  // Obtener una boleta por su ID único
  const obtenerBoleta = useCallback(
    (id: string): Boleta | undefined => {
      return boletas.find((b) => b.id === id)
    },
    [boletas]
  )

  // Obtener boletas de un cliente por su RUN o correo electrónico
  const obtenerBoletasPorCliente = useCallback(
    (identificador: string): Boleta[] => {
      const idLimpio = identificador.trim().toLowerCase()
      return boletas
        .filter(
          (b) =>
            (b.clienteRun && b.clienteRun.trim().toLowerCase() === idLimpio) ||
            (b.clienteCorreo && b.clienteCorreo.trim().toLowerCase() === idLimpio)
        )
        .sort((a, b) => b.folio - a.folio)
    },
    [boletas]
  )

  // Emitir una nueva boleta tras un pago exitoso
  const emitirBoleta = useCallback(
    (datos: DatosNuevaBoleta): Boleta => {
      // Calcular siguiente folio correlativo
      const ultimoFolio = boletas.reduce((max, b) => (b.folio > max ? b.folio : max), 1000)
      const nuevoFolio = ultimoFolio + 1

      // Desglose de impuestos chilenos (IVA 19% incluido en el total)
      const subtotalNeto = Math.round(datos.total / 1.19)
      const iva = datos.total - subtotalNeto

      const ahora = new Date()
      const fechaLegible = ahora.toLocaleString('es-CL', {
        dateStyle: 'short',
        timeStyle: 'medium'
      })

      const nuevaBoleta: Boleta = {
        id: `BOL-${Date.now()}-${nuevoFolio}`,
        folio: nuevoFolio,
        fecha: fechaLegible,
        clienteRun: datos.clienteRun || undefined,
        clienteNombre: datos.clienteNombre || 'Cliente General',
        clienteCorreo: datos.clienteCorreo || 'cliente@fortepiano.cl',
        items: datos.items,
        subtotalNeto,
        iva,
        total: datos.total,
        metodoPago: datos.metodoPago || 'Tarjeta de Débito / Webpay Plus',
        estado: 'Emitida'
      }

      guardar((prev) => [nuevaBoleta, ...prev])
      return nuevaBoleta
    },
    [boletas, guardar]
  )

  // Anular boleta (función administrativa)
  const anularBoleta = useCallback(
    (id: string) => {
      guardar((prev) =>
        prev.map((b) => (b.id === id ? { ...b, estado: 'Anulada' as const } : b))
      )
    },
    [guardar]
  )

  return {
    boletas,
    obtenerBoleta,
    obtenerBoletasPorCliente,
    emitirBoleta,
    anularBoleta,
    recargar
  }
}

export default useBoletas
