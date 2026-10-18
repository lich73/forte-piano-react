import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
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
    <Card as="article" className="h-100 card-forte-hover">
      <Link to={`/blog/${noticia.slug}`}>
        <Card.Img
          variant="top"
          src={rutaImagen}
          alt={noticia.titulo}
          style={{ height: '190px', objectFit: 'cover' }}
        />
      </Link>
      <Card.Body className="d-flex flex-column">
        <p className="small text-muted mb-1">{noticia.fecha}</p>
        <Card.Title as="h3" className="h6">
          <Link to={`/blog/${noticia.slug}`} className="text-decoration-none text-light">
            {noticia.titulo}
          </Link>
        </Card.Title>
        <Card.Text className="small text-muted flex-grow-1">{noticia.resumen}</Card.Text>
        <Link
          to={`/blog/${noticia.slug}`}
          className="btn btn-outline-accent btn-sm align-self-start mt-2"
        >
          Ver noticia
        </Link>
      </Card.Body>
    </Card>
  )

  if (mostrarColumna) {
    return <div className="col-md-6 col-lg-4">{cardContent}</div>
  }

  return cardContent
}

export default NewsCard
