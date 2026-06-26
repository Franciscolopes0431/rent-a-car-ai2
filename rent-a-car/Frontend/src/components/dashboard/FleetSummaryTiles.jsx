import { Col, Placeholder, Row } from 'react-bootstrap';

const TILE_META = [
  { key: 'available', label: 'Disponível', tone: 'success' },
  { key: 'reserved', label: 'Reservado', tone: 'info' },
  { key: 'maintenance', label: 'Manutenção', tone: 'danger' },
];

function FleetSummaryTiles({ summary, isLoading }) {
  return (
    <Row className="g-2 mb-3">
      {TILE_META.map((tile) => (
        <Col key={tile.key} xs={4}>
          <article className={`rc-fleet-tile rc-${tile.tone}`}>
            {isLoading ? (
              <Placeholder as="div" animation="glow">
                <Placeholder xs={8} className="mb-1" />
                <Placeholder xs={10} />
              </Placeholder>
            ) : (
              <>
                <p className="rc-fleet-tile-value">{summary?.[tile.key] ?? 0}</p>
                <p className="rc-fleet-tile-label">{tile.label}</p>
              </>
            )}
          </article>
        </Col>
      ))}
    </Row>
  );
}

export default FleetSummaryTiles;
