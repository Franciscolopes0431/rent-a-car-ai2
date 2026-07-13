import { Link, NavLink } from 'react-router-dom';
import Logo from '../common/Logo';
import SidebarUserCard from './SidebarUserCard';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
  { to: '/admin/frota', label: 'Frota', icon: 'bi-car-front' },
  { to: '/admin/reservas', label: 'Reservas', icon: 'bi-calendar-check' },
  { to: '/admin/manutencao', label: 'Manutenção', icon: 'bi-tools' },
  { to: '/admin/clientes', label: 'Clientes', icon: 'bi-people' },
  { to: '/admin/relatorios', label: 'Relatórios', icon: 'bi-bar-chart' },
  { to: '/admin/apoio', label: 'Apoio', icon: 'bi-life-preserver' },
  { to: '/admin/avaliacoes', label: 'Avaliações', icon: 'bi-star' },
  { to: '/admin/equipa', label: 'Equipa', icon: 'bi-person-gear' },
  { to: '/admin/auditoria', label: 'Auditoria', icon: 'bi-shield-check' },
  { to: '/admin/configuracoes', label: 'Configurações', icon: 'bi-gear' },
];

function Sidebar({ onNavigate }) {
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
            end={item.to === '/admin'}
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

      <SidebarUserCard />
    </aside>
  );
}

export default Sidebar;
