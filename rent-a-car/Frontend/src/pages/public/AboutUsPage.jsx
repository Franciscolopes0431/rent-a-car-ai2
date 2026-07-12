import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../styles/public-pages.css';

function AboutUsPage() {
  return (
    <div className="rc-public-page">
      {/* Hero Section */}
      <section className="rc-hero-section">
        <div className="rc-hero-overlay"></div>
        <Container className="rc-hero-content text-center text-white">
          <h1 className="display-3 fw-bold mb-3 animate-fade-in-up">Conduza o seu destino</h1>
          <p className="lead mb-4 animate-fade-in-up delay-1">
            Mais do que aluguer de carros, oferecemos liberdade, conforto e segurança para as suas viagens.
          </p>
        </Container>
      </section>

      <Container className="py-5">
        {/* História e Missão */}
        <Row className="mb-5 align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <h2 className="fw-bold mb-3 rc-section-title">A Nossa História</h2>
            <p className="text-secondary">
              Fundada em 2010, a Rent-a-Car começou com uma pequena frota e um grande sonho: transformar a forma como as pessoas viajam. Hoje, com mais de uma década de experiência, orgulhamo-nos de ser líderes no mercado, oferecendo um serviço de excelência focado na satisfação total dos nossos clientes.
            </p>
            <p className="text-secondary">
              O nosso compromisso é garantir que cada viagem comece e termine com um sorriso, fornecendo viaturas modernas e um atendimento personalizado.
            </p>
          </Col>
          <Col lg={6}>
            <div className="rc-mission-card p-4 rounded shadow-sm">
              <h4 className="fw-bold text-primary mb-3"><i className="bi bi-bullseye me-2"></i>Missão, Visão e Valores</h4>
              <ul className="list-unstyled mb-0">
                <li className="mb-3">
                  <strong>Missão:</strong> Proporcionar a melhor experiência de mobilidade com transparência e segurança.
                </li>
                <li className="mb-3">
                  <strong>Visão:</strong> Ser a rent-a-car de eleição em toda a Europa, reconhecida pela inovação e sustentabilidade.
                </li>
                <li>
                  <strong>Valores:</strong> Confiança, Excelência, Inovação e Foco no Cliente.
                </li>
              </ul>
            </div>
          </Col>
        </Row>

        {/* Estatísticas */}
        <div className="rc-stats-section py-5 mb-5 rounded">
          <Row className="text-center">
            <Col sm={6} md={3} className="mb-4 mb-md-0">
              <h2 className="display-4 fw-bold text-primary mb-1">500+</h2>
              <p className="text-secondary mb-0">Carros Disponíveis</p>
            </Col>
            <Col sm={6} md={3} className="mb-4 mb-md-0">
              <h2 className="display-4 fw-bold text-primary mb-1">50k+</h2>
              <p className="text-secondary mb-0">Clientes Satisfeitos</p>
            </Col>
            <Col sm={6} md={3} className="mb-4 mb-sm-0">
              <h2 className="display-4 fw-bold text-primary mb-1">15</h2>
              <p className="text-secondary mb-0">Anos de Experiência</p>
            </Col>
            <Col sm={6} md={3}>
              <h2 className="display-4 fw-bold text-primary mb-1">20+</h2>
              <p className="text-secondary mb-0">Cidades Abrangidas</p>
            </Col>
          </Row>
        </div>

        {/* Porquê escolher a nossa empresa (Ícones) */}
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-4 rc-section-title">Porquê Escolher-nos?</h2>
          <Row className="g-4">
            <Col md={4} sm={6}>
              <Card className="rc-feature-card h-100 border-0 shadow-sm text-center p-4">
                <div className="rc-feature-icon mx-auto mb-3 text-primary">
                  <i className="bi bi-tag-fill fs-1"></i>
                </div>
                <Card.Title className="fw-bold">Preços Competitivos</Card.Title>
                <Card.Text className="text-secondary">As melhores tarifas do mercado sem taxas ocultas.</Card.Text>
              </Card>
            </Col>
            <Col md={4} sm={6}>
              <Card className="rc-feature-card h-100 border-0 shadow-sm text-center p-4">
                <div className="rc-feature-icon mx-auto mb-3 text-primary">
                  <i className="bi bi-lightning-charge-fill fs-1"></i>
                </div>
                <Card.Title className="fw-bold">Reserva Rápida</Card.Title>
                <Card.Text className="text-secondary">Processo de reserva simples e 100% digital.</Card.Text>
              </Card>
            </Col>
            <Col md={4} sm={6}>
              <Card className="rc-feature-card h-100 border-0 shadow-sm text-center p-4">
                <div className="rc-feature-icon mx-auto mb-3 text-primary">
                  <i className="bi bi-headset fs-1"></i>
                </div>
                <Card.Title className="fw-bold">Suporte 24/7</Card.Title>
                <Card.Text className="text-secondary">Assistência em viagem e apoio ao cliente a qualquer hora.</Card.Text>
              </Card>
            </Col>
            <Col md={4} sm={6} className="offset-md-2">
              <Card className="rc-feature-card h-100 border-0 shadow-sm text-center p-4">
                <div className="rc-feature-icon mx-auto mb-3 text-primary">
                  <i className="bi bi-car-front-fill fs-1"></i>
                </div>
                <Card.Title className="fw-bold">Frota Moderna</Card.Title>
                <Card.Text className="text-secondary">Veículos recentes, limpos e sempre revistos.</Card.Text>
              </Card>
            </Col>
            <Col md={4} sm={6}>
              <Card className="rc-feature-card h-100 border-0 shadow-sm text-center p-4">
                <div className="rc-feature-icon mx-auto mb-3 text-primary">
                  <i className="bi bi-shield-check-fill fs-1"></i>
                </div>
                <Card.Title className="fw-bold">Seguro Incluído</Card.Title>
                <Card.Text className="text-secondary">Viaje com tranquilidade total com as nossas opções de seguro.</Card.Text>
              </Card>
            </Col>
          </Row>
        </div>

        {/* CTA */}
        <div className="rc-cta-section text-center py-5 rounded bg-primary text-white shadow">
          <h2 className="fw-bold mb-3">Pronto para a sua próxima viagem?</h2>
          <p className="lead mb-4">Descubra o carro perfeito para si e faça a sua reserva em poucos minutos.</p>
          <Button as={Link} to="/frota" variant="light" size="lg" className="fw-bold rc-btn-cta px-5 py-3 rounded-pill">
            Reservar um Carro
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default AboutUsPage;
