import { Placeholder } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import FleetSummaryTiles from './FleetSummaryTiles';
import FleetVehicleRow from './FleetVehicleRow';

function FleetStatusPanel({ fleet, isLoading, basePath = '/admin' }) {
  const navigate = useNavigate();
  const summary = fleet?.summary || { available: 0, reserved: 0, maintenance: 0 };
  const vehicles = fleet?.vehicles || [];

  return (
    <section className="rc-card rc-fleet-card">
      <div className="rc-card-header">
        <h2>ESTADO DA FROTA</h2>
        <button type="button" className="rc-inline-link" onClick={() => navigate(`${basePath}/frota`)}>
          Gerir <i className="bi bi-chevron-right" aria-hidden="true" />
        </button>
      </div>

      <FleetSummaryTiles summary={summary} isLoading={isLoading} />

      {isLoading ? (
        <Placeholder as="div" animation="glow">
          <Placeholder xs={12} className="mb-3" />
          <Placeholder xs={12} className="mb-3" />
          <Placeholder xs={12} className="mb-3" />
          <Placeholder xs={12} className="mb-3" />
          <Placeholder xs={12} />
        </Placeholder>
      ) : vehicles.length === 0 ? (
        <p className="text-secondary mb-0">Sem veículos para mostrar.</p>
      ) : (
        <div className="rc-fleet-list">
          {vehicles.map((vehicle) => (
            <FleetVehicleRow key={`${vehicle.model}-${vehicle.plate}`} vehicle={vehicle} />
          ))}
        </div>
      )}
    </section>
  );
}

export default FleetStatusPanel;
