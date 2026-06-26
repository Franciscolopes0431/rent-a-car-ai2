import { Button } from 'react-bootstrap';

function EmptyState({ title, description, action }) {
  return (
    <div className="rc-empty-state rc-card text-center p-5">
      <div className="mb-3">
        <i className="bi bi-emoji-frown fs-1 text-warning" aria-hidden="true" />
      </div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-secondary mb-4">{description}</p>
      {action && (
        <Button variant="warning" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
