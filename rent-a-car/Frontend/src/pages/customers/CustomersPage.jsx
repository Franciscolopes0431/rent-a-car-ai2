import { useMemo, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import CustomerFormModal from './CustomerFormModal';
import { useCustomers } from '../../hooks/useCustomers';
import * as customerService from '../../services/customerService';

function CustomersPage() {
  const { customers, pagination, search, setSearch, setPagination, isLoading, error, refetch } = useCustomers();
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const actions = [
    {
      key: 'new',
      label: '+ Novo Cliente',
      icon: 'bi-plus',
      onClick: () => {
        setEditingCustomer(null);
        setShowForm(true);
      },
    },
  ];

  const columns = useMemo(
    () => [
      { key: 'name', label: 'NOME', render: (customer) => `${customer.firstName} ${customer.lastName}` },
      { key: 'email', label: 'EMAIL' },
      { key: 'phone', label: 'TELEFONE' },
      { key: 'createdAt', label: 'REGISTADO EM', render: (customer) => new Date(customer.createdAt).toLocaleDateString('pt-PT') },
      {
        key: 'actions',
        label: 'AÇÕES',
        render: (customer) => (
          <div className="d-flex gap-2">
            <Button variant="link" className="text-secondary p-0" onClick={(e) => { e.stopPropagation(); setEditingCustomer(customer); setShowForm(true); }}><i className="bi bi-pencil" /></Button>
            <Button variant="link" className="text-danger p-0" onClick={(e) => { e.stopPropagation(); setDeleteTarget(customer); setShowDeleteConfirm(true); }}><i className="bi bi-trash" /></Button>
          </div>
        ),
      },
    ],
    []
  );

  const handleDeleteConfirmed = async () => {
    if (deleteTarget) {
      await customerService.remove(deleteTarget.id);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      refetch();
    }
  };

  return (
    <div>
      <PageHeader title="CLIENTES" subtitle="Gestão de clientes e reservas" actions={actions} />

      <div className="rc-card p-4 mb-4">
        <Row className="gy-3 align-items-end">
          <Col lg={6}>
            <SearchBar value={search} onChange={setSearch} placeholder="Procurar cliente por nome, email ou telefone..." />
          </Col>
          <Col lg={6} className="text-end">
            <Button variant="outline-secondary" onClick={() => refetch()}>Atualizar</Button>
          </Col>
        </Row>
      </div>

      <div className="rc-card p-0">
        <DataTable
          columns={columns}
          data={customers}
          loading={isLoading}
          emptyMessage={error ? error : 'Nenhum cliente encontrado'}
        />
      </div>

      <Pagination
        pagination={pagination}
        onPageChange={(page) => setPagination((current) => ({ ...current, page }))}
        onPageSizeChange={(pageSize) => setPagination((current) => ({ ...current, pageSize, page: 1 }))}
      />

      {!isLoading && customers.length === 0 && (
        <EmptyState
          title="Sem clientes registados"
          description="Adicione o primeiro cliente para começar a gerir reservas reais."
          action={{ label: 'Novo cliente', onClick: () => setShowForm(true) }}
        />
      )}

      <CustomerFormModal
        show={showForm}
        customer={editingCustomer}
        onHide={() => { setShowForm(false); setEditingCustomer(null); }}
        onSaved={() => { setShowForm(false); setEditingCustomer(null); refetch(); }}
      />

      <ConfirmDialog
        show={showDeleteConfirm}
        title="Eliminar cliente"
        message={`Tem a certeza que deseja eliminar ${deleteTarget?.firstName} ${deleteTarget?.lastName}?`}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}

export default CustomersPage;
