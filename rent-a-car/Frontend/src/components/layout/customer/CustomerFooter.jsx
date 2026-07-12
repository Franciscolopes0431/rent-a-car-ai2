import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from '../../common/Logo';

function CustomerFooter() {
  return (
    <footer className="rc-customer-footer mt-auto py-5">
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={6}>
            <div className="mb-3">
              <Logo />
            </div>
            <p className="text-secondary">
              A sua solução de confiança para aluguer de veículos. Conduza com conforto, segurança e estilo.
            </p>
          </Col>
          <Col lg={2} md={6}>
            <h5 className="text-white mb-3">Links Úteis</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/frota" className="text-secondary text-decoration-none">A Nossa Frota</Link></li>
              <li><Link to="/sobre" className="text-secondary text-decoration-none">Sobre Nós</Link></li>
              <li><Link to="/contactos" className="text-secondary text-decoration-none">Contactos</Link></li>
              <li><Link to="/faq" className="text-secondary text-decoration-none">FAQ</Link></li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h5 className="text-white mb-3">Legal</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/termos" className="text-secondary text-decoration-none">Termos e Condições</Link></li>
              <li><Link to="/privacidade" className="text-secondary text-decoration-none">Política de Privacidade</Link></li>
              <li><Link to="/cookies" className="text-secondary text-decoration-none">Política de Cookies</Link></li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h5 className="text-white mb-3">Contactos</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 text-secondary">
              <li><i className="bi bi-geo-alt me-2"></i> Rua do Aluguer, 123, Lisboa</li>
              <li><i className="bi bi-telephone me-2"></i> +351 210 000 000</li>
              <li><i className="bi bi-envelope me-2"></i> geral@rentcar.pt</li>
            </ul>
          </Col>
        </Row>
        <hr className="my-4 border-secondary" />
        <Row>
          <Col className="text-center text-secondary">
            <small>&copy; {new Date().getFullYear()} RentCar. Todos os direitos reservados.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default CustomerFooter;
