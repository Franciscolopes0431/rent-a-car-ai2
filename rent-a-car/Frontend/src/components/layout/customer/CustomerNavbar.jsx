import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Logo from '../../common/Logo';

function CustomerNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="rc-customer-navbar" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <Logo />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="customer-navbar-nav" />
        <Navbar.Collapse id="customer-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Início</Nav.Link>
            <Nav.Link as={NavLink} to="/frota">Frota</Nav.Link>
            <Nav.Link as={NavLink} to="/sobre">Sobre Nós</Nav.Link>
            <Nav.Link as={NavLink} to="/contactos">Contactos</Nav.Link>
            {isAuthenticated && user?.role === 'cliente' ? <Nav.Link as={NavLink} to="/minhas-reservas">Reservas</Nav.Link> : null}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <NavDropdown title={<span><i className="bi bi-person-circle me-2"></i>{user?.name}</span>} id="customer-nav-dropdown" align="end">
                {user?.role === 'admin' || user?.role === 'gestor' ? (
                  <>
                    <NavDropdown.Item as={Link} to={`/${user.role}`}>Painel de {user.role === 'admin' ? 'administração' : 'gestão'}</NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                ) : null}
                <NavDropdown.Item as={Link} to="/minha-conta">A Minha Conta</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/minhas-reservas">As Minhas Reservas</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/historico">Histórico</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/metodos-pagamento">Métodos de Pagamento</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/avaliacoes">Avaliações</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/suporte">Apoio ao Cliente</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">Sair</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Entrar</Nav.Link>
                <Nav.Link as={Link} to="/registo" className="btn btn-primary ms-2 px-3 text-white rc-btn-primary">
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

export default CustomerNavbar;
