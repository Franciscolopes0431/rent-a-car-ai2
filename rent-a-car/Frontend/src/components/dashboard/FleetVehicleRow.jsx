import { useMemo } from 'react';
import BookingStatusBadge from './BookingStatusBadge';

function FleetVehicleRow({ vehicle }) {
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
      }),
    []
  );

  return (
    <article className="rc-fleet-row">
      <div>
        <p className="rc-fleet-model">
          {vehicle.model}
          <span className="rc-muted-inline"> · {vehicle.plate}</span>
        </p>
        <p className="rc-fleet-meta">
          {vehicle.category} · {currencyFormatter.format(vehicle.pricePerDay)}/dia
        </p>
      </div>

      <BookingStatusBadge status={vehicle.status} />
    </article>
  );
}

export default FleetVehicleRow;
