import { Link } from 'react-router-dom'
import { Noticia } from '../../types'

interface NewsCardProps {
  noticia: Noticia
  mostrarColumna?: boolean
}

export function NewsCard({ noticia, mostrarColumna = false }: NewsCardProps) {
  const rutaImagen = noticia.imagen
    ? noticia.imagen.startsWith('/')
      ? noticia.imagen
      : `/img/${noticia.imagen}`
    : '/img/logo.png'

  const cardContent = (
    <article className="card h-100 card-forte-hover">
      <Link to={`/blog/${noticia.slug}`}>
        <img
          src={rutaImagen}
          className="card-img-top"
          alt={noticia.titulo}
          style={{ height: '190px', objectFit: 'cover' }}
        />
      </Link>
      <div className="card-body d-flex flex-column">
        <p className="small text-muted mb-1">{noticia.fecha}</p>
        <h3 className="h6">
          <Link to={`/blog/${noticia.slug}`} className="text-decoration-none text-light">
            {noticia.titulo}
          </Link>
        </h3>
        <p className="small text-muted flex-grow-1">{noticia.resumen}</p>
        <Link
          to={`/blog/${noticia.slug}`}
          className="btn btn-outline-accent btn-sm align-self-start mt-2"
        >
          Ver noticia
        </Link>
      </div>
    </article>
  )

  if (mostrarColumna) {
    return <div className="col-md-6 col-lg-4">{cardContent}</div>
  }

  return cardContent
}

export default NewsCard
