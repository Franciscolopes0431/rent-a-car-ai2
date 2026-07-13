import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import LandingFooter from '../components/landing/LandingFooter';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUndo, FaTags, FaShieldAlt, FaHeadset, FaStopwatch, FaMapMarkerAlt, FaCar, FaLaptop, FaKey } from 'react-icons/fa';

function LandingPage() {
  return (
    <div className="rc-landing-page">
      <LandingNavbar />
      <main>
        <HeroSection />
        
        {/* Benefícios Section */}
        <section className="py-5 bg-white">
          <Container>
            <div className="text-center mb-5">
              <h2 className="fw-bold text-dark">Benefícios</h2>
              <p className="text-muted">Tudo o que precisa para uma viagem sem preocupações</p>
            </div>
            <Row className="text-center g-4 justify-content-center">
              <Col xs={6} md={4} lg={2}>
                <div className="mb-3 text-primary"><FaUndo size={40} /></div>
                <h6 className="fw-bold text-dark">Cancelamento gratuito</h6>
              </Col>
              <Col xs={6} md={4} lg={2}>
                <div className="mb-3 text-primary"><FaTags size={40} /></div>
                <h6 className="fw-bold text-dark">Melhores preços garantidos</h6>
              </Col>
              <Col xs={6} md={4} lg={2}>
                <div className="mb-3 text-primary"><FaShieldAlt size={40} /></div>
                <h6 className="fw-bold text-dark">Sem taxas escondidas</h6>
              </Col>
              <Col xs={6} md={4} lg={2}>
                <div className="mb-3 text-primary"><FaHeadset size={40} /></div>
                <h6 className="fw-bold text-dark">Apoio ao cliente 24/7</h6>
              </Col>
              <Col xs={6} md={4} lg={2}>
                <div className="mb-3 text-primary"><FaStopwatch size={40} /></div>
                <h6 className="fw-bold text-dark">Reserva em menos de 2 min</h6>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Decorative Divider */}
        <div style={{ height: 0, position: 'relative', zIndex: 10 }}>
          <div className="d-flex justify-content-center">
            <div className="bg-white rounded-circle shadow-sm d-flex justify-content-center align-items-center" style={{ width: '60px', height: '60px', marginTop: '-30px' }}>
              <FaCar className="text-primary" size={28} />
            </div>
          </div>
        </div>

        {/* Categorias de Veículos Section */}
        <section className="py-5" style={{ backgroundColor: '#e9ecef' }}>
          <Container>
            <div className="text-center mb-5">
              <h2 className="fw-bold text-dark">Categorias de Veículos</h2>
              <p className="text-muted">A frota ideal para qualquer ocasião</p>
            </div>
            <Row className="g-4">
              {[
                { name: 'Económicos', img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80' },
                { name: 'SUV', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80' },
                { name: 'Elétricos', img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80' },
                { name: 'Luxo', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80' },
                { name: 'Comerciais', img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80' },
                { name: 'Familiares', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80' }
              ].map((cat, idx) => (
                <Col md={4} sm={6} key={idx}>
                  <Card className="h-100 border-0 text-white shadow-sm overflow-hidden" style={{ minHeight: '220px', borderRadius: '15px', cursor: 'pointer' }}>
                    <Card.Img src={cat.img} alt={cat.name} className="h-100 w-100" style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0, transition: 'transform 0.3s' }} 
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} 
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                    <div className="card-img-overlay d-flex flex-column justify-content-end p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2))' }}>
                      <Card.Title className="fw-bold mb-0 fs-4">{cat.name}</Card.Title>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Como Funciona Section */}
        <section className="py-5 bg-dark text-white">
          <Container>
            <div className="text-center mb-5">
              <h2 className="fw-bold">Como Funciona</h2>
              <p className="text-white-50">Processo simples e rápido para iniciar a sua viagem</p>
            </div>
            <Row className="text-center">
              <Col md={3} sm={6} className="mb-4 mb-md-0 position-relative">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3 shadow-lg" style={{width: '80px', height: '80px', fontSize: '32px'}}>
                  <FaMapMarkerAlt />
                </div>
                <h5 className="fw-bold">1. Escolhe o local</h5>
              </Col>
              <Col md={3} sm={6} className="mb-4 mb-md-0 position-relative">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3 shadow-lg" style={{width: '80px', height: '80px', fontSize: '32px'}}>
                  <FaCar />
                </div>
                <h5 className="fw-bold">2. Seleciona o carro</h5>
              </Col>
              <Col md={3} sm={6} className="mb-4 mb-md-0 position-relative">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3 shadow-lg" style={{width: '80px', height: '80px', fontSize: '32px'}}>
                  <FaLaptop />
                </div>
                <h5 className="fw-bold">3. Reserva online</h5>
              </Col>
              <Col md={3} sm={6}>
                <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3 shadow-lg" style={{width: '80px', height: '80px', fontSize: '32px'}}>
                  <FaKey />
                </div>
                <h5 className="fw-bold">4. Levanta o veículo</h5>
              </Col>
            </Row>
          </Container>
        </section>

      </main>
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
