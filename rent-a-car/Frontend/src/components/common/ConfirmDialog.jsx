import { Button, Modal } from 'react-bootstrap';

function ConfirmDialog({ show, title, message, onCancel, onConfirm, confirmLabel = 'Confirmar' }) {
  return (
    <Modal show={show} onHide={onCancel} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0">{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="warning" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDialog;
