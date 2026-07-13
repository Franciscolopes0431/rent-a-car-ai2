import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import * as featureService from '../../services/customerFeatureService';
import { useAuth } from '../../hooks/useAuth';

const statusLabels = { pendente: 'Pendente', aprovada: 'Aprovada', oculta: 'Oculta' };
const statusClasses = { pendente: 'bg-warning text-dark', aprovada: 'bg-success', oculta: 'bg-danger' };

function ReviewManagementPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('');
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = (await featureService.listManagedReviews()).data;
      setReviews(data);
      setDrafts(Object.fromEntries(data.map((review) => [review.id, { moderationStatus: review.moderationStatus, adminResponse: review.adminResponse || '' }])));
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível carregar as avaliações.');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const counts = useMemo(() => reviews.reduce((result, review) => ({ ...result, [review.moderationStatus]: (result[review.moderationStatus] || 0) + 1 }), {}), [reviews]);
  const visibleReviews = useMemo(() => filter ? reviews.filter((review) => review.moderationStatus === filter) : reviews, [filter, reviews]);

  const updateDraft = (id, field, value) => setDrafts((current) => ({ ...current, [id]: { ...current[id], [field]: value } }));
  const save = async (id) => {
    try {
      setSavingId(id);
      await featureService.moderateReview(id, drafts[id]);
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível guardar a moderação.');
    } finally { setSavingId(null); }
  };
  const remove = async (id) => {
    if (!window.confirm('Eliminar definitivamente esta avaliação?')) return;
    try { await featureService.removeReview(id); await load(); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Não foi possível eliminar a avaliação.'); }
  };

  return <Container fluid className="py-4">
    <div className="rc-page-header"><div><span className="rc-eyebrow">Qualidade</span><h1>Moderação de avaliações</h1><p>Aprove, oculte e responda às avaliações enviadas pelos clientes.</p></div></div>
    {error ? <Alert variant="danger">{error}</Alert> : null}
    <Row className="g-3 mb-4">
      {[['', 'Todas'], ['pendente', 'Pendentes'], ['aprovada', 'Aprovadas'], ['oculta', 'Ocultas']].map(([value, label]) => <Col sm={6} xl={3} key={label}><button type="button" className={`rc-client-stat w-100 text-start ${filter === value ? 'border-warning' : ''}`} onClick={() => setFilter(value)}><div><i className="bi bi-star" /><span>{label}</span></div><strong>{value ? counts[value] || 0 : reviews.length}</strong></button></Col>)}
    </Row>
    {loading ? <div className="text-center py-5"><Spinner variant="warning" /></div> : visibleReviews.length === 0 ? <div className="rc-card text-center py-5 text-secondary">Não existem avaliações neste estado.</div> : <div className="d-grid gap-3">{visibleReviews.map((review) => <article className="rc-card" key={review.id}>
      <div className="d-flex flex-wrap justify-content-between gap-3 mb-3"><div><div className="text-warning fs-5" aria-label={`${review.rating} estrelas`}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div><h2 className="h5 mb-1">{review.reservation?.vehicle?.brand} {review.reservation?.vehicle?.model}</h2><p className="text-secondary small mb-0">{review.user?.nome} · {review.user?.email} · Reserva #{review.reservationId}</p></div><span className={`badge align-self-start ${statusClasses[review.moderationStatus]}`}>{statusLabels[review.moderationStatus]}</span></div>
      <blockquote className="border-start border-warning ps-3 text-white">{review.comment}</blockquote>
      <Row className="g-3 align-items-end mt-1"><Col lg={3}><Form.Group><Form.Label>Publicação</Form.Label><Form.Select value={drafts[review.id]?.moderationStatus || 'pendente'} onChange={(event) => updateDraft(review.id, 'moderationStatus', event.target.value)}><option value="pendente">Pendente</option><option value="aprovada">Aprovar e publicar</option><option value="oculta">Ocultar</option></Form.Select></Form.Group></Col><Col lg={7}><Form.Group><Form.Label>Resposta da RentCar</Form.Label><Form.Control as="textarea" rows={2} maxLength={500} placeholder="Resposta pública opcional..." value={drafts[review.id]?.adminResponse || ''} onChange={(event) => updateDraft(review.id, 'adminResponse', event.target.value)} /><Form.Text>{drafts[review.id]?.adminResponse?.length || 0}/500</Form.Text></Form.Group></Col><Col lg={2}><Button className="w-100" variant="warning" disabled={savingId === review.id} onClick={() => save(review.id)}>{savingId === review.id ? 'A guardar...' : 'Guardar'}</Button>{user?.role === 'admin' ? <Button className="w-100 mt-2" variant="outline-danger" onClick={() => remove(review.id)}>Eliminar</Button> : null}</Col></Row>
      {review.moderator ? <p className="text-secondary small mt-3 mb-0">Última moderação por {review.moderator.nome}{review.moderatedAt ? ` em ${new Date(review.moderatedAt).toLocaleString('pt-PT')}` : ''}.</p> : null}
    </article>)}</div>}
  </Container>;
}

export default ReviewManagementPage;
