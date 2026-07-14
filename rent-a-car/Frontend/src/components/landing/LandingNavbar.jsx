import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../common/Logo';

function LandingNavbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const dashboardPath = user?.role === 'admin'
    ? '/admin'
    : user?.role === 'gestor'
      ? '/gestor'
      : '/cliente';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="rc-landing-navbar" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <Logo />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="landing-navbar-nav" />
        <Navbar.Collapse id="landing-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/frota">Frota</Nav.Link>
            <Nav.Link as={Link} to="/sobre">Sobre Nós</Nav.Link>
            <Nav.Link as={Link} to="/contactos">Contactos</Nav.Link>
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link as="button" type="button" onClick={handleLogout} className="rc-landing-logout-link">
                  Terminar sessão
                </Nav.Link>
                <Nav.Link as={Link} to={dashboardPath} className="btn rc-btn-primary-action ms-lg-2 text-white">
                  <i className="bi bi-speedometer2 me-2" aria-hidden="true" />
                  Voltar ao painel
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Entrar</Nav.Link>
                <Nav.Link as={Link} to="/registo" className="btn rc-btn-primary-action ms-lg-2 text-white">
                  Registar
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default LandingNavbar;
