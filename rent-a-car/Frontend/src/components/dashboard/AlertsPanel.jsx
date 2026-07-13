import { Placeholder } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AlertsPanel({ alerts, isLoading, basePath = '/admin' }) {
  const navigate = useNavigate();
  return (
    <section className="rc-card rc-alerts-card">
      <div className="rc-card-header">
        <h2>ALERTAS E INDISPONIBILIDADES</h2>
        <button type="button" className="rc-inline-link" onClick={() => navigate(`${basePath}/manutencao`)}>
          Gerir <i className="bi bi-chevron-right" aria-hidden="true" />
        </button>
      </div>

      {isLoading ? (
        <Placeholder as="div" animation="glow">
          <Placeholder xs={12} className="mb-3" />
          <Placeholder xs={12} className="mb-3" />
          <Placeholder xs={12} />
        </Placeholder>
      ) : alerts.length === 0 ? (
        <p className="text-secondary mb-0">Sem alertas ativos.</p>
      ) : (
        <div className="rc-alerts-list">
          {alerts.map((alert) => (
            <article key={alert.id} className="rc-alert-item">
              <span className="rc-alert-icon-wrap" aria-hidden="true">
                <i className={`bi ${alert.icon || 'bi-tools'}`} aria-hidden="true" />
              </span>
              <div>
                <p className="rc-alert-title">
                  {alert.vehicle?.model} — {alert.type}
                </p>
                <p className="rc-alert-description">{alert.description}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AlertsPanel;
