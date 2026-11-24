/** Imagen de respaldo para noticias sin ruta o con una ruta inexistente. */
export const IMAGEN_BLOG_FALLBACK = '/img/blog/banner.jpg'

/**
 * Normaliza la ruta de una imagen de noticia. El backend guarda rutas
 * relativas a public/img (ej: "blog/piano.webp").
 */
export function rutaImagenNoticia(imagen?: string | null): string {
  const ruta = imagen?.trim()
  if (!ruta) return IMAGEN_BLOG_FALLBACK
  return ruta.startsWith('/') ? ruta : `/img/${ruta}`
}

/**
 * Reemplaza una imagen que no cargó por el respaldo. La guarda evita un bucle
 * si el respaldo tampoco existe.
 */
export function usarImagenRespaldo(event: { currentTarget: HTMLImageElement }): void {
  const img = event.currentTarget
  if (!img.src.endsWith(IMAGEN_BLOG_FALLBACK)) {
    img.src = IMAGEN_BLOG_FALLBACK
  }
}
