import React, { createContext, useContext, useState, useMemo, useCallback } from 'react'
import Swal from 'sweetalert2'
import { FORTEPIANO_KEYS } from '../storage/claves'
import {
  ItemCarrito,
  Producto,
  DatosCheckout,
  Boleta,
  ResultadoPasarela,
  EstadoPedido
} from '../types'
import { formatearPrecio, obtenerPrecioEfectivo } from '../utils/formato'
import { imprimirBoletaHtml } from '../utils/impresion'

export interface ItemCarritoConDetalle extends ItemCarrito {
  producto?: Producto
  subtotal: number
}

interface CartContextValue {
  carrito: ItemCarrito[]
  itemsConDetalle: ItemCarritoConDetalle[]
  totalItems: number
  total: number
  agregar: (codigo: string, cantidad?: number) => boolean
  cambiarCantidad: (codigo: string, delta: number) => void
  eliminar: (codigo: string) => Promise<boolean>
  vaciar: () => void
  finalizarCompra: (datosCheckout?: DatosCheckout) => void
  procesarPagoPasarela: (
    datosCheckout: DatosCheckout,
    resultado: ResultadoPasarela,
    pedidoExistenteId?: string
  ) => { exito: boolean; boleta?: Boleta; mensaje: string }
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function generarHtmlBoleta(boleta: Boleta): string {
  const filasHtml = boleta.items
    .map(
      (it) => `
      <tr style="border-bottom: 1px solid #cbd5e1;">
        <td style="padding: 7px 6px; color: #0f172a !important; font-weight: bold;">${it.cantidad}x</td>
        <td style="padding: 7px 6px; color: #0f172a !important;">
          <strong style="color: #0f172a !important; display: block; font-size: 13px;">${it.nombre}</strong>
          <small style="color: #475569 !important; font-size: 11px;">Código: ${it.codigo}</small>
        </td>
        <td style="padding: 7px 6px; text-align: right; font-weight: bold; color: #0f172a !important;">
          ${formatearPrecio(it.subtotal)}
        </td>
      </tr>
    `
    )
    .join('')

  const infoEnvioHtml = boleta.datosEnvio
    ? `
      <div class="boleta-info-box" style="font-size: 12px; margin-bottom: 14px; background: #f0fdf4 !important; padding: 10px 12px; border: 1px solid #bbf7d0; border-radius: 6px;">
        <p style="margin: 0 0 4px 0; color: #166534 !important; font-weight: 700; text-transform: uppercase; font-size: 11px;">Datos de Despacho / Entrega</p>
        <p style="margin: 2px 0; color: #1e293b !important;"><strong style="color: #0f172a !important;">Modalidad:</strong> ${
          boleta.datosEnvio.modalidad === 'retiro_tienda'
            ? 'Retiro en Tienda Forte & Piano'
            : boleta.datosEnvio.modalidad === 'otra_direccion'
            ? 'Despacho a domicilio (Dirección alternativa)'
            : 'Despacho a domicilio (Dirección de perfil)'
        }</p>
        <p style="margin: 2px 0; color: #1e293b !important;"><strong style="color: #0f172a !important;">Destinatario:</strong> ${boleta.datosEnvio.destinatario}${
          boleta.datosEnvio.telefono ? ` &bull; Tel: ${boleta.datosEnvio.telefono}` : ''
        }</p>
        <p style="margin: 2px 0; color: #1e293b !important;"><strong style="color: #0f172a !important;">Dirección:</strong> ${boleta.datosEnvio.direccion}, ${boleta.datosEnvio.comunaNombre}, ${boleta.datosEnvio.regionNombre}</p>
        ${
          boleta.datosEnvio.referencia
            ? `<p style="margin: 2px 0; color: #1e293b !important;"><strong style="color: #0f172a !important;">Indicaciones:</strong> ${boleta.datosEnvio.referencia}</p>`
            : ''
        }
      </div>
    `
    : ''

  return `
    <div id="boletaImprimible" style="text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #0f172a !important; background: #ffffff !important; padding: 18px; border: 1px dashed #94a3b8; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 14px; border-bottom: 2px solid #0d233a; padding-bottom: 10px;">
        <h4 class="boleta-empresa" style="margin: 0; font-size: 18px; color: #0d233a !important; font-weight: 800;">FORTE & PIANO SpA</h4>
        <p class="boleta-subtitulo" style="margin: 3px 0; font-size: 12px; color: #334155 !important;">R.U.T.: 76.543.210-3 &bull; Venta de Instrumentos Musicales</p>
        <p class="boleta-subtitulo" style="margin: 2px 0; font-size: 12px; color: #334155 !important;">Av. Providencia 1234, Santiago &bull; contacto@fortepiano.cl</p>
        <div class="boleta-folio-box" style="display: inline-block; border: 2px solid #0056b3 !important; background: #f0f7ff !important; padding: 6px 16px; margin-top: 8px; border-radius: 4px;">
          <span style="font-weight: 800; color: #0056b3 !important; font-size: 14px;">BOLETA ELECTRÓNICA N° ${boleta.folio}</span>
        </div>
      </div>

      <div class="boleta-info-box" style="font-size: 12px; margin-bottom: 10px; background: #f8fafc !important; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
        <p style="margin: 0 0 4px 0; color: #334155 !important; font-weight: 700; text-transform: uppercase; font-size: 11px;">Datos del Cliente (Facturación)</p>
        <p style="margin: 3px 0; color: #1e293b !important;"><strong style="color: #0f172a !important;">Fecha de emisión:</strong> ${boleta.fecha}</p>
        <p style="margin: 3px 0; color: #1e293b !important;"><strong style="color: #0f172a !important;">Cliente:</strong> ${boleta.clienteNombre}</p>
        ${boleta.clienteRun ? `<p style="margin: 3px 0; color: #1e293b !important;"><strong style="color: #0f172a !important;">R.U.T. Cliente:</strong> ${boleta.clienteRun}</p>` : ''}
        <p style="margin: 3px 0; color: #1e293b !important;"><strong style="color: #0f172a !important;">Correo:</strong> ${boleta.clienteCorreo}</p>
        <p style="margin: 3px 0; color: #1e293b !important;"><strong style="color: #0f172a !important;">Medio de pago:</strong> ${boleta.metodoPago}</p>
        <p style="margin: 3px 0; color: #1e293b !important;"><strong style="color: #0f172a !important;">Estado del pedido:</strong> ${boleta.estado}</p>
      </div>

      ${infoEnvioHtml}

      <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 14px;">
        <thead>
          <tr style="background: #f1f5f9 !important; border-bottom: 2px solid #94a3b8; text-align: left;">
            <th style="padding: 7px 6px; color: #0f172a !important; font-weight: 700;">Cant.</th>
            <th style="padding: 7px 6px; color: #0f172a !important; font-weight: 700;">Descripción</th>
            <th style="padding: 7px 6px; text-align: right; color: #0f172a !important; font-weight: 700;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${filasHtml}
        </tbody>
      </table>

      <div class="boleta-totales" style="border-top: 1px dashed #94a3b8; padding-top: 10px; font-size: 13px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: #1e293b !important;">Subtotal Neto:</span>
          <span style="color: #0f172a !important; font-weight: 600;">${formatearPrecio(boleta.subtotalNeto)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: #1e293b !important;">19% I.V.A.:</span>
          <span style="color: #0f172a !important; font-weight: 600;">${formatearPrecio(boleta.iva)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; border-top: 2px solid #0d233a; padding-top: 8px; margin-top: 6px;">
          <span style="color: #0d233a !important;">TOTAL PAGADO:</span>
          <span class="boleta-total-pagado" style="color: #0056b3 !important; font-size: 17px; font-weight: 800;">${formatearPrecio(boleta.total)}</span>
        </div>
      </div>

      <p class="boleta-footer-aviso" style="text-align: center; font-size: 11px; color: #475569 !important; margin: 14px 0 0 0;">
        El IVA de esta boleta ha sido retenido según normativa vigente del SII.<br/>
        ¡Gracias por tu compra en Forte & Piano!
      </p>
    </div>
  `
}

export function mostrarModalBoletaEmitida(boleta: Boleta) {
  const boletaHtml = generarHtmlBoleta(boleta)
  Swal.fire({
    title: '¡Pago Exitoso! Pedido Confirmado',
    html: boletaHtml,
    icon: 'success',
    width: '600px',
    showCancelButton: true,
    confirmButtonText: '<i class="bi bi-printer"></i> Imprimir Boleta',
    cancelButtonText: 'Aceptar',
    confirmButtonColor: '#0056b3',
    willClose: () => {
      document.body.classList.remove('swal2-shown', 'swal2-height-auto')
      document.body.style.overflow = ''
    },
    didClose: () => {
      document.body.classList.remove('swal2-shown', 'swal2-height-auto')
      document.body.style.overflow = ''
    }
  }).then((swalRes) => {
    if (swalRes.isConfirmed) {
      setTimeout(() => {
        imprimirBoletaHtml(boletaHtml, boleta.folio)
      }, 150)
    }
  })
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [carrito, setCarrito] = useState<ItemCarrito[]>(() => {
    try {
      const guardado = localStorage.getItem(FORTEPIANO_KEYS.carrito)
      return guardado ? (JSON.parse(guardado) as ItemCarrito[]) : []
    } catch {
      return []
    }
  })

  // Obtener la lista más reciente de productos desde localStorage
  const obtenerProductos = useCallback((): Producto[] => {
    try {
      const prods = localStorage.getItem(FORTEPIANO_KEYS.productos)
      return prods ? (JSON.parse(prods) as Producto[]) : []
    } catch {
      return []
    }
  }, [])

  // Guardar en localStorage cada vez que cambia el carrito
  const guardarCarrito = (nuevoCarrito: ItemCarrito[]) => {
    localStorage.setItem(FORTEPIANO_KEYS.carrito, JSON.stringify(nuevoCarrito))
    setCarrito(nuevoCarrito)
  }

  // Items enriquecidos con su producto y subtotal
  const itemsConDetalle = useMemo<ItemCarritoConDetalle[]>(() => {
    const productos = obtenerProductos()
    return carrito.map((item) => {
      const producto = productos.find((p) => p.codigo === item.codigo)
      const subtotal = producto ? obtenerPrecioEfectivo(producto) * item.cantidad : 0
      return {
        ...item,
        producto,
        subtotal
      }
    })
  }, [carrito, obtenerProductos])

  const totalItems = useMemo(() => {
    return carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0)
  }, [carrito])

  const total = useMemo(() => {
    return itemsConDetalle.reduce((acumulado, item) => acumulado + item.subtotal, 0)
  }, [itemsConDetalle])

  // Agrega un producto al carrito respetando el stock disponible
  const agregar = (codigo: string, cantidad = 1): boolean => {
    const productos = obtenerProductos()
    const producto = productos.find((p) => p.codigo === codigo)

    if (!producto) {
      Swal.fire({
        title: 'Error',
        text: 'Producto no encontrado.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      })
      return false
    }

    if (producto.stock <= 0) {
      Swal.fire({
        title: 'Sin stock',
        text: 'Este producto no tiene stock disponible.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      })
      return false
    }

    const itemExistente = carrito.find((i) => i.codigo === codigo)
    const cantidadActual = itemExistente ? itemExistente.cantidad : 0
    const cantidadFinal = cantidadActual + cantidad

    if (cantidadFinal > producto.stock) {
      Swal.fire({
        title: 'Stock insuficiente',
        text: `Solo hay ${producto.stock} unidades disponibles de ${producto.nombre}.`,
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      })
      return false
    }

    let nuevoCarrito: ItemCarrito[]
    if (itemExistente) {
      nuevoCarrito = carrito.map((i) =>
        i.codigo === codigo ? { ...i, cantidad: cantidadFinal } : i
      )
    } else {
      nuevoCarrito = [...carrito, { codigo, cantidad }]
    }

    guardarCarrito(nuevoCarrito)
    Swal.fire({
      title: 'Agregado',
      text: `${producto.nombre} se añadió al carrito.`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    })
    return true
  }

  // Modifica la cantidad de un ítem con un delta (+1 o -1)
  const cambiarCantidad = (codigo: string, delta: number) => {
    const productos = obtenerProductos()
    const producto = productos.find((p) => p.codigo === codigo)
    const item = carrito.find((i) => i.codigo === codigo)

    if (!item || !producto) return

    const nuevaCantidad = item.cantidad + delta

    if (nuevaCantidad <= 0) {
      eliminar(codigo)
      return
    }

    if (nuevaCantidad > producto.stock) {
      Swal.fire({
        title: 'Stock insuficiente',
        text: `Solo hay ${producto.stock} unidades disponibles.`,
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      })
      return
    }

    const nuevoCarrito = carrito.map((i) =>
      i.codigo === codigo ? { ...i, cantidad: nuevaCantidad } : i
    )
    guardarCarrito(nuevoCarrito)
  }

  // Elimina un ítem del carrito previa confirmación
  const eliminar = async (codigo: string): Promise<boolean> => {
    const resultado = await Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Se quitará del carrito de compras.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (resultado.isConfirmed) {
      const nuevoCarrito = carrito.filter((i) => i.codigo !== codigo)
      guardarCarrito(nuevoCarrito)
      await Swal.fire({
        title: 'Eliminado',
        text: 'El producto fue eliminado del carrito.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })
      return true
    }
    return false
  }

  // Vacía el carrito por completo
  const vaciar = () => {
    guardarCarrito([])
  }

  // Procesa un escenario simulado de la pasarela de pagos y actualiza el estado del pedido
  const procesarPagoPasarela = (
    datosCheckout: DatosCheckout,
    resultado: ResultadoPasarela,
    pedidoExistenteId?: string
  ): { exito: boolean; boleta?: Boleta; mensaje: string } => {
    if (carrito.length === 0) {
      return { exito: false, mensaje: 'El carrito se encuentra vacío.' }
    }

    // 1. Validar stock en tiempo real
    const productosActuales = obtenerProductos()
    for (const item of carrito) {
      const prod = productosActuales.find((p) => p.codigo === item.codigo)
      if (!prod || prod.stock < item.cantidad) {
        return {
          exito: false,
          mensaje: `Stock insuficiente para "${prod?.nombre ?? item.codigo}". Disponible: ${prod?.stock ?? 0}.`
        }
      }
    }

    // 2. Determinar estado del pedido y mensaje según escenario seleccionado
    let nuevoEstado: EstadoPedido = 'Emitida'
    let mensajeResultado = 'El pago ha sido aprobado y tu boleta electrónica fue emitida con éxito.'

    if (resultado === 'rechazado') {
      nuevoEstado = 'Rechazada'
      mensajeResultado =
        'La entidad emisora rechazó el cargo (fondos insuficientes o límite excedido). La transacción no pudo completarse.'
    } else if (resultado === 'intentar_mas_tarde') {
      nuevoEstado = 'Pendiente'
      mensajeResultado =
        'El servicio de autorización bancaria presenta intermitencia temporal. Tu pedido quedó en estado Pendiente para que puedas reintentar el pago.'
    }

    // 3. Cargar boletas existentes
    let boletasGuardadas: Boleta[] = []
    try {
      const boletasRaw = localStorage.getItem(FORTEPIANO_KEYS.boletas)
      if (boletasRaw) {
        boletasGuardadas = JSON.parse(boletasRaw)
      }
    } catch {
      boletasGuardadas = []
    }

    const subtotalNeto = Math.round(total / 1.19)
    const iva = total - subtotalNeto
    const ahora = new Date()
    const fechaLegible = ahora.toLocaleString('es-CL', {
      dateStyle: 'short',
      timeStyle: 'medium'
    })

    const itemsBoleta = itemsConDetalle.map((item) => ({
      codigo: item.codigo,
      nombre: item.producto?.nombre ?? item.codigo,
      precioUnitario: obtenerPrecioEfectivo(item.producto),
      cantidad: item.cantidad,
      subtotal: item.subtotal
    }))

    const clienteNombreFinal =
      `${datosCheckout.clienteNombre} ${datosCheckout.clienteApellidos}`.trim() ||
      'Cliente General'

    let boletaResultante: Boleta
    let nuevasBoletas: Boleta[]

    const indiceExistente = pedidoExistenteId
      ? boletasGuardadas.findIndex((b) => b.id === pedidoExistenteId)
      : -1

    if (indiceExistente >= 0) {
      boletaResultante = {
        ...boletasGuardadas[indiceExistente],
        fecha: fechaLegible,
        clienteRun: datosCheckout.clienteRun,
        clienteNombre: clienteNombreFinal,
        clienteCorreo: datosCheckout.clienteCorreo,
        items: itemsBoleta,
        subtotalNeto,
        iva,
        total,
        metodoPago: datosCheckout.metodoPago || 'Webpay Plus / Débito',
        estado: nuevoEstado,
        datosEnvio: datosCheckout.datosEnvio,
        mensajeTransaccion: mensajeResultado
      }
      nuevasBoletas = [...boletasGuardadas]
      nuevasBoletas[indiceExistente] = boletaResultante
    } else {
      const ultimoFolio = boletasGuardadas.reduce(
        (max, b) => (b.folio > max ? b.folio : max),
        1000
      )
      const nuevoFolio = ultimoFolio + 1

      boletaResultante = {
        id: `BOL-${Date.now()}-${nuevoFolio}`,
        folio: nuevoFolio,
        fecha: fechaLegible,
        clienteRun: datosCheckout.clienteRun,
        clienteNombre: clienteNombreFinal,
        clienteCorreo: datosCheckout.clienteCorreo,
        items: itemsBoleta,
        subtotalNeto,
        iva,
        total,
        metodoPago: datosCheckout.metodoPago || 'Webpay Plus / Débito',
        estado: nuevoEstado,
        datosEnvio: datosCheckout.datosEnvio,
        mensajeTransaccion: mensajeResultado
      }
      nuevasBoletas = [boletaResultante, ...boletasGuardadas]
    }

    localStorage.setItem(FORTEPIANO_KEYS.boletas, JSON.stringify(nuevasBoletas))
    window.dispatchEvent(
      new CustomEvent('fortepiano_storage_change', {
        detail: { clave: FORTEPIANO_KEYS.boletas }
      })
    )

    // 4. Si el pago fue exitoso, descontar stock y vaciar carrito
    if (resultado === 'exitoso') {
      const productosActualizados = productosActuales.map((p) => {
        const itemEnCarrito = carrito.find((i) => i.codigo === p.codigo)
        if (itemEnCarrito) {
          return {
            ...p,
            stock: Math.max(0, p.stock - itemEnCarrito.cantidad)
          }
        }
        return p
      })

      localStorage.setItem(FORTEPIANO_KEYS.productos, JSON.stringify(productosActualizados))
      window.dispatchEvent(
        new CustomEvent('fortepiano_storage_change', {
          detail: { clave: FORTEPIANO_KEYS.productos }
        })
      )

      guardarCarrito([])
    }

    return {
      exito: resultado === 'exitoso',
      boleta: boletaResultante,
      mensaje: mensajeResultado
    }
  }

  // Función directa de compatibilidad
  const finalizarCompra = async (datosCheckout?: DatosCheckout) => {
    if (carrito.length === 0) return

    let sesionActual: { run?: string; nombre?: string; apellidos?: string; correo?: string } | null = null
    try {
      const sesionRaw = localStorage.getItem(FORTEPIANO_KEYS.sesion)
      if (sesionRaw) sesionActual = JSON.parse(sesionRaw)
    } catch {
      sesionActual = null
    }

    const checkoutEfectivo: DatosCheckout = datosCheckout || {
      clienteRun: sesionActual?.run || '123456785',
      clienteNombre: sesionActual?.nombre || 'Cliente',
      clienteApellidos: sesionActual?.apellidos || 'General',
      clienteCorreo: sesionActual?.correo || 'cliente@gmail.com',
      metodoPago: 'Webpay Plus / Tarjeta de Débito',
      datosEnvio: {
        modalidad: 'retiro_tienda',
        destinatario: sesionActual?.nombre || 'Cliente General',
        regionNombre: 'Región Metropolitana',
        comunaNombre: 'Providencia',
        direccion: 'Av. Providencia 1234'
      }
    }

    const res = procesarPagoPasarela(
      checkoutEfectivo,
      checkoutEfectivo.resultadoTransaccion || 'exitoso',
      checkoutEfectivo.boletaExistenteId
    )

    if (res.exito && res.boleta) {
      mostrarModalBoletaEmitida(res.boleta)
    }
  }

  return (
    <CartContext.Provider
      value={{
        carrito,
        itemsConDetalle,
        totalItems,
        total,
        agregar,
        cambiarCantidad,
        eliminar,
        vaciar,
        finalizarCompra,
        procesarPagoPasarela
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider')
  }
  return context
}

export default CartContext
