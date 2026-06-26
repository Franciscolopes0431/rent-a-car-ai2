import { NavLink } from 'react-router-dom';
import Logo from '../common/Logo';
import SidebarUserCard from './SidebarUserCard';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
  { to: '/admin/frota', label: 'Frota', icon: 'bi-car-front' },
  { to: '/admin/reservas', label: 'Reservas', icon: 'bi-calendar-check' },
  { to: '/admin/manutencao', label: 'Manutenção', icon: 'bi-tools' },
  { to: '/admin/clientes', label: 'Clientes', icon: 'bi-people' },
  { to: '/admin/relatorios', label: 'Relatórios', icon: 'bi-bar-chart' },
];

function Sidebar({ onNavigate }) {
  return (
    <aside className="rc-sidebar">
      <div className="rc-sidebar-logo-wrap">
        <Logo />
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
