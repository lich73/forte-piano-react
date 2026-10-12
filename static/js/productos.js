/* Forte & Piano - productos.js
   Logica de catalogo, detalle de producto y mantenedor administrativo de productos. */

function obtenerProductos() {
    return obtenerColeccion(FORTEPIANO_KEYS.productos);
}

function obtenerProductoPorCodigo(codigo) {
    return obtenerProductos().find(function (p) { return p.codigo === codigo; });
}

function obtenerNombreCategoria(categoriaId) {
    const categoria = obtenerColeccion(FORTEPIANO_KEYS.categorias).find(function (c) { return c.id === Number(categoriaId); });
    return categoria ? categoria.nombre : "Sin categoria";
}

function rutaImagenProducto(producto) {
    if (!producto.imagen) return "/static/img/logo.svg";
    return "/static/img/" + producto.imagen;
}

/* Genera dinamicamente una tarjeta Bootstrap para un producto. */
function crearTarjetaProducto(producto) {
    const columna = document.createElement("div");
    columna.className = "col-sm-6 col-lg-3";

    const agotado = producto.stock <= 0;

    columna.innerHTML =
        '<div class="card h-100 card-forte-hover">' +
        '<a href="/producto-detalle?codigo=' + producto.codigo + '">' +
        '<img src="' + rutaImagenProducto(producto) + '" class="card-img-top" alt="' + producto.nombre + '">' +
        '</a>' +
        '<div class="card-body d-flex flex-column" style="cursor: pointer;" onclick="window.location.href=\'/producto-detalle?codigo=' + producto.codigo + '\'">' +
        '<span class="badge bg-secondary align-self-start mb-2">' + obtenerNombreCategoria(producto.categoriaId) + '</span>' +
        '<h3 class="h6">' +
        '<a href="/producto-detalle?codigo=' + producto.codigo + '" class="text-decoration-none text-light">' + producto.nombre + '</a>' +
        '</h3>' +
        '<p class="fw-bold text-accent mb-2">' + formatearPrecio(producto.precio) + '</p>' +
        '<p class="small text-muted mb-3">' + (agotado ? '<span class="badge bg-danger">Sin stock</span>' : 'Stock: ' + producto.stock) + '</p>' +
        '<div class="mt-auto d-flex gap-2">' +
        '<a href="/producto-detalle?codigo=' + producto.codigo + '" class="btn btn-outline-accent btn-sm flex-fill" onclick="event.stopPropagation();">Ver detalle</a>' +
        '<button class="btn btn-accent btn-sm flex-fill" ' + (agotado ? "disabled" : "") + ' onclick="event.stopPropagation(); agregarAlCarrito(\'' + producto.codigo + '\', 1)"><i class="bi bi-cart-plus"></i></button>' +
        '</div>' +
        '</div>' +
        '</div>';

    return columna;
}

function mostrarProductosDestacados(idContenedor, cantidad) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;
    const productos = obtenerProductos().filter(function (p) { return p.estado === "Activo"; }).slice(0, cantidad);
    contenedor.innerHTML = "";
    productos.forEach(function (producto) {
        contenedor.appendChild(crearTarjetaProducto(producto));
    });
}

/* Pinta el catalogo completo aplicando filtros de busqueda y categoria. */
function mostrarCatalogo(idContenedor, texto, categoriaId) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;

    let productos = obtenerProductos().filter(function (p) { return p.estado === "Activo"; });

    if (texto) {
        const busqueda = texto.toLowerCase();
        productos = productos.filter(function (p) { return p.nombre.toLowerCase().includes(busqueda); });
    }

    if (categoriaId) {
        productos = productos.filter(function (p) { return p.categoriaId === Number(categoriaId); });
    }

    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = '<div class="col-12"><p class="text-muted text-center py-5">No se encontraron productos con esos criterios.</p></div>';
        return;
    }

    productos.forEach(function (producto) {
        contenedor.appendChild(crearTarjetaProducto(producto));
    });
}

function llenarSelectCategorias(idSelect, incluirTodas) {
    const select = document.getElementById(idSelect);
    if (!select) return;
    const categorias = obtenerColeccion(FORTEPIANO_KEYS.categorias);

    select.innerHTML = "";
    if (incluirTodas) {
        select.innerHTML += '<option value="">Todas las categorias</option>';
    } else {
        select.innerHTML += '<option value="">Seleccione una categoria</option>';
    }
    categorias.forEach(function (categoria) {
        select.innerHTML += '<option value="' + categoria.id + '">' + categoria.nombre + '</option>';
    });
}

/* ---------- Detalle de producto ---------- */

function mostrarDetalleProducto() {
    const parametros = new URLSearchParams(window.location.search);
    const codigo = parametros.get("codigo");
    const producto = obtenerProductoPorCodigo(codigo);
    const contenedor = document.getElementById("detalleProducto");

    if (!producto) {
        contenedor.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">Producto no encontrado.</p><a href="/productos" class="btn btn-accent">Volver al catalogo</a></div>';
        return;
    }

    document.title = producto.nombre + " - Forte & Piano";
    const agotado = producto.stock <= 0;

    contenedor.innerHTML =
        '<div class="col-md-5">' +
        '<img src="' + rutaImagenProducto(producto) + '" class="img-fluid rounded bg-forte-panel p-2" alt="' + producto.nombre + '">' +
        '</div>' +
        '<div class="col-md-7">' +
        '<span class="badge bg-secondary mb-2">' + obtenerNombreCategoria(producto.categoriaId) + '</span>' +
        '<h1 class="h3">' + producto.nombre + '</h1>' +
        '<p class="text-muted">' + (producto.descripcion || "Sin descripcion disponible.") + '</p>' +
        '<p class="display-6 text-accent">' + formatearPrecio(producto.precio) + '</p>' +
        '<p>' + (agotado ? '<span class="badge bg-danger">Sin stock</span>' : '<span class="badge bg-success">Stock disponible: ' + producto.stock + '</span>') + '</p>' +
        '<div class="d-flex align-items-center gap-3 my-3">' +
        '<label for="cantidadDetalle" class="form-label mb-0">Cantidad</label>' +
        '<input type="number" id="cantidadDetalle" class="form-control" style="width:90px;" value="1" min="1" max="' + Math.max(producto.stock, 1) + '" ' + (agotado ? "disabled" : "") + '>' +
        '</div>' +
        '<button class="btn btn-accent btn-lg" ' + (agotado ? "disabled" : "") + ' onclick="agregarAlCarritoDesdeDetalle(\'' + producto.codigo + '\')"><i class="bi bi-cart-plus"></i> Anadir al carrito</button>' +
        '</div>';
}

function agregarAlCarritoDesdeDetalle(codigo) {
    const cantidadInput = document.getElementById("cantidadDetalle");
    const cantidad = parseInt(cantidadInput.value, 10) || 1;
    agregarAlCarrito(codigo, cantidad);
}

/* ==================== MANTENEDOR ADMINISTRATIVO ==================== */

function guardarProducto(producto) {
    const productos = obtenerProductos();
    const indice = productos.findIndex(function (p) { return p.codigo === producto.codigo; });
    if (indice === -1) {
        productos.push(producto);
    } else {
        productos[indice] = producto;
    }
    guardarColeccion(FORTEPIANO_KEYS.productos, productos);
}

function eliminarProducto(codigo) {
    const productos = obtenerProductos().filter(function (p) { return p.codigo !== codigo; });
    guardarColeccion(FORTEPIANO_KEYS.productos, productos);
}

function cargarTablaProductosAdmin() {
    const productos = obtenerProductos();
    const cuerpoTabla = document.getElementById("cuerpoTablaProductos");
    cuerpoTabla.innerHTML = "";

    const sesion = obtenerSesion();
    const soloLectura = sesion && sesion.rolId === 2;
    const botonNuevo = document.getElementById("btnNuevoProducto");
    if (botonNuevo && soloLectura) botonNuevo.style.display = "none";

    productos.forEach(function (producto) {
        const critico = producto.stockCritico != null && producto.stock <= producto.stockCritico;
        const fila = document.createElement("tr");
        const acciones = soloLectura
            ? '<button class="btn btn-sm btn-outline-accent" onclick="verProductoAdmin(\'' + producto.codigo + '\')" title="Ver"><i class="bi bi-eye"></i></button>'
            : '<button class="btn btn-sm btn-outline-accent me-1" onclick="verProductoAdmin(\'' + producto.codigo + '\')" title="Ver"><i class="bi bi-eye"></i></button>' +
            '<button class="btn btn-sm btn-outline-light me-1" onclick="window.location.href=\'/admin/productos/form?codigo=' + producto.codigo + '\'" title="Editar"><i class="bi bi-pencil"></i></button>' +
            '<button class="btn btn-sm btn-outline-danger" onclick="confirmarEliminarProducto(\'' + producto.codigo + '\')" title="Eliminar"><i class="bi bi-trash"></i></button>';

        fila.innerHTML =
            '<td>' + producto.codigo + '</td>' +
            '<td><img src="' + rutaImagenProducto(producto) + '" alt="' + producto.nombre + '" height="40"></td>' +
            '<td>' + producto.nombre + '</td>' +
            '<td>' + obtenerNombreCategoria(producto.categoriaId) + '</td>' +
            '<td>' + formatearPrecio(producto.precio) + '</td>' +
            '<td class="' + (critico ? "stock-critico" : "") + '">' + producto.stock + (critico ? ' <i class="bi bi-exclamation-triangle-fill"></i>' : '') + '</td>' +
            '<td><span class="badge ' + (producto.estado === "Activo" ? "bg-success" : "bg-secondary") + '">' + producto.estado + '</span></td>' +
            '<td class="text-nowrap">' + acciones + '</td>';
        cuerpoTabla.appendChild(fila);
    });

    if ($.fn.DataTable.isDataTable("#tablaProductos")) {
        $("#tablaProductos").DataTable().destroy();
    }
    $("#tablaProductos").DataTable({
        language: {
            "decimal": "",
            "emptyTable": "No hay información",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
            "infoFiltered": "(Filtrado de _MAX_ total entradas)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ Entradas",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "zeroRecords": "Sin resultados encontrados",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        },
        pageLength: 5
    });
}

function verProductoAdmin(codigo) {
    const producto = obtenerProductoPorCodigo(codigo);
    if (!producto) return;
    Swal.fire({
        title: producto.nombre,
        html:
            '<img src="' + rutaImagenProducto(producto) + '" class="img-fluid mb-3" style="max-height:160px;"><br>' +
            '<p class="text-start"><strong>Codigo:</strong> ' + producto.codigo + '<br>' +
            '<strong>Categoria:</strong> ' + obtenerNombreCategoria(producto.categoriaId) + '<br>' +
            '<strong>Precio:</strong> ' + formatearPrecio(producto.precio) + '<br>' +
            '<strong>Stock:</strong> ' + producto.stock + '<br>' +
            '<strong>Stock critico:</strong> ' + (producto.stockCritico != null ? producto.stockCritico : "-") + '<br>' +
            '<strong>Descripcion:</strong> ' + (producto.descripcion || "-") + '</p>',
        confirmButtonText: "Cerrar"
    });
}

function confirmarEliminarProducto(codigo) {
    Swal.fire({
        title: "Eliminar producto?",
        text: "Esta accion no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar"
    }).then(function (resultado) {
        if (resultado.isConfirmed) {
            eliminarProducto(codigo);
            Swal.fire("Eliminado", "El producto fue eliminado correctamente.", "success");
            cargarTablaProductosAdmin();
        }
    });
}

/* Prepara el formulario Nuevo/Editar segun exista ?codigo= en la URL. */
function inicializarFormularioProducto() {
    llenarSelectCategorias("categoriaProducto", false);

    const parametros = new URLSearchParams(window.location.search);
    const codigo = parametros.get("codigo");

    if (codigo) {
        const producto = obtenerProductoPorCodigo(codigo);
        if (producto) {
            document.getElementById("tituloFormularioProducto").textContent = "Editar producto";
            document.getElementById("codigoProducto").value = producto.codigo;
            document.getElementById("codigoProducto").readOnly = true;
            document.getElementById("nombreProducto").value = producto.nombre;
            document.getElementById("descripcionProducto").value = producto.descripcion || "";
            document.getElementById("precioProducto").value = producto.precio;
            document.getElementById("stockProducto").value = producto.stock;
            document.getElementById("stockCriticoProducto").value = producto.stockCritico != null ? producto.stockCritico : "";
            document.getElementById("categoriaProducto").value = producto.categoriaId;
            document.getElementById("imagenProducto").value = producto.imagen || "";
            document.getElementById("estadoProducto").value = producto.estado || "Activo";
        }
    }

    document.getElementById("formularioProducto").addEventListener("submit", function (evento) {
        evento.preventDefault();
        procesarFormularioProducto(codigo);
    });
}

function procesarFormularioProducto(codigoOriginal) {
    const codigo = document.getElementById("codigoProducto");
    const nombre = document.getElementById("nombreProducto");
    const descripcion = document.getElementById("descripcionProducto");
    const precio = document.getElementById("precioProducto");
    const stock = document.getElementById("stockProducto");
    const stockCritico = document.getElementById("stockCriticoProducto");
    const categoria = document.getElementById("categoriaProducto");
    const imagen = document.getElementById("imagenProducto");
    const estado = document.getElementById("estadoProducto");

    let esValido = true;

    if (textoRequerido(codigo.value, null) && codigo.value.trim().length >= 3) {
        marcarValido(codigo);
    } else {
        marcarInvalido(codigo);
        esValido = false;
    }

    const codigoDuplicado = obtenerProductos().some(function (p) {
        return p.codigo === codigo.value.trim() && p.codigo !== codigoOriginal;
    });
    if (codigoDuplicado) {
        marcarInvalido(codigo);
        esValido = false;
    }

    if (textoRequerido(nombre.value, 100)) {
        marcarValido(nombre);
    } else {
        marcarInvalido(nombre);
        esValido = false;
    }

    if (!descripcion.value || descripcion.value.trim().length <= 500) {
        marcarValido(descripcion);
    } else {
        marcarInvalido(descripcion);
        esValido = false;
    }

    if (numeroEnRango(precio.value, 0)) {
        marcarValido(precio);
    } else {
        marcarInvalido(precio);
        esValido = false;
    }

    if (enteroEnRango(stock.value, 0)) {
        marcarValido(stock);
    } else {
        marcarInvalido(stock);
        esValido = false;
    }

    if (!stockCritico.value || enteroEnRango(stockCritico.value, 0)) {
        marcarValido(stockCritico);
    } else {
        marcarInvalido(stockCritico);
        esValido = false;
    }

    if (categoria.value) {
        marcarValido(categoria);
    } else {
        marcarInvalido(categoria);
        esValido = false;
    }

    if (!esValido) {
        Swal.fire("Revisa el formulario", "Existen campos obligatorios o invalidos.", "error");
        return;
    }

    const producto = {
        codigo: codigo.value.trim(),
        nombre: nombre.value.trim(),
        descripcion: descripcion.value.trim(),
        precio: Number(precio.value),
        stock: Number(stock.value),
        stockCritico: stockCritico.value ? Number(stockCritico.value) : null,
        categoriaId: Number(categoria.value),
        imagen: imagen.value.trim() || "logo.svg",
        estado: estado.value
    };

    guardarProducto(producto);

    let mensajeExtra = "";
    if (producto.stockCritico != null && producto.stock <= producto.stockCritico) {
        mensajeExtra = " El stock esta en o bajo el nivel critico.";
    }

    Swal.fire("Correcto", "Producto guardado correctamente." + mensajeExtra, "success").then(function () {
        window.location.href = "/admin/productos";
    });
}
