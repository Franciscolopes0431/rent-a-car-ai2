import { useEffect, useMemo, useState } from 'react';
import { Button, Form, Modal, Row, Col } from 'react-bootstrap';
import * as vehicleService from '../../../services/vehicleService';

const CATEGORY_OPTIONS = ['Compacto', 'Berlina', 'SUV', 'Citadino', 'Desportivo'];
const STATUS_OPTIONS = ['Disponível', 'Reservado', 'Manutenção'];

function GestorVehicleFormModal({ show, vehicle, onHide, onSaved }) {
  const emptyVehicle = { plate: '', brand: '', model: '', category: 'Compacto', pricePerDay: '', status: 'Disponível', year: '', seats: '', transmission: '', fuel: '' };
  const [formData, setFormData] = useState(emptyVehicle);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        plate: vehicle.plate || '',
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        category: vehicle.category || 'Compacto',
        pricePerDay: vehicle.pricePerDay || '',
        status: vehicle.status || 'Disponível',
        year: vehicle.year || '', seats: vehicle.seats || '', transmission: vehicle.transmission || '', fuel: vehicle.fuel || '',
      });
    } else {
      setFormData(emptyVehicle);
    }
    setErrors({});
  }, [vehicle, show]);

  const title = useMemo(() => (vehicle ? 'EDITAR VIATURA' : 'NOVA VIATURA'), [vehicle]);

  const validate = () => {
    const payloadErrors = {};
    if (!formData.plate) payloadErrors.plate = 'A matrícula é obrigatória.';
    else if (!/^[A-Z0-9]{2}-[A-Z0-9]{2}-[A-Z0-9]{2}$/.test(formData.plate)) payloadErrors.plate = 'Formato AA-AA-AA inválido.';
    if (!formData.brand) payloadErrors.brand = 'A marca é obrigatória.';
    if (!formData.model) payloadErrors.model = 'O modelo é obrigatório.';
    if (formData.pricePerDay === '' || Number(formData.pricePerDay) <= 0) payloadErrors.pricePerDay = 'O preço deve ser maior que zero.';
    setErrors(payloadErrors);
    return Object.keys(payloadErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const payload = {
        plate: formData.plate,
        brand: formData.brand,
        model: formData.model,
        category: formData.category,
        pricePerDay: Number(formData.pricePerDay),
        status: formData.status,
        year: formData.year ? Number(formData.year) : null, seats: formData.seats ? Number(formData.seats) : null,
        transmission: formData.transmission || null, fuel: formData.fuel || null,
      };

      if (vehicle) {
        await vehicleService.update(vehicle.id, payload);
      } else {
        await vehicleService.create(payload);
      }

      onSaved();
    } catch (error) {
      setErrors({ api: error.response?.data?.message || 'Erro ao salvar viatura.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {errors.api && <div className="alert alert-danger">{errors.api}</div>}
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="gestor-plate">
                <Form.Label>Matrícula</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.plate}
                  onChange={(event) => setFormData({ ...formData, plate: event.target.value.toUpperCase() })}
                  placeholder="AA-AA-AA"
                  isInvalid={!!errors.plate}
                />
                <Form.Control.Feedback type="invalid">{errors.plate}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="gestor-brand">
                <Form.Label>Marca</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.brand}
                  onChange={(event) => setFormData({ ...formData, brand: event.target.value })}
                  isInvalid={!!errors.brand}
                />
                <Form.Control.Feedback type="invalid">{errors.brand}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="gestor-model">
                <Form.Label>Modelo</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.model}
                  onChange={(event) => setFormData({ ...formData, model: event.target.value })}
                  isInvalid={!!errors.model}
                />
                <Form.Control.Feedback type="invalid">{errors.model}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="gestor-category">
                <Form.Label>Categoria</Form.Label>
                <Form.Select value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })}>
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="gestor-pricePerDay">
                <Form.Label>Preço por dia</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pricePerDay}
                  onChange={(event) => setFormData({ ...formData, pricePerDay: event.target.value })}
                  isInvalid={!!errors.pricePerDay}
                />
                <Form.Control.Feedback type="invalid">{errors.pricePerDay}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="gestor-status">
                <Form.Label>Estado</Form.Label>
                <Form.Select value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })}>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}><Form.Group controlId="gestorYear"><Form.Label>Ano</Form.Label><Form.Control type="number" min="1980" max={new Date().getFullYear() + 1} value={formData.year} onChange={(event) => setFormData({ ...formData, year: event.target.value })} /></Form.Group></Col>
            <Col md={6}><Form.Group controlId="gestorSeats"><Form.Label>Lugares</Form.Label><Form.Control type="number" min="1" max="9" value={formData.seats} onChange={(event) => setFormData({ ...formData, seats: event.target.value })} /></Form.Group></Col>
            <Col md={6}><Form.Group controlId="gestorTransmission"><Form.Label>Transmissão</Form.Label><Form.Select value={formData.transmission} onChange={(event) => setFormData({ ...formData, transmission: event.target.value })}><option value="">Não indicada</option><option>Manual</option><option>Automática</option></Form.Select></Form.Group></Col>
            <Col md={6}><Form.Group controlId="gestorFuel"><Form.Label>Combustível</Form.Label><Form.Select value={formData.fuel} onChange={(event) => setFormData({ ...formData, fuel: event.target.value })}><option value="">Não indicado</option><option>Gasolina</option><option>Diesel</option><option>Híbrido</option><option>Elétrico</option></Form.Select></Form.Group></Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button type="submit" variant="warning" disabled={isSaving}>{vehicle ? 'Atualizar' : 'Criar'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default GestorVehicleFormModal;
