import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function HeroSection() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('Lisboa');
  const [pickup, setPickup] = useState('');
  const [ret, setRet] = useState('');
  const [error, setError] = useState('');
  const today = new Date().toISOString().slice(0, 10);

  const handleSearch = (event) => {
    event.preventDefault();
    if (!pickup || !ret) {
      setError('Selecione as datas de levantamento e devolução.');
      return;
    }
    if (pickup < today || ret <= pickup) {
      setError('Escolha um levantamento a partir de hoje e uma devolução posterior.');
      return;
    }
    const params = new URLSearchParams();
    if (pickup) params.set('pickup', pickup);
    if (ret) params.set('return', ret);
    params.set('location', location);
    navigate(`/frota?${params.toString()}`);
  };

  return (
    <header className="rc-landing-hero" style={{ backgroundImage: "url('/cars/Porsche%20Cayenne.jpg')" }}>
      <div className="rc-landing-hero-overlay" />
      <Container className="rc-landing-hero-content">
        <Row>
          <Col lg={7}>
            <h1 className="rc-landing-hero-title">Alugue o automóvel ideal para a sua viagem.</h1>
            <p className="rc-landing-hero-subtitle">Reserva rápida · Serviço de confiança · Preços justos</p>

            <div className="rc-landing-search">
              <Form className="d-flex gap-2 align-items-center" onSubmit={handleSearch}>
                <Form.Select className="rc-landing-input" value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Local de levantamento">
                  <option>Lisboa</option>
                  <option>Porto</option>
                  <option>Faro</option>
                </Form.Select>
                <Form.Control type="date" min={today} className="rc-landing-input" value={pickup} onChange={(e) => { setPickup(e.target.value); setRet((current) => current && current <= e.target.value ? '' : current); setError(''); }} aria-label="Data de levantamento" />
                <Form.Control type="date" min={pickup || today} className="rc-landing-input" value={ret} onChange={(e) => { setRet(e.target.value); setError(''); }} aria-label="Data de devolução" />
                <Button type="submit" variant="" className="rc-landing-cta" aria-label="Pesquisar viaturas">Pesquisar Viaturas</Button>
              </Form>
              {error ? <p className="text-danger small mt-2 mb-0" role="alert">{error}</p> : null}
            </div>

            <div className="rc-landing-stats mt-4">
              <small className="text-secondary">⭐ 4,8/5 de média · Mais de 10 000 clientes satisfeitos</small>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}

export default HeroSection;
