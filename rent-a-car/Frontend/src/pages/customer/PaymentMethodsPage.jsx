import { useState } from 'react';
import { Alert, Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import EmptyState from '../../components/common/EmptyState';

const STORAGE_KEY = 'rentcarPaymentMethods';
const readMethods = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } };

function PaymentMethodsPage() {
  const [methods, setMethods] = useState(readMethods);
  const [show, setShow] = useState(false);
  const [card, setCard] = useState({ holder: '', number: '', expiry: '' });
  const [message, setMessage] = useState('');
  const persist = (next) => { setMethods(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };
  const addCard = (event) => { event.preventDefault(); const digits = card.number.replace(/\D/g, ''); if (digits.length < 12) return; const next = [...methods, { id: Date.now(), type: digits.startsWith('4') ? 'Visa' : 'Mastercard', last4: digits.slice(-4), expiry: card.expiry, holder: card.holder, isDefault: methods.length === 0 }]; persist(next); setCard({ holder: '', number: '', expiry: '' }); setShow(false); setMessage('Cartão adicionado com sucesso.'); };
  const setDefault = (id) => persist(methods.map((method) => ({ ...method, isDefault: method.id === id })));
  const remove = (id) => { const remaining = methods.filter((method) => method.id !== id); if (remaining.length && !remaining.some((method) => method.isDefault)) remaining[0].isDefault = true; persist(remaining); };

  return <Container className="py-4 rc-customer-page"><div className="rc-customer-page-header"><div><span className="rc-eyebrow">Pagamento fictício</span><h1>Métodos de Pagamento</h1><p>Guarde cartões de teste para preencher o checkout mais rapidamente.</p></div><Button variant="warning" onClick={() => setShow(true)}><i className="bi bi-plus-lg me-2" />Adicionar cartão</Button></div>{message ? <Alert variant="success" dismissible onClose={() => setMessage('')}>{message}</Alert> : null}
    {methods.length === 0 ? <EmptyState title="Sem métodos de pagamento" description="Adicione um cartão de teste para simplificar futuras reservas." action={{ label: 'Adicionar cartão', onClick: () => setShow(true) }} /> : <Row className="g-4">{methods.map((method) => <Col md={6} lg={4} key={method.id}><div className="rc-card rc-payment-card h-100"><div className="d-flex justify-content-between"><i className="bi bi-credit-card-2-front fs-2 text-warning" />{method.isDefault ? <span className="rc-status-badge rc-badge-success">Predefinido</span> : null}</div><h2 className="h5 mt-4">{method.type} •••• {method.last4}</h2><p className="text-secondary mb-4">Expira em {method.expiry}</p><div className="d-flex gap-2 mt-auto">{!method.isDefault ? <Button size="sm" variant="outline-warning" onClick={() => setDefault(method.id)}>Predefinir</Button> : null}<Button size="sm" variant="outline-danger" aria-label={`Eliminar cartão terminado em ${method.last4}`} onClick={() => remove(method.id)}><i className="bi bi-trash" /></Button></div></div></Col>)}</Row>}
    <Modal show={show} onHide={() => setShow(false)} centered><Modal.Header closeButton><Modal.Title>Adicionar cartão de teste</Modal.Title></Modal.Header><Form onSubmit={addCard}><Modal.Body><Alert variant="info" className="small">Os dados ficam apenas neste dispositivo e não são enviados para pagamento.</Alert><Form.Group className="mb-3"><Form.Label>Nome no cartão</Form.Label><Form.Control required value={card.holder} onChange={(e) => setCard({ ...card, holder: e.target.value })} /></Form.Group><Form.Group className="mb-3"><Form.Label>Número do cartão</Form.Label><Form.Control required inputMode="numeric" maxLength={19} placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value.replace(/[^\d ]/g, '') })} /></Form.Group><Form.Group><Form.Label>Validade</Form.Label><Form.Control required pattern="(0[1-9]|1[0-2])/[0-9]{2}" placeholder="MM/AA" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} /></Form.Group></Modal.Body><Modal.Footer><Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button><Button variant="warning" type="submit">Guardar cartão</Button></Modal.Footer></Form></Modal>
  </Container>;
}
export default PaymentMethodsPage;
