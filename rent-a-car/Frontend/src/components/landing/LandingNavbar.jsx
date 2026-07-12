import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

function LandingNavbar() {
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
            <Nav.Link as={Link} to="/login">Entrar</Nav.Link>
            <Nav.Link as={Link} to="/registo" className="btn rc-btn-primary-action ms-2 text-white">
              Registar
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default LandingNavbar;
