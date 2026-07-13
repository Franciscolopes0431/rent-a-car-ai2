import { Button, Col, Container, Row } from 'react-bootstrap';
import HeroPanel from '../components/auth/HeroPanel';
import LoginForm from '../components/auth/LoginForm';
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <main className="rc-login-page">
      <Container fluid className="p-0">
        <Row className="g-0 min-vh-100">
          <HeroPanel />

          <Col lg={6} className="rc-right-panel d-flex align-items-center justify-content-center">
            <div className="rc-auth-form-shell">
              <Button as={Link} to="/" variant="" className="rc-auth-back-link">
                <i className="bi bi-arrow-left" aria-hidden="true" /> Voltar ao início
              </Button>
              <LoginForm />
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default LoginPage;
