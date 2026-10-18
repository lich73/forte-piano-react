import { Container, Row, Col, Card } from 'react-bootstrap'

export default function Servicios() {
  return (
    <section className="py-5 my-4">
      <Container>
        <div className="text-center mb-5">
          <h1 className="display-5 mb-3 forte-heading">Nuestros Servicios</h1>
          <p className="text-muted fs-5">No solo vendemos instrumentos, también cuidamos de tu experiencia musical.</p>
        </div>

        <Row className="g-4 justify-content-center">
          {/* Servicio 1: Afinación */}
          <Col md={4}>
            <Card className="h-100 text-center p-4 card-forte-hover">
              <Card.Body>
                <i className="bi bi-tools display-4 text-accent mb-4 d-block" />
                <h3 className="h4 card-title mb-3">Afinación de Pianos</h3>
                <p className="card-text text-muted">
                  Contamos con técnicos certificados para afinar, regular y mantener
                  tu piano acústico en perfectas condiciones, directo en tu domicilio.
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Servicio 2: Clases */}
          <Col md={4}>
            <Card className="h-100 text-center p-4 card-forte-hover">
              <Card.Body>
                <i className="bi bi-music-note-beamed display-4 text-accent mb-4 d-block" />
                <h3 className="h4 card-title mb-3">Clases de Piano</h3>
                <p className="card-text text-muted">
                  Nuestra academia ofrece clases personalizadas para todos los
                  niveles, guiadas por profesores profesionales y concertistas.
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Servicio 3: Transporte */}
          <Col md={4}>
            <Card className="h-100 text-center p-4 card-forte-hover">
              <Card.Body>
                <i className="bi bi-truck display-4 text-accent mb-4 d-block" />
                <h3 className="h4 card-title mb-3">Transporte de Pianos</h3>
                <p className="card-text text-muted">
                  Mover un piano es una tarea sumamente delicada. Ofrecemos servicio
                  de mudanza especializada con seguro para proteger tu inversión.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
