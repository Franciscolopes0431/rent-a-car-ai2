import Logo from '../common/Logo';

const BENEFITS = [
  'Reservas em menos de 2 minutos',
  'Cancelamento gratuito até 24h antes',
  'Seguro incluído em todos os veículos',
  'Suporte 24/7 em português',
];

function RegisterHeroPanel() {
  return (
    <section className="rc-register-hero-panel">
      <div className="rc-register-hero-content">
        <Logo />

        <div className="rc-register-hero-bottom">
          <span className="rc-hero-eyebrow">
            <i className="bi bi-stars" aria-hidden="true" /> Comece hoje
          </span>
          <h1 className="rc-register-hero-title">
            JUNTE-SE À
            <br />
            <span>RENTCAR.</span>
          </h1>

          <p className="rc-register-hero-subtitle">
            Crie a sua conta gratuitamente e reserve a viatura ideal de forma rápida, simples e segura.
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
