import { Container, Row } from 'react-bootstrap'
import { useNoticias } from '../hooks/useNoticias'
import { NewsCard } from '../components/common/NewsCard'

export default function Blog() {
  const { noticias } = useNoticias()

  return (
    <section className="py-5">
      <Container>
        {/* Banner llamativo en la parte superior del blog */}
        <div className="mb-5 position-relative">
          <img
            src="/img/blog/banner.jpg"
            className="img-fluid rounded w-100 shadow-lg"
            alt="Banner del blog"
            style={{ height: '350px', objectFit: 'cover' }}
          />
          <div
            className="position-absolute bottom-0 start-0 w-100 p-4 rounded-bottom"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}
          >
            <h2 className="text-white mb-0" style={{ fontWeight: 700 }}>
              Novedades y Noticias
            </h2>
          </div>
        </div>

        <h1 className="section-title">Blog musical</h1>
        <p className="text-muted mb-4">
          Novedades, lanzamientos y curiosidades del mundo de los instrumentos musicales.
        </p>

        <Row className="g-4" id="blogContenedor">
          {noticias.length === 0 ? (
            <p className="text-muted">No hay noticias publicadas por el momento.</p>
          ) : (
            noticias.map((noticia) => (
              <NewsCard key={noticia.id} noticia={noticia} mostrarColumna />
            ))
          )}
        </Row>
      </Container>
    </section>
  )
}
