import { useMemo } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { useBookings } from '../../hooks/useBookings';

const money = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
const dayMs = 1000 * 60 * 60 * 24;

const ACTIONS = [
  { to: '/cliente/frota', title: 'Explorar frota', description: 'Compare as viaturas disponíveis.', icon: 'bi-car-front', action: 'Ver frota' },
  { to: '/cliente/reserva', title: 'Nova reserva', description: 'Reserve um veículo em poucos passos.', icon: 'bi-calendar-plus', action: 'Reservar agora', primary: true },
  { to: '/cliente/minhas-reservas', title: 'As minhas reservas', description: 'Consulte, altere ou cancele reservas.', icon: 'bi-calendar-check', action: 'Gerir reservas' },
  { to: '/cliente/suporte', title: 'Apoio ao cliente', description: 'Obtenha ajuda e acompanhe pedidos.', icon: 'bi-life-preserver', action: 'Pedir ajuda' },
];

function ClientDashboardPage() {
  const { user } = useAuth();
  const { bookings, summary, isLoading, error } = useBookings({}, 100);
  const today = new Date().toISOString().slice(0, 10);
  const firstName = user?.name?.split(' ')[0] || 'Cliente';

  const data = useMemo(() => {
    const upcoming = bookings.filter((booking) => booking.estado !== 'cancelada' && booking.data_fim >= today).sort((a, b) => a.data_inicio.localeCompare(b.data_inicio));
    const finished = bookings.filter((booking) => booking.estado === 'confirmada' && booking.data_fim < today);
    const rentalDays = finished.reduce((total, booking) => total + Math.max(1, Math.ceil((new Date(`${booking.data_fim}T00:00:00`) - new Date(`${booking.data_inicio}T00:00:00`)) / dayMs)), 0);
    const spent = finished.reduce((total, booking) => total + Number(booking.preco_estimado || 0), 0);
    return { upcoming, finished, rentalDays, spent };
  }, [bookings, today]);

  if (isLoading) return <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>;

  return (
    <Container fluid className="py-4 rc-client-dashboard">
      <section className="rc-client-welcome mb-4">
        <div><span className="rc-eyebrow">Área do cliente</span><h1>Olá, {firstName} <span aria-hidden="true">👋</span></h1><p>Bem-vindo novamente. {data.upcoming.length === 1 ? 'Tem 1 reserva ativa.' : `Tem ${data.upcoming.length} reservas ativas.`}</p></div>
        <Button as={Link} to="/cliente/frota" variant="warning" size="lg"><i className="bi bi-plus-lg me-2" />Nova reserva</Button>
      </section>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <Row className="g-3 mb-4">
        {[
          { label: 'Reservas', value: summary.total, icon: 'bi-calendar3' },
          { label: 'Dias alugados', value: data.rentalDays, icon: 'bi-clock-history' },
          { label: 'Viagens terminadas', value: data.finished.length, icon: 'bi-check2-circle' },
          { label: 'Total acumulado', value: money.format(data.spent), icon: 'bi-wallet2' },
        ].map((stat) => <Col sm={6} xl={3} key={stat.label}><article className="rc-client-stat"><div><i className={`bi ${stat.icon}`} /><span>{stat.label}</span></div><strong>{stat.value ?? 0}</strong></article></Col>)}
      </Row>

      <Row className="g-4 mb-4">
        {ACTIONS.map((item) => <Col md={6} xl={3} key={item.to}><article className={`rc-client-action-card ${item.primary ? 'is-primary' : ''}`}><div className="rc-client-action-icon"><i className={`bi ${item.icon}`} /></div><h2>{item.title}</h2><p>{item.description}</p><Button as={Link} to={item.to} variant={item.primary ? 'dark' : 'outline-warning'}>{item.action} <i className="bi bi-arrow-right ms-2" /></Button></article></Col>)}
      </Row>

      <Row className="g-4">
        <Col xl={8}><section className="rc-card rc-next-booking h-100"><div className="d-flex justify-content-between align-items-center mb-4"><div><span className="rc-eyebrow">Próxima viagem</span><h2 className="h4 mt-1 mb-0">A sua próxima reserva</h2></div><Button as={Link} to="/cliente/minhas-reservas" variant="link" className="text-warning text-decoration-none">Ver todas</Button></div>{data.upcoming[0] ? <div className="rc-next-booking-content"><div className="rc-next-booking-vehicle"><i className="bi bi-car-front-fill" /><div><h3>{data.upcoming[0].vehicle?.brand} {data.upcoming[0].vehicle?.model}</h3><p>{data.upcoming[0].vehicle?.plate}</p></div></div><div><small>Levantamento</small><strong>{new Date(`${data.upcoming[0].data_inicio}T00:00:00`).toLocaleDateString('pt-PT')}</strong></div><div><small>Devolução</small><strong>{new Date(`${data.upcoming[0].data_fim}T00:00:00`).toLocaleDateString('pt-PT')}</strong></div><div><small>Estado</small><StatusBadge status={data.upcoming[0].estado} /></div></div> : <div className="rc-inline-empty"><i className="bi bi-calendar2-plus" /><div><h3>Sem viagens planeadas</h3><p>Escolha uma viatura e prepare a próxima viagem.</p></div><Button as={Link} to="/cliente/frota" variant="warning">Explorar frota</Button></div>}</section></Col>
        <Col xl={4}><section className="rc-card h-100"><span className="rc-eyebrow">Precisa de ajuda?</span><h2 className="h4 mt-2">Estamos disponíveis</h2><p className="text-secondary">Consulte respostas rápidas ou registe um pedido de apoio associado a uma reserva.</p><div className="d-grid gap-2 mt-4"><Button as={Link} to="/cliente/suporte" variant="outline-warning">Abrir apoio</Button><Button as="a" href="tel:+351210000000" variant="link" className="text-secondary text-decoration-none"><i className="bi bi-telephone me-2" />+351 210 000 000</Button></div></section></Col>
      </Row>
    </Container>
  );
}

export default ClientDashboardPage;
