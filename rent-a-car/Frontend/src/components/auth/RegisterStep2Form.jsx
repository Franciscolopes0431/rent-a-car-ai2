import { useMemo, useState } from 'react';
import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';
import authService from '../../services/authService';
import RegisterStepIndicator from './RegisterStepIndicator';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function RegisterStep2Form() {
  const { registerData, prevStep } = useRegister();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const isFormFilled = useMemo(
    () => formData.password && formData.confirmPassword && formData.acceptTerms,
    [formData.acceptTerms, formData.confirmPassword, formData.password]
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    const validationErrors = {};

    if (!PASSWORD_REGEX.test(formData.password)) {
      validationErrors.password = 'A palavra-passe deve ter pelo menos 8 caracteres, uma maiúscula, uma minúscula e um número.';
    }

    if (formData.confirmPassword !== formData.password) {
      validationErrors.confirmPassword = 'As palavras-passe não coincidem.';
    }

    if (!formData.acceptTerms) {
      validationErrors.acceptTerms = 'Tem de aceitar os termos e condições.';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setApiError('');
    setIsLoading(true);

    try {
      const payload = {
        nome: `${registerData.firstName} ${registerData.lastName}`.trim(),
        email: registerData.email,
        phone: registerData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        acceptTerms: formData.acceptTerms,
      };

      const response = await authService.register(payload);

      if (response?.token) {
        navigate('/login');
      } else {
        navigate('/login');
      }
    } catch (error) {
      setApiError(error?.response?.data?.message || 'Não foi possível concluir o registo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rc-register-form-wrapper">
      <p className="rc-register-kicker">PASSO 2 DE 2</p>
      <h2 className="rc-register-title">
        CRIE A
        <br />
        <span>SUA PASSWORD</span>
      </h2>

      <p className="rc-register-signin-text">
        Já tem conta? <Link to="/login">Inicie sessão</Link>
      </p>

      <RegisterStepIndicator currentStep={2} totalSteps={2} />

      {apiError ? (
        <Alert variant="danger" className="mb-3" role="alert">
          {apiError}
        </Alert>
      ) : null}

      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label className="rc-register-input-label">PALAVRA-PASSE</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Introduza uma palavra-passe"
            className="rc-register-input"
            isInvalid={Boolean(errors.password)}
          />
          {errors.password ? <Form.Text className="text-danger d-block mt-2">{errors.password}</Form.Text> : null}
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label className="rc-register-input-label">CONFIRME A PALAVRA-PASSE</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repita a palavra-passe"
            className="rc-register-input"
            isInvalid={Boolean(errors.confirmPassword)}
          />
          {errors.confirmPassword ? <Form.Text className="text-danger d-block mt-2">{errors.confirmPassword}</Form.Text> : null}
        </Form.Group>

        <Form.Group className="mb-4" controlId="acceptTerms">
          <Form.Check
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            label="Aceito os termos e condições e a política de privacidade."
            isInvalid={Boolean(errors.acceptTerms)}
          />
          {errors.acceptTerms ? <Form.Text className="text-danger d-block mt-2">{errors.acceptTerms}</Form.Text> : null}
        </Form.Group>

        <div className="d-flex gap-2">
          <Button type="button" variant="outline-light" className="rc-register-primary-btn" onClick={prevStep}>
            VOLTAR
          </Button>
          <Button type="submit" className="rc-register-primary-btn" disabled={!isFormFilled || isLoading}>
            {isLoading ? <Spinner size="sm" animation="border" role="status" aria-hidden="true" /> : 'REGISTAR'}
          </Button>
        </div>
      </Form>
    </section>
  );
}

export default RegisterStep2Form;
