import { Button, Modal } from 'react-bootstrap';

function ConfirmDialog({ show, title, message, onCancel, onConfirm, confirmLabel = 'Confirmar', isConfirming = false }) {
  return (
    <Modal show={show} onHide={onCancel} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0">{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} disabled={isConfirming}>
          Cancelar
        </Button>
        <Button variant="warning" onClick={onConfirm} disabled={isConfirming}>
          {isConfirming ? 'A processar...' : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDialog;
