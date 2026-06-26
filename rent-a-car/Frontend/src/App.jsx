import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { RegisterProvider } from './context/RegisterContext';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FleetPage from './pages/fleet/FleetPage';
import BookingsPage from './pages/bookings/BookingsPage';
import CustomersPage from './pages/customers/CustomersPage';
import MaintenancePage from './pages/maintenance/MaintenancePage';
import ReportsPage from './pages/reports/ReportsPage';

function SectionPlaceholder({ title }) {
  return (
    <div className="rc-card">
      <h2 className="h4 mb-2">{title}</h2>
      <p className="text-secondary mb-0">Página em desenvolvimento.</p>
    </div>
  );
}

function BookingDetailsPlaceholder() {
  return <SectionPlaceholder title="Detalhe da Reserva" />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/registo"
        element={(
          <RegisterProvider>
            <RegisterPage />
          </RegisterProvider>
        )}
      />

      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/frota" element={<FleetPage />} />
          <Route path="/admin/reservas" element={<BookingsPage />} />
          <Route path="/admin/reservas/:id" element={<BookingDetailsPlaceholder />} />
          <Route path="/admin/manutencao" element={<MaintenancePage />} />
          <Route path="/admin/clientes" element={<CustomersPage />} />
          <Route path="/admin/relatorios" element={<ReportsPage />} />
        </Route>
      </Route>

      <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
