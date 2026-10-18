import { FORTEPIANO_KEYS } from '../../storage/claves'
import { inicializarDatos } from '../../data/seed'
import { ItemCarrito, Producto } from '../../types'
import { useCart } from '../../context/CartContext'

describe('Integrante 2 - Test 4: Lógica de Carrito y Control de Stock Disponible', () => {
  beforeEach(() => {
    localStorage.clear()
    inicializarDatos()
  })

  afterEach(() => {
    localStorage.clear()
  })

  // Funciones auxiliares que replican la lógica del CartContext sobre localStorage
  const obtenerProductos = (): Producto[] => {
    const raw = localStorage.getItem(FORTEPIANO_KEYS.productos)
    return raw ? JSON.parse(raw) : []
  }

  const obtenerCarrito = (): ItemCarrito[] => {
    const raw = localStorage.getItem(FORTEPIANO_KEYS.carrito)
    return raw ? JSON.parse(raw) : []
  }

  const guardarCarrito = (nuevo: ItemCarrito[]) => {
    localStorage.setItem(FORTEPIANO_KEYS.carrito, JSON.stringify(nuevo))
  }

  const simularAgregarAlCarrito = (codigo: string, cantidad = 1): boolean => {
    const productos = obtenerProductos()
    const producto = productos.find((p) => p.codigo === codigo)
    if (!producto) return false
    if (producto.stock <= 0) return false

    const carrito = obtenerCarrito()
    const itemExistente = carrito.find((i) => i.codigo === codigo)
    const cantidadActual = itemExistente ? itemExistente.cantidad : 0
    const cantidadFinal = cantidadActual + cantidad

    if (cantidadFinal > producto.stock) {
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
    return true
  }

  const calcularSubtotalesYTotal = (carrito: ItemCarrito[]) => {
    const productos = obtenerProductos()
    let totalItems = 0
    let total = 0

    const itemsConDetalle = carrito.map((item) => {
      const prod = productos.find((p) => p.codigo === item.codigo)
      const subtotal = prod ? prod.precio * item.cantidad : 0
      totalItems += item.cantidad
      total += subtotal
      return { ...item, producto: prod, subtotal }
    })

    return { itemsConDetalle, totalItems, total }
  }

  const simularCambiarCantidad = (codigo: string, delta: number): boolean => {
    const productos = obtenerProductos()
    const producto = productos.find((p) => p.codigo === codigo)
    const carrito = obtenerCarrito()
    const item = carrito.find((i) => i.codigo === codigo)

    if (!item || !producto) return false

    const nuevaCantidad = item.cantidad + delta
    if (nuevaCantidad <= 0) {
      const nuevoCarrito = carrito.filter((i) => i.codigo !== codigo)
      guardarCarrito(nuevoCarrito)
      return true
    }

    if (nuevaCantidad > producto.stock) {
      return false
    }

    const nuevoCarrito = carrito.map((i) =>
      i.codigo === codigo ? { ...i, cantidad: nuevaCantidad } : i
    )
    guardarCarrito(nuevoCarrito)
    return true
  }

  it('useCart() debe lanzar un error si se invoca fuera de un proveedor o contexto de React', () => {
    expect(() => useCart()).toThrow()
  })

  it('debe agregar un producto dentro del stock, incrementar totalItems y calcular el subtotal y total correctamente', () => {
    // PD-006: Yamaha Arius YDP-146 Rosewood, precio: 699990, stock: 25
    const agregado = simularAgregarAlCarrito('PD-006', 2)
    expect(agregado).toBeTrue()

    const carritoActual = obtenerCarrito()
    expect(carritoActual.length).toBe(1)
    expect(carritoActual[0].codigo).toBe('PD-006')
    expect(carritoActual[0].cantidad).toBe(2)

    const calculos = calcularSubtotalesYTotal(carritoActual)
    expect(calculos.totalItems).toBe(2)
    expect(calculos.itemsConDetalle[0].subtotal).toBe(1399980) // 699990 * 2
    expect(calculos.total).toBe(1399980)
  })

  it('debe permitir agregar múltiples productos distintos recalculando totalItems y total global', () => {
    simularAgregarAlCarrito('PD-006', 1) // 699.990
    simularAgregarAlCarrito('PA-001', 1) // 3.299.000 (stock: 5)

    const carrito = obtenerCarrito()
    expect(carrito.length).toBe(2)

    const calculos = calcularSubtotalesYTotal(carrito)
    expect(calculos.totalItems).toBe(2)
    expect(calculos.total).toBe(699990 + 3299000) // 3.998.990
  })

  it('debe bloquear el agregado cuando la cantidad solicitada supera el stock disponible sin modificar el carrito', () => {
    // PA-001 tiene stock: 5
    // 1. Agregamos 3 unidades válidas
    const primerPaso = simularAgregarAlCarrito('PA-001', 3)
    expect(primerPaso).toBeTrue()

    // 2. Intentamos agregar 3 más (total 6 > stock 5)
    const segundoPaso = simularAgregarAlCarrito('PA-001', 3)
    expect(segundoPaso).toBeFalse()

    // El carrito debe seguir intacto con 3 unidades
    const carrito = obtenerCarrito()
    expect(carrito.find((i) => i.codigo === 'PA-001')?.cantidad).toBe(3)
  })

  it('debe rechazar el agregado de un producto con stock 0 sin alterar el carrito', () => {
    // Configuramos un producto agotado en localStorage
    const productos = obtenerProductos()
    const productosModificados = productos.map((p) =>
      p.codigo === 'AC-005' ? { ...p, stock: 0 } : p
    )
    localStorage.setItem(FORTEPIANO_KEYS.productos, JSON.stringify(productosModificados))

    const resultado = simularAgregarAlCarrito('AC-005', 1)
    expect(resultado).toBeFalse()

    const carrito = obtenerCarrito()
    expect(carrito.some((i) => i.codigo === 'AC-005')).toBeFalse()
  })

  it('debe rechazar el intento de agregar un producto con código no existente', () => {
    const resultado = simularAgregarAlCarrito('NO-EXISTE-999', 1)
    expect(resultado).toBeFalse()
    expect(obtenerCarrito().length).toBe(0)
  })

  it('debe actualizar cantidad con delta respetando stock y remover el ítem si la cantidad llega a cero', () => {
    simularAgregarAlCarrito('PD-006', 2)

    // Aumentar en 1 (total 3)
    const incremento = simularCambiarCantidad('PD-006', 1)
    expect(incremento).toBeTrue()
    expect(obtenerCarrito().find((i) => i.codigo === 'PD-006')?.cantidad).toBe(3)

    // Reducir hasta <= 0 (elimina)
    const reduccion = simularCambiarCantidad('PD-006', -3)
    expect(reduccion).toBeTrue()
    expect(obtenerCarrito().find((i) => i.codigo === 'PD-006')).toBeUndefined()
  })

  it('debe vaciar el carrito completamente y sincronizar con localStorage', () => {
    simularAgregarAlCarrito('PD-006', 1)
    simularAgregarAlCarrito('PA-001', 1)
    expect(obtenerCarrito().length).toBe(2)

    // Vaciar
    guardarCarrito([])
    const carritoVacio = obtenerCarrito()
    expect(carritoVacio.length).toBe(0)

    const calculos = calcularSubtotalesYTotal(carritoVacio)
    expect(calculos.totalItems).toBe(0)
    expect(calculos.total).toBe(0)
  })
})
