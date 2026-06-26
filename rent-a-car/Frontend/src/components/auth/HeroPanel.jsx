import { Col } from 'react-bootstrap';
import Logo from '../common/Logo';
import heroImage from '../../assets/images/bugatti-hero.jpg';

function HeroPanel() {
  return (
    <Col lg={6} className="d-none d-lg-block p-0">
      <section
        className="rc-hero-panel"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.85) 100%), url(${heroImage})` }}
      >
        <div className="rc-hero-content">
          <Logo />

          <div className="rc-hero-bottom">
            <h1 className="rc-hero-title">
              DRIVE YOUR
              <br />
              <span>ADVENTURE.</span>
            </h1>
            <p className="rc-hero-subtitle">
              Premium vehicles for every journey. Reserve your perfect car in minutes and hit the road with confidence.
            </p>

            <div className="rc-hero-stats" role="list" aria-label="Estatísticas RentCar">
              <div role="listitem">
                <strong>500+</strong>
                <span>Veículos disponíveis</span>
              </div>
              <div role="listitem">
                <strong>48h</strong>
                <span>Suporte ao cliente</span>
              </div>
              <div role="listitem">
                <strong>4.9★</strong>
                <span>Avaliação média</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Col>
  );
}

export default HeroPanel;
