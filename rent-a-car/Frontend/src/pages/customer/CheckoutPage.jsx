import { Container, Row, Col, Button, Form, Card, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as vehicleService from '../../services/vehicleService';

function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get('vehicleId');
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [dates, setDates] = useState({
    pickup: '',
    return: '',
    location: 'Lisboa - Aeroporto'
  });

  const [extras, setExtras] = useState({
    gps: false,
    childSeat: 0,
    insurance: false
  });

  const [payment, setPayment] = useState({
    method: 'Credit Card',
    acceptTerms: false
  });

  useEffect(() => {
    if (!vehicleId) {
      navigate('/frota');
      return;
    }

    const fetchVehicle = async () => {
      try {
        const response = await vehicleService.getById(vehicleId);
        setVehicle(response.data);
      } catch (err) {
        console.error("Error fetching vehicle:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId, navigate]);

  if (isLoading || !vehicle) {
    return (
      <Container className="py-5 text-center">
        <p className="text-secondary">A preparar a sua reserva...</p>
      </Container>
    );
  }

  const days = dates.pickup && dates.return 
    ? Math.max(1, Math.ceil((new Date(dates.return) - new Date(dates.pickup)) / (1000 * 60 * 60 * 24))) 
    : 1;

  const basePrice = vehicle.price_per_day * days;
  const extrasPrice = (extras.gps ? 10 * days : 0) + (extras.childSeat * 5 * days) + (extras.insurance ? 25 * days : 0);
  const totalPrice = basePrice + extrasPrice;

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleConfirm = () => {
    if (!payment.acceptTerms) {
      alert('Tem de aceitar os termos e condições para prosseguir.');
      return;
    }
    // Simulate booking creation
    alert('Reserva concluída com sucesso!');
    navigate('/minhas-reservas');
  };

  return (
    <Container className="py-4">
      <h1 className="h3 mb-4 text-white">Finalizar Reserva</h1>

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
                        onChange={(e) => setDates({ ...dates, pickup: e.target.value })}
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
                        onChange={(e) => setDates({ ...dates, return: e.target.value })}
                        className="bg-dark text-white border-secondary"
                      />
                    </Form.Group>
                  </Col>
                </Row>
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
              <h4 className="h5 text-white mb-4">Método de Pagamento</h4>
              
              <Form.Group className="mb-4">
                <Form.Label className="text-secondary">Selecione o método</Form.Label>
                <Form.Select 
                  value={payment.method}
                  onChange={(e) => setPayment({ ...payment, method: e.target.value })}
                  className="bg-dark text-white border-secondary mb-3"
                >
                  <option value="Credit Card">Cartão de Crédito/Débito</option>
                  <option value="MB Way">MB Way</option>
                  <option value="Paypal">PayPal</option>
                </Form.Select>
              </Form.Group>

              {payment.method === 'Credit Card' && (
                <div className="p-3 border border-secondary rounded mb-4">
                  <p className="text-secondary small mb-3"><i className="bi bi-shield-lock me-2"></i>Pagamento Seguro</p>
                  <Form.Group className="mb-3">
                    <Form.Control placeholder="Número do Cartão" className="bg-dark text-white border-secondary" />
                  </Form.Group>
                  <Row>
                    <Col xs={6}>
                      <Form.Control placeholder="MM/AA" className="bg-dark text-white border-secondary" />
                    </Col>
                    <Col xs={6}>
                      <Form.Control placeholder="CVC" className="bg-dark text-white border-secondary" />
                    </Col>
                  </Row>
                </div>
              )}

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
                <Button variant="primary" onClick={handleConfirm} className="rc-btn-primary px-4" disabled={!payment.acceptTerms}>
                  Confirmar e Pagar
                </Button>
              </div>
            </div>
          )}
        </Col>

        <Col lg={4}>
          <div className="rc-card position-sticky" style={{ top: '90px' }}>
            <h4 className="h5 text-white border-bottom border-secondary pb-3 mb-3">Resumo da Reserva</h4>
            
            <div className="d-flex align-items-center mb-4">
              <img src={vehicle.image_url} alt={vehicle.model} className="rounded me-3" style={{ width: '80px', height: '60px', objectFit: 'cover' }} />
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
                <span>Diárias ({days}x €{vehicle.price_per_day})</span>
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
                <span>Total a Pagar</span>
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
