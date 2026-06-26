import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import * as customerService from '../../services/customerService';

function CustomerFormModal({ show, customer, onHide, onSaved }) {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || '',
      });
    } else {
      setFormData({ firstName: '', lastName: '', email: '', phone: '' });
    }
    setErrors({});
  }, [customer, show]);

  const validate = () => {
    const payloadErrors = {};
    if (!formData.firstName) payloadErrors.firstName = 'O nome é obrigatório.';
    if (!formData.lastName) payloadErrors.lastName = 'O sobrenome é obrigatório.';
    if (!formData.email) payloadErrors.email = 'O email é obrigatório.';
    if (formData.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) payloadErrors.email = 'Formato de email inválido.';
    if (!formData.phone) payloadErrors.phone = 'O telefone é obrigatório.';
    setErrors(payloadErrors);
    return Object.keys(payloadErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const payload = { ...formData };
      if (customer) {
        await customerService.update(customer.id, payload);
      } else {
        await customerService.create(payload);
      }
      onSaved();
    } catch (error) {
      setErrors({ api: error.response?.data?.message || 'Erro ao salvar cliente.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{customer ? 'EDITAR CLIENTE' : 'NOVO CLIENTE'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {errors.api && <div className="alert alert-danger">{errors.api}</div>}
          <Form.Group controlId="firstName" className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={formData.firstName}
              onChange={(event) => setFormData({ ...formData, firstName: event.target.value })}
              isInvalid={!!errors.firstName}
            />
            <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="lastName" className="mb-3">
            <Form.Label>Sobrenome</Form.Label>
            <Form.Control
              type="text"
              value={formData.lastName}
              onChange={(event) => setFormData({ ...formData, lastName: event.target.value })}
              isInvalid={!!errors.lastName}
            />
            <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="phone" className="mb-3">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              type="tel"
              value={formData.phone}
              onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button type="submit" variant="warning" disabled={isSaving}>{customer ? 'Atualizar' : 'Criar'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CustomerFormModal;
