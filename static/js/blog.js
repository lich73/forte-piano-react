/* Forte & Piano - blog.js
   Renderiza el listado de noticias desde localStorage. */

function obtenerNoticias() {
    return obtenerColeccion(FORTEPIANO_KEYS.blog);
}

function crearTarjetaNoticia(noticia) {
    const columna = document.createElement("div");
    columna.className = "col-md-6 col-lg-4";

    columna.innerHTML =
        '<article class="card h-100 card-forte-hover">' +
        '<img src="/static/img/' + noticia.imagen + '" class="card-img-top" alt="' + noticia.titulo + '">' +
        '<div class="card-body d-flex flex-column">' +
        '<p class="small text-muted mb-1">' + noticia.fecha + '</p>' +
        '<h3 class="h6">' + noticia.titulo + '</h3>' +
        '<p class="small text-muted flex-grow-1">' + noticia.resumen + '</p>' +
        '<a href="/blog/' + noticia.slug + '" class="btn btn-outline-accent btn-sm align-self-start">Ver noticia</a>' +
        '</div>' +
        '</article>';

    return columna;
}

function mostrarNoticias(idContenedor, cantidad) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;
    let noticias = obtenerNoticias();
    if (cantidad) noticias = noticias.slice(0, cantidad);
    contenedor.innerHTML = "";
    noticias.forEach(function (noticia) {
        contenedor.appendChild(crearTarjetaNoticia(noticia));
    });
}
