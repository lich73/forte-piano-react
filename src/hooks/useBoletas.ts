import { useCallback } from 'react'
import { FORTEPIANO_KEYS } from '../storage/claves'
import { useColeccion } from '../storage/useColeccion'
import { Boleta, ItemBoleta, EstadoPedido, ResultadoPasarela, Producto } from '../types'

export interface DatosNuevaBoleta {
  clienteRun?: string
  clienteNombre: string
  clienteCorreo: string
  items: ItemBoleta[]
  total: number
  metodoPago?: string
  estado?: EstadoPedido
}

/**
 * Hook para la emisión, consulta, actualización de estado e historial de boletas y pedidos.
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

  // Emitir una nueva boleta tras un pago
  const emitirBoleta = useCallback(
    (datos: DatosNuevaBoleta): Boleta => {
      const ultimoFolio = boletas.reduce((max, b) => (b.folio > max ? b.folio : max), 1000)
      const nuevoFolio = ultimoFolio + 1

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
        estado: datos.estado || 'Emitida'
      }

      guardar((prev) => [nuevaBoleta, ...prev])
      return nuevaBoleta
    },
    [boletas, guardar]
  )

  // Actualizar estado de un pedido/boleta según resultado de pasarela
  const reintentarPagoBoleta = useCallback(
    (
      id: string,
      resultado: ResultadoPasarela
    ): { exito: boolean; boleta?: Boleta; mensaje: string } => {
      const actual = boletas.find((b) => b.id === id)
      if (!actual) {
        return { exito: false, mensaje: 'Pedido no encontrado.' }
      }

      const nuevoEstado: EstadoPedido =
        resultado === 'exitoso'
          ? 'Emitida'
          : resultado === 'rechazado'
          ? 'Rechazada'
          : 'Pendiente'

      const mensaje =
        resultado === 'exitoso'
          ? 'Pago confirmado exitosamente. Tu boleta ha sido emitida.'
          : resultado === 'rechazado'
          ? 'La transacción fue rechazada por la entidad bancaria.'
          : 'Problema temporal de conexión. Puedes volver a intentarlo más tarde.'

      // Si pasa a Emitida desde otro estado, descontar stock
      if (resultado === 'exitoso' && actual.estado !== 'Emitida') {
        try {
          const rawProds = localStorage.getItem(FORTEPIANO_KEYS.productos)
          const prods: Producto[] = rawProds ? JSON.parse(rawProds) : []
          const actualizados = prods.map((p) => {
            const item = actual.items.find((i) => i.codigo === p.codigo)
            if (item) {
              return { ...p, stock: Math.max(0, p.stock - item.cantidad) }
            }
            return p
          })
          localStorage.setItem(FORTEPIANO_KEYS.productos, JSON.stringify(actualizados))
          window.dispatchEvent(
            new CustomEvent('fortepiano_storage_change', {
              detail: { clave: FORTEPIANO_KEYS.productos }
            })
          )
        } catch {
          // continuar
        }
      }

      const boletaActualizada: Boleta = {
        ...actual,
        estado: nuevoEstado,
        mensajeTransaccion: mensaje
      }

      guardar((prev) => prev.map((b) => (b.id === id ? boletaActualizada : b)))

      return {
        exito: resultado === 'exitoso',
        boleta: boletaActualizada,
        mensaje
      }
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
    reintentarPagoBoleta,
    anularBoleta,
    recargar
  }
}

export default useBoletas
