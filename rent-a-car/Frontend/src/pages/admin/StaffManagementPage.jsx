import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Modal, Spinner, Table } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import * as adminService from '../../services/adminService';

const emptyForm = { name: '', email: '', role: 'gestor', password: '' };

function StaffManagementPage() {
  const { user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const load = async () => { try { setStaff((await adminService.listStaff()).data); setError(''); } catch (requestError) { setError(requestError.response?.data?.message || 'Não foi possível carregar a equipa.'); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const openCreate = () => { setEditing({}); setForm(emptyForm); };
  const openEdit = (member) => { setEditing(member); setForm({ name: member.name, email: member.email, role: member.role, password: '' }); };
  const save = async (event) => { event.preventDefault(); setSaving(true); try { if (editing.id) { await adminService.updateStaff(editing.id, form); if (form.password) await adminService.updateStaffPassword(editing.id, form.password); } else await adminService.createStaff(form); setEditing(null); await load(); } catch (requestError) { setError(requestError.response?.data?.message || 'Não foi possível guardar o membro da equipa.'); } finally { setSaving(false); } };
  const remove = async (member) => { if (!window.confirm(`Eliminar a conta de ${member.name}?`)) return; try { await adminService.deleteStaff(member.id); await load(); } catch (requestError) { setError(requestError.response?.data?.message || 'Não foi possível eliminar a conta.'); } };
  return <Container fluid className="py-4"><div className="rc-page-header"><div><span className="rc-eyebrow">Administração</span><h1>Equipa e permissões</h1><p>Crie gestores, atribua funções e controle o acesso administrativo.</p></div><Button variant="warning" onClick={openCreate}>+ Adicionar membro</Button></div>{error ? <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert> : null}<div className="rc-card p-0">{loading ? <div className="text-center py-5"><Spinner variant="warning" /></div> : <Table responsive hover variant="dark" className="mb-0"><thead><tr><th>Nome</th><th>Email</th><th>Função</th><th>Última alteração</th><th>Ações</th></tr></thead><tbody>{staff.map((member) => <tr key={member.id}><td>{member.name}{member.id === user?.id ? <small className="text-warning ms-2">A sua conta</small> : null}</td><td>{member.email}</td><td><span className={`badge ${member.role === 'admin' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>{member.role === 'admin' ? 'Administrador' : 'Gestor'}</span></td><td>{new Date(member.updatedAt).toLocaleString('pt-PT')}</td><td><div className="d-flex gap-2"><Button size="sm" variant="outline-light" onClick={() => openEdit(member)}>Editar</Button><Button size="sm" variant="outline-danger" disabled={member.id === user?.id} onClick={() => remove(member)}>Eliminar</Button></div></td></tr>)}</tbody></Table>}</div>
  <Modal show={!!editing} onHide={() => setEditing(null)} centered><Modal.Header closeButton><Modal.Title>{editing?.id ? 'Editar membro' : 'Novo membro'}</Modal.Title></Modal.Header><Form onSubmit={save}><Modal.Body><Form.Group className="mb-3"><Form.Label>Nome</Form.Label><Form.Control required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Form.Group><Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></Form.Group><Form.Group className="mb-3"><Form.Label>Função</Form.Label><Form.Select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="gestor">Gestor — operação diária</option><option value="admin">Administrador — acesso total</option></Form.Select></Form.Group><Form.Group><Form.Label>{editing?.id ? 'Nova palavra-passe (opcional)' : 'Palavra-passe inicial'}</Form.Label><Form.Control required={!editing?.id} type="password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><Form.Text>Mínimo de 8 caracteres.</Form.Text></Form.Group></Modal.Body><Modal.Footer><Button variant="secondary" onClick={() => setEditing(null)}>Cancelar</Button><Button variant="warning" type="submit" disabled={saving}>{saving ? 'A guardar...' : 'Guardar'}</Button></Modal.Footer></Form></Modal></Container>;
}
export default StaffManagementPage;
