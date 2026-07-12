import { Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/admin': ['Dashboard', 'Visão geral da operação'],
  '/admin/frota': ['Frota', 'Gestão das viaturas'],
  '/admin/reservas': ['Reservas', 'Gestão das reservas'],
  '/admin/manutencao': ['Manutenção', 'Alertas e indisponibilidades'],
  '/admin/clientes': ['Clientes', 'Gestão dos clientes'],
  '/admin/relatorios': ['Relatórios', 'Análise da operação'],
};

function TopBar({ onToggleSidebar }) {
  const { pathname } = useLocation();
  const monthYear = new Date().toLocaleDateString('pt-PT', {
    month: 'long',
    year: 'numeric',
  });

  const pageKey = Object.keys(PAGE_TITLES).sort((a, b) => b.length - a.length).find((path) => pathname.startsWith(path)) || '/admin';
  const [title, description] = PAGE_TITLES[pageKey];
  const subtitle = `${description} · ${monthYear.charAt(0).toUpperCase()}${monthYear.slice(1)}`;

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
          <h1 className="rc-topbar-title">{title}</h1>
          <p className="rc-topbar-subtitle">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
