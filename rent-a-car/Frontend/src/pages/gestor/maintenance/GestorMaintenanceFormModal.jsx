import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import * as maintenanceService from '../../../services/maintenanceService';
import * as vehicleService from '../../../services/vehicleService';

const TYPE_OPTIONS = ['Manutenção', 'Indisponibilidade', 'Revisão', 'Sinistro'];

function GestorMaintenanceFormModal({ show, alert, onHide, onSaved }) {
  const [formData, setFormData] = useState({ vehicleId: '', type: 'Manutenção', description: '', resolved: false });
  const [errors, setErrors] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (alert) {
      setFormData({
        vehicleId: alert.vehicle?.id || '',
        type: alert.type || 'Manutenção',
        description: alert.description || '',
        resolved: alert.resolved || false,
      });
    } else {
      setFormData({ vehicleId: '', type: 'Manutenção', description: '', resolved: false });
    }
    setErrors({});
  }, [alert, show]);

  useEffect(() => {
    async function loadVehicles() {
      const response = await vehicleService.list({ pageSize: 200 });
      setVehicles(response.data.data);
    }
    if (show) {
      loadVehicles();
    }
  }, [show]);

  const validate = () => {
    const payloadErrors = {};
    if (!formData.vehicleId) payloadErrors.vehicleId = 'O veículo é obrigatório.';
    if (!formData.description) payloadErrors.description = 'A descrição é obrigatória.';
    setErrors(payloadErrors);
    return Object.keys(payloadErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const payload = {
        vehicleId: formData.vehicleId,
        type: formData.type,
        description: formData.description,
        resolved: formData.resolved,
      };
      if (alert) {
        await maintenanceService.update(alert.id, payload);
      } else {
        await maintenanceService.create(payload);
      }
      onSaved();
    } catch (error) {
      setErrors({ api: error.response?.data?.message || 'Erro ao salvar alerta de manutenção.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{alert ? 'EDITAR ALERTA' : 'NOVO ALERTA'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {errors.api && <div className="alert alert-danger">{errors.api}</div>}
          <Form.Group controlId="gestor-vehicleId-maint" className="mb-3">
            <Form.Label>Veículo</Form.Label>
            <Form.Select value={formData.vehicleId} onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })} isInvalid={!!errors.vehicleId}>
              <option value="">Selecione um veículo</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>{`${vehicle.brand} ${vehicle.model} (${vehicle.plate})`}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.vehicleId}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="gestor-type-maint" className="mb-3">
            <Form.Label>Tipo</Form.Label>
            <Form.Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
              {TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="gestor-description-maint" className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control as="textarea" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} isInvalid={!!errors.description} />
            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="gestor-resolved-maint" className="mb-3">
            <Form.Check
              type="checkbox"
              label="Resolvido"
              checked={formData.resolved}
              onChange={(e) => setFormData({ ...formData, resolved: e.target.checked })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button type="submit" variant="warning" disabled={isSaving}>{alert ? 'Salvar alterações' : 'Criar alerta'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default GestorMaintenanceFormModal;
