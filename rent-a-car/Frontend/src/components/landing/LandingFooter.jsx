import { Container, Row, Col } from 'react-bootstrap';

function LandingFooter() {
  return (
    <footer className="rc-landing-footer">
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <h5>Contacts</h5>
            <p className="text-secondary mb-1">123 Main Street, Lisbon</p>
            <p className="text-secondary mb-1">support@rentacar.example</p>
            <p className="text-secondary mb-0">+351 912 345 678</p>
          </Col>
          <Col md={4}>
            <h5>Useful links</h5>
            <ul className="list-unstyled text-secondary">
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms & Conditions</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Follow us</h5>
            <div className="d-flex gap-2">
              <a href="#" aria-label="Facebook" className="text-secondary"><i className="bi bi-facebook fs-4"></i></a>
              <a href="#" aria-label="Instagram" className="text-secondary"><i className="bi bi-instagram fs-4"></i></a>
              <a href="#" aria-label="LinkedIn" className="text-secondary"><i className="bi bi-linkedin fs-4"></i></a>
            </div>
          </Col>
        </Row>

        <div className="rc-landing-footer-bottom text-secondary mt-4">
          © 2025 Rent-a-Car Co. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

export default LandingFooter;
