import { useEffect, useMemo, useState } from 'react';
import { Button, Form, Modal, Row, Col, Spinner } from 'react-bootstrap';
import * as bookingService from '../../../services/bookingService';
import * as customerService from '../../../services/customerService';
import * as vehicleService from '../../../services/vehicleService';
import GestorCustomerFormModal from '../customers/GestorCustomerFormModal';

const STATUS_OPTIONS = ['Pendente', 'Confirmada', 'Em curso', 'Concluída', 'Cancelada'];

function GestorBookingFormModal({ show, booking, onHide, onSaved }) {
  const [formData, setFormData] = useState({ customerId: '', vehicleId: '', startDate: '', endDate: '', status: 'Pendente' });
  const [errors, setErrors] = useState({});
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingResources, setIsLoadingResources] = useState(false);

  useEffect(() => {
    if (booking) {
      setFormData({
        customerId: booking.customer?.id || '',
        vehicleId: booking.vehicle?.id || '',
        startDate: booking.startDate || '',
        endDate: booking.endDate || '',
        status: booking.status || 'Pendente',
      });
    } else {
      setFormData({ customerId: '', vehicleId: '', startDate: '', endDate: '', status: 'Pendente' });
    }
    setErrors({});
  }, [booking, show]);

  useEffect(() => {
    async function loadResources() {
      setIsLoadingResources(true);
      try {
        const [customerResponse, vehicleResponse] = await Promise.all([
          customerService.list({ pageSize: 100 }),
          vehicleService.list({ status: 'Disponível', pageSize: 100 }),
        ]);
        setCustomers(customerResponse.data.data);
        setVehicles(vehicleResponse.data.data);
      } finally {
        setIsLoadingResources(false);
      }
    }

    if (show) {
      loadResources();
    }
  }, [show]);

  const validate = () => {
    const payloadErrors = {};
    if (!formData.customerId) payloadErrors.customerId = 'O cliente é obrigatório.';
    if (!formData.vehicleId) payloadErrors.vehicleId = 'O veículo é obrigatório.';
    if (!formData.startDate) payloadErrors.startDate = 'A data de início é obrigatória.';
    if (!formData.endDate) payloadErrors.endDate = 'A data de fim é obrigatória.';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) payloadErrors.endDate = 'A data de fim deve ser posterior à data de início.';
    setErrors(payloadErrors);
    return Object.keys(payloadErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const payload = {
        customerId: formData.customerId,
        vehicleId: formData.vehicleId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
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

  const handleNewCustomerSaved = async () => {
    setShowCustomerForm(false);
    const response = await customerService.list({ pageSize: 100 });
    setCustomers(response.data.data);
  };

  const availableVehicles = useMemo(() => vehicles, [vehicles]);

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
                <Form.Group controlId="gestor-customerId">
                  <Form.Label>Cliente</Form.Label>
                  <div className="d-flex gap-2 align-items-center">
                    <Form.Select
                      value={formData.customerId}
                      onChange={(event) => setFormData({ ...formData, customerId: event.target.value })}
                      isInvalid={!!errors.customerId}
                    >
                      <option value="">Selecione um cliente</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>{`${customer.firstName} ${customer.lastName}`}</option>
                      ))}
                    </Form.Select>
                    <Button variant="outline-warning" size="sm" type="button" onClick={() => setShowCustomerForm(true)}>+ Novo cliente</Button>
                  </div>
                  <Form.Control.Feedback type="invalid">{errors.customerId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="gestor-vehicleId">
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
                <Form.Group controlId="gestor-startDate">
                  <Form.Label>De</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.startDate}
                    onChange={(event) => setFormData({ ...formData, startDate: event.target.value })}
                    isInvalid={!!errors.startDate}
                  />
                  <Form.Control.Feedback type="invalid">{errors.startDate}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="gestor-endDate">
                  <Form.Label>Até</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.endDate}
                    onChange={(event) => setFormData({ ...formData, endDate: event.target.value })}
                    isInvalid={!!errors.endDate}
                  />
                  <Form.Control.Feedback type="invalid">{errors.endDate}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="gestor-booking-status">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })}>
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
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

      <GestorCustomerFormModal
        show={showCustomerForm}
        onHide={() => setShowCustomerForm(false)}
        onSaved={handleNewCustomerSaved}
      />
    </>
  );
}

export default GestorBookingFormModal;
