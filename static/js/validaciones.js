/* Forte & Piano - validaciones.js
   Funciones reutilizables de validacion para formularios. */

const DOMINIOS_CORREO_VALIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

function validarCorreo(correo) {
    if (!correo || correo.length === 0 || correo.length > 100) return false;
    return DOMINIOS_CORREO_VALIDOS.some(function (dominio) {
        return correo.toLowerCase().endsWith(dominio);
    });
}

function validarPassword(password) {
    return typeof password === "string" && password.length >= 4 && password.length <= 10;
}

/* Valida un RUN chileno sin puntos ni guion (ej: 123456785) usando el algoritmo modulo 11. */
function validarRun(run) {
    if (!run) return false;
    run = run.toUpperCase().trim();
    if (run.length < 7 || run.length > 9) return false;

    const cuerpo = run.slice(0, -1);
    const dv = run.slice(-1);

    if (!/^[0-9]+$/.test(cuerpo)) return false;
    if (!/^[0-9K]$/.test(dv)) return false;

    let suma = 0;
    let multiplicador = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);
    let dvEsperado;
    if (resto === 11) dvEsperado = "0";
    else if (resto === 10) dvEsperado = "K";
    else dvEsperado = String(resto);

    return dv === dvEsperado;
}

function marcarValido(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
}

function marcarInvalido(input) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
}

function textoRequerido(valor, maximo) {
    if (!valor || valor.trim().length === 0) return false;
    if (maximo && valor.trim().length > maximo) return false;
    return true;
}

function numeroEnRango(valor, minimo) {
    const numero = Number(valor);
    if (isNaN(numero)) return false;
    return numero >= minimo;
}

function enteroEnRango(valor, minimo) {
    const numero = Number(valor);
    if (isNaN(numero)) return false;
    return Number.isInteger(numero) && numero >= minimo;
}
