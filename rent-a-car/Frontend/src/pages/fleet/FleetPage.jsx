import { useMemo, useState } from 'react';
import { Button, Col, Form, Row, Badge } from 'react-bootstrap';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import VehicleFormModal from './VehicleFormModal';
import VehicleDetailDrawer from './VehicleDetailDrawer';
import { useFleet } from '../../hooks/useFleet';
import * as vehicleService from '../../services/vehicleService';

const categoryOptions = [
  { label: 'Todas as categorias', value: '' },
  { label: 'Compacto', value: 'Compacto' },
  { label: 'Berlina', value: 'Berlina' },
  { label: 'SUV', value: 'SUV' },
  { label: 'Citadino', value: 'Citadino' },
  { label: 'Desportivo', value: 'Desportivo' },
];

function FleetPage() {
  const { vehicles, pagination, filters, setFilters, setPagination, isLoading, error, refetch, statusOptions } = useFleet();
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const totalCount = pagination.total || vehicles.length;

  const actions = [
    {
      key: 'new',
      label: '+ Nova Viatura',
      icon: 'bi-plus',
      onClick: () => {
        setEditingVehicle(null);
        setShowForm(true);
      },
    },
  ];

  const handleSearch = (value) => setFilters((current) => ({ ...current, search: value }));
  const handleStatus = (status) => setFilters((current) => ({ ...current, status }));
  const handleCategory = (event) => setFilters((current) => ({ ...current, category: event.target.value }));

  const columns = useMemo(
    () => [
      {
        key: 'vehicle',
        label: 'VIATURA',
        render: (vehicle) => (
          <div className="d-flex align-items-center gap-3">
            <div className="rc-vehicle-avatar d-flex align-items-center justify-content-center">
              <i className="bi bi-car-front fs-4" aria-hidden="true" />
            </div>
            <div>
              <div className="fw-semibold text-white">{`${vehicle.brand} ${vehicle.model}`}</div>
              <div className="text-secondary small">{vehicle.category}</div>
            </div>
          </div>
        ),
      },
      { key: 'plate', label: 'MATRÍCULA', render: (vehicle) => <code className="text-secondary">{vehicle.plate}</code> },
      { key: 'category', label: 'CATEGORIA' },
      {
        key: 'pricePerDay',
        label: 'PREÇO/DIA',
        render: (vehicle) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(vehicle.pricePerDay),
      },
      { key: 'status', label: 'ESTADO', render: (vehicle) => <StatusBadge status={vehicle.status} /> },
      {
        key: 'actions',
        label: 'AÇÕES',
        render: (vehicle) => (
          <div className="d-flex align-items-center gap-2">
            <Button variant="link" className="text-secondary p-0" onClick={(e) => { e.stopPropagation(); setSelectedVehicle(vehicle); }}><i className="bi bi-eye" /></Button>
            <Button variant="link" className="text-secondary p-0" onClick={(e) => { e.stopPropagation(); setEditingVehicle(vehicle); setShowForm(true); }}><i className="bi bi-pencil" /></Button>
            <Button variant="link" className="text-danger p-0" onClick={(e) => { e.stopPropagation(); setDeleteTarget(vehicle); setShowDeleteConfirm(true); }}><i className="bi bi-trash" /></Button>
          </div>
        ),
      },
    ],
    []
  );

  const handleDeleteConfirmed = async () => {
    if (deleteTarget) {
      await vehicleService.remove(deleteTarget.id);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      refetch();
    }
  };

  return (
    <div>
      <PageHeader
        title="FROTA"
        subtitle={`Gestão de viaturas · ${totalCount} veículos`}
        actions={actions}
      />
      <div className="rc-card p-4 mb-4">
        <Row className="gy-3 align-items-end">
          <Col lg={5}>
            <SearchBar value={filters.search} onChange={handleSearch} placeholder="Procurar por marca, modelo ou matrícula..." />
          </Col>
          <Col lg={4}>
            <Form.Select value={filters.category} onChange={handleCategory} aria-label="Categoria">
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Form.Select>
          </Col>
          <Col lg={3} className="text-end">
            <Badge bg="secondary">Última atualização há poucos segundos</Badge>
          </Col>
        </Row>
        <FilterChips options={statusOptions} active={filters.status} onChange={handleStatus} />
      </div>
      <div className="rc-card p-0">
        <DataTable
          columns={columns}
          data={vehicles}
          loading={isLoading}
          emptyMessage={error ? error : 'Nenhuma viatura encontrada'}
          onRowClick={(vehicle) => setSelectedVehicle(vehicle)}
        />
      </div>
      <Pagination
        pagination={pagination}
        onPageChange={(page) => setPagination((current) => ({ ...current, page }))}
        onPageSizeChange={(pageSize) => setPagination((current) => ({ ...current, pageSize, page: 1 }))}
      />
      {!isLoading && vehicles.length === 0 && (
        <EmptyState
          title="Sem viaturas cadastradas"
          description="Adicione a sua primeira viatura para começar a gerir a frota em tempo real."
          action={{ label: 'Adicionar viatura', onClick: () => setShowForm(true) }}
        />
      )}

      <VehicleFormModal
        show={showForm}
        vehicle={editingVehicle}
        onHide={() => { setShowForm(false); setEditingVehicle(null); }}
        onSaved={() => { setShowForm(false); setEditingVehicle(null); refetch(); }}
      />

      <VehicleDetailDrawer
        vehicle={selectedVehicle}
        onHide={() => setSelectedVehicle(null)}
        onUpdated={() => refetch()}
      />

      <ConfirmDialog
        show={showDeleteConfirm}
        title="Eliminar viatura"
        message={`Tem a certeza que deseja eliminar ${deleteTarget?.brand} ${deleteTarget?.model}?`}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}

export default FleetPage;
