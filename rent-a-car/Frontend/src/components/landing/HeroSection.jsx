import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import SearchBar from '../common/SearchBar';

function HeroSection() {
  const [location, setLocation] = useState('Lisbon');
  const [pickup, setPickup] = useState('');
  const [ret, setRet] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (pickup) params.set('pickup', pickup);
    if (ret) params.set('return', ret);
    params.set('location', location);
    window.location.href = `/frota?${params.toString()}`;
  };

  return (
    <header className="rc-landing-hero" style={{ backgroundImage: `url('/src/assets/images/bmw-hero.jpg')` }}>
      <div className="rc-landing-hero-overlay" />
      <Container className="rc-landing-hero-content">
        <Row>
          <Col lg={7}>
            <h1 className="rc-landing-hero-title">Rent the perfect car for your journey.</h1>
            <p className="rc-landing-hero-subtitle">Fast booking · Trusted service · Fair prices</p>

            <div className="rc-landing-search">
              <Form className="d-flex gap-2 align-items-center">
                <Form.Select className="rc-landing-input" value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Pickup location">
                  <option>Lisbon</option>
                  <option>Porto</option>
                  <option>Faro</option>
                </Form.Select>
                <Form.Control type="date" className="rc-landing-input" value={pickup} onChange={(e) => setPickup(e.target.value)} aria-label="Pickup date" />
                <Form.Control type="date" className="rc-landing-input" value={ret} onChange={(e) => setRet(e.target.value)} aria-label="Return date" />
                <Button variant="" className="rc-landing-cta" onClick={handleSearch} aria-label="Search Vehicles">Search Vehicles</Button>
              </Form>
            </div>

            <div className="rc-landing-stats mt-4">
              <small className="text-secondary">⭐ 4.8/5 average · +10,000 happy customers</small>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}

export default HeroSection;
