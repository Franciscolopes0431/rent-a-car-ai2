import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function SidebarUserCard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userName = user?.name || 'Administrador';
  const userEmail = user?.email || 'admin@rentcar.pt';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="rc-sidebar-user-card">
      <div className="rc-sidebar-user-avatar" aria-hidden="true">
        A
      </div>
      <div className="rc-sidebar-user-content">
        <p className="rc-sidebar-user-name">{userName}</p>
        <p className="rc-sidebar-user-email">{userEmail}</p>
      </div>
      <Button
        type="button"
        variant="link"
        className="rc-sidebar-logout"
        onClick={handleLogout}
        aria-label="Terminar sessão"
      >
        <i className="bi bi-box-arrow-right" aria-hidden="true" />
      </Button>
    </div>
  );
}

export default SidebarUserCard;
