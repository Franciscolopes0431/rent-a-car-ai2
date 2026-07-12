import { useEffect, useState } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import * as bookingService from '../../services/bookingService';
import StatusBadge from '../../components/common/StatusBadge';

function ReservationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bookingService.getById(id)
      .then((response) => setReservation(response.data))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Não foi possível carregar a reserva.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>;
  if (error || !reservation) return <Alert variant="danger">{error || 'Reserva não encontrada.'}</Alert>;

  return (
    <div className="rc-card">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <Button variant="link" className="p-0 text-secondary text-decoration-none mb-3" onClick={() => navigate(-1)}>← Voltar</Button>
          <h2 className="h4 text-white mb-1">Reserva {reservation.reference}</h2>
          <p className="text-secondary mb-0">{reservation.user?.name || 'Cliente não indicado'}</p>
        </div>
        <StatusBadge status={reservation.estado} />
      </div>
      <dl className="row mb-0">
        <dt className="col-sm-4 text-secondary">Viatura</dt>
        <dd className="col-sm-8 text-white">{reservation.vehicle?.brand} {reservation.vehicle?.model} · {reservation.vehicle?.plate}</dd>
        <dt className="col-sm-4 text-secondary">Levantamento</dt>
        <dd className="col-sm-8 text-white">{new Date(reservation.data_inicio).toLocaleDateString('pt-PT')}</dd>
        <dt className="col-sm-4 text-secondary">Devolução</dt>
        <dd className="col-sm-8 text-white">{new Date(reservation.data_fim).toLocaleDateString('pt-PT')}</dd>
        <dt className="col-sm-4 text-secondary">Preço estimado</dt>
        <dd className="col-sm-8 text-white">{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(Number(reservation.preco_estimado || 0))}</dd>
      </dl>
    </div>
  );
}

export default ReservationDetailsPage;
