import { Col, Placeholder, Row } from 'react-bootstrap';

function SkeletonCard({ height = 120 }) {
  return (
    <div className="rc-card" style={{ minHeight: height }}>
      <Placeholder as="div" animation="glow">
        <Placeholder xs={5} className="mb-3" />
        <Placeholder xs={3} className="mb-2" />
        <Placeholder xs={8} />
      </Placeholder>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="rc-dashboard-page">
      <Row className="g-3 mb-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Col key={index} md={6} xl={3}>
            <SkeletonCard height={140} />
          </Col>
        ))}
      </Row>

      <Row className="g-3 mb-4">
        <Col xl={8}>
          <SkeletonCard height={480} />
        </Col>
        <Col xl={4}>
          <SkeletonCard height={480} />
        </Col>
      </Row>

      <Row className="g-3">
        <Col xl={7}>
          <SkeletonCard height={240} />
        </Col>
        <Col xl={5}>
          <SkeletonCard height={240} />
        </Col>
      </Row>
    </div>
  );
}

export default DashboardSkeleton;
