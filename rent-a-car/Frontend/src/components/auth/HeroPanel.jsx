import { Col } from 'react-bootstrap';
import Logo from '../common/Logo';

function HeroPanel() {
  return (
    <Col lg={6} className="d-none d-lg-block p-0">
      <section
        className="rc-hero-panel"
      >
        <div className="rc-hero-content">
          <Logo />

          <div className="rc-hero-bottom">
            <span className="rc-hero-eyebrow">
              <i className="bi bi-shield-check" aria-hidden="true" /> Aluguer simples e seguro
            </span>
            <h1 className="rc-hero-title">
              A SUA VIAGEM
              <br />
              <span>COMEÇA AQUI.</span>
            </h1>
            <p className="rc-hero-subtitle">
              Encontre a viatura certa, reserve em poucos minutos e viaje com toda a confiança.
            </p>

            <div className="rc-hero-stats" role="list" aria-label="Vantagens RentCar">
              <div role="listitem">
                <strong>20+</strong>
                <span>Viaturas na frota</span>
              </div>
              <div role="listitem">
                <strong>2 min</strong>
                <span>Reserva rápida</span>
              </div>
              <div role="listitem">
                <strong>24/7</strong>
                <span>Acesso à sua conta</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Col>
  );
}

export default HeroPanel;
