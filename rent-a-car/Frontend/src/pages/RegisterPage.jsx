import { Button, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import RegisterHeroPanel from '../components/auth/RegisterHeroPanel';
import RegisterStep1Form from '../components/auth/RegisterStep1Form';
import RegisterStep2Form from '../components/auth/RegisterStep2Form';
import { useRegister } from '../context/RegisterContext';

function RegisterPage() {
  const { currentStep } = useRegister();

  return (
    <Container fluid className="register-page p-0">
      <Row className="g-0 min-vh-100">
        <Col lg={6} className="d-none d-lg-flex p-0">
          <RegisterHeroPanel />
        </Col>

        <Col
          lg={6}
          className="rc-register-right-panel d-flex align-items-center justify-content-center"
        >
          <div className="rc-auth-form-shell rc-auth-form-shell-register">
            <Button as={Link} to="/" variant="" className="rc-auth-back-link">
              <i className="bi bi-arrow-left" aria-hidden="true" /> Voltar ao início
            </Button>
            {currentStep === 1 ? <RegisterStep1Form /> : <RegisterStep2Form />}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
