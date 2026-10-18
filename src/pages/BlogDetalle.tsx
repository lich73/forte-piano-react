import { useParams, Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { useNoticias } from '../hooks/useNoticias'

export default function BlogDetalle() {
  const { slug } = useParams<{ slug: string }>()
  const { obtenerNoticia } = useNoticias()

  const noticia = slug ? obtenerNoticia(slug) : undefined

  if (!noticia) {
    return (
      <Container className="py-5 text-center" style={{ maxWidth: '800px' }}>
        <h1 className="mb-4">Noticia no encontrada</h1>
        <p className="text-muted mb-4">La noticia que buscas no existe o ha sido eliminada.</p>
        <Link to="/blog" className="btn btn-accent">
          <i className="bi bi-arrow-left me-2" />
          Volver al Blog
        </Link>
      </Container>
    )
  }

  const rutaImagenPrincipal = noticia.imagen
    ? noticia.imagen.startsWith('/')
      ? noticia.imagen
      : `/img/${noticia.imagen}`
    : '/img/logo.png'

  return (
    <article className="container py-5" style={{ maxWidth: '800px' }}>
      {/* Imagen principal */}
      <img
        src={rutaImagenPrincipal}
        className="img-fluid rounded mb-4 shadow"
        alt={noticia.titulo}
        style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
      />
      <p className="text-muted small mb-1">{noticia.fecha}</p>
      <h1 className="mb-4">{noticia.titulo}</h1>

      {/* Contenido dinámico del artículo */}
      {noticia.contenido && noticia.contenido.length > 0 ? (
        noticia.contenido.map((parrafo, index) => {
          // Detectar encabezados numerados (ej: "1. Control de Humedad: ...")
          const encabezadoMatch = parrafo.match(/^(\d+\.\s+[^:]+):\s*(.*)$/)
          return (
            <div key={index} className="mb-3">
              {encabezadoMatch ? (
                <>
                  <h3 className="h5 mt-4 text-light">{encabezadoMatch[1]}</h3>
                  <p className="lead fs-6 text-light opacity-75">{encabezadoMatch[2]}</p>
                </>
              ) : (
                <p className="lead fs-6 text-light opacity-75">{parrafo}</p>
              )}

              {/* Imagen de apoyo en medio del artículo para noticias específicas */}
              {noticia.slug === 'detalle-1' && index === 1 && (
                <div className="text-center my-4">
                  <img
                    src="/img/blog/piano.webp"
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: '350px', objectFit: 'cover', width: '100%' }}
                    alt="Nuestra tienda por dentro"
                  />
                  <p className="text-muted small mt-2">Visítanos y descubre nuestro amplio catálogo de instrumentos.</p>
                </div>
              )}

              {noticia.slug === 'detalle-3' && index === 5 && (
                <div className="text-center my-4">
                  <img
                    src="/img/blog/banner.jpg"
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: '350px', objectFit: 'cover', width: '100%' }}
                    alt="Curiosidades del piano"
                  />
                  <p className="text-muted small mt-2">Explora el fascinante mundo del piano.</p>
                </div>
              )}
            </div>
          )
        })
      ) : (
        <p className="lead fs-6 text-light opacity-75">{noticia.resumen}</p>
      )}

      <div className="pt-3">
        <Link to="/blog" className="btn btn-accent mt-3">
          <i className="bi bi-arrow-left me-2" />
          Volver al Blog
        </Link>
      </div>
    </article>
  )
}
