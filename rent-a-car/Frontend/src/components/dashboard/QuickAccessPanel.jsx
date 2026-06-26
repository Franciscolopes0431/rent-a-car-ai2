import { useState } from 'react';
import { Modal, Placeholder, Row, Col } from 'react-bootstrap';

const DEFAULT_ACCOUNTS = [
  { id: 'manager', label: 'Gestor', description: 'Conta operacional', icon: 'bi-person-circle' },
  { id: 'client', label: 'Cliente', description: 'Conta de cliente', icon: 'bi-person-circle' },
];

function QuickAccessPanel({ accounts = DEFAULT_ACCOUNTS, isLoading }) {
  const [selectedAccount, setSelectedAccount] = useState(null);

  return (
    <section className="rc-card rc-quick-card">
      <div className="rc-card-header">
        <h2>ACESSO RÁPIDO A CONTAS</h2>
        <button type="button" className="rc-inline-link">
          Dar contas <i className="bi bi-chevron-right" aria-hidden="true" />
        </button>
      </div>

      {isLoading ? (
        <Placeholder as="div" animation="glow">
          <Placeholder xs={12} className="mb-2" />
          <Placeholder xs={12} />
        </Placeholder>
      ) : (
        <Row className="g-2">
          {accounts.map((account) => (
            <Col key={account.id} sm={6}>
              <button
                type="button"
                className="rc-account-tile"
                onClick={() => setSelectedAccount(account)}
              >
                <i className={`bi ${account.icon}`} aria-hidden="true" />
                <span>
                  <strong>{account.label}</strong>
                  <small>{account.description}</small>
                </span>
              </button>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        centered
        show={Boolean(selectedAccount)}
        onHide={() => setSelectedAccount(null)}
        contentClassName="rc-support-modal"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Gestão de conta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAccount ? (
            <p className="mb-0">
              Fluxo de criação/atribuição para <strong>{selectedAccount.label}</strong> em construção.
            </p>
          ) : null}
        </Modal.Body>
      </Modal>
    </section>
  );
}

export default QuickAccessPanel;
