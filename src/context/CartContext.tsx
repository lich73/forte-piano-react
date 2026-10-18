import React, { createContext, useContext, useState, useMemo, useCallback } from 'react'
import Swal from 'sweetalert2'
import { FORTEPIANO_KEYS } from '../storage/claves'
import { ItemCarrito, Producto } from '../types'
import { formatearPrecio } from '../utils/formato'

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
  finalizarCompra: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

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
      const subtotal = producto ? producto.precio * item.cantidad : 0
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

  // Finaliza la compra con confirmación
  const finalizarCompra = () => {
    if (carrito.length === 0) return

    Swal.fire({
      title: 'Confirmar compra',
      text: `Total a pagar: ${formatearPrecio(total)}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        vaciar()
        Swal.fire({
          title: 'Gracias por tu compra',
          text: 'Tu pedido fue registrado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
      }
    })
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
        finalizarCompra
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
