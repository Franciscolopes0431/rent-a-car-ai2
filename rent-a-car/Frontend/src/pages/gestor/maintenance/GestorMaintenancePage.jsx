import { useMemo, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import EmptyState from '../../../components/common/EmptyState';
import GestorMaintenanceFormModal from './GestorMaintenanceFormModal';
import { useMaintenance } from '../../../hooks/useMaintenance';

function GestorMaintenancePage() {
  const { alerts, pagination, filters, setFilters, setPagination, isLoading, error, refetch, typeOptions } = useMaintenance();
  const [showForm, setShowForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);

  const actions = [
    {
      key: 'new',
      label: '+ Novo Alerta',
      icon: 'bi-plus',
      onClick: () => {
        setEditingAlert(null);
        setShowForm(true);
      },
    },
  ];

  const columns = useMemo(
    () => [
      {
        key: 'vehicle',
        label: 'VEÍCULO',
        render: (alert) => `${alert.vehicle?.brand || '---'} ${alert.vehicle?.model || ''}`,
      },
      { key: 'type', label: 'TIPO' },
      {
        key: 'description',
        label: 'DESCRIÇÃO',
        render: (alert) => alert.description,
      },
      {
        key: 'resolved',
        label: 'ESTADO',
        render: (alert) => (
          <span className={`badge ${alert.resolved ? 'badge-success' : 'badge-warning'}`}>{alert.resolved ? 'Resolvido' : 'Pendente'}</span>
        ),
      },
      {
        key: 'createdAt',
        label: 'CRIADO EM',
        render: (alert) => new Date(alert.createdAt).toLocaleDateString('pt-PT'),
      },
      {
        key: 'actions',
        label: 'AÇÕES',
        render: (alert) => (
          <div className="d-flex gap-2">
            <Button variant="link" className="text-secondary p-0" onClick={(e) => { e.stopPropagation(); setEditingAlert(alert); setShowForm(true); }}><i className="bi bi-pencil" /></Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <PageHeader title="MANUTENÇÃO" subtitle="Registe paragens e mantenha a frota operacional" actions={actions} />

      <div className="rc-card p-4 mb-4">
        <Row className="gy-3 align-items-end">
          <Col lg={4}>
            <Form.Select value={filters.type} onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}>
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Form.Select>
          </Col>
          <Col lg={4}>
            <Form.Select value={filters.resolved} onChange={(event) => setFilters((current) => ({ ...current, resolved: event.target.value }))}>
              <option value="">Todos</option>
              <option value="true">Resolvidos</option>
              <option value="false">Abertos</option>
            </Form.Select>
          </Col>
          <Col lg={4} className="text-end">
            <Button variant="outline-secondary" onClick={() => refetch()}>Atualizar</Button>
          </Col>
        </Row>
      </div>

      <div className="rc-card p-0">
        <DataTable
          columns={columns}
          data={alerts}
          loading={isLoading}
          emptyMessage={error ? error : 'Nenhum alerta encontrado'}
        />
      </div>

      <Pagination
        pagination={pagination}
        onPageChange={(page) => setPagination((current) => ({ ...current, page }))}
        onPageSizeChange={(pageSize) => setPagination((current) => ({ ...current, pageSize, page: 1 }))}
      />

      {!isLoading && alerts.length === 0 && (
        <EmptyState
          title="Sem alertas de manutenção"
          description="Registe o primeiro alerta de manutenção ou indisponibilidade para acompanhar a frota."
          action={{ label: 'Novo alerta', onClick: () => setShowForm(true) }}
        />
      )}

      <GestorMaintenanceFormModal
        show={showForm}
        alert={editingAlert}
        onHide={() => { setShowForm(false); setEditingAlert(null); }}
        onSaved={() => { setShowForm(false); setEditingAlert(null); refetch(); }}
      />

    </div>
  );
}

export default GestorMaintenancePage;
