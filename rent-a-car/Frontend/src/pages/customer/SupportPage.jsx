import { Container, Row, Col, Card, Form, Button, Accordion } from 'react-bootstrap';
import { useState } from 'react';

function SupportPage() {
  const [formData, setFormData] = useState({
    subject: '',
    bookingId: '',
    message: ''
  });

  const [messageSent, setMessageSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessageSent(true);
    setFormData({ subject: '', bookingId: '', message: '' });
    setTimeout(() => setMessageSent(false), 5000);
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-2 text-white">Apoio ao Cliente</h1>
          <p className="text-secondary">Como podemos ajudar? Consulte as FAQs ou envie-nos uma mensagem.</p>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={7}>
          <div className="rc-card mb-4">
            <h4 className="h5 text-white border-bottom border-secondary pb-3 mb-4">Enviar Mensagem</h4>
            
            {messageSent && (
              <div className="alert alert-success">
                A sua mensagem foi enviada com sucesso! Iremos responder o mais breve possível.
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Assunto</Form.Label>
                    <Form.Select 
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="bg-dark text-white border-secondary"
                    >
                      <option value="">Selecione um assunto...</option>
                      <option value="Dúvida sobre reserva">Dúvida sobre reserva</option>
                      <option value="Alteração/Cancelamento">Alteração ou Cancelamento</option>
                      <option value="Faturação">Faturação ou Pagamento</option>
                      <option value="Incidente">Incidente/Avaria</option>
                      <option value="Outro">Outro assunto</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Reserva Associada (Opcional)</Form.Label>
                    <Form.Select 
                      value={formData.bookingId}
                      onChange={(e) => setFormData({...formData, bookingId: e.target.value})}
                      className="bg-dark text-white border-secondary"
                    >
                      <option value="">Nenhuma</option>
                      <option value="1234">Reserva #1234 (BMW Serie 1)</option>
                      <option value="1235">Reserva #1235 (Renault Clio)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-secondary">Mensagem</Form.Label>
                    <Form.Control 
                      as="textarea"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Descreva a sua questão detalhadamente..."
                      className="bg-dark text-white border-secondary"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end">
                <Button type="submit" variant="primary" className="rc-btn-primary px-4">
                  Enviar Mensagem <i className="bi bi-send ms-2"></i>
                </Button>
              </div>
            </Form>
          </div>
        </Col>

        <Col lg={5}>
          <div className="rc-card">
            <h4 className="h5 text-white border-bottom border-secondary pb-3 mb-4">Perguntas Frequentes</h4>
            <Accordion defaultActiveKey="0" className="rc-accordion" data-bs-theme="dark">
              <Accordion.Item eventKey="0" className="border-secondary bg-transparent">
                <Accordion.Header>Posso cancelar a minha reserva?</Accordion.Header>
                <Accordion.Body className="text-secondary">
                  Sim, pode cancelar a sua reserva a qualquer momento. No entanto, aplicam-se taxas de cancelamento se este for efetuado com menos de 48h de antecedência face à data de levantamento.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1" className="border-secondary bg-transparent">
                <Accordion.Header>O que está incluído no preço?</Accordion.Header>
                <Accordion.Body className="text-secondary">
                  O preço base inclui quilometragem ilimitada, assistência em viagem 24/7 e o seguro obrigatório de responsabilidade civil. O seguro de danos próprios (cobertura total) é um extra opcional.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2" className="border-secondary bg-transparent">
                <Accordion.Header>Que documentos preciso de apresentar?</Accordion.Header>
                <Accordion.Body className="text-secondary">
                  No momento do levantamento, deve apresentar: Cartão de Cidadão ou Passaporte válido, Carta de Condução válida há pelo menos 1 ano e um Cartão de Crédito em nome do condutor principal para o depósito.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3" className="border-secondary bg-transparent">
                <Accordion.Header>Qual é a política de combustível?</Accordion.Header>
                <Accordion.Body className="text-secondary">
                  A nossa política é "Cheio-Cheio". O veículo ser-lhe-á entregue com o depósito cheio e deve ser devolvido também atestado. Caso contrário, será cobrada uma taxa de reabastecimento mais o custo do combustível em falta.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <div className="mt-5 p-4 bg-dark rounded border border-secondary text-center">
              <h5 className="text-white mb-3">Ainda precisa de ajuda?</h5>
              <p className="text-secondary mb-3">Ligue para a nossa linha de apoio, disponível todos os dias das 9h às 20h.</p>
              <h4 className="text-warning mb-0"><i className="bi bi-telephone me-2"></i>+351 210 000 000</h4>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default SupportPage;
