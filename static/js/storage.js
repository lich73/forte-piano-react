/* Forte & Piano - storage.js
   Maneja las colecciones de localStorage (base de datos simulada),
   la sesion del usuario y la barra de navegacion comun a todas las paginas. */

const FORTEPIANO_KEYS = {
    usuarios: "fortepiano_usuarios",
    productos: "fortepiano_productos",
    categorias: "fortepiano_categorias",
    regiones: "fortepiano_regiones",
    comunas: "fortepiano_comunas",
    roles: "fortepiano_roles",
    carrito: "fortepiano_carrito",
    contactos: "fortepiano_contactos",
    blog: "fortepiano_blog",
    sesion: "fortepiano_sesion"
};

function obtenerColeccion(clave) {
    return JSON.parse(localStorage.getItem(clave)) || [];
}

function guardarColeccion(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}

/* ---------- Datos iniciales de prueba ---------- */

function inicializarDatos() {
    if (!localStorage.getItem(FORTEPIANO_KEYS.roles)) {
        guardarColeccion(FORTEPIANO_KEYS.roles, [
            { id: 1, nombre: "Administrador" },
            { id: 2, nombre: "Vendedor" },
            { id: 3, nombre: "Cliente" }
        ]);
    }

    if (!localStorage.getItem(FORTEPIANO_KEYS.categorias)) {
        guardarColeccion(FORTEPIANO_KEYS.categorias, [
            { id: 1, nombre: "Pianos Acusticos" },
            { id: 2, nombre: "Pianos Digitales" },
            { id: 3, nombre: "Sintetizadores" },
            { id: 4, nombre: "Accesorios" },
            { id: 5, nombre: "Amplificadores" },
            { id: 6, nombre: "Partituras" }
        ]);
    }

    if (!localStorage.getItem(FORTEPIANO_KEYS.regiones)) {
        guardarColeccion(FORTEPIANO_KEYS.regiones, [
            { id: 1, nombre: "Region Metropolitana" },
            { id: 2, nombre: "Valparaiso" },
            { id: 3, nombre: "Biobio" }
        ]);
    }

    if (!localStorage.getItem(FORTEPIANO_KEYS.comunas)) {
        guardarColeccion(FORTEPIANO_KEYS.comunas, [
            { id: 1, regionId: 1, nombre: "Santiago" },
            { id: 2, regionId: 1, nombre: "Providencia" },
            { id: 3, regionId: 1, nombre: "Maipu" },
            { id: 4, regionId: 2, nombre: "Valparaiso" },
            { id: 5, regionId: 2, nombre: "Vina del Mar" },
            { id: 6, regionId: 3, nombre: "Concepcion" },
            { id: 7, regionId: 3, nombre: "Talcahuano" }
        ]);
    }

    if (!localStorage.getItem(FORTEPIANO_KEYS.usuarios)) {
        guardarColeccion(FORTEPIANO_KEYS.usuarios, [
            {
                run: "123456785", nombre: "Admin", apellidos: "Forte",
                correo: "admin@gmail.com", password: "admin123",
                fechaNacimiento: "1990-01-01", rolId: 1,
                regionId: 1, comunaId: 1, direccion: "Av. Principal 123",
                estado: "Activo"
            },
            {
                run: "987654325", nombre: "Vendedor", apellidos: "Forte",
                correo: "vendedor@gmail.com", password: "vend1234",
                fechaNacimiento: "1992-05-14", rolId: 2,
                regionId: 1, comunaId: 2, direccion: "Calle Venta 456",
                estado: "Activo"
            },
            {
                run: "112223339", nombre: "Camila", apellidos: "Soto Perez",
                correo: "camila@gmail.com", password: "cliente1",
                fechaNacimiento: "1998-03-22", rolId: 3,
                regionId: 2, comunaId: 4, direccion: "Los Aromos 789",
                estado: "Activo"
            },
            {
                run: "201113334", nombre: "Diego", apellidos: "Fernandez Rojas",
                correo: "diego@duoc.cl", password: "diego123",
                fechaNacimiento: "2001-11-09", rolId: 3,
                regionId: 3, comunaId: 6, direccion: "Las Rosas 321",
                estado: "Activo"
            }
        ]);
    }

    // TEMPORAL: forzar recarga de productos con imagenes reales (borrar despues)
    localStorage.removeItem(FORTEPIANO_KEYS.productos);

    if (!localStorage.getItem(FORTEPIANO_KEYS.productos)) {
        guardarColeccion(FORTEPIANO_KEYS.productos, [
            { codigo: "AC-005", nombre: "Soporte de Teclado Doble", descripcion: "Soporte de teclado tipo tijera de metal resistente con altura ajustable, compatible con la mayoria de pianos digitales y teclados.", precio: 17990, stock: 10, stockCritico: 3, categoriaId: 4, imagen: "productos/prod-soporte-teclado-doble.webp", estado: "Activo" },
            { codigo: "PD-006", nombre: "Yamaha Arius YDP-146 Rosewood", descripcion: "Piano digital de mueble con teclas contrapesadas GH3, sonido Pure CF Sampling y acabado elegante en palisandro.", precio: 699990, stock: 25, stockCritico: 5, categoriaId: 2, imagen: "productos/prod-piano-yamaha-arius-ydp-146-rosewood.webp", estado: "Activo" },
            { codigo: "AD-001", nombre: "Funda GTSA Key 61 con Ruedas", descripcion: "Funda acolchada con ruedas para teclados de 61 teclas, protege tu instrumento del polvo y la humedad durante el transporte.", precio: 25000, stock: 15, stockCritico: 4, categoriaId: 4, imagen: "productos/prod-funda-gtsa-key-61-ruedas.webp", estado: "Activo" },
            { codigo: "PA-001", nombre: "Piano Yamaha B1", descripcion: "Piano acustico vertical de la serie B, ideal para estudiantes y espacios reducidos. Sonido brillante y mecanismo fiable.", precio: 3299000, stock: 5, stockCritico: 2, categoriaId: 1, imagen: "productos/prod-piano-yamaha-b10.webp", estado: "Activo" },
            { codigo: "PD-001", nombre: "Yamaha P-45 Negro", descripcion: "Piano digital de entrada con 88 teclas contrapesadas GHS y tecnologia Pure CF Sampling. Compacto y portatil.", precio: 459990, stock: 30, stockCritico: 5, categoriaId: 2, imagen: "productos/prod-piano-yamaha-p45-negro.webp", estado: "Activo" },
            { codigo: "SY-001", nombre: "Nord Electro 6D 61", descripcion: "Teclado de escenario premium con 61 teclas, motores de piano, organo y sintetizador. Sonido profesional de referencia.", precio: 1899990, stock: 12, stockCritico: 3, categoriaId: 3, imagen: "productos/prod-teclado-nord-electro-6d-61.jpg", estado: "Activo" },
            { codigo: "AD-003", nombre: "Pedal de Sustain SP-34", descripcion: "Pedal de sustain estilo piano con accion progresiva, compatible con la mayoria de pianos y teclados digitales.", precio: 15000, stock: 25, stockCritico: 5, categoriaId: 4, imagen: "productos/prod-pedal-sp-34.webp", estado: "Activo" },
            { codigo: "PD-002", nombre: "Donner DDP-80 Digital Piano", descripcion: "Piano digital compacto de 88 teclas contrapesadas con 128 voces de polifonia y diseno moderno en madera.", precio: 659990, stock: 18, stockCritico: 4, categoriaId: 2, imagen: "productos/prod-piano-donner-ddp-80.webp", estado: "Activo" }
        ]);
    }

    // TEMPORAL: forzar recarga de blog con imagenes reales (borrar despues)
    localStorage.removeItem(FORTEPIANO_KEYS.blog);

    if (!localStorage.getItem(FORTEPIANO_KEYS.blog)) {
        guardarColeccion(FORTEPIANO_KEYS.blog, [
            { id: 1, titulo: "Forte & Piano abre sus puertas", resumen: "Nace una nueva tienda online pensada por y para los pianistas y músicos de Chile.", imagen: "blog/apertura_nueva.jpg", fecha: "2026-08-01", slug: "detalle-1" },
            { id: 2, titulo: "Cuidando tu piano acústico", resumen: "Consejos clave sobre humedad, temperatura y afinación para mantener tu piano en perfecto estado.", imagen: "blog/banner.jpg", fecha: "2026-08-10", slug: "detalle-2" },
            { id: 3, titulo: "5 curiosidades sobre los pianos", resumen: "Datos interesantes que quizás no conocías sobre el rey de los instrumentos musicales.", imagen: "blog/piano.webp", fecha: "2026-08-20", slug: "detalle-3" }
        ]);
    }

    if (!localStorage.getItem(FORTEPIANO_KEYS.carrito)) {
        guardarColeccion(FORTEPIANO_KEYS.carrito, []);
    }

    if (!localStorage.getItem(FORTEPIANO_KEYS.contactos)) {
        guardarColeccion(FORTEPIANO_KEYS.contactos, []);
    }
}

/* ---------- Sesion ---------- */

function obtenerSesion() {
    return JSON.parse(localStorage.getItem(FORTEPIANO_KEYS.sesion)) || null;
}

function guardarSesion(usuario) {
    localStorage.setItem(FORTEPIANO_KEYS.sesion, JSON.stringify(usuario));
}

function cerrarSesion() {
    localStorage.removeItem(FORTEPIANO_KEYS.sesion);
    window.location.href = "/login";
}

function obtenerNombreRol(rolId) {
    const rol = obtenerColeccion(FORTEPIANO_KEYS.roles).find(function (r) { return r.id === rolId; });
    return rol ? rol.nombre : "";
}

/* Protege paginas administrativas segun el rol permitido. */
function protegerPaginaAdmin(rolesPermitidos) {
    const sesion = obtenerSesion();
    if (!sesion || rolesPermitidos.indexOf(sesion.rolId) === -1) {
        Swal.fire({
            title: "Acceso restringido",
            text: "Debes iniciar sesion con una cuenta autorizada para ver esta pagina.",
            icon: "warning",
            confirmButtonText: "Ir a Iniciar sesion"
        }).then(function () {
            window.location.href = "/login";
        });
        return false;
    }
    return true;
}

/* ---------- Navbar dinamica ---------- */

function actualizarNavbar() {
    const sesion = obtenerSesion();
    const navInvitado = document.getElementById("navInvitado");
    const navUsuario = document.getElementById("navUsuario");
    const navUsuarioNombre = document.getElementById("navUsuarioNombre");
    const navAdminItem = document.getElementById("navAdminItem");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    if (!navInvitado || !navUsuario) return;

    if (sesion) {
        navInvitado.style.display = "none";
        navUsuario.style.display = "block";
        if (navUsuarioNombre) navUsuarioNombre.textContent = sesion.nombre;
        if (navAdminItem && (sesion.rolId === 1 || sesion.rolId === 2)) {
            navAdminItem.style.display = "block";
        }
    } else {
        navInvitado.style.display = "flex";
        navUsuario.style.display = "none";
        if (navAdminItem) navAdminItem.style.display = "none";
    }

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", function (evento) {
            evento.preventDefault();
            cerrarSesion();
        });
    }
}

/* ---------- Badge del carrito ---------- */

function actualizarBadgeCarrito() {
    const carrito = obtenerColeccion(FORTEPIANO_KEYS.carrito);
    let totalItems = 0;
    for (let i = 0; i < carrito.length; i++) {
        totalItems += carrito[i].cantidad;
    }
    const badge = document.getElementById("carritoBadge");
    if (!badge) return;
    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.style.display = "block";
    } else {
        badge.style.display = "none";
    }
}

/* Oculta la seccion de Usuarios en el menu administrativo para el rol Vendedor. */
function ocultarUsuariosSiVendedor() {
    const sesion = obtenerSesion();
    if (!sesion || sesion.rolId !== 2) return;
    const enlaceSidebar = document.getElementById("sidebarUsuariosLink");
    const enlaceOffcanvas = document.getElementById("offcanvasUsuariosLink");
    if (enlaceSidebar) enlaceSidebar.style.display = "none";
    if (enlaceOffcanvas) enlaceOffcanvas.style.display = "none";
}

/* Marca como activo el enlace del navbar/sidebar que corresponde a la pagina actual. */
function marcarEnlaceActivo() {
    const rutaActual = window.location.pathname;
    document.querySelectorAll(".nav-link").forEach(function (enlace) {
        const href = enlace.getAttribute("href");
        if (href && href !== "#" && href === rutaActual) {
            enlace.classList.add("active");
        }
    });
}

function formatearPrecio(valor) {
    return "$" + Number(valor).toLocaleString("es-CL");
}

document.addEventListener("DOMContentLoaded", function () {
    inicializarDatos();
    actualizarNavbar();
    actualizarBadgeCarrito();
    marcarEnlaceActivo();
});
