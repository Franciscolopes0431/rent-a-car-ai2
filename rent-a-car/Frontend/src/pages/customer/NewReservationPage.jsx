import { useState } from 'react';
import { Alert, Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as vehicleService from '../../services/vehicleService';

const money = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });

function NewReservationPage() {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const [criteria, setCriteria] = useState({ pickup: '', returnDate: '', location: 'Lisboa - Aeroporto' });
  const [vehicles, setVehicles] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async (event) => {
    event.preventDefault();
    if (!criteria.pickup || !criteria.returnDate || criteria.pickup < today || criteria.returnDate <= criteria.pickup) { setError('Escolha um levantamento a partir de hoje e uma devolução posterior.'); return; }
    setLoading(true); setError(''); setSearched(true);
    try { const response = await vehicleService.available({ data_inicio: criteria.pickup, data_fim: criteria.returnDate }); setVehicles(Array.isArray(response.data) ? response.data : []); }
    catch (requestError) { setVehicles([]); setError(requestError.response?.data?.message || 'Não foi possível consultar a disponibilidade.'); }
    finally { setLoading(false); }
  };

  const choose = (vehicle) => {
    const params = new URLSearchParams({ vehicleId: vehicle.id, pickup: criteria.pickup, return: criteria.returnDate, location: criteria.location });
    navigate(`/cliente/reserva/checkout?${params.toString()}`);
  };

  const days = criteria.pickup && criteria.returnDate ? Math.max(1, Math.ceil((new Date(criteria.returnDate) - new Date(criteria.pickup)) / 86400000)) : 1;

  return <Container fluid className="py-4 rc-new-reservation"><section className="rc-client-welcome mb-4"><div><span className="rc-eyebrow">Nova reserva</span><h1>Para onde vamos?</h1><p>Escolha as datas e mostramos apenas viaturas realmente disponíveis.</p></div><div className="rc-reservation-step"><span className="is-active">1</span><i /><span>2</span><i /><span>3</span></div></section>
    <Row className="g-4"><Col xl={4}><Form onSubmit={search} className="rc-card rc-reservation-search"><div className="rc-card-header"><h2>Datas da viagem</h2></div><Form.Group className="mb-3"><Form.Label>Local de levantamento</Form.Label><Form.Select value={criteria.location} onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}><option>Lisboa - Aeroporto</option><option>Porto - Aeroporto</option><option>Faro - Aeroporto</option></Form.Select></Form.Group><Row><Col md={6} xl={12}><Form.Group className="mb-3"><Form.Label>Levantamento</Form.Label><Form.Control required type="date" min={today} value={criteria.pickup} onChange={(e) => setCriteria({ ...criteria, pickup: e.target.value, returnDate: criteria.returnDate <= e.target.value ? '' : criteria.returnDate })} /></Form.Group></Col><Col md={6} xl={12}><Form.Group className="mb-4"><Form.Label>Devolução</Form.Label><Form.Control required type="date" min={criteria.pickup || today} value={criteria.returnDate} onChange={(e) => setCriteria({ ...criteria, returnDate: e.target.value })} /></Form.Group></Col></Row>{error ? <Alert variant="danger" className="small">{error}</Alert> : null}<Button className="w-100" variant="warning" type="submit" disabled={loading}>{loading ? 'A procurar...' : <><i className="bi bi-search me-2" />Ver disponibilidade</>}</Button><p className="small text-secondary text-center mt-3 mb-0"><i className="bi bi-shield-check me-1" />Sem cobrança nesta etapa</p></Form></Col>
      <Col xl={8}><div className="d-flex justify-content-between align-items-end mb-3"><div><span className="rc-eyebrow">Viaturas</span><h2 className="h4 text-white mb-0">{searched ? `${vehicles.length} disponíveis` : 'Escolha primeiro as datas'}</h2></div>{searched && vehicles.length ? <span className="text-secondary small">Preço para {days} {days === 1 ? 'dia' : 'dias'}</span> : null}</div>{loading ? <div className="rc-card text-center py-5"><Spinner animation="border" variant="warning" /><p className="text-secondary mt-3 mb-0">A verificar reservas e indisponibilidades...</p></div> : !searched ? <div className="rc-card rc-reservation-placeholder"><i className="bi bi-calendar2-week" /><h3>Comece pelas datas</h3><p>Assim conseguimos apresentar preços e disponibilidade corretos.</p></div> : vehicles.length === 0 ? <div className="rc-card rc-reservation-placeholder"><i className="bi bi-car-front" /><h3>Sem viaturas disponíveis</h3><p>Experimente outras datas ou outro período.</p></div> : <Row className="g-3">{vehicles.map((vehicle) => <Col md={6} key={vehicle.id}><article className="rc-reservation-vehicle"><div className="rc-reservation-vehicle-media">{vehicle.imageUrl ? <img src={vehicle.imageUrl} alt={`${vehicle.brand} ${vehicle.model}`} /> : <i className="bi bi-car-front-fill" />}<span>{vehicle.category}</span></div><div className="rc-reservation-vehicle-body"><div><h3>{vehicle.brand} {vehicle.model}</h3><p><i className="bi bi-people" /> {vehicle.seats || 5} lugares <span>·</span> {vehicle.transmission || 'Transmissão não indicada'}</p></div><div className="rc-reservation-vehicle-footer"><div><small>Total estimado</small><strong>{money.format(Number(vehicle.pricePerDay) * days)}</strong><span>{money.format(Number(vehicle.pricePerDay))}/dia</span></div><Button variant="warning" onClick={() => choose(vehicle)}>Escolher <i className="bi bi-arrow-right ms-1" /></Button></div></div></article></Col>)}</Row>}</Col></Row>
  </Container>;
}
export default NewReservationPage;
