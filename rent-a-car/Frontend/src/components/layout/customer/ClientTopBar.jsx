import { Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/cliente': ['Visão geral', 'A sua área pessoal'],
  '/cliente/frota': ['Frota', 'Escolha a sua próxima viatura'],
  '/cliente/reserva': ['Nova reserva', 'Reserve um veículo em poucos passos'],
  '/cliente/minhas-reservas': ['As minhas reservas', 'Acompanhe e altere as suas reservas'],
  '/cliente/historico': ['Histórico', 'Reservas anteriores e concluídas'],
  '/cliente/minha-conta': ['A minha conta', 'Dados pessoais da conta'],
  '/cliente/metodos-pagamento': ['Pagamentos', 'Gerir os seus métodos de pagamento'],
  '/cliente/avaliacoes': ['Avaliações', 'Comentários e classificações'],
  '/cliente/suporte': ['Suporte', 'Ajuda e contactos de apoio'],
};

function ClientTopBar({ onToggleSidebar }) {
  const { pathname } = useLocation();
  const monthYear = new Date().toLocaleDateString('pt-PT', {
    month: 'long',
    year: 'numeric',
  });

  const pageKey = Object.keys(PAGE_TITLES)
    .sort((a, b) => b.length - a.length)
    .find((path) => pathname.startsWith(path)) || '/cliente';

  const [title, description] = PAGE_TITLES[pageKey];
  const subtitle = `${description} · ${monthYear.charAt(0).toUpperCase()}${monthYear.slice(1)}`;

  return (
    <header className="rc-topbar">
      <div className="d-flex align-items-start gap-3">
        <Button
          type="button"
          variant="link"
          className="rc-topbar-menu d-lg-none"
          aria-label="Abrir menu lateral"
          onClick={onToggleSidebar}
        >
          <i className="bi bi-list" aria-hidden="true" />
        </Button>

        <div>
          <h1 className="rc-topbar-title">{title}</h1>
          <p className="rc-topbar-subtitle">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}

export default ClientTopBar;
