/* Forte & Piano - usuarios.js
   Logica de registro, login y mantenedor administrativo de usuarios. */

function obtenerUsuarios() {
    return obtenerColeccion(FORTEPIANO_KEYS.usuarios);
}

function obtenerUsuarioPorRun(run) {
    return obtenerUsuarios().find(function (u) { return u.run === run; });
}

function obtenerNombreRegion(regionId) {
    const region = obtenerColeccion(FORTEPIANO_KEYS.regiones).find(function (r) { return r.id === Number(regionId); });
    return region ? region.nombre : "-";
}

function obtenerNombreComuna(comunaId) {
    const comuna = obtenerColeccion(FORTEPIANO_KEYS.comunas).find(function (c) { return c.id === Number(comunaId); });
    return comuna ? comuna.nombre : "-";
}

function llenarSelectRegiones(idSelect) {
    const select = document.getElementById(idSelect);
    if (!select) return;
    const regiones = obtenerColeccion(FORTEPIANO_KEYS.regiones);
    select.innerHTML = '<option value="">Seleccione una region</option>';
    regiones.forEach(function (region) {
        select.innerHTML += '<option value="' + region.id + '">' + region.nombre + '</option>';
    });
}

/* Filtra las comunas segun la region seleccionada. */
function llenarSelectComunas(idSelectRegion, idSelectComuna, comunaSeleccionada) {
    const selectRegion = document.getElementById(idSelectRegion);
    const selectComuna = document.getElementById(idSelectComuna);
    if (!selectRegion || !selectComuna) return;

    const regionId = Number(selectRegion.value);
    const comunas = obtenerColeccion(FORTEPIANO_KEYS.comunas).filter(function (c) { return c.regionId === regionId; });

    selectComuna.innerHTML = '<option value="">Seleccione una comuna</option>';
    comunas.forEach(function (comuna) {
        selectComuna.innerHTML += '<option value="' + comuna.id + '">' + comuna.nombre + '</option>';
    });

    if (comunaSeleccionada) {
        selectComuna.value = comunaSeleccionada;
    }
}

/* ==================== REGISTRO ==================== */

function inicializarFormularioRegistro() {
    llenarSelectRegiones("regionRegistro");

    document.getElementById("regionRegistro").addEventListener("change", function () {
        llenarSelectComunas("regionRegistro", "comunaRegistro");
    });

    document.getElementById("formularioRegistro").addEventListener("submit", function (evento) {
        evento.preventDefault();
        procesarRegistro();
    });
}

function procesarRegistro() {
    const run = document.getElementById("runRegistro");
    const nombre = document.getElementById("nombreRegistro");
    const apellidos = document.getElementById("apellidosRegistro");
    const correo = document.getElementById("correoRegistro");
    const password = document.getElementById("passwordRegistro");
    const fechaNacimiento = document.getElementById("fechaNacimientoRegistro");
    const region = document.getElementById("regionRegistro");
    const comuna = document.getElementById("comunaRegistro");
    const direccion = document.getElementById("direccionRegistro");

    let esValido = true;

    if (validarRun(run.value)) {
        marcarValido(run);
    } else {
        marcarInvalido(run);
        esValido = false;
    }

    const runDuplicado = obtenerUsuarioPorRun(run.value.toUpperCase().trim());
    if (runDuplicado) {
        marcarInvalido(run);
        esValido = false;
    }

    if (textoRequerido(nombre.value, 50)) {
        marcarValido(nombre);
    } else {
        marcarInvalido(nombre);
        esValido = false;
    }

    if (textoRequerido(apellidos.value, 100)) {
        marcarValido(apellidos);
    } else {
        marcarInvalido(apellidos);
        esValido = false;
    }

    if (validarCorreo(correo.value)) {
        marcarValido(correo);
    } else {
        marcarInvalido(correo);
        esValido = false;
    }

    if (validarPassword(password.value)) {
        marcarValido(password);
    } else {
        marcarInvalido(password);
        esValido = false;
    }

    if (region.value) {
        marcarValido(region);
    } else {
        marcarInvalido(region);
        esValido = false;
    }

    if (comuna.value) {
        marcarValido(comuna);
    } else {
        marcarInvalido(comuna);
        esValido = false;
    }

    if (textoRequerido(direccion.value, 300)) {
        marcarValido(direccion);
    } else {
        marcarInvalido(direccion);
        esValido = false;
    }

    if (!esValido) {
        Swal.fire("Revisa el formulario", "Existen campos obligatorios o invalidos.", "error");
        return;
    }

    const nuevoUsuario = {
        run: run.value.toUpperCase().trim(),
        nombre: nombre.value.trim(),
        apellidos: apellidos.value.trim(),
        correo: correo.value.trim(),
        password: password.value,
        fechaNacimiento: fechaNacimiento.value || "",
        rolId: 3,
        regionId: Number(region.value),
        comunaId: Number(comuna.value),
        direccion: direccion.value.trim(),
        estado: "Activo"
    };

    const usuarios = obtenerUsuarios();
    usuarios.push(nuevoUsuario);
    guardarColeccion(FORTEPIANO_KEYS.usuarios, usuarios);

    Swal.fire("Correcto", "Usuario registrado correctamente.", "success").then(function () {
        window.location.href = "/login";
    });
}

/* ==================== LOGIN ==================== */

function inicializarFormularioLogin() {
    document.getElementById("formularioLogin").addEventListener("submit", function (evento) {
        evento.preventDefault();
        procesarLogin();
    });
}

function procesarLogin() {
    const correo = document.getElementById("correoLogin");
    const password = document.getElementById("passwordLogin");

    let esValido = true;

    if (validarCorreo(correo.value)) {
        marcarValido(correo);
    } else {
        marcarInvalido(correo);
        esValido = false;
    }

    if (validarPassword(password.value)) {
        marcarValido(password);
    } else {
        marcarInvalido(password);
        esValido = false;
    }

    if (!esValido) {
        Swal.fire("Revisa el formulario", "Correo o contrasena con formato invalido.", "error");
        return;
    }

    const usuario = obtenerUsuarios().find(function (u) {
        return u.correo.toLowerCase() === correo.value.toLowerCase() && u.password === password.value;
    });

    if (!usuario) {
        Swal.fire("Credenciales incorrectas", "El correo o la contrasena no coinciden.", "error");
        return;
    }

    if (usuario.estado === "Inactivo") {
        Swal.fire("Cuenta inactiva", "Tu cuenta se encuentra deshabilitada. Contacta a un administrador.", "warning");
        return;
    }

    guardarSesion({
        run: usuario.run,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        rolId: usuario.rolId
    });

    Swal.fire("Bienvenido", "Inicio de sesion correcto.", "success").then(function () {
        if (usuario.rolId === 1 || usuario.rolId === 2) {
            window.location.href = "/admin";
        } else {
            window.location.href = "/";
        }
    });
}

/* ==================== MANTENEDOR ADMINISTRATIVO ==================== */

function guardarUsuario(usuario) {
    const usuarios = obtenerUsuarios();
    const indice = usuarios.findIndex(function (u) { return u.run === usuario.run; });
    if (indice === -1) {
        usuarios.push(usuario);
    } else {
        usuarios[indice] = usuario;
    }
    guardarColeccion(FORTEPIANO_KEYS.usuarios, usuarios);
}

function eliminarUsuario(run) {
    const usuarios = obtenerUsuarios().filter(function (u) { return u.run !== run; });
    guardarColeccion(FORTEPIANO_KEYS.usuarios, usuarios);
}

function cargarTablaUsuariosAdmin() {
    const usuarios = obtenerUsuarios();
    const cuerpoTabla = document.getElementById("cuerpoTablaUsuarios");
    cuerpoTabla.innerHTML = "";

    usuarios.forEach(function (usuario) {
        const fila = document.createElement("tr");
        fila.innerHTML =
            '<td>' + usuario.run + '</td>' +
            '<td>' + usuario.nombre + '</td>' +
            '<td>' + usuario.apellidos + '</td>' +
            '<td>' + usuario.correo + '</td>' +
            '<td>' + obtenerNombreRol(usuario.rolId) + '</td>' +
            '<td>' + obtenerNombreRegion(usuario.regionId) + '</td>' +
            '<td><span class="badge ' + (usuario.estado === "Activo" ? "bg-success" : "bg-secondary") + '">' + usuario.estado + '</span></td>' +
            '<td class="text-nowrap">' +
            '<button class="btn btn-sm btn-outline-accent me-1" onclick="verUsuarioAdmin(\'' + usuario.run + '\')" title="Ver"><i class="bi bi-eye"></i></button>' +
            '<button class="btn btn-sm btn-outline-light me-1" onclick="window.location.href=\'/admin/usuarios/form?run=' + usuario.run + '\'" title="Editar"><i class="bi bi-pencil"></i></button>' +
            '<button class="btn btn-sm btn-outline-danger" onclick="confirmarEliminarUsuario(\'' + usuario.run + '\')" title="Eliminar"><i class="bi bi-trash"></i></button>' +
            '</td>';
        cuerpoTabla.appendChild(fila);
    });

    if ($.fn.DataTable.isDataTable("#tablaUsuarios")) {
        $("#tablaUsuarios").DataTable().destroy();
    }
    $("#tablaUsuarios").DataTable({
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
        pageLength: 5,
    });
}

function verUsuarioAdmin(run) {
    const usuario = obtenerUsuarioPorRun(run);
    if (!usuario) return;
    Swal.fire({
        title: usuario.nombre + " " + usuario.apellidos,
        html:
            '<p class="text-start"><strong>RUN:</strong> ' + usuario.run + '<br>' +
            '<strong>Correo:</strong> ' + usuario.correo + '<br>' +
            '<strong>Rol:</strong> ' + obtenerNombreRol(usuario.rolId) + '<br>' +
            '<strong>Region:</strong> ' + obtenerNombreRegion(usuario.regionId) + '<br>' +
            '<strong>Comuna:</strong> ' + obtenerNombreComuna(usuario.comunaId) + '<br>' +
            '<strong>Direccion:</strong> ' + usuario.direccion + '<br>' +
            '<strong>Estado:</strong> ' + usuario.estado + '</p>',
        confirmButtonText: "Cerrar"
    });
}

function confirmarEliminarUsuario(run) {
    Swal.fire({
        title: "Eliminar usuario?",
        text: "Esta accion no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar"
    }).then(function (resultado) {
        if (resultado.isConfirmed) {
            eliminarUsuario(run);
            Swal.fire("Eliminado", "El usuario fue eliminado correctamente.", "success");
            cargarTablaUsuariosAdmin();
        }
    });
}

function llenarSelectRoles(idSelect) {
    const select = document.getElementById(idSelect);
    if (!select) return;
    const roles = obtenerColeccion(FORTEPIANO_KEYS.roles);
    select.innerHTML = '<option value="">Seleccione un tipo de usuario</option>';
    roles.forEach(function (rol) {
        select.innerHTML += '<option value="' + rol.id + '">' + rol.nombre + '</option>';
    });
}

/* Prepara el formulario Nuevo/Editar segun exista ?run= en la URL. */
function inicializarFormularioUsuarioAdmin() {
    llenarSelectRoles("rolUsuario");
    llenarSelectRegiones("regionUsuario");

    document.getElementById("regionUsuario").addEventListener("change", function () {
        llenarSelectComunas("regionUsuario", "comunaUsuario");
    });

    const parametros = new URLSearchParams(window.location.search);
    const run = parametros.get("run");

    if (run) {
        const usuario = obtenerUsuarioPorRun(run);
        if (usuario) {
            document.getElementById("tituloFormularioUsuario").textContent = "Editar usuario";
            document.getElementById("runUsuario").value = usuario.run;
            document.getElementById("runUsuario").readOnly = true;
            document.getElementById("nombreUsuario").value = usuario.nombre;
            document.getElementById("apellidosUsuario").value = usuario.apellidos;
            document.getElementById("correoUsuario").value = usuario.correo;
            document.getElementById("passwordUsuario").value = usuario.password;
            document.getElementById("fechaNacimientoUsuario").value = usuario.fechaNacimiento || "";
            document.getElementById("rolUsuario").value = usuario.rolId;
            document.getElementById("regionUsuario").value = usuario.regionId;
            llenarSelectComunas("regionUsuario", "comunaUsuario", usuario.comunaId);
            document.getElementById("direccionUsuario").value = usuario.direccion;
            document.getElementById("estadoUsuario").value = usuario.estado || "Activo";
        }
    }

    document.getElementById("formularioUsuario").addEventListener("submit", function (evento) {
        evento.preventDefault();
        procesarFormularioUsuarioAdmin(run);
    });
}

function procesarFormularioUsuarioAdmin(runOriginal) {
    const run = document.getElementById("runUsuario");
    const nombre = document.getElementById("nombreUsuario");
    const apellidos = document.getElementById("apellidosUsuario");
    const correo = document.getElementById("correoUsuario");
    const password = document.getElementById("passwordUsuario");
    const fechaNacimiento = document.getElementById("fechaNacimientoUsuario");
    const rol = document.getElementById("rolUsuario");
    const region = document.getElementById("regionUsuario");
    const comuna = document.getElementById("comunaUsuario");
    const direccion = document.getElementById("direccionUsuario");
    const estado = document.getElementById("estadoUsuario");

    let esValido = true;

    if (validarRun(run.value)) {
        marcarValido(run);
    } else {
        marcarInvalido(run);
        esValido = false;
    }

    const runDuplicado = obtenerUsuarios().some(function (u) {
        return u.run === run.value.toUpperCase().trim() && u.run !== runOriginal;
    });
    if (runDuplicado) {
        marcarInvalido(run);
        esValido = false;
    }

    if (textoRequerido(nombre.value, 50)) marcarValido(nombre); else { marcarInvalido(nombre); esValido = false; }
    if (textoRequerido(apellidos.value, 100)) marcarValido(apellidos); else { marcarInvalido(apellidos); esValido = false; }
    if (validarCorreo(correo.value)) marcarValido(correo); else { marcarInvalido(correo); esValido = false; }
    if (validarPassword(password.value)) marcarValido(password); else { marcarInvalido(password); esValido = false; }
    if (rol.value) marcarValido(rol); else { marcarInvalido(rol); esValido = false; }
    if (region.value) marcarValido(region); else { marcarInvalido(region); esValido = false; }
    if (comuna.value) marcarValido(comuna); else { marcarInvalido(comuna); esValido = false; }
    if (textoRequerido(direccion.value, 300)) marcarValido(direccion); else { marcarInvalido(direccion); esValido = false; }

    if (!esValido) {
        Swal.fire("Revisa el formulario", "Existen campos obligatorios o invalidos.", "error");
        return;
    }

    const usuario = {
        run: run.value.toUpperCase().trim(),
        nombre: nombre.value.trim(),
        apellidos: apellidos.value.trim(),
        correo: correo.value.trim(),
        password: password.value,
        fechaNacimiento: fechaNacimiento.value || "",
        rolId: Number(rol.value),
        regionId: Number(region.value),
        comunaId: Number(comuna.value),
        direccion: direccion.value.trim(),
        estado: estado.value
    };

    guardarUsuario(usuario);

    Swal.fire("Correcto", "Usuario guardado correctamente.", "success").then(function () {
        window.location.href = "/admin/usuarios";
    });
}
