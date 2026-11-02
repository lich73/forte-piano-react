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

function limpiarRun(run) {
    if (!run || typeof run !== "string") return "";
    return run.replace(/[.\-\s]/g, "").toUpperCase().trim();
}

function calcularDigitoVerificador(cuerpo) {
    if (!cuerpo || !/^[0-9]+$/.test(cuerpo)) return "";
    let suma = 0;
    let multiplicador = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    const resto = 11 - (suma % 11);
    if (resto === 11) return "0";
    if (resto === 10) return "K";
    return String(resto);
}

/* Valida un RUN chileno exigiendo dígito verificador y comprobando Módulo 11. */
function validarRun(run) {
    if (!run || typeof run !== "string") return false;
    const texto = run.trim();
    if (texto.length === 0) return false;

    let cuerpo = "";
    let dv = "";

    if (texto.indexOf("-") !== -1 || texto.indexOf(".") !== -1) {
        const formatoConGuion = /^(?:\d{1,2}(?:\.\d{3}){2}|\d{7,8})-[0-9Kk]$/.test(texto);
        if (!formatoConGuion) return false;

        const limpio = limpiarRun(texto);
        cuerpo = limpio.slice(0, -1);
        dv = limpio.slice(-1);
    } else {
        if (!/^\d{8}[0-9Kk]$/.test(texto)) return false;
        cuerpo = texto.slice(0, 8);
        dv = texto.slice(8).toUpperCase();
    }

    if (!/^[0-9]+$/.test(cuerpo)) return false;
    if (Number(cuerpo) < 1000000) return false;
    if (!/^[0-9K]$/.test(dv)) return false;

    return dv === calcularDigitoVerificador(cuerpo);
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
