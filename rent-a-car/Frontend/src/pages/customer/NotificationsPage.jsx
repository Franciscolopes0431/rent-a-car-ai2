import { useEffect, useState } from 'react';
import { Alert, Button, Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as notificationService from '../../services/notificationService';

function NotificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => { try { setItems((await notificationService.list()).data.data); setError(''); } catch (requestError) { setError(requestError.response?.data?.message || 'Não foi possível carregar as notificações.'); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const open = async (item) => { if (!item.readAt) await notificationService.markRead(item.id); if (item.link) navigate(item.link); else load(); };
  const readAll = async () => { await notificationService.markAllRead(); await load(); };
  return <Container className="py-4 rc-customer-page"><div className="rc-customer-page-header"><div><span className="rc-eyebrow">Atualizações da conta</span><h1>Notificações</h1><p>Acompanhe reservas, apoio e avaliações num só lugar.</p></div>{items.some((item) => !item.readAt) ? <Button variant="outline-warning" onClick={readAll}>Marcar tudo como lido</Button> : null}</div>{error ? <Alert variant="danger">{error}</Alert> : null}<div className="rc-card">{loading ? <div className="text-center py-5"><Spinner variant="warning" /></div> : items.length === 0 ? <p className="text-secondary text-center py-5 mb-0">Ainda não tem notificações.</p> : items.map((item) => <button key={item.id} type="button" onClick={() => open(item)} className={`w-100 text-start border-0 border-bottom border-secondary p-3 d-flex gap-3 bg-transparent text-white ${item.readAt ? 'opacity-75' : ''}`}><span className={`rounded-circle mt-1 ${item.readAt ? 'bg-secondary' : 'bg-warning'}`} style={{ width: 10, height: 10, flex: '0 0 auto' }} /><span><strong className="d-block">{item.title}</strong><span className="text-secondary">{item.message}</span><small className="d-block text-secondary mt-1">{new Date(item.createdAt).toLocaleString('pt-PT')}</small></span></button>)}</div></Container>;
}
export default NotificationsPage;
