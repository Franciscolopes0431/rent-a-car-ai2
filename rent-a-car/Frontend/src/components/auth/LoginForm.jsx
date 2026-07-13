import { useEffect, useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';
import PasswordInput from '../common/PasswordInput';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (!formData.email && !formData.password) {
      return;
    }

    setErrors((prev) => {
      const nextErrors = { ...prev };

      if (formData.email) {
        delete nextErrors.email;
      }

      if (formData.password) {
        delete nextErrors.password;
      }

      return nextErrors;
    });

    setApiError('');
  }, [formData.email, formData.password]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.email || !EMAIL_REGEX.test(formData.email)) {
      validationErrors.email = 'Informe um e-mail válido.';
    }

    if (!formData.password || formData.password.length < 6) {
      validationErrors.password = 'A palavra-passe deve ter pelo menos 6 caracteres.';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setApiError('');
    setIsLoading(true);

    try {
      const response = await authService.login(formData);
      if (!response?.user) throw new Error('Dados da conta não recebidos do servidor.');
      login({ user: response.user, rememberMe: formData.rememberMe });
      // Role-aware redirect
      const role = response.user?.role;
      if (role === 'admin') navigate('/admin', { replace: true });
      else if (role === 'gestor') navigate('/gestor', { replace: true });
      else navigate('/cliente', { replace: true });
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Não foi possível entrar na conta.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rc-form-wrapper">
      <p className="rc-kicker">BEM-VINDO DE VOLTA</p>
      <h2 className="rc-form-title">ACEDA À SUA CONTA</h2>

      <p className="rc-signup-text">
        Não tem conta? <Link to="/registo">Registe-se gratuitamente</Link>
      </p>

      {apiError ? (
        <Alert variant="danger" className="mb-3" role="alert">
          {apiError}
        </Alert>
      ) : null}

      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-3">
          <Form.Label className="rc-input-label">EMAIL</Form.Label>
          <Form.Control
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="youremail@example.com"
            className="rc-auth-input"
            isInvalid={Boolean(errors.email)}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            autoComplete="email"
          />
          {errors.email ? (
            <Form.Text id="email-error" className="text-danger d-block mt-2">
              {errors.email}
            </Form.Text>
          ) : null}
        </Form.Group>

        <Form.Group className="mb-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <Form.Label className="rc-input-label mb-0">PALAVRA-PASSE</Form.Label>
          </div>

          <PasswordInput
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isInvalid={Boolean(errors.password)}
            ariaDescribedBy={errors.password ? 'password-error' : undefined}
          />

          {errors.password ? (
            <Form.Text id="password-error" className="text-danger d-block mt-2">
              {errors.password}
            </Form.Text>
          ) : null}
        </Form.Group>

        <Form.Group className="mb-4" controlId="rememberMe">
          <Form.Check
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            label="Manter-me conectado"
            className="rc-remember-check"
          />
        </Form.Group>

        <Button
          type="submit"
          className="rc-primary-btn"
          disabled={isLoading}
          aria-label="Entrar na conta"
        >
          {isLoading ? (
            <Spinner size="sm" animation="border" role="status" aria-hidden="true" />
          ) : (
            <>
              ENTRAR NA CONTA <FiArrowRight />
            </>
          )}
        </Button>
      </Form>

      <p className="rc-terms-text">
        Ao entrar, concorda com os nossos <Link to="/termos">Termos de Serviço</Link> e{' '}
        <Link to="/privacidade">Política de Privacidade</Link>
      </p>
    </div>
  );
}

export default LoginForm;
