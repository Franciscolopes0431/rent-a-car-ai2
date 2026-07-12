import { useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';

function AccountPage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmation: '' });
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState('');

  const saveProfile = async (event) => {
    event.preventDefault(); setSaving('profile'); setFeedback(null);
    try { const updated = await authService.updateProfile(profile); updateUser(updated); setFeedback({ type: 'success', text: 'Dados atualizados com sucesso.' }); }
    catch (error) { setFeedback({ type: 'danger', text: error.response?.data?.message || 'Não foi possível atualizar os dados.' }); }
    finally { setSaving(''); }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    if (passwords.newPassword !== passwords.confirmation) { setFeedback({ type: 'danger', text: 'As novas palavras-passe não coincidem.' }); return; }
    setSaving('password'); setFeedback(null);
    try { const result = await authService.updatePassword(passwords); setPasswords({ currentPassword: '', newPassword: '', confirmation: '' }); setFeedback({ type: 'success', text: result.message }); }
    catch (error) { setFeedback({ type: 'danger', text: error.response?.data?.message || 'Não foi possível alterar a palavra-passe.' }); }
    finally { setSaving(''); }
  };

  return (
    <Container className="py-4 rc-customer-page">
      <div className="rc-customer-page-header"><div><span className="rc-eyebrow">Perfil</span><h1>A Minha Conta</h1><p>Atualize os seus dados e mantenha a conta segura.</p></div></div>
      {feedback ? <Alert variant={feedback.type} dismissible onClose={() => setFeedback(null)}>{feedback.text}</Alert> : null}
      <Row className="g-4">
        <Col lg={7}><div className="rc-card h-100"><h2 className="h5 mb-1">Dados pessoais</h2><p className="text-secondary small mb-4">Estes dados são usados nas suas reservas.</p>
          <Form onSubmit={saveProfile}><Form.Group className="mb-3"><Form.Label>Nome completo</Form.Label><Form.Control required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></Form.Group><Form.Group className="mb-4"><Form.Label>Email</Form.Label><Form.Control required type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></Form.Group><Button type="submit" variant="warning" disabled={saving === 'profile'}>{saving === 'profile' ? 'A guardar...' : 'Guardar alterações'}</Button></Form>
        </div></Col>
        <Col lg={5}><div className="rc-card"><h2 className="h5 mb-1">Segurança</h2><p className="text-secondary small mb-4">Use pelo menos 8 caracteres.</p>
          <Form onSubmit={savePassword}><Form.Group className="mb-3"><Form.Label>Palavra-passe atual</Form.Label><Form.Control required type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} /></Form.Group><Form.Group className="mb-3"><Form.Label>Nova palavra-passe</Form.Label><Form.Control required minLength={8} type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} /></Form.Group><Form.Group className="mb-4"><Form.Label>Confirmar palavra-passe</Form.Label><Form.Control required type="password" value={passwords.confirmation} onChange={(e) => setPasswords({ ...passwords, confirmation: e.target.value })} /></Form.Group><Button type="submit" variant="outline-warning" disabled={saving === 'password'}>{saving === 'password' ? 'A atualizar...' : 'Alterar palavra-passe'}</Button></Form>
        </div><div className="rc-card mt-4"><h2 className="h6">Precisa de ajuda?</h2><p className="text-secondary small">A equipa de apoio pode esclarecer questões sobre a sua conta.</p><Button as={Link} to="/suporte" variant="link" className="p-0 text-warning text-decoration-none">Contactar apoio <i className="bi bi-arrow-right" /></Button></div></Col>
      </Row>
    </Container>
  );
}
export default AccountPage;
