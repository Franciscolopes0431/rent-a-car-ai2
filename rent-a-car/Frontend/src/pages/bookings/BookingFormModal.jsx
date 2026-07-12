import { useEffect, useMemo, useState } from 'react';
import { Button, Form, Modal, Row, Col, Spinner } from 'react-bootstrap';
import * as bookingService from '../../services/bookingService';
import * as vehicleService from '../../services/vehicleService';

const STATUS_OPTIONS = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'cancelada', label: 'Cancelada' },
];

function BookingFormModal({ show, booking, onHide, onSaved }) {
  const [formData, setFormData] = useState({ customerId: '', vehicleId: '', startDate: '', endDate: '', status: 'pendente' });
  const [errors, setErrors] = useState({});
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerData, setCustomerData] = useState({ name: '', email: '', password: '' });
  const [customerError, setCustomerError] = useState('');
  const [isSavingCustomer, setIsSavingCustomer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingResources, setIsLoadingResources] = useState(false);

  useEffect(() => {
    if (booking) {
      setFormData({
        customerId: booking.customer?.id || '',
        vehicleId: booking.vehicle?.id || '',
        startDate: booking.startDate || '',
        endDate: booking.endDate || '',
        status: booking.estado || booking.status || 'pendente',
      });
    } else {
      setFormData({ customerId: '', vehicleId: '', startDate: '', endDate: '', status: 'pendente' });
    }
    setErrors({});
  }, [booking, show]);

  useEffect(() => {
    async function loadResources() {
      setIsLoadingResources(true);
      try {
        const [customerResponse, vehicleResponse] = await Promise.all([
          bookingService.listCustomers(),
          vehicleService.list({ status: 'Disponível', pageSize: 100 }),
        ]);
        setCustomers(customerResponse.data);
        const available = vehicleResponse.data.data;
        setVehicles(booking?.vehicle && !available.some((vehicle) => vehicle.id === booking.vehicle.id)
          ? [booking.vehicle, ...available]
          : available);
      } catch (error) {
        setErrors({ api: error.response?.data?.message || 'Não foi possível carregar clientes e viaturas.' });
      } finally {
        setIsLoadingResources(false);
      }
    }

    if (show) {
      loadResources();
    }
  }, [show, booking]);

  const validate = () => {
    const payloadErrors = {};
    if (!formData.customerId) payloadErrors.customerId = 'O cliente é obrigatório.';
    if (!formData.vehicleId) payloadErrors.vehicleId = 'O veículo é obrigatório.';
    if (!formData.startDate) payloadErrors.startDate = 'A data de início é obrigatória.';
    if (!formData.endDate) payloadErrors.endDate = 'A data de fim é obrigatória.';
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) payloadErrors.endDate = 'A data de fim deve ser posterior à data de início.';
    setErrors(payloadErrors);
    return Object.keys(payloadErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const payload = {
        userId: formData.customerId,
        vehicleId: formData.vehicleId,
        data_inicio: formData.startDate,
        data_fim: formData.endDate,
        estado: formData.status,
      };
      if (booking) {
        await bookingService.update(booking.id, payload);
      } else {
        await bookingService.create(payload);
      }
      onSaved();
    } catch (error) {
      setErrors({ api: error.response?.data?.message || 'Erro ao salvar reserva.' });
    } finally {
      setIsSaving(false);
    }
  };

  const availableVehicles = useMemo(
    () => vehicles,
    [vehicles]
  );

  const handleCreateCustomer = async (event) => {
    event.preventDefault();
    setCustomerError('');
    setIsSavingCustomer(true);
    try {
      const response = await bookingService.createCustomer(customerData);
      setCustomers((current) => [...current, response.data].sort((a, b) => a.name.localeCompare(b.name)));
      setFormData((current) => ({ ...current, customerId: response.data.id }));
      setCustomerData({ name: '', email: '', password: '' });
      setShowCustomerForm(false);
    } catch (error) {
      setCustomerError(error.response?.data?.message || 'Não foi possível criar o cliente.');
    } finally {
      setIsSavingCustomer(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{booking ? 'EDITAR RESERVA' : 'NOVA RESERVA'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {errors.api && <div className="alert alert-danger">{errors.api}</div>}
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="customerId">
                  <Form.Label>Cliente</Form.Label>
                  <div className="d-flex gap-2 align-items-start">
                    <Form.Select
                      value={formData.customerId}
                      onChange={(event) => setFormData({ ...formData, customerId: event.target.value })}
                      isInvalid={!!errors.customerId}
                    >
                      <option value="">Selecione um cliente</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>{customer.name} — {customer.email}</option>
                      ))}
                    </Form.Select>
                    <Button variant="outline-warning" type="button" className="text-nowrap" onClick={() => setShowCustomerForm(true)}>+ Cliente</Button>
                  </div>
                  <Form.Control.Feedback type="invalid">{errors.customerId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="vehicleId">
                  <Form.Label>Veículo</Form.Label>
                  <Form.Select
                    value={formData.vehicleId}
                    onChange={(event) => setFormData({ ...formData, vehicleId: event.target.value })}
                    isInvalid={!!errors.vehicleId}
                  >
                    <option value="">Selecione um veículo disponível</option>
                    {availableVehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>{`${vehicle.brand} ${vehicle.model} (${vehicle.plate})`}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.vehicleId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="startDate">
                  <Form.Label>De</Form.Label>
                  <Form.Control
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={formData.startDate}
                    onChange={(event) => setFormData({ ...formData, startDate: event.target.value })}
                    isInvalid={!!errors.startDate}
                  />
                  <Form.Control.Feedback type="invalid">{errors.startDate}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="endDate">
                  <Form.Label>Até</Form.Label>
                  <Form.Control
                    type="date"
                    min={formData.startDate || new Date().toISOString().slice(0, 10)}
                    value={formData.endDate}
                    onChange={(event) => setFormData({ ...formData, endDate: event.target.value })}
                    isInvalid={!!errors.endDate}
                  />
                  <Form.Control.Feedback type="invalid">{errors.endDate}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="status">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })}>
                    {STATUS_OPTIONS.filter((option) => booking || option.value !== 'cancelada').map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            {isLoadingResources && (
              <div className="d-flex align-items-center gap-2 mt-3 text-secondary">
                <Spinner animation="border" size="sm" /> A carregar recursos...
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>Cancelar</Button>
            <Button type="submit" variant="warning" disabled={isSaving}>{booking ? 'Atualizar reserva' : 'Criar reserva'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showCustomerForm} onHide={() => setShowCustomerForm(false)} centered>
        <Modal.Header closeButton><Modal.Title>NOVO CLIENTE</Modal.Title></Modal.Header>
        <Form onSubmit={handleCreateCustomer}>
          <Modal.Body>
            {customerError ? <div className="alert alert-danger">{customerError}</div> : null}
            <Form.Group className="mb-3" controlId="newCustomerName">
              <Form.Label>Nome completo</Form.Label>
              <Form.Control required value={customerData.name} onChange={(event) => setCustomerData({ ...customerData, name: event.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newCustomerEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control required type="email" value={customerData.email} onChange={(event) => setCustomerData({ ...customerData, email: event.target.value })} />
            </Form.Group>
            <Form.Group controlId="newCustomerPassword">
              <Form.Label>Palavra-passe inicial</Form.Label>
              <Form.Control required type="password" minLength={8} value={customerData.password} onChange={(event) => setCustomerData({ ...customerData, password: event.target.value })} />
              <Form.Text>O cliente poderá utilizar estes dados para entrar na aplicação.</Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCustomerForm(false)} disabled={isSavingCustomer}>Cancelar</Button>
            <Button variant="warning" type="submit" disabled={isSavingCustomer}>{isSavingCustomer ? 'A criar...' : 'Criar cliente'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default BookingFormModal;
