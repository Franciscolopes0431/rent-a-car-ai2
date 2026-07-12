import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { useState } from 'react';
import EmptyState from '../../components/common/EmptyState';

function ReviewsPage() {
  const [reviews, setReviews] = useState([
    { id: 1, vehicleId: 101, vehicleName: 'BMW Serie 1', date: '2023-10-15', vehicleRating: 5, serviceRating: 5, comment: 'Excelente viatura, muito limpa. O serviço foi impecável.' },
    { id: 2, vehicleId: 105, vehicleName: 'Mercedes A-Class', date: '2023-08-22', vehicleRating: 4, serviceRating: 3, comment: 'O carro estava bom, mas demorou um pouco no levantamento.' }
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);

  const handleEditClick = (review) => {
    setCurrentReview({ ...review });
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem a certeza que deseja eliminar esta avaliação?')) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const handleSave = () => {
    setReviews(reviews.map(r => r.id === currentReview.id ? currentReview : r));
    setShowEditModal(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <i key={i} className={`bi bi-star-fill ${i < rating ? 'text-warning' : 'text-secondary'} me-1`}></i>
    ));
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-2 text-white">As Minhas Avaliações</h1>
          <p className="text-secondary">Consulte e edite as avaliações que deixou sobre as suas reservas passadas.</p>
        </Col>
      </Row>

      <Row className="g-4">
        {reviews.length === 0 ? (
          <Col>
            <EmptyState 
              title="Sem avaliações"
              description="Ainda não avaliou nenhuma reserva. Após concluir uma viagem, poderá partilhar a sua experiência."
            />
          </Col>
        ) : (
          reviews.map(review => (
            <Col lg={6} key={review.id}>
              <Card className="rc-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="text-white mb-0">{review.vehicleName}</h5>
                    <small className="text-secondary">{new Date(review.date).toLocaleDateString()}</small>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-secondary small me-2">Veículo:</span>
                    {renderStars(review.vehicleRating)}
                  </div>
                  <div className="mb-3">
                    <span className="text-secondary small me-2">Serviço:</span>
                    {renderStars(review.serviceRating)}
                  </div>

                  <p className="text-white fst-italic">"{review.comment}"</p>

                  <div className="d-flex gap-2 mt-4 pt-3 border-top border-secondary">
                    <Button variant="outline-primary" size="sm" onClick={() => handleEditClick(review)}>
                      <i className="bi bi-pencil me-2"></i>Editar
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(review.id)}>
                      <i className="bi bi-trash me-2"></i>Eliminar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered contentClassName="bg-dark text-white border-secondary">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title>Editar Avaliação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentReview && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">Avaliação do Veículo (1 a 5)</Form.Label>
                <Form.Select 
                  value={currentReview.vehicleRating}
                  onChange={(e) => setCurrentReview({...currentReview, vehicleRating: parseInt(e.target.value)})}
                  className="bg-dark text-white border-secondary"
                >
                  {[1,2,3,4,5].map(v => <option key={v} value={v}>{v} Estrelas</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">Avaliação do Serviço (1 a 5)</Form.Label>
                <Form.Select 
                  value={currentReview.serviceRating}
                  onChange={(e) => setCurrentReview({...currentReview, serviceRating: parseInt(e.target.value)})}
                  className="bg-dark text-white border-secondary"
                >
                  {[1,2,3,4,5].map(v => <option key={v} value={v}>{v} Estrelas</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">Comentário</Form.Label>
                <Form.Control 
                  as="textarea"
                  rows={4}
                  value={currentReview.comment}
                  onChange={(e) => setCurrentReview({...currentReview, comment: e.target.value})}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="outline-light" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} className="rc-btn-primary">
            Guardar Alterações
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ReviewsPage;
