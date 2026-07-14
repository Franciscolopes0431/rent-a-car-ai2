import { useEffect, useState } from 'react';
import { Alert, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap';
import Pagination from '../../components/common/Pagination';
import * as adminService from '../../services/adminService';

const actionLabels = { consultar: 'Consulta', criar: 'Criação', alterar: 'Alteração', alterar_estado: 'Mudança de estado', eliminar: 'Eliminação' };
function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ role: '', action: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => { setLoading(true); try { const response = await adminService.listAudit({ ...filters, page: pagination.page, pageSize: pagination.pageSize }); setLogs(response.data.data); setPagination(response.data.pagination); setError(''); } catch (requestError) { setError(requestError.response?.data?.message || 'Não foi possível carregar a auditoria.'); } finally { setLoading(false); } };
  useEffect(() => { load(); }, [filters, pagination.page, pagination.pageSize]);
  return <Container fluid className="py-4"><div className="rc-page-header"><div><span className="rc-eyebrow">Segurança</span><h1>Auditoria</h1><p>Histórico das alterações realizadas por administradores e gestores.</p></div></div>{error ? <Alert variant="danger">{error}</Alert> : null}<div className="rc-card mb-3"><Row className="g-3"><Col md={4}><Form.Select value={filters.role} onChange={(event) => { setFilters({ ...filters, role: event.target.value }); setPagination((current) => ({ ...current, page: 1 })); }}><option value="">Todas as funções</option><option value="admin">Administradores</option><option value="gestor">Gestores</option></Form.Select></Col><Col md={4}><Form.Select value={filters.action} onChange={(event) => { setFilters({ ...filters, action: event.target.value }); setPagination((current) => ({ ...current, page: 1 })); }}><option value="">Todas as ações</option>{Object.entries(actionLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Form.Select></Col></Row></div><div className="rc-card p-0">{loading ? <div className="text-center py-5"><Spinner variant="warning" /></div> : logs.length === 0 ? <p className="text-secondary text-center py-5 mb-0">Ainda não existem registos de auditoria.</p> : <Table responsive hover variant="dark" className="mb-0"><thead><tr><th>Data</th><th>Utilizador</th><th>Função</th><th>Ação</th><th>Recurso</th><th>Resultado</th></tr></thead><tbody>{logs.map((log) => <tr key={log.id}><td>{new Date(log.createdAt).toLocaleString('pt-PT')}</td><td>{log.actorEmail || 'Conta removida'}</td><td>{log.actorRole}</td><td>{actionLabels[log.action] || log.action}</td><td><code className="text-secondary">{log.path}</code></td><td>{log.statusCode}</td></tr>)}</tbody></Table>}</div><Pagination pagination={pagination} onPageChange={(page) => setPagination((current) => ({ ...current, page }))} onPageSizeChange={(pageSize) => setPagination((current) => ({ ...current, pageSize, page: 1 }))} /></Container>;
}
export default AuditLogPage;
