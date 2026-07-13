import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LandingNavbar from '../../components/landing/LandingNavbar';
import LandingFooter from '../../components/landing/LandingFooter';
import '../../styles/public-pages.css';

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      // Simulate sending data
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setValidated(false);
      }, 3000);
    }
    setValidated(true);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="rc-public-page">
      <LandingNavbar />
      {/* Hero Section */}
      <section className="rc-hero-section contact-hero">
        <div className="rc-hero-overlay"></div>
        <Container className="rc-hero-content text-center text-white">
          <h1 className="display-3 fw-bold mb-3 animate-fade-in-up">Fale Connosco</h1>
          <p className="lead mb-4 animate-fade-in-up delay-1">
            Estamos aqui para ajudar. Entre em contacto connosco para qualquer dúvida ou questão.
          </p>
        </Container>
      </section>

      <Container className="py-5">
        <Row className="gy-5 mb-5">
          {/* Formulário de Contacto */}
          <Col lg={7}>
            <div className="rc-contact-card p-4 p-md-5 bg-white rounded shadow-sm h-100 border">
              <h3 className="fw-bold mb-4">Envie-nos uma Mensagem</h3>
              {submitted ? (
                <div className="alert alert-success">
                  <i className="bi bi-check-circle-fill me-2"></i>A sua mensagem foi enviada com sucesso! Iremos responder em breve.
                </div>
              ) : (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="contactName">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="O seu nome" />
                        <Form.Control.Feedback type="invalid">Por favor, insira o seu nome.</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="contactEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="O seu email" />
                        <Form.Control.Feedback type="invalid">Por favor, insira um email válido.</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="contactPhone">
                        <Form.Label>Telefone</Form.Label>
                        <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="O seu número" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="contactSubject">
                        <Form.Label>Assunto</Form.Label>
                        <Form.Control required type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Assunto da mensagem" />
                        <Form.Control.Feedback type="invalid">Por favor, insira o assunto.</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-4" controlId="contactMessage">
                    <Form.Label>Mensagem</Form.Label>
                    <Form.Control required as="textarea" rows={5} name="message" value={formData.message} onChange={handleChange} placeholder="Como podemos ajudar?" />
                    <Form.Control.Feedback type="invalid">Por favor, escreva a sua mensagem.</Form.Control.Feedback>
                  </Form.Group>
                  <Button type="submit" className="w-100 py-2 rc-btn-primary fw-bold">
                    Enviar Mensagem
                  </Button>
                </Form>
              )}
            </div>
          </Col>

          {/* Informações de Contacto */}
          <Col lg={5}>
            <div className="d-flex flex-column h-100">
              <Card className="border-0 shadow-sm mb-4 flex-grow-1 rc-info-card text-white">
                <Card.Body className="p-4 p-md-5">
                  <h4 className="fw-bold mb-4 text-white">Informações de Contacto</h4>
                  <ul className="list-unstyled mb-4 rc-contact-list">
                    <li className="d-flex mb-3 align-items-center">
                      <div className="rc-icon-box bg-primary text-white rounded-circle p-2 me-3">
                        <i className="bi bi-geo-alt-fill"></i>
                      </div>
                      <div>
                        <strong className="text-white">Morada:</strong><br/>
                        <span className="text-light">Rua da Liberdade, 123, 1000-123 Lisboa</span>
                      </div>
                    </li>
                    <li className="d-flex mb-3 align-items-center">
                      <div className="rc-icon-box bg-primary text-white rounded-circle p-2 me-3">
                        <i className="bi bi-telephone-fill"></i>
                      </div>
                      <div>
                        <strong className="text-white">Telefone:</strong><br/>
                        <span className="text-light">+351 210 000 000</span>
                      </div>
                    </li>
                    <li className="d-flex mb-3 align-items-center">
                      <div className="rc-icon-box bg-primary text-white rounded-circle p-2 me-3">
                        <i className="bi bi-envelope-fill"></i>
                      </div>
                      <div>
                        <strong className="text-white">Email:</strong><br/>
                        <span className="text-light">geral@rentcar.pt</span>
                      </div>
                    </li>
                    <li className="d-flex align-items-center">
                      <div className="rc-icon-box bg-primary text-white rounded-circle p-2 me-3">
                        <i className="bi bi-clock-fill"></i>
                      </div>
                      <div>
                        <strong className="text-white">Horário:</strong><br/>
                        <span className="text-light">Seg a Sex: 09:00 - 19:00<br/>Sáb e Dom: 10:00 - 15:00</span>
                      </div>
                    </li>
                  </ul>
                  
                  <hr className="my-4 border-secondary"/>
                  
                  <h5 className="fw-bold mb-3 text-white">Siga-nos nas Redes Sociais</h5>
                  <div className="d-flex gap-3">
                    <a href="#" className="rc-social-link bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width:'40px', height:'40px'}}><i className="bi bi-facebook"></i></a>
                    <a href="#" className="rc-social-link bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width:'40px', height:'40px'}}><i className="bi bi-instagram"></i></a>
                    <a href="#" className="rc-social-link bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width:'40px', height:'40px'}}><i className="bi bi-twitter-x"></i></a>
                    <a href="#" className="rc-social-link bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width:'40px', height:'40px'}}><i className="bi bi-linkedin"></i></a>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Mapa */}
        <div className="mb-5 rounded overflow-hidden shadow-sm border" style={{ height: '350px', backgroundColor: '#e9ecef', position: 'relative' }}>
          <iframe 
            src="https://maps.google.com/maps?q=Avenida%20da%20Liberdade,%20123,%20Lisboa&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de Localização"
          ></iframe>
        </div>

        {/* FAQ Section */}
        <div className="mb-5 rc-faq-section py-4 px-md-5">
          <h2 className="text-center fw-bold mb-4">Perguntas Frequentes (FAQ)</h2>
          <Accordion defaultActiveKey="0" className="shadow-sm">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Como posso efetuar uma reserva?</Accordion.Header>
              <Accordion.Body>
                Pode efetuar a reserva através da nossa página de "Frota", selecionando o veículo desejado e seguindo os passos de checkout. Todo o processo é online e seguro.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Que documentos preciso para levantar o carro?</Accordion.Header>
              <Accordion.Body>
                Precisará de um cartão de cidadão/passaporte válido, uma carta de condução com mais de 1 ano e um cartão de crédito em nome do condutor principal para a caução.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Posso cancelar a minha reserva?</Accordion.Header>
              <Accordion.Body>
                Sim, as reservas podem ser canceladas gratuitamente até 48 horas antes do levantamento do veículo através da sua área de cliente.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Como contacto a assistência em viagem?</Accordion.Header>
              <Accordion.Body>
                Em caso de avaria ou acidente, ligue imediatamente para o número de assistência 24/7 fornecido no seu contrato de aluguer ou diretamente para o nosso número geral.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>

        {/* CTA */}
        <div className="rc-cta-section text-center py-5 rounded bg-primary text-white shadow">
          <h2 className="fw-bold mb-3">Já sabe qual o carro que precisa?</h2>
          <p className="lead mb-4">Veja a nossa frota disponível e faça a sua reserva hoje mesmo.</p>
          <Button as={Link} to="/frota" variant="light" size="lg" className="fw-bold rc-btn-cta px-5 py-3 rounded-pill">
            Ver Frota Disponível
          </Button>
        </div>
      </Container>
      <LandingFooter />
    </div>
  );
}

export default ContactPage;
