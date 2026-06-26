import { Placeholder } from 'react-bootstrap';

function StatCard({ label, value, footer, icon, footerVariant = 'muted', isLoading = false }) {
  return (
    <article className="rc-card rc-stat-card">
      {isLoading ? (
        <Placeholder as="div" animation="glow">
          <Placeholder xs={5} className="mb-3" />
          <Placeholder xs={4} className="mb-2" />
          <Placeholder xs={6} />
        </Placeholder>
      ) : (
        <>
          <div className="rc-stat-head">
            <span>{label}</span>
            <i className={`bi ${icon}`} aria-hidden="true" />
          </div>
          <p className="rc-stat-value">{value}</p>
          <p className={`rc-stat-footer ${footerVariant === 'success' ? 'is-positive' : ''}`}>
            {footer}
          </p>
        </>
      )}
    </article>
  );
}

export default StatCard;
