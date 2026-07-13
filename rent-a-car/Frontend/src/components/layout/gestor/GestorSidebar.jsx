import { NavLink } from 'react-router-dom';
import Logo from '../../common/Logo';
import { Link } from 'react-router-dom';
import GestorSidebarUserCard from './GestorSidebarUserCard';

const NAV_ITEMS = [
  { to: '/gestor', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
  { to: '/gestor/frota', label: 'Frota', icon: 'bi-car-front' },
  { to: '/gestor/reservas', label: 'Reservas', icon: 'bi-calendar-check' },
  { to: '/gestor/manutencao', label: 'Manutenção', icon: 'bi-tools' },
  { to: '/gestor/clientes', label: 'Clientes', icon: 'bi-people' },
  { to: '/gestor/relatorios', label: 'Relatórios', icon: 'bi-bar-chart' },
  { to: '/gestor/apoio', label: 'Apoio', icon: 'bi-life-preserver' },
  { to: '/gestor/avaliacoes', label: 'Avaliações', icon: 'bi-star' },
];

function GestorSidebar({ onNavigate }) {
  return (
    <aside className="rc-sidebar">
      <div className="rc-sidebar-logo-wrap">
        <Link to="/" onClick={onNavigate} className="rc-sidebar-home-link" aria-label="Voltar à página inicial">
          <Logo />
        </Link>
      </div>

      <nav className="rc-sidebar-nav" aria-label="Navegação principal">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/gestor'}
            onClick={onNavigate}
            className={({ isActive }) => `rc-sidebar-link ${isActive ? 'is-active' : ''}`}
          >
            <span className="rc-sidebar-link-left">
              <i className={`bi ${item.icon}`} aria-hidden="true" />
              <span>{item.label}</span>
            </span>
            <span className="rc-sidebar-active-dot" aria-hidden="true" />
          </NavLink>
        ))}
      </nav>

      <GestorSidebarUserCard />
    </aside>
  );
}

export default GestorSidebar;
