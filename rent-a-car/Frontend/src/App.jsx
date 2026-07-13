import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import PublicRoute from './components/layout/PublicRoute';
import { RegisterProvider } from './context/RegisterContext';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FleetPage from './pages/fleet/FleetPage';
import BookingsPage from './pages/bookings/BookingsPage';
import CustomersPage from './pages/customers/CustomersPage';
import MaintenancePage from './pages/maintenance/MaintenancePage';
import ReportsPage from './pages/reports/ReportsPage';
// Gestor imports
import GestorLayout from './components/layout/gestor/GestorLayout';
import GestorDashboardPage from './pages/gestor/GestorDashboardPage';
import GestorFleetPage from './pages/gestor/fleet/GestorFleetPage';
import GestorBookingsPage from './pages/gestor/bookings/GestorBookingsPage';
import GestorCustomersPage from './pages/gestor/customers/GestorCustomersPage';
import GestorMaintenancePage from './pages/gestor/maintenance/GestorMaintenancePage';
import GestorReportsPage from './pages/gestor/reports/GestorReportsPage';
import ClientLayout from './components/layout/customer/ClientLayout';
import LandingPage from './pages/LandingPage';
import VehicleCatalogPage from './pages/public/VehicleCatalogPage';
import VehicleDetailsPage from './pages/public/VehicleDetailsPage';
import AboutUsPage from './pages/public/AboutUsPage';
import ContactPage from './pages/public/ContactPage';
import AccountPage from './pages/customer/AccountPage';
import PaymentMethodsPage from './pages/customer/PaymentMethodsPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import MyBookingsPage from './pages/customer/MyBookingsPage';
import HistoryPage from './pages/customer/HistoryPage';
import ReviewsPage from './pages/customer/ReviewsPage';
import SupportPage from './pages/customer/SupportPage';
import ClientDashboardPage from './pages/customer/ClientDashboardPage';
import NewReservationPage from './pages/customer/NewReservationPage';
import ReservationDetailsPage from './pages/reservations/ReservationDetailsPage';
import LegalPage from './pages/public/LegalPage';
import SupportManagementPage from './pages/support/SupportManagementPage';
import ReviewManagementPage from './pages/reviews/ReviewManagementPage';
import NotificationsPage from './pages/customer/NotificationsPage';
import StaffManagementPage from './pages/admin/StaffManagementPage';
import SettingsPage from './pages/admin/SettingsPage';
import AuditLogPage from './pages/admin/AuditLogPage';

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/frota" element={<VehicleCatalogPage />} />
        <Route path="/frota/:id" element={<VehicleDetailsPage />} />
        <Route path="/sobre" element={<AboutUsPage />} />
        <Route path="/contactos" element={<ContactPage />} />
        <Route path="/termos" element={<LegalPage type="terms" />} />
        <Route path="/privacidade" element={<LegalPage type="privacy" />} />
        <Route path="/faq" element={<LegalPage type="faq" />} />
        <Route path="/cookies" element={<LegalPage type="cookies" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/registo"
          element={(
            <RegisterProvider>
              <RegisterPage />
            </RegisterProvider>
          )}
        />
      </Route>

      <Route element={<ProtectedRoute role="cliente" />}>
        <Route element={<ClientLayout />}>
          <Route path="/cliente" element={<ClientDashboardPage />} />
          <Route path="/cliente/frota" element={<VehicleCatalogPage />} />
          <Route path="/cliente/frota/:id" element={<VehicleDetailsPage />} />
          <Route path="/cliente/minha-conta" element={<AccountPage />} />
          <Route path="/cliente/metodos-pagamento" element={<PaymentMethodsPage />} />
          <Route path="/cliente/reserva" element={<NewReservationPage />} />
          <Route path="/cliente/reserva/checkout" element={<CheckoutPage />} />
          <Route path="/cliente/minhas-reservas" element={<MyBookingsPage />} />
          <Route path="/cliente/historico" element={<HistoryPage />} />
          <Route path="/cliente/avaliacoes" element={<ReviewsPage />} />
          <Route path="/cliente/suporte" element={<SupportPage />} />
          <Route path="/cliente/notificacoes" element={<NotificationsPage />} />
        </Route>
      </Route>

      <Route path="/minha-conta" element={<Navigate to="/cliente/minha-conta" replace />} />
      <Route path="/metodos-pagamento" element={<Navigate to="/cliente/metodos-pagamento" replace />} />
      <Route path="/reserva" element={<Navigate to="/cliente/reserva" replace />} />
      <Route path="/minhas-reservas" element={<Navigate to="/cliente/minhas-reservas" replace />} />
      <Route path="/historico" element={<Navigate to="/cliente/historico" replace />} />
      <Route path="/avaliacoes" element={<Navigate to="/cliente/avaliacoes" replace />} />
      <Route path="/suporte" element={<Navigate to="/cliente/suporte" replace />} />

      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/frota" element={<FleetPage />} />
          <Route path="/admin/reservas" element={<BookingsPage />} />
          <Route path="/admin/reservas/:id" element={<ReservationDetailsPage />} />
          <Route path="/admin/manutencao" element={<MaintenancePage />} />
          <Route path="/admin/clientes" element={<CustomersPage />} />
          <Route path="/admin/relatorios" element={<ReportsPage />} />
          <Route path="/admin/apoio" element={<SupportManagementPage />} />
          <Route path="/admin/avaliacoes" element={<ReviewManagementPage />} />
          <Route path="/admin/equipa" element={<StaffManagementPage />} />
          <Route path="/admin/auditoria" element={<AuditLogPage />} />
          <Route path="/admin/configuracoes" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Rotas do Gestor */}
      <Route element={<ProtectedRoute role="gestor" />}>
        <Route element={<GestorLayout />}>
          <Route path="/gestor" element={<GestorDashboardPage />} />
          <Route path="/gestor/frota" element={<GestorFleetPage />} />
          <Route path="/gestor/reservas" element={<GestorBookingsPage />} />
          <Route path="/gestor/reservas/:id" element={<ReservationDetailsPage />} />
          <Route path="/gestor/manutencao" element={<GestorMaintenancePage />} />
          <Route path="/gestor/clientes" element={<GestorCustomersPage />} />
          <Route path="/gestor/relatorios" element={<GestorReportsPage />} />
          <Route path="/gestor/apoio" element={<SupportManagementPage />} />
          <Route path="/gestor/avaliacoes" element={<ReviewManagementPage />} />
        </Route>
      </Route>

      <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
