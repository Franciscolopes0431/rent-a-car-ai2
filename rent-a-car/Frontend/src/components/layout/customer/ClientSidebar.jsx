import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../common/Logo';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const MAIN_ITEMS = [
  { to: '/cliente', label: 'Visão geral', icon: 'bi-house-door' },
  { to: '/cliente/frota', label: 'Frota', icon: 'bi-car-front' },
  { to: '/cliente/reserva', label: 'Nova reserva', icon: 'bi-calendar-plus', primary: true },
  { to: '/cliente/minhas-reservas', label: 'As minhas reservas', icon: 'bi-calendar-check' },
  { to: '/cliente/historico', label: 'Histórico', icon: 'bi-clock-history' },
];
const ACCOUNT_ITEMS = [
  { to: '/cliente/notificacoes', label: 'Notificações', icon: 'bi-bell' },
  { to: '/cliente/minha-conta', label: 'Perfil', icon: 'bi-person' },
  { to: '/cliente/metodos-pagamento', label: 'Pagamentos', icon: 'bi-credit-card' },
  { to: '/cliente/avaliacoes', label: 'Avaliações', icon: 'bi-star' },
  { to: '/cliente/suporte', label: 'Ajuda', icon: 'bi-life-preserver' },
];

function SidebarLinks({ items, onNavigate }) {
  return items.map((item) => <NavLink key={item.to} to={item.to} end={item.to === '/cliente'} onClick={onNavigate} className={({ isActive }) => `rc-sidebar-link ${item.primary ? 'is-primary-action' : ''} ${isActive ? 'is-active' : ''}`}><span className="rc-sidebar-link-left"><i className={`bi ${item.icon}`} aria-hidden="true" /><span>{item.label}</span></span><span className="rc-sidebar-active-dot" aria-hidden="true" /></NavLink>);
}

function ClientSidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = (user?.name || 'Cliente').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  const handleLogout = () => { logout(); navigate('/login'); };

  return <aside className="rc-sidebar rc-client-sidebar"><div className="rc-sidebar-logo-wrap"><Link to="/" onClick={onNavigate} className="rc-sidebar-home-link" aria-label="Voltar à página inicial"><Logo /></Link></div><nav className="rc-sidebar-nav" aria-label="Navegação do cliente"><span className="rc-sidebar-section-label">Principal</span><SidebarLinks items={MAIN_ITEMS} onNavigate={onNavigate} /><span className="rc-sidebar-section-label mt-3">Conta</span><SidebarLinks items={ACCOUNT_ITEMS} onNavigate={onNavigate} /></nav><div className="rc-client-sidebar-footer"><div className="rc-client-user"><span className="rc-client-avatar" aria-hidden="true">{initials}</span><div><strong>{user?.name || 'Cliente'}</strong><span>{user?.email || ''}</span></div></div><button type="button" className="rc-client-logout" onClick={handleLogout}><i className="bi bi-box-arrow-right" />Terminar sessão</button></div></aside>;
}
export default ClientSidebar;
