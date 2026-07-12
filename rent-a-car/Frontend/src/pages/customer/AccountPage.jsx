import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

function AccountPage() {
  const { user } = useAuth();
  
  const [personalData, setPersonalData] = useState({
    name: user?.name || 'Cliente Teste',
    email: user?.email || 'cliente@teste.com',
    phone: '912345678',
    address: 'Rua do Teste, 123',
    birthDate: '1990-01-01',
    licenseNumber: 'L-12345678',
    licenseExpiry: '2030-01-01'
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [message, setMessage] = useState(null);

  const handlePersonalDataChange = (e) => {
    setPersonalData({ ...personalData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSavePersonalData = (e) => {
    e.preventDefault();
    setMessage({ type: 'success', text: 'Dados pessoais atualizados com sucesso!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'danger', text: 'As palavras-passe não coincidem.' });
      return;
    }
    setMessage({ type: 'success', text: 'Palavra-passe atualizada com sucesso!' });
    setPasswords({ current: '', new: '', confirm: '' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-2 text-white">A Minha Conta</h1>
          <p className="text-secondary">Faça a gestão dos seus dados pessoais e de segurança.</p>
        </Col>
      </Row>

      {message && (
        <div className={`alert alert-${message.type}`} role="alert">
          {message.text}
        </div>
      )}

      <Row className="g-4">
        <Col lg={8}>
          <div className="rc-card">
            <h4 className="h5 text-white mb-4 border-bottom border-secondary pb-2">Dados Pessoais</h4>
            <Form onSubmit={handleSavePersonalData}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Nome Completo</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="name"
                      value={personalData.name}
                      onChange={handlePersonalDataChange}
                      required
                      className="bg-dark text-white border-secondary" 
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      name="email"
                      value={personalData.email}
                      onChange={handlePersonalDataChange}
                      required
                      className="bg-dark text-white border-secondary" 
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Telefone</Form.Label>
                    <Form.Control 
                      type="tel" 
                      name="phone"
                      value={personalData.phone}
                      onChange={handlePersonalDataChange}
                      required
                      className="bg-dark text-white border-secondary" 
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Data de Nascimento</Form.Label>
                    <Form.Control 
                      type="date" 
                      name="birthDate"
                      value={personalData.birthDate}
                      onChange={handlePersonalDataChange}
                      required
                      className="bg-dark text-white border-secondary" 
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Morada Completa</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="address"
                      value={personalData.address}
                      onChange={handlePersonalDataChange}
                      required
                      className="bg-dark text-white border-secondary" 
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Nº Carta de Condução</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="licenseNumber"
                      value={personalData.licenseNumber}
                      onChange={handlePersonalDataChange}
                      required
                      className="bg-dark text-white border-secondary" 
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-secondary">Validade da Carta</Form.Label>
                    <Form.Control 
                      type="date" 
                      name="licenseExpiry"
                      value={personalData.licenseExpiry}
                      onChange={handlePersonalDataChange}
                      required
                      className="bg-dark text-white border-secondary" 
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end">
                <Button variant="primary" type="submit" className="rc-btn-primary px-4">
                  Guardar Alterações
                </Button>
              </div>
            </Form>
          </div>
        </Col>

        <Col lg={4}>
          <div className="rc-card mb-4">
            <h4 className="h5 text-white mb-4 border-bottom border-secondary pb-2">Segurança</h4>
            <Form onSubmit={handleUpdatePassword}>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">Palavra-passe Atual</Form.Label>
                <Form.Control 
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  required
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">Nova Palavra-passe</Form.Label>
                <Form.Control 
                  type="password"
                  name="new"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  required
                  minLength="8"
                  className="bg-dark text-white border-secondary"
                />
                <Form.Text className="text-muted small">
                  Mínimo de 8 caracteres.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="text-secondary">Confirmar Nova Palavra-passe</Form.Label>
                <Form.Control 
                  type="password"
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  required
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
              <Button variant="outline-light" type="submit" className="w-100">
                Atualizar Palavra-passe
              </Button>
            </Form>
          </div>

          <div className="rc-card border-danger border border-1">
            <h4 className="h5 text-danger mb-3">Zona de Perigo</h4>
            <p className="text-secondary small mb-3">
              Ao eliminar a sua conta, perderá o acesso a todas as suas reservas e histórico permanentemente.
            </p>
            <Button variant="outline-danger" className="w-100" onClick={() => alert('Modal de confirmação aqui')}>
              Eliminar Conta
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AccountPage;
