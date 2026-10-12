/* Forte & Piano - carrito.js
   Manejo del carrito de compras usando localStorage. */

function obtenerCarrito() {
    return obtenerColeccion(FORTEPIANO_KEYS.carrito);
}

function guardarCarrito(carrito) {
    guardarColeccion(FORTEPIANO_KEYS.carrito, carrito);
}

/* Agrega un producto al carrito respetando el stock disponible. */
function agregarAlCarrito(codigo, cantidad) {
    const producto = obtenerProductoPorCodigo(codigo);
    if (!producto) return;

    if (producto.stock <= 0) {
        Swal.fire("Sin stock", "Este producto no tiene stock disponible.", "error");
        return;
    }

    const carrito = obtenerCarrito();
    const item = carrito.find(function (i) { return i.codigo === codigo; });
    const cantidadActual = item ? item.cantidad : 0;
    const cantidadFinal = cantidadActual + (cantidad || 1);

    if (cantidadFinal > producto.stock) {
        Swal.fire("Stock insuficiente", "Solo hay " + producto.stock + " unidades disponibles de " + producto.nombre + ".", "warning");
        return;
    }

    if (item) {
        item.cantidad = cantidadFinal;
    } else {
        carrito.push({ codigo: codigo, cantidad: cantidad || 1 });
    }

    guardarCarrito(carrito);
    actualizarBadgeCarrito();
    Swal.fire("Agregado", producto.nombre + " se anadio al carrito.", "success");
}

function cambiarCantidadCarrito(codigo, delta) {
    const producto = obtenerProductoPorCodigo(codigo);
    const carrito = obtenerCarrito();
    const item = carrito.find(function (i) { return i.codigo === codigo; });
    if (!item || !producto) return;

    const nuevaCantidad = item.cantidad + delta;

    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(codigo);
        return;
    }

    if (nuevaCantidad > producto.stock) {
        Swal.fire("Stock insuficiente", "Solo hay " + producto.stock + " unidades disponibles.", "warning");
        return;
    }

    item.cantidad = nuevaCantidad;
    guardarCarrito(carrito);
    renderizarCarrito();
    actualizarBadgeCarrito();
}

function eliminarDelCarrito(codigo) {
    Swal.fire({
        title: "Eliminar producto?",
        text: "Se quitara del carrito de compras.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar"
    }).then(function (resultado) {
        if (resultado.isConfirmed) {
            const carrito = obtenerCarrito().filter(function (i) { return i.codigo !== codigo; });
            guardarCarrito(carrito);
            renderizarCarrito();
            actualizarBadgeCarrito();
            Swal.fire("Eliminado", "El producto fue eliminado del carrito.", "success");
        }
    });
}

function calcularTotales(carrito) {
    let total = 0;
    carrito.forEach(function (item) {
        const producto = obtenerProductoPorCodigo(item.codigo);
        if (producto) total += producto.precio * item.cantidad;
    });
    return total;
}

function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const contenedor = document.getElementById("carritoContenedor");
    const vacio = document.getElementById("carritoVacio");
    const resumen = document.getElementById("carritoResumen");

    if (carrito.length === 0) {
        contenedor.innerHTML = "";
        vacio.style.display = "block";
        resumen.style.display = "none";
        return;
    }

    vacio.style.display = "none";
    resumen.style.display = "block";
    contenedor.innerHTML = "";

    carrito.forEach(function (item) {
        const producto = obtenerProductoPorCodigo(item.codigo);
        if (!producto) return;
        const subtotal = producto.precio * item.cantidad;

        const fila = document.createElement("div");
        fila.className = "bg-forte-panel rounded p-3 mb-3";
        fila.innerHTML =
            '<div class="row align-items-center g-3">' +
            '<div class="col-3 col-md-2">' +
            '<a href="/producto-detalle?codigo=' + producto.codigo + '">' +
            '<img src="' + rutaImagenProducto(producto) + '" class="img-fluid rounded" alt="' + producto.nombre + '">' +
            '</a>' +
            '</div>' +
            '<div class="col-9 col-md-4">' +
            '<h3 class="h6 mb-1">' +
            '<a href="/producto-detalle?codigo=' + producto.codigo + '" class="text-decoration-none text-light">' + producto.nombre + '</a>' +
            '</h3>' +
            '<p class="small text-muted mb-0">' + formatearPrecio(producto.precio) + ' c/u</p>' +
            '</div>' +
            '<div class="col-6 col-md-3 d-flex align-items-center gap-2">' +
            '<button class="btn btn-outline-accent cart-qty-btn" onclick="cambiarCantidadCarrito(\'' + producto.codigo + '\', -1)">-</button>' +
            '<span class="fw-bold">' + item.cantidad + '</span>' +
            '<button class="btn btn-outline-accent cart-qty-btn" onclick="cambiarCantidadCarrito(\'' + producto.codigo + '\', 1)">+</button>' +
            '</div>' +
            '<div class="col-4 col-md-2">' +
            '<span class="fw-bold text-accent">' + formatearPrecio(subtotal) + '</span>' +
            '</div>' +
            '<div class="col-2 col-md-1 text-end">' +
            '<button class="btn btn-outline-danger btn-sm" onclick="eliminarDelCarrito(\'' + producto.codigo + '\')"><i class="bi bi-trash"></i></button>' +
            '</div>' +
            '</div>';

        contenedor.appendChild(fila);
    });

    const total = calcularTotales(carrito);
    document.getElementById("carritoTotal").textContent = formatearPrecio(total);
}

function vaciarCarrito() {
    guardarCarrito([]);
    renderizarCarrito();
    actualizarBadgeCarrito();
}

function finalizarCompra() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) return;

    Swal.fire({
        title: "Confirmar compra",
        text: "Total a pagar: " + formatearPrecio(calcularTotales(carrito)),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"
    }).then(function (resultado) {
        if (resultado.isConfirmed) {
            vaciarCarrito();
            Swal.fire("Gracias por tu compra", "Tu pedido fue registrado correctamente.", "success");
        }
    });
}
