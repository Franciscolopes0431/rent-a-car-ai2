import { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import * as featureService from '../../services/customerFeatureService';

function TicketConversationModal({ ticket, onHide, onUpdated }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const privileged = ['admin', 'gestor'].includes(user?.role);

  const load = async () => {
    if (!ticket) return;
    setLoading(true);
    try { setMessages((await featureService.listTicketMessages(ticket.id)).data); setError(''); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Não foi possível carregar a conversa.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [ticket?.id]);

  const submit = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try { await featureService.sendTicketMessage(ticket.id, message.trim()); setMessage(''); await load(); onUpdated?.(); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Não foi possível enviar a resposta.'); }
    finally { setSending(false); }
  };

  return <Modal show={!!ticket} onHide={onHide} centered size="lg" scrollable>
    <Modal.Header closeButton><Modal.Title>{ticket?.subject}<small className="d-block text-secondary fs-6">SUP-{String(ticket?.id || '').padStart(6, '0')}</small></Modal.Title></Modal.Header>
    <Modal.Body>
      {ticket?.origin === 'contacto_publico' && privileged ? <Alert variant="info">Esta resposta fica no histórico interno. O remetente público não possui conta para a consultar.</Alert> : null}
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {loading ? <div className="text-center py-5"><Spinner variant="warning" /></div> : <div className="d-flex flex-column gap-3" aria-live="polite">{messages.map((item) => {
        const mine = item.sender?.id === user?.id || (privileged && ['admin', 'gestor'].includes(item.senderRole));
        return <div key={item.id} className={`p-3 rounded ${mine ? 'bg-warning text-dark align-self-end' : 'bg-dark border border-secondary align-self-start'}`} style={{ maxWidth: '82%', whiteSpace: 'pre-wrap' }}><strong className="d-block small mb-1">{item.sender?.nome || (item.senderRole === 'visitante' ? 'Visitante' : item.senderRole)}</strong>{item.message}<small className="d-block mt-2 opacity-75">{new Date(item.createdAt).toLocaleString('pt-PT')}</small></div>;
      })}</div>}
    </Modal.Body>
    <Form onSubmit={submit}><Modal.Footer className="d-block"><Form.Label>Responder</Form.Label><Form.Control as="textarea" rows={3} maxLength={2000} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Escreva uma resposta clara..." /><div className="d-flex justify-content-between align-items-center mt-2"><small className="text-secondary">{message.length}/2000</small><Button type="submit" variant="warning" disabled={sending || !message.trim()}>{sending ? 'A enviar...' : 'Enviar resposta'}</Button></div></Modal.Footer></Form>
  </Modal>;
}
export default TicketConversationModal;
