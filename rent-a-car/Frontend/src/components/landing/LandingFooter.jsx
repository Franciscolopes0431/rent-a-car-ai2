import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function LandingFooter() {
  return (
    <footer className="rc-landing-footer">
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <h5>Contactos</h5>
            <p className="text-secondary mb-1">Rua do Aluguer, 123, Lisboa</p>
            <p className="text-secondary mb-1">geral@rentcar.pt</p>
            <p className="text-secondary mb-0">+351 912 345 678</p>
          </Col>
          <Col md={4}>
            <h5>Links úteis</h5>
            <ul className="list-unstyled text-secondary">
              <li><Link to="/privacidade">Política de Privacidade</Link></li>
              <li><Link to="/termos">Termos e Condições</Link></li>
              <li><Link to="/faq">Perguntas Frequentes</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Informação</h5>
            <p className="text-secondary mb-0">Consulte as condições de aluguer antes de efetuar a sua reserva.</p>
          </Col>
        </Row>

        <div className="rc-landing-footer-bottom text-secondary mt-4">
          © 2026 RentCar. Todos os direitos reservados.
        </div>
      </Container>
    </footer>
  );
}

export default LandingFooter;
