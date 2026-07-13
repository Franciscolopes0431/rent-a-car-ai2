import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Spinner, Table } from 'react-bootstrap';
import * as featureService from '../../services/customerFeatureService';
import { useAuth } from '../../hooks/useAuth';
import TicketConversationModal from '../../components/support/TicketConversationModal';

const labels = { recebido: 'Recebido', em_analise: 'Em análise', resolvido: 'Resolvido' };

function SupportManagementPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const load = async () => {
    try {
      setTickets((await featureService.listTickets()).data);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível carregar os pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    try {
      await featureService.updateTicket(id, status);
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível atualizar o pedido.');
    }
  };

  const removeTicket = async (id) => {
    if (!window.confirm('Eliminar definitivamente este pedido?')) return;
    try { await featureService.removeTicket(id); await load(); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Não foi possível eliminar o pedido.'); }
  };

  return <Container fluid className="py-4">
    <div className="rc-page-header"><div><span className="rc-eyebrow">Atendimento</span><h1>Pedidos de apoio</h1><p>Acompanhe os pedidos da área de cliente e do formulário público.</p></div></div>
    {error ? <Alert variant="danger">{error}</Alert> : null}
    <div className="rc-card">
      {loading ? <div className="text-center py-5"><Spinner variant="warning" /></div> : tickets.length === 0 ? <p className="text-secondary text-center py-5 mb-0">Sem pedidos de apoio.</p> : <Table responsive hover variant="dark" className="mb-0">
        <thead><tr><th>Referência</th><th>Origem</th><th>Remetente</th><th>Assunto</th><th>Mensagem</th><th>Estado</th><th><span className="visually-hidden">Ações</span></th></tr></thead>
        <tbody>{tickets.map((ticket) => {
          const name = ticket.user?.nome || ticket.guestName || 'Visitante';
          const email = ticket.user?.email || ticket.guestEmail || 'Sem email';
          return <tr key={ticket.id}>
            <td>SUP-{String(ticket.id).padStart(6, '0')}</td>
            <td><span className={`badge ${ticket.origin === 'contacto_publico' ? 'bg-info text-dark' : 'bg-secondary'}`}>{ticket.origin === 'contacto_publico' ? 'Contacto público' : 'Área do cliente'}</span></td>
            <td>{name}<small className="d-block text-secondary">{email}</small>{ticket.guestPhone ? <small className="d-block text-secondary">{ticket.guestPhone}</small> : null}</td>
            <td>{ticket.subject}</td>
            <td style={{ maxWidth: 360, whiteSpace: 'pre-wrap' }}>{ticket.message}</td>
            <td><Form.Select size="sm" value={ticket.status} onChange={(event) => changeStatus(ticket.id, event.target.value)}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Form.Select></td>
            <td><div className="d-flex gap-2"><Button size="sm" variant="outline-warning" onClick={() => setSelectedTicket(ticket)}>Abrir</Button>{user?.role === 'admin' ? <Button size="sm" variant="outline-danger" onClick={() => removeTicket(ticket.id)} aria-label={`Eliminar pedido SUP-${ticket.id}`}><i className="bi bi-trash" /></Button> : null}</div></td>
          </tr>;
        })}</tbody>
      </Table>}
    </div><TicketConversationModal ticket={selectedTicket} onHide={() => setSelectedTicket(null)} onUpdated={load} />
  </Container>;
}

export default SupportManagementPage;
