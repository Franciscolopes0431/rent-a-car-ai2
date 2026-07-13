import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as vehicleService from '../../services/vehicleService';
import * as bookingService from '../../services/bookingService';
import { useAuth } from '../../hooks/useAuth';

function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get('vehicleId');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(searchParams.get('pickup') && searchParams.get('return') ? 2 : 1);
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [dates, setDates] = useState({
    pickup: searchParams.get('pickup') || '',
    return: searchParams.get('return') || '',
    location: searchParams.get('location') || 'Lisboa - Aeroporto'
  });

  const [extras, setExtras] = useState({
    gps: false,
    childSeat: 0,
    insurance: false
  });

  const [payment, setPayment] = useState({
    method: 'Pagamento de teste',
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!vehicleId) {
      navigate('/cliente/reserva');
      return;
    }

    const fetchVehicle = async () => {
      try {
        setLoadError('');
        const response = await vehicleService.getById(vehicleId);
        const vehicleData = response?.data?.data || response?.data;
        setVehicle(vehicleData || null);
        if (!vehicleData) {
          setLoadError('Não foi possível encontrar este veículo.');
        }
      } catch (err) {
        console.error('Error fetching vehicle:', err);
        setLoadError(err.response?.data?.message || 'Não foi possível carregar o veículo selecionado.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId, navigate]);

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <p className="text-secondary">A preparar a sua reserva...</p>
      </Container>
    );
  }

  if (!vehicle) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{loadError || 'Não foi possível carregar o veículo selecionado.'}</Alert>
      </Container>
    );
  }

  const days = dates.pickup && dates.return 
    ? Math.max(1, Math.ceil((new Date(dates.return) - new Date(dates.pickup)) / (1000 * 60 * 60 * 24))) 
    : 1;

  const basePrice = Number(vehicle.pricePerDay) * days;
  const extrasPrice = (extras.gps ? 10 * days : 0) + (extras.childSeat * 5 * days) + (extras.insurance ? 25 * days : 0);
  const totalPrice = basePrice + extrasPrice;

  const handleNext = () => {
    if (step === 1) {
      if (!dates.pickup || !dates.return) {
        setError('Selecione as datas de levantamento e devolução para continuar.');
        return;
      }

      if (dates.pickup < today || dates.return <= dates.pickup) {
        setError('Escolha um levantamento a partir de hoje e uma devolução posterior.');
        return;
      }
    }

    setError('');
    setStep((current) => current + 1);
  };
  const handlePrev = () => setStep(s => s - 1);

  const handleConfirm = async () => {
    if (!dates.pickup || !dates.return) {
      setError('Selecione as datas de levantamento e devolução para continuar.');
      return;
    }

    if (new Date(dates.return) <= new Date(dates.pickup)) {
      setError('A data de devolução tem de ser posterior à data de levantamento.');
      return;
    }

    if (!payment.acceptTerms) {
      setError('Tem de aceitar os termos e condições para prosseguir.');
      return;
    }

    if (!user?.id) {
      setError('É necessário iniciar sessão para concluir a reserva.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        userId: user.id,
        vehicleId: Number(vehicleId),
        data_inicio: dates.pickup,
        data_fim: dates.return,
        extras,
      };

      const response = await bookingService.create(payload);
      const reservationId = response?.data?.id || response?.id;
      navigate(`/minhas-reservas?reservation=${reservationId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível criar a reserva.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-4 rc-customer-page">
      <div className="rc-customer-page-header"><div><span className="rc-eyebrow">Reserva segura</span><h1>Finalizar Reserva</h1><p>Revise cada etapa antes de confirmar.</p></div></div>

      <div className="d-flex justify-content-between mb-5 position-relative rc-stepper">
        <div className={`text-center ${step >= 1 ? 'text-primary' : 'text-secondary'}`} style={{ zIndex: 1, backgroundColor: 'var(--rc-bg-dark)', padding: '0 10px' }}>
          <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${step >= 1 ? 'bg-primary text-dark' : 'bg-secondary text-white'}`} style={{ width: '40px', height: '40px' }}>
            1
          </div>
          <div className="small fw-bold">Datas e Local</div>
        </div>
        <div className={`text-center ${step >= 2 ? 'text-primary' : 'text-secondary'}`} style={{ zIndex: 1, backgroundColor: 'var(--rc-bg-dark)', padding: '0 10px' }}>
          <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${step >= 2 ? 'bg-primary text-dark' : 'bg-secondary text-white'}`} style={{ width: '40px', height: '40px' }}>
            2
          </div>
          <div className="small fw-bold">Extras</div>
        </div>
        <div className={`text-center ${step >= 3 ? 'text-primary' : 'text-secondary'}`} style={{ zIndex: 1, backgroundColor: 'var(--rc-bg-dark)', padding: '0 10px' }}>
          <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${step >= 3 ? 'bg-primary text-dark' : 'bg-secondary text-white'}`} style={{ width: '40px', height: '40px' }}>
            3
          </div>
          <div className="small fw-bold">Pagamento</div>
        </div>
        <div className="position-absolute border-bottom border-secondary" style={{ top: '20px', left: '10%', right: '10%', zIndex: 0 }}></div>
      </div>

      <Row>
        <Col lg={8}>
          {step === 1 && (
            <div className="rc-card mb-4">
              <h4 className="h5 text-white mb-4">Quando e onde?</h4>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="text-secondary">Local de Levantamento e Devolução</Form.Label>
                  <Form.Select 
                    value={dates.location}
                    onChange={(e) => setDates({ ...dates, location: e.target.value })}
                    className="bg-dark text-white border-secondary"
                  >
                    <option>Lisboa - Aeroporto</option>
                    <option>Porto - Aeroporto</option>
                    <option>Faro - Aeroporto</option>
                  </Form.Select>
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-secondary">Data de Levantamento</Form.Label>
                      <Form.Control 
                        type="date"
                        value={dates.pickup}
                        min={today}
                        onChange={(e) => setDates({ ...dates, pickup: e.target.value, return: dates.return && dates.return <= e.target.value ? '' : dates.return })}
                        className="bg-dark text-white border-secondary"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-secondary">Data de Devolução</Form.Label>
                      <Form.Control 
                        type="date"
                        value={dates.return}
                        min={dates.pickup || today}
                        onChange={(e) => setDates({ ...dates, return: e.target.value })}
                        className="bg-dark text-white border-secondary"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {error ? <Alert variant="danger" className="mb-3">{error}</Alert> : null}
                <div className="d-flex justify-content-end mt-4">
                  <Button variant="primary" onClick={handleNext} disabled={!dates.pickup || !dates.return} className="rc-btn-primary px-4">
                    Continuar para Extras
                  </Button>
                </div>
              </Form>
            </div>
          )}

          {step === 2 && (
            <div className="rc-card mb-4">
              <h4 className="h5 text-white mb-4">Pretende adicionar algum extra?</h4>
              
              <div className="border border-secondary rounded p-3 mb-3 d-flex justify-content-between align-items-center bg-dark">
                <div>
                  <h5 className="text-white mb-1">GPS / Navegação</h5>
                  <p className="text-secondary mb-0 small">€10 / dia</p>
                </div>
                <Form.Check 
                  type="switch"
                  id="gps-switch"
                  checked={extras.gps}
                  onChange={(e) => setExtras({ ...extras, gps: e.target.checked })}
                />
              </div>

              <div className="border border-secondary rounded p-3 mb-3 d-flex justify-content-between align-items-center bg-dark">
                <div>
                  <h5 className="text-white mb-1">Cobertura Total (Seguro)</h5>
                  <p className="text-secondary mb-0 small">Zero franquia. Viaje sem preocupações. (€25 / dia)</p>
                </div>
                <Form.Check 
                  type="switch"
                  id="insurance-switch"
                  checked={extras.insurance}
                  onChange={(e) => setExtras({ ...extras, insurance: e.target.checked })}
                />
              </div>

              <div className="border border-secondary rounded p-3 mb-4 d-flex justify-content-between align-items-center bg-dark">
                <div>
                  <h5 className="text-white mb-1">Cadeira de Criança</h5>
                  <p className="text-secondary mb-0 small">Obrigatório para crianças até 12 anos ou 135cm. (€5 / dia)</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Button variant="outline-secondary" size="sm" onClick={() => setExtras({ ...extras, childSeat: Math.max(0, extras.childSeat - 1) })}>-</Button>
                  <span className="text-white px-2">{extras.childSeat}</span>
                  <Button variant="outline-secondary" size="sm" onClick={() => setExtras({ ...extras, childSeat: extras.childSeat + 1 })}>+</Button>
                </div>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <Button variant="outline-light" onClick={handlePrev}>
                  Voltar
                </Button>
                <Button variant="primary" onClick={handleNext} className="rc-btn-primary px-4">
                  Continuar para Pagamento
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="rc-card mb-4">
              <h4 className="h5 text-white mb-2">Confirmação</h4>
              <Alert variant="info" className="small mb-4"><i className="bi bi-info-circle me-2" />O pagamento é fictício. Não será efetuada qualquer cobrança.</Alert>
              
              <Form.Group className="mb-4">
                <Form.Label className="text-secondary">Selecione o método</Form.Label>
                <Form.Select 
                  value={payment.method}
                  onChange={(e) => setPayment({ ...payment, method: e.target.value })}
                  className="bg-dark text-white border-secondary mb-3"
                >
                  <option value="Pagamento de teste">Pagamento de teste</option>
                </Form.Select>
              </Form.Group>

              {error ? (
                <Alert variant="danger" className="mb-3">{error}</Alert>
              ) : null}

              <Form.Group className="mb-4">
                <Form.Check 
                  type="checkbox"
                  id="terms"
                  label="Aceito os Termos e Condições e a Política de Privacidade."
                  className="text-secondary"
                  checked={payment.acceptTerms}
                  onChange={(e) => setPayment({ ...payment, acceptTerms: e.target.checked })}
                />
              </Form.Group>

              <div className="d-flex justify-content-between mt-4">
                <Button variant="outline-light" onClick={handlePrev}>
                  Voltar
                </Button>
                <Button variant="primary" onClick={handleConfirm} className="rc-btn-primary px-4" disabled={!payment.acceptTerms || isSubmitting}>
                  {isSubmitting ? 'A confirmar...' : 'Confirmar Reserva'}
                </Button>
              </div>
            </div>
          )}
        </Col>

        <Col lg={4}>
          <div className="rc-card position-sticky" style={{ top: '90px' }}>
            <h4 className="h5 text-white border-bottom border-secondary pb-3 mb-3">Resumo da Reserva</h4>
            
            <div className="d-flex align-items-center mb-4">
              <img src={vehicle.imageUrl} alt={vehicle.model} className="rounded me-3" style={{ width: '80px', height: '60px', objectFit: 'cover' }} />
              <div>
                <h6 className="text-white mb-0">{vehicle.brand} {vehicle.model}</h6>
                <small className="text-secondary">{vehicle.category}</small>
              </div>
            </div>

            {dates.pickup && dates.return && (
              <div className="mb-4 text-secondary small">
                <div className="mb-1"><i className="bi bi-geo-alt me-2 text-warning"></i>{dates.location}</div>
                <div className="mb-1"><i className="bi bi-calendar me-2 text-warning"></i>{dates.pickup} a {dates.return} ({days} {days === 1 ? 'dia' : 'dias'})</div>
              </div>
            )}

            <div className="border-top border-secondary pt-3 mt-3">
              <div className="d-flex justify-content-between text-secondary mb-2">
                <span>Diárias ({days}x €{Number(vehicle.pricePerDay).toFixed(2)})</span>
                <span>€{basePrice.toFixed(2)}</span>
              </div>
              
              {extras.gps && (
                <div className="d-flex justify-content-between text-secondary mb-2 small">
                  <span>GPS</span>
                  <span>€{(10 * days).toFixed(2)}</span>
                </div>
              )}
              {extras.insurance && (
                <div className="d-flex justify-content-between text-secondary mb-2 small">
                  <span>Seguro Total</span>
                  <span>€{(25 * days).toFixed(2)}</span>
                </div>
              )}
              {extras.childSeat > 0 && (
                <div className="d-flex justify-content-between text-secondary mb-2 small">
                  <span>Cadeira Criança (x{extras.childSeat})</span>
                  <span>€{(5 * extras.childSeat * days).toFixed(2)}</span>
                </div>
              )}

              <div className="d-flex justify-content-between text-white fw-bold fs-5 border-top border-secondary pt-3 mt-3">
                <span>Total estimado</span>
                <span className="text-warning">€{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CheckoutPage;
