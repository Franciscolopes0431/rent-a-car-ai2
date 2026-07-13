import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useFleet } from '../../hooks/useFleet';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import LandingNavbar from '../../components/landing/LandingNavbar';
import LandingFooter from '../../components/landing/LandingFooter';

function VehicleCatalogPage() {
  const { pathname } = useLocation();
  const fleetBase = pathname.startsWith('/cliente') ? '/cliente/frota' : '/frota';
  const isStandalonePublic = pathname === '/frota';
  
  const { vehicles, pagination, filters, setFilters, setPagination, isLoading, error, categoryOptions } = useFleet();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const content = (
    <Container className={isStandalonePublic ? "py-5" : ""}>
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-2 text-white">A Nossa Frota</h1>
          <p className="text-secondary">Encontre o veículo perfeito para a sua próxima viagem.</p>
        </Col>
      </Row>
      <Row>
        <Col lg={3} className="mb-4">
          <div className="rc-card rc-filters-card">
            <h4 className="h5 mb-4 text-white">Filtros</h4>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-secondary">Pesquisa</Form.Label>
              <Form.Control
                type="text"
                placeholder="Marca ou modelo..."
                name="search"
                value={filters.search || ''}
                onChange={handleFilterChange}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-secondary">Categoria</Form.Label>
              <Form.Select
                name="category"
                value={filters.category || ''}
                onChange={handleFilterChange}
                className="bg-dark text-white border-secondary"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* A real app would have date pickers here, but standard useFleet just supports search/category/status */}
            <Button 
              variant="outline-secondary" 
              className="w-100 mt-2"
              onClick={() => setFilters({ status: '', category: '', search: '' })}
            >
              Limpar Filtros
            </Button>
          </div>
        </Col>
        <Col lg={9}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner animation="border" variant="warning" />
            </div>
          ) : vehicles.length === 0 ? (
             <EmptyState 
                title="Nenhum veículo encontrado" 
                description="Não encontrámos veículos com os filtros selecionados. Tente alterar os critérios de pesquisa." 
             />
          ) : (
            <>
              <Row className="g-4">
                {vehicles.map((vehicle) => (
                  <Col md={6} xl={4} key={vehicle.id}>
                    <Card className="rc-card rc-vehicle-card p-0 overflow-hidden h-100 border-0">
                      {vehicle.imageUrl ? (
                        <Card.Img variant="top" src={vehicle.imageUrl} alt={`${vehicle.brand} ${vehicle.model}`} className="rc-vehicle-card-img" />
                      ) : (
                        <div className="rc-vehicle-card-img bg-secondary d-flex align-items-center justify-content-center text-dark fs-1">
                          <i className="bi bi-car-front-fill"></i>
                        </div>
                      )}
                      <Card.Body className="rc-vehicle-card-body p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Card.Title className="text-white mb-0 fs-5">{vehicle.brand} {vehicle.model}</Card.Title>
                        </div>
                        <div className="mb-3">
                          <span className="badge bg-secondary me-2">{vehicle.category}</span>
                          <span className="badge bg-dark border border-secondary text-secondary">{vehicle.year}</span>
                        </div>
                        <div className="text-secondary small mb-4 d-flex flex-wrap gap-2">
                          <span title="Lugares"><i className="bi bi-people me-1"></i>{vehicle.seats ? `${vehicle.seats} lugares` : 'Lugares não indicados'}</span>
                          <span title="Transmissão"><i className="bi bi-gear me-1"></i>{vehicle.transmission || 'Não indicada'}</span>
                          <span title="Combustível"><i className="bi bi-fuel-pump me-1"></i>{vehicle.fuel || 'Não indicado'}</span>
                        </div>
                        <div className="mt-auto d-flex justify-content-between align-items-center border-top border-secondary pt-3">
                          <div className="rc-vehicle-price">
                            €{Number(vehicle.pricePerDay).toFixed(2)}<span>/dia</span>
                          </div>
                          <Button as={Link} to={`${fleetBase}/${vehicle.id}`} variant="primary" className="rc-btn-primary px-3 py-2">
                            Ver Detalhes
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <div className="mt-4">
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  onPageSizeChange={(size) => setPagination({ ...pagination, pageSize: size, page: 1 })}
                />
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );

  return isStandalonePublic ? (
    <div className="rc-public-page">
      <LandingNavbar />
      {content}
      <LandingFooter />
    </div>
  ) : (
    content
  );
}

export default VehicleCatalogPage;
