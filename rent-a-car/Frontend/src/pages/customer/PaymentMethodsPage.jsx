import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import EmptyState from '../../components/common/EmptyState';

function PaymentMethodsPage() {
  const methods = [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '5555', expiry: '08/24', isDefault: false }
  ];

  return (
    <Container>
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 mb-2 text-white">Métodos de Pagamento</h1>
            <p className="text-secondary">Faça a gestão dos seus cartões para um checkout mais rápido.</p>
          </div>
          <Button variant="primary" className="rc-btn-primary">
            <i className="bi bi-plus-lg me-2"></i>Adicionar Cartão
          </Button>
        </Col>
      </Row>

      <Row className="g-4">
        {methods.length === 0 ? (
          <Col>
            <EmptyState 
              title="Sem métodos de pagamento"
              description="Não tem nenhum cartão guardado. Adicione um para facilitar as suas futuras reservas."
              action={{ label: 'Adicionar Cartão', onClick: () => alert('Adicionar') }}
            />
          </Col>
        ) : (
          methods.map(method => (
            <Col md={6} lg={4} key={method.id}>
              <Card className="rc-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="d-flex align-items-center">
                      <i className={`bi bi-credit-card fs-3 me-3 text-${method.type === 'Visa' ? 'info' : 'warning'}`}></i>
                      <div>
                        <h5 className="text-white mb-0">{method.type} terminado em {method.last4}</h5>
                        <small className="text-secondary">Expira a {method.expiry}</small>
                      </div>
                    </div>
                    {method.isDefault && <span className="badge bg-success">Predefinido</span>}
                  </div>
                  <div className="d-flex justify-content-end gap-2 border-top border-secondary pt-3 mt-auto">
                    {!method.isDefault && (
                      <Button variant="outline-secondary" size="sm">
                        Tornar Predefinido
                      </Button>
                    )}
                    <Button variant="outline-danger" size="sm">
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default PaymentMethodsPage;
