import Logo from '../common/Logo';
import heroImage from '../../assets/images/bmw-hero.jpg';

const BENEFITS = [
  'Reservas em menos de 2 minutos',
  'Cancelamento gratuito até 24h antes',
  'Seguro incluído em todos os veículos',
  'Suporte 24/7 em português',
];

function RegisterHeroPanel() {
  return (
    <section
      className="rc-register-hero-panel"
      style={{
        backgroundImage:
          `linear-gradient(180deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.90) 100%), url(${heroImage})`,
      }}
    >
      <div className="rc-register-hero-content">
        <Logo />

        <div className="rc-register-hero-bottom">
          <h1 className="rc-register-hero-title">
            JUNTE-SE A
            <br />
            NOSSA <span>FROTA.</span>
          </h1>

          <p className="rc-register-hero-subtitle">
            Crie a sua conta e tenha acesso imediato a mais de 500 veículos premium. Rápido,
            simples e seguro.
          </p>

          <ul className="rc-register-benefits" aria-label="Benefícios da RentCar">
            {BENEFITS.map((benefit) => (
              <li key={benefit}>
                <i className="bi bi-check-circle-fill" aria-hidden="true" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default RegisterHeroPanel;
