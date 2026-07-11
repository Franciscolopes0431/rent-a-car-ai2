import { Button } from 'react-bootstrap';

function GestorTopBar({ onToggleSidebar }) {
  const monthYear = new Date().toLocaleDateString('pt-PT', {
    month: 'long',
    year: 'numeric',
  });

  const subtitle = `Visão geral da operação · ${monthYear.charAt(0).toUpperCase()}${monthYear.slice(1)}`;

  return (
    <header className="rc-topbar">
      <div className="d-flex align-items-start gap-3">
        <Button
          type="button"
          variant="link"
          className="rc-topbar-menu d-lg-none"
          aria-label="Abrir menu lateral"
          onClick={onToggleSidebar}
        >
          <i className="bi bi-list" aria-hidden="true" />
        </Button>

        <div>
          <h1 className="rc-topbar-title">DASHBOARD</h1>
          <p className="rc-topbar-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="rc-topbar-actions">
        <Button type="button" className="rc-btn-secondary-action">
          <i className="bi bi-plus" aria-hidden="true" />
          <span>Nova Viatura</span>
        </Button>

        <Button type="button" className="rc-btn-primary-action">
          <i className="bi bi-plus" aria-hidden="true" />
          <span>Nova Reserva</span>
        </Button>
      </div>
    </header>
  );
}

export default GestorTopBar;
