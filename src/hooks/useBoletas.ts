import { useCallback } from 'react'
import { boletasApi, mensajeDeError, obtenerSesionGuardada, obtenerTokenJwt } from '../services/api'
import type {
  Boleta,
  CheckoutRequest,
  DatosEnvio,
  ResultadoPasarela
} from '../types'
import { useApiLista } from './useApiLista'

export interface OpcionesBoletas {
  /** true → GET /boletas/mis-boletas (CLIENTE); false → GET /boletas (ADMIN/VENDEDOR). */
  soloMias?: boolean
  clienteRun?: string
  correo?: string
  /** Permite evitar la petición mientras no hay sesión con la que filtrar. */
  activo?: boolean
}

/** Boletas y pedidos leídos siempre desde la API REST. */
export function useBoletas(opciones: OpcionesBoletas = {}) {
  const { soloMias = false, clienteRun, correo, activo = true } = opciones
  const clave = `${soloMias ? 'mias' : 'todas'}|${clienteRun || ''}|${correo || ''}`

  const { datos: boletas, cargando, error, recargar, setDatos } = useApiLista<Boleta>(
    () =>
      soloMias
        ? boletasApi.misBoletas(clienteRun, correo)
        : boletasApi.listar(clienteRun),
    clave,
    activo
  )

  const obtenerBoleta = useCallback(
    (id: string): Boleta | undefined => boletas.find((b) => b.id === id),
    [boletas]
  )

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

  /**
   * Reintento de pago. Se usa POST /boletas/checkout con `boletaExistenteId`
   * porque el PUT /boletas/{id}/reintentar-pago está restringido a ADMIN/VENDEDOR.
   */
  const reintentarPagoBoleta = useCallback(
    async (
      id: string,
      resultado: ResultadoPasarela
    ): Promise<{ exito: boolean; boleta?: Boleta; mensaje: string }> => {
      const actual = boletas.find((b) => b.id === id)
      if (!actual) {
        return { exito: false, mensaje: 'Pedido no encontrado.' }
      }

      const sesion = obtenerSesionGuardada()
      if (!sesion || !obtenerTokenJwt() || sesion.rolId === 2) {
        return {
          exito: false,
          mensaje: 'Tu sesión no permite realizar pagos. Ingresa con una cuenta de Cliente o Administrador.'
        }
      }

      const datosEnvio: DatosEnvio = actual.datosEnvio || {
        modalidad: 'retiro_tienda',
        destinatario: actual.clienteNombre,
        regionNombre: '-',
        comunaNombre: '-',
        direccion: '-'
      }

      const request: CheckoutRequest = {
        clienteRun: actual.clienteRun,
        clienteNombre: actual.clienteNombre,
        clienteCorreo: actual.clienteCorreo,
        metodoPago: actual.metodoPago,
        datosEnvio,
        items: actual.items.map((item) => ({ codigo: item.codigo, cantidad: item.cantidad })),
        resultadoTransaccion: resultado,
        boletaExistenteId: id
      }

      try {
        const boleta = await boletasApi.checkout(request)
        setDatos((prev) => prev.map((b) => (b.id === id ? boleta : b)))
        return {
          exito: boleta.estado === 'Emitida',
          boleta,
          mensaje:
            boleta.mensajeTransaccion ||
            (boleta.estado === 'Emitida'
              ? 'Pago confirmado exitosamente. Tu boleta ha sido emitida.'
              : 'El pago no pudo completarse. Puedes volver a intentarlo.')
        }
      } catch (e) {
        return { exito: false, mensaje: mensajeDeError(e) }
      }
    },
    [boletas, setDatos]
  )

  const anularBoleta = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const anulada = await boletasApi.anular(id)
        setDatos((prev) => prev.map((b) => (b.id === id ? anulada : b)))
        return true
      } catch {
        return false
      }
    },
    [setDatos]
  )

  return {
    boletas,
    cargando,
    error,
    obtenerBoleta,
    obtenerBoletasPorCliente,
    reintentarPagoBoleta,
    anularBoleta,
    recargar
  }
}

export default useBoletas
