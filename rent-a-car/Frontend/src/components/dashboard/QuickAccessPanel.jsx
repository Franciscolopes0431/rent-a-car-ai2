import { Placeholder, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DEFAULT_ACTIONS = [
  { id: 'customers', label: 'Clientes', description: 'Consultar e gerir clientes', icon: 'bi-people', path: 'clientes' },
  { id: 'bookings', label: 'Reservas', description: 'Consultar e gerir reservas', icon: 'bi-calendar-check', path: 'reservas' },
];

function QuickAccessPanel({ actions = DEFAULT_ACTIONS, isLoading, basePath = '/admin' }) {
  return (
    <section className="rc-card rc-quick-card">
      <div className="rc-card-header">
        <h2>ACESSO RÁPIDO</h2>
      </div>

      {isLoading ? (
        <Placeholder as="div" animation="glow">
          <Placeholder xs={12} className="mb-2" />
          <Placeholder xs={12} />
        </Placeholder>
      ) : (
        <Row className="g-2">
          {actions.map((action) => (
            <Col key={action.id} sm={6}>
              <Link
                to={`${basePath}/${action.path}`}
                className="rc-account-tile"
              >
                <i className={`bi ${action.icon}`} aria-hidden="true" />
                <span>
                  <strong>{action.label}</strong>
                  <small>{action.description}</small>
                </span>
              </Link>
            </Col>
          ))}
        </Row>
      )}

    </section>
  );
}

export default QuickAccessPanel;
