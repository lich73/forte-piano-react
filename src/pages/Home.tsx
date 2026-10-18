import { Link } from 'react-router-dom'
import { Carousel } from 'react-bootstrap'
import { useProductos } from '../hooks/useProductos'
import { useNoticias } from '../hooks/useNoticias'
import { ProductCard } from '../components/common/ProductCard'
import { NewsCard } from '../components/common/NewsCard'

export default function Home() {
  const { destacados } = useProductos()
  const { ultimas } = useNoticias()

  const productosDestacados = destacados(4)
  const ultimasNoticias = ultimas(3)

  return (
    <>
      {/* Sección Hero con Carousel nativo de React-Bootstrap */}
      <section className="hero-section">
        <Carousel id="heroCarousel" fade interval={5000} indicators>
          <Carousel.Item>
            <img
              src="/img/banners/banner-1.png"
              className="d-block w-100"
              alt="Temporada 2026"
            />
            <Carousel.Caption style={{ left: '15%', textAlign: 'left' }}>
              <h1 className="display-6">Temporada 2026</h1>
              <p className="d-none d-md-block">Descubre los mejores instrumentos musicales</p>
              <Link to="/productos" className="btn btn-accent">
                Ver catálogo
              </Link>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              src="/img/banners/banner-2.png"
              className="d-block w-100"
              alt="Ofertas de Primavera - Hasta un 80% Off!"
            />
            <Carousel.Caption style={{ left: '15%', textAlign: 'left' }}>
              <h1 className="display-6">Ofertas de Primavera - Hasta un 80% Off!</h1>
              <p className="d-none d-md-block">Precios de Temporada</p>
              <Link to="/productos" className="btn btn-accent">
                Ver ofertas
              </Link>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              src="/img/banners/banner-3.png"
              className="d-block w-100"
              alt="Ofertas de lanzamiento"
            />
            <Carousel.Caption style={{ left: '15%', textAlign: 'left' }}>
              <h1 className="display-6">¡Aprende a tocar piano con nosotros!</h1>
              <p className="d-none d-md-block">Academia musical Forte & Piano</p>
              <Link to="/servicios" className="btn btn-accent">
                Ver cursos
              </Link>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              src="/img/banners/banner-4.png"
              className="d-block w-100"
              alt="Conciertos de Piano"
            />
            <Carousel.Caption style={{ left: '15%', textAlign: 'left' }}>
              <h1 className="display-6">Conciertos de Piano</h1>
              <p className="d-none d-md-block">Próximos encuentros musicales</p>
              <Link to="/blog" className="btn btn-accent">
                Ver Eventos
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </section>

      {/* Sección de Productos Destacados */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title mb-0">Productos destacados</h2>
          <Link to="/productos" className="btn btn-outline-accent btn-sm">
            Ver todos <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
        <div className="row g-4" id="destacadosContenedor">
          {productosDestacados.map((producto) => (
            <div key={producto.codigo} className="col-sm-6 col-lg-3">
              <ProductCard producto={producto} />
            </div>
          ))}
        </div>
      </section>

      {/* Sección de Últimas Novedades */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title mb-0">Últimas novedades</h2>
          <Link to="/blog" className="btn btn-outline-accent btn-sm">
            Ver todas <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
        <div className="row g-4" id="noticiasContenedor">
          {ultimasNoticias.map((noticia) => (
            <div key={noticia.id} className="col-md-6 col-lg-4">
              <NewsCard noticia={noticia} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
