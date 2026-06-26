import { Col, Container, Row } from 'react-bootstrap';
import RegisterHeroPanel from '../components/auth/RegisterHeroPanel';
import RegisterStep1Form from '../components/auth/RegisterStep1Form';
import { useRegister } from '../context/RegisterContext';

function RegisterStep2Placeholder() {
  return (
    <div className="text-white text-center px-4">
      Passo 2 de registo em desenvolvimento.
    </div>
  );
}

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
          {currentStep === 1 ? <RegisterStep1Form /> : <RegisterStep2Placeholder />}
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
