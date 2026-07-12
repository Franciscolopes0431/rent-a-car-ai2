import { Button } from 'react-bootstrap';

function PageHeader({ title, subtitle, actions = [] }) {
  return (
    <div className="rc-page-header rc-card mb-4">
      <div>
        <h2 className="rc-page-title mb-1">{title}</h2>
        <p className="text-muted mb-0">{subtitle}</p>
      </div>
      <div className="rc-page-header-actions d-flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.key}
            variant={action.variant || 'warning'}
            className="btn-sm rc-btn-primary-action"
            onClick={action.onClick}
          >
            {action.icon && <i className={`bi ${action.icon} me-2`} aria-hidden="true" />}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default PageHeader;
