import { useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import EmptyState from '../../components/common/EmptyState';
import { useBookings } from '../../hooks/useBookings';

const KEY = 'rentcarReviews';
const readReviews = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };

function ReviewsPage() {
  const { bookings, isLoading } = useBookings({ history: 'true' });
  const [reviews, setReviews] = useState(readReviews);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const eligible = bookings.filter((booking) => booking.estado === 'confirmada' && !reviews.some((review) => review.bookingId === booking.id));
  const save = (event) => { event.preventDefault(); const next = [{ id: Date.now(), bookingId: selected.id, vehicle: `${selected.vehicle?.brand} ${selected.vehicle?.model}`, date: new Date().toISOString(), ...form }, ...reviews]; setReviews(next); localStorage.setItem(KEY, JSON.stringify(next)); setSelected(null); setForm({ rating: 5, comment: '' }); };

  return <Container className="py-4 rc-customer-page"><div className="rc-customer-page-header"><div><span className="rc-eyebrow">Experiência</span><h1>As Minhas Avaliações</h1><p>Partilhe a sua experiência após uma reserva concluída.</p></div>{eligible.length ? <Button variant="warning" onClick={() => setSelected(eligible[0])}>Avaliar uma reserva</Button> : null}</div>
    {isLoading ? <div className="text-center py-5"><Spinner variant="warning" /></div> : reviews.length === 0 ? <EmptyState title="Sem avaliações" description={eligible.length ? 'Já pode avaliar uma das suas reservas concluídas.' : 'Quando concluir uma reserva, poderá avaliá-la aqui.'} action={eligible.length ? { label: 'Avaliar agora', onClick: () => setSelected(eligible[0]) } : undefined} /> : <Row className="g-4">{reviews.map((review) => <Col md={6} key={review.id}><article className="rc-card h-100"><div className="d-flex justify-content-between"><h2 className="h5">{review.vehicle}</h2><span className="text-warning" aria-label={`${review.rating} estrelas`}>{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span></div><p className="text-secondary mb-0">{review.comment}</p></article></Col>)}</Row>}
    <Modal show={Boolean(selected)} onHide={() => setSelected(null)} centered><Modal.Header closeButton><Modal.Title>Avaliar reserva</Modal.Title></Modal.Header><Form onSubmit={save}><Modal.Body><p className="text-secondary">{selected?.vehicle?.brand} {selected?.vehicle?.model}</p><Form.Group className="mb-3"><Form.Label>Classificação</Form.Label><Form.Select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>{[5,4,3,2,1].map((value) => <option key={value} value={value}>{value} estrelas</option>)}</Form.Select></Form.Group><Form.Group><Form.Label>Comentário</Form.Label><Form.Control required minLength={10} maxLength={500} as="textarea" rows={4} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} /><Form.Text>{form.comment.length}/500 caracteres</Form.Text></Form.Group></Modal.Body><Modal.Footer><Button variant="secondary" onClick={() => setSelected(null)}>Cancelar</Button><Button variant="warning" type="submit">Publicar avaliação</Button></Modal.Footer></Form></Modal>
  </Container>;
}
export default ReviewsPage;
