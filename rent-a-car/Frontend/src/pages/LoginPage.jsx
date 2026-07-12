import { Col, Container, Row } from 'react-bootstrap';
import HeroPanel from '../components/auth/HeroPanel';
import LoginForm from '../components/auth/LoginForm';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <main className="rc-login-page">
      <Container fluid className="p-0">
        <Row className="g-0 min-vh-100">
          <HeroPanel />

          <Col lg={6} className="rc-right-panel d-flex align-items-center justify-content-center">
                    <div style={{ width: '100%', maxWidth: '480px' }}>
                      <div className="mb-3">
                        <Button as={Link} to="/" variant="" className="rc-btn-secondary-action">
                          ← Back to home
                        </Button>
                      </div>
                      <LoginForm />
                    </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default LoginPage;
