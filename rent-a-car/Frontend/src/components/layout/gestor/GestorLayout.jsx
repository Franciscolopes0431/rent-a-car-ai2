import { useState } from 'react';
import { Col, Container, Offcanvas, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import GestorSidebar from './GestorSidebar';
import GestorTopBar from './GestorTopBar';

function GestorLayout() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const openSidebar = () => setShowMobileSidebar(true);
  const closeSidebar = () => setShowMobileSidebar(false);

  return (
    <Container fluid className="rc-admin-layout p-0">
      <Row className="g-0">
        <Col lg="auto" className="d-none d-lg-block">
          <GestorSidebar />
        </Col>

        <Col className="rc-admin-main">
          <GestorTopBar onToggleSidebar={openSidebar} />
          <main className="rc-admin-content" aria-live="polite">
            <Outlet />
          </main>
        </Col>
      </Row>

      <Offcanvas
        show={showMobileSidebar}
        onHide={closeSidebar}
        placement="start"
        className="rc-sidebar-offcanvas"
      >
        <Offcanvas.Header closeButton closeVariant="white" />
        <Offcanvas.Body className="p-0">
          <GestorSidebar onNavigate={closeSidebar} />
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
}

export default GestorLayout;
