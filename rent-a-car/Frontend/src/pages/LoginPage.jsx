import { Col, Container, Row } from 'react-bootstrap';
import HeroPanel from '../components/auth/HeroPanel';
import LoginForm from '../components/auth/LoginForm';

function LoginPage() {
  return (
    <main className="rc-login-page">
      <Container fluid className="p-0">
        <Row className="g-0 min-vh-100">
          <HeroPanel />

          <Col lg={6} className="rc-right-panel d-flex align-items-center justify-content-center">
            <LoginForm />
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default LoginPage;
