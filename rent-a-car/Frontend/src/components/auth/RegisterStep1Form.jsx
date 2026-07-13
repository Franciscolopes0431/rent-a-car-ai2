import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';
import { checkEmail } from '../../services/authService';
import RegisterStepIndicator from './RegisterStepIndicator';

const NAME_REGEX = /^[A-Za-zÀ-ÿ\s'-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+\d{1,3}\s?)?[\d\s]{9,15}$/;

function RegisterStep1Form() {
  const { registerData, updateData, nextStep } = useRegister();

  const [formData, setFormData] = useState({
    firstName: registerData.firstName,
    lastName: registerData.lastName,
    email: registerData.email,
    phone: registerData.phone,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setErrors((previous) => {
      const next = { ...previous };

      Object.entries(formData).forEach(([field, value]) => {
        if (value.trim()) {
          delete next[field];
        }
      });

      return next;
    });
  }, [formData]);

  const isFormFilled = useMemo(
    () => Object.values(formData).every((value) => value.trim().length > 0),
    [formData]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const validationErrors = {};

    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      validationErrors.firstName = 'O nome deve ter pelo menos 2 caracteres.';
    } else if (!NAME_REGEX.test(formData.firstName.trim())) {
      validationErrors.firstName = 'O nome só pode conter letras e espaços.';
    }

    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
      validationErrors.lastName = 'O apelido deve ter pelo menos 2 caracteres.';
    } else if (!NAME_REGEX.test(formData.lastName.trim())) {
      validationErrors.lastName = 'O apelido só pode conter letras e espaços.';
    }

    if (!EMAIL_REGEX.test(formData.email.trim())) {
      validationErrors.email = 'Introduza um email válido.';
    }

    if (!PHONE_REGEX.test(formData.phone.trim())) {
      validationErrors.phone = 'Introduza um telemóvel válido.';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const validateEmailAvailability = async () => {
    const email = formData.email.trim();

    if (!EMAIL_REGEX.test(email)) {
      return false;
    }

    try {
      const response = await checkEmail(email);
      const isAvailable = Boolean(response?.data?.available);

      if (!isAvailable) {
        setErrors((prev) => ({
          ...prev,
          email: 'Este email já está registado.',
        }));
      }

      return isAvailable;
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        email: 'Não foi possível validar o email. Tente novamente.',
      }));
      return false;
    }
  };

  const handleEmailBlur = async () => {
    if (formData.email.trim() && EMAIL_REGEX.test(formData.email.trim())) {
      await validateEmailAvailability();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const emailAvailable = await validateEmailAvailability();

      if (!emailAvailable) {
        return;
      }

      updateData({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });
      nextStep();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rc-register-form-wrapper">
      <p className="rc-register-kicker">PASSO 1 DE 2</p>
      <h2 className="rc-register-title">
        DADOS
        <br />
        <span>PESSOAIS</span>
      </h2>

      <p className="rc-register-signin-text">
        Já tem conta? <Link to="/login">Inicie sessão</Link>
      </p>

      <RegisterStepIndicator currentStep={1} totalSteps={2} />

      <Form onSubmit={handleSubmit} noValidate>
        <Row className="g-2">
          <Col md={6}>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label className="rc-register-input-label">NOME</Form.Label>
              <div className="rc-register-input-wrap">
                <i className="bi bi-person rc-register-input-icon" aria-hidden="true" />
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="João"
                  className="rc-register-input"
                  autoComplete="given-name"
                  aria-invalid={errors.firstName ? 'true' : 'false'}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  isInvalid={Boolean(errors.firstName)}
                />
              </div>
              {errors.firstName ? (
                <Form.Text id="firstName-error" className="text-danger d-block mt-2">
                  {errors.firstName}
                </Form.Text>
              ) : null}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label className="rc-register-input-label">APELIDO</Form.Label>
              <div className="rc-register-input-wrap">
                <i className="bi bi-person rc-register-input-icon" aria-hidden="true" />
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Silva"
                  className="rc-register-input"
                  autoComplete="family-name"
                  aria-invalid={errors.lastName ? 'true' : 'false'}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  isInvalid={Boolean(errors.lastName)}
                />
              </div>
              {errors.lastName ? (
                <Form.Text id="lastName-error" className="text-danger d-block mt-2">
                  {errors.lastName}
                </Form.Text>
              ) : null}
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label className="rc-register-input-label">EMAIL</Form.Label>
          <div className="rc-register-input-wrap">
            <i className="bi bi-envelope rc-register-input-icon" aria-hidden="true" />
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              placeholder="joao@exemplo.com"
              className="rc-register-input"
              autoComplete="email"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              isInvalid={Boolean(errors.email)}
            />
          </div>
          {errors.email ? (
            <Form.Text id="email-error" className="text-danger d-block mt-2">
              {errors.email}
            </Form.Text>
          ) : null}
        </Form.Group>

        <Form.Group className="mb-4" controlId="phone">
          <Form.Label className="rc-register-input-label">TELEMÓVEL</Form.Label>
          <div className="rc-register-input-wrap">
            <i className="bi bi-telephone rc-register-input-icon" aria-hidden="true" />
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+351 912 345 678"
              className="rc-register-input"
              autoComplete="tel"
              aria-invalid={errors.phone ? 'true' : 'false'}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              isInvalid={Boolean(errors.phone)}
            />
          </div>
          {errors.phone ? (
            <Form.Text id="phone-error" className="text-danger d-block mt-2">
              {errors.phone}
            </Form.Text>
          ) : null}
        </Form.Group>

        <Button
          type="submit"
          className="rc-register-primary-btn"
          disabled={!isFormFilled || isLoading}
        >
          {isLoading ? (
            <Spinner size="sm" animation="border" role="status" aria-hidden="true" />
          ) : (
            <>
              CONTINUAR <i className="bi bi-arrow-right" aria-hidden="true" />
            </>
          )}
        </Button>
      </Form>
    </section>
  );
}

export default RegisterStep1Form;
