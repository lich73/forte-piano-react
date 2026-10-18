import { Container, Row, Col, Accordion } from 'react-bootstrap'

export default function Nosotros() {
  return (
    <>
      <section className="py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <h1 className="section-title">Quiénes somos</h1>
              <p>
                <strong>Forte & Piano</strong> es una tienda online dedicada a la venta de instrumentos musicales,
                creada para conectar a la comunidad musical con sus próximas aventuras sonoras.
              </p>
              <p>
                En Forte & Piano encontrarás los mejores instrumentos musicales, con una experiencia de compra simple,
                rápida y pensada para músicos de todos los niveles.
              </p>
              <p>
                Nuestro propósito es ofrecer un catálogo variado, información clara de cada producto
                y un proceso de compra sin complicaciones.
              </p>
            </Col>
            <Col lg={6} className="text-center">
              <img
                src="/img/banners/banner-1.png"
                alt="Forte & Piano"
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sección de Preguntas Frecuentes (Accordion) */}
      <section className="py-5">
        <Container>
          <h2 className="section-title mb-4">Preguntas Frecuentes</h2>
          <Accordion id="faqAccordion" data-bs-theme="dark" defaultActiveKey="0">
            {/* Pregunta 1 */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>¿Hacen despachos a regiones?</Accordion.Header>
              <Accordion.Body>
                Sí, enviamos a lo largo de todo Chile. Contamos con transporte especializado para asegurar que tu
                piano llegue en perfectas condiciones y afinado.
              </Accordion.Body>
            </Accordion.Item>
            {/* Pregunta 2 */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>¿Los pianos acústicos vienen armados?</Accordion.Header>
              <Accordion.Body>
                Los pianos verticales y de cola se entregan 100% armados y listos para tocar en tu domicilio. En el
                caso de los teclados y pianos digitales, requieren un ensamblaje mínimo (colocarlos en su soporte).
              </Accordion.Body>
            </Accordion.Item>
            {/* Pregunta 3 */}
            <Accordion.Item eventKey="2">
              <Accordion.Header>¿Ofrecen garantía o servicio técnico?</Accordion.Header>
              <Accordion.Body>
                Todos nuestros instrumentos cuentan con una garantía de fábrica de hasta 5 años. Además, contamos
                con una red de técnicos autorizados para mantenciones y afinación a domicilio.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Container>
      </section>
    </>
  )
}
