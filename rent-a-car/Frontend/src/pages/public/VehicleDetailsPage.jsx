import { Container, Row, Col, Button, Spinner, Table, Form } from 'react-bootstrap';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as vehicleService from '../../services/vehicleService';
import { useAuth } from '../../hooks/useAuth';
import LandingNavbar from '../../components/landing/LandingNavbar';
import LandingFooter from '../../components/landing/LandingFooter';
import * as featureService from '../../services/customerFeatureService';

function VehicleDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  
  const isStandalonePublic = pathname.startsWith('/frota');

  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  // For dynamic calculation
  const [days, setDays] = useState(1);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setIsLoading(true);
        const response = await vehicleService.getById(id);
        setVehicle(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar detalhes do veículo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  useEffect(() => {
    featureService.listPublicReviews(id).then((response) => setReviews(response.data)).catch(() => setReviews([]));
  }, [id]);

  const handleBookNow = () => {
    if (isAuthenticated) {
      navigate(`/cliente/reserva/checkout?vehicleId=${id}`);
    } else {
      // Redirect to login, but keep intent
      navigate(`/login?redirect=/cliente/reserva/checkout?vehicleId=${id}`);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="warning" />
          <p className="text-secondary mt-3">A carregar veículo...</p>
        </Container>
      );
    }

    if (error || !vehicle) {
      return (
        <Container className="py-5">
          <div className="alert alert-danger" role="alert">
            {error || 'Veículo não encontrado.'}
          </div>
          <Button variant="link" as={Link} to="/frota" className="text-white p-0 text-decoration-none">
            <i className="bi bi-arrow-left me-2"></i>Voltar à Frota
          </Button>
        </Container>
      );
    }

    return (
      <Container className={isStandalonePublic ? "py-5" : ""}>
      <div className="mb-4 d-flex align-items-center">
        <Button variant="link" as={Link} to="/frota" className="text-secondary p-0 text-decoration-none me-3">
          <i className="bi bi-arrow-left fs-4"></i>
        </Button>
        <h1 className="h3 mb-0 text-white">{vehicle.brand} {vehicle.model}</h1>
        <span className="badge bg-secondary ms-3">{vehicle.category}</span>
        {vehicle.year ? <span className="badge bg-dark border border-secondary text-secondary ms-2">{vehicle.year}</span> : null}
      </div>
      
      <Row className="g-4">
        <Col lg={8}>
          <div className="rc-card mb-4 p-0 overflow-hidden border-0">
            {vehicle.imageUrl ? (
              <img src={vehicle.imageUrl} alt={`${vehicle.brand} ${vehicle.model}`} className="w-100" style={{ height: '400px', objectFit: 'cover' }} />
            ) : (
              <div className="w-100 bg-secondary d-flex align-items-center justify-content-center text-dark" style={{ height: '400px' }}>
                <i className="bi bi-car-front-fill" style={{ fontSize: '10rem' }}></i>
              </div>
            )}
          </div>

          <div className="rc-card mb-4">
            <h4 className="h5 text-white border-bottom border-secondary pb-3 mb-3">Especificações Técnicas</h4>
            <Row>
              <Col sm={6}>
                <ul className="list-unstyled text-secondary">
                  <li className="mb-2"><i className="bi bi-tag me-2 text-warning"></i> <strong>Marca:</strong> {vehicle.brand}</li>
                  <li className="mb-2"><i className="bi bi-car-front me-2 text-warning"></i> <strong>Modelo:</strong> {vehicle.model}</li>
                  {vehicle.year ? <li className="mb-2"><i className="bi bi-calendar me-2 text-warning"></i> <strong>Ano:</strong> {vehicle.year}</li> : null}
                  <li className="mb-2"><i className="bi bi-123 me-2 text-warning"></i> <strong>Matrícula:</strong> {vehicle.plate}</li>
                </ul>
              </Col>
              <Col sm={6}>
                 <ul className="list-unstyled text-secondary">
                  <li className="mb-2"><i className="bi bi-people me-2 text-warning"></i> <strong>Lugares:</strong> {vehicle.seats || 'Não indicados'}</li>
                  <li className="mb-2"><i className="bi bi-door-closed me-2 text-warning"></i> <strong>Portas:</strong> {vehicle.doors || 5}</li>
                  <li className="mb-2"><i className="bi bi-fuel-pump me-2 text-warning"></i> <strong>Combustível:</strong> {vehicle.fuelType || 'Não indicado'}</li>
                  <li className="mb-2"><i className="bi bi-gear me-2 text-warning"></i> <strong>Transmissão:</strong> {vehicle.transmission || 'Não indicada'}</li>
                </ul>
              </Col>
            </Row>
          </div>

          <div className="rc-card mb-4">
            <h4 className="h5 text-white border-bottom border-secondary pb-3 mb-3">Condições de Aluguer</h4>
            <ul className="text-secondary ps-3 mb-0">
              <li className="mb-2">Idade mínima: 21 anos (taxa jovem pode aplicar-se a condutores com menos de 25 anos).</li>
              <li className="mb-2">Carta de condução válida há pelo menos 1 ano.</li>
              <li className="mb-2">Depósito de segurança exigido no momento do levantamento (cartão de crédito).</li>
              <li className="mb-2">Política de combustível: Cheio-Cheio.</li>
              <li>Quilometragem: Ilimitada.</li>
            </ul>
          </div>

          <section className="rc-card" aria-labelledby="vehicle-reviews-title">
            <div className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-3 mb-3"><h2 id="vehicle-reviews-title" className="h5 text-white mb-0">Avaliações dos clientes</h2><span className="text-secondary small">{reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}</span></div>
            {reviews.length === 0 ? <p className="text-secondary mb-0">Ainda não existem avaliações publicadas para esta viatura.</p> : <div className="d-grid gap-3">{reviews.map((review) => <article key={review.id} className="border-bottom border-secondary pb-3"><div className="d-flex justify-content-between gap-3"><strong className="text-white">{review.user?.displayName || 'Cliente'}</strong><span className="text-warning" aria-label={`${review.rating} estrelas`}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></div><p className="text-secondary mt-2 mb-2">{review.comment}</p>{review.adminResponse ? <div className="bg-dark rounded p-3 mt-2"><strong className="text-warning small">Resposta da RentCar</strong><p className="text-secondary mb-0 mt-1">{review.adminResponse}</p></div> : null}</article>)}</div>}
          </section>
        </Col>

        <Col lg={4}>
          <div className="rc-card rc-filters-card position-sticky" style={{ top: '90px' }}>
            <h4 className="h5 text-white mb-4">Resumo e Reserva</h4>
            
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-secondary fs-5">Preço Diário</span>
              <span className="text-white fs-4 fw-bold">€{Number(vehicle.pricePerDay).toFixed(2)}</span>
            </div>

            <Form.Group className="mb-4">
              <Form.Label className="text-secondary">Simular dias de aluguer</Form.Label>
              <Form.Control 
                type="number" 
                min="1" 
                max="30"
                value={days}
                onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-dark text-white border-secondary" 
              />
            </Form.Group>

            <div className="p-3 bg-dark rounded border border-secondary mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2 text-secondary">
                <span>€{Number(vehicle.pricePerDay).toFixed(2)} x {days} {days === 1 ? 'dia' : 'dias'}</span>
                <span>€{(Number(vehicle.pricePerDay) * days).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center text-secondary mb-3">
                <span>Taxas e Impostos</span>
                <span>Incluídos</span>
              </div>
              <div className="d-flex justify-content-between align-items-center border-top border-secondary pt-2 mt-2">
                <span className="text-white fw-bold">Total Estimado</span>
                <span className="text-warning fs-4 fw-bold">€{(Number(vehicle.pricePerDay) * days).toFixed(2)}</span>
              </div>
            </div>

            <Button 
              variant="warning" 
              className="w-100 py-3 fw-bold fs-5 text-dark rc-btn-primary"
              onClick={handleBookNow}
              disabled={vehicle.status === 'Manutenção'}
            >
              {vehicle.status !== 'Manutenção' ? 'Reservar Agora' : 'Veículo Indisponível'}
            </Button>
            
            {!isAuthenticated && (
              <div className="text-center mt-3 text-secondary small">
                Terá de iniciar sessão para concluir a reserva.
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
    );
  };

  const content = renderContent();

  return isStandalonePublic ? (
    <div className="rc-public-page">
      <LandingNavbar />
      {content}
      <LandingFooter />
    </div>
  ) : (
    content
  );
}

export default VehicleDetailsPage;
