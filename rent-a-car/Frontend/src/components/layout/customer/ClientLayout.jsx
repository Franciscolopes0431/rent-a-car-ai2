import { useState } from 'react';
import { Col, Container, Offcanvas, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import ClientSidebar from './ClientSidebar';
import ClientTopBar from './ClientTopBar';

function ClientLayout() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const openSidebar = () => setShowMobileSidebar(true);
  const closeSidebar = () => setShowMobileSidebar(false);

  return (
    <Container fluid className="rc-admin-layout p-0">
      <Row className="g-0">
        <Col lg="auto" className="d-none d-lg-block">
          <ClientSidebar />
        </Col>

        <Col className="rc-admin-main">
          <ClientTopBar onToggleSidebar={openSidebar} />
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
          <ClientSidebar onNavigate={closeSidebar} />
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
}

export default ClientLayout;