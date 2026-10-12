/* Forte & Piano - contacto.js
   Validacion y almacenamiento de mensajes del formulario de contacto. */

function inicializarFormularioContacto() {
    document.getElementById("formularioContacto").addEventListener("submit", function (evento) {
        evento.preventDefault();
        procesarContacto();
    });
}

function procesarContacto() {
    const nombre = document.getElementById("nombreContacto");
    const correo = document.getElementById("correoContacto");
    const comentario = document.getElementById("comentarioContacto");

    let esValido = true;

    if (textoRequerido(nombre.value, 100)) {
        marcarValido(nombre);
    } else {
        marcarInvalido(nombre);
        esValido = false;
    }

    if (validarCorreo(correo.value)) {
        marcarValido(correo);
    } else {
        marcarInvalido(correo);
        esValido = false;
    }

    if (textoRequerido(comentario.value, 500)) {
        marcarValido(comentario);
    } else {
        marcarInvalido(comentario);
        esValido = false;
    }

    if (!esValido) {
        Swal.fire("Revisa el formulario", "Existen campos obligatorios o invalidos.", "error");
        return;
    }

    const mensaje = {
        nombre: nombre.value.trim(),
        correo: correo.value.trim(),
        comentario: comentario.value.trim(),
        fecha: new Date().toISOString().slice(0, 10)
    };

    const contactos = obtenerColeccion(FORTEPIANO_KEYS.contactos);
    contactos.push(mensaje);
    guardarColeccion(FORTEPIANO_KEYS.contactos, contactos);

    Swal.fire("Mensaje enviado", "Gracias por escribirnos, te responderemos pronto.", "success");
    document.getElementById("formularioContacto").reset();
    [nombre, correo, comentario].forEach(function (campo) {
        campo.classList.remove("is-valid", "is-invalid");
    });
}
