import { Container } from 'react-bootstrap';

const CONTENT = {
  terms: {
    title: 'Termos e Condições',
    paragraphs: [
      'A reserva está sujeita à disponibilidade da viatura e à validação dos dados do condutor.',
      'O condutor deve apresentar uma carta de condução válida e cumprir os requisitos indicados para a viatura.',
      'Cancelamentos e alterações estão sujeitos às condições apresentadas no momento da reserva.',
    ],
  },
  privacy: {
    title: 'Política de Privacidade',
    paragraphs: [
      'Os dados pessoais são utilizados para gerir a conta, as reservas e o apoio ao cliente.',
      'A RentCar não vende dados pessoais e aplica medidas adequadas para proteger a informação armazenada.',
      'Pode solicitar a consulta, correção ou eliminação dos seus dados através da página de contactos.',
    ],
  },
  faq: {
    title: 'Perguntas Frequentes',
    paragraphs: [
      'Como reservar? Escolha uma viatura, indique as datas e confirme a reserva na sua conta.',
      'Posso cancelar? Sim, através da área “As Minhas Reservas”, de acordo com as condições aplicáveis.',
      'O pagamento é real? Não. Nesta versão de demonstração, o pagamento é apenas simulado.',
    ],
  },
  cookies: {
    title: 'Política de Cookies',
    paragraphs: [
      'Esta versão utiliza apenas o armazenamento necessário para manter a sessão do utilizador.',
      'Não são utilizados cookies de publicidade ou de acompanhamento de terceiros.',
    ],
  },
};

function LegalPage({ type }) {
  const content = CONTENT[type] || CONTENT.terms;

  return (
    <Container className="py-5">
      <div className="rc-card">
        <h1 className="h3 text-white mb-4">{content.title}</h1>
        {content.paragraphs.map((paragraph) => <p key={paragraph} className="text-secondary">{paragraph}</p>)}
      </div>
    </Container>
  );
}

export default LegalPage;
