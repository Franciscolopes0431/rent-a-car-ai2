import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import PublicRoute from './components/layout/PublicRoute';
import { RegisterProvider } from './context/RegisterContext';

const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));
const GestorLayout = lazy(() => import('./components/layout/gestor/GestorLayout'));
const ClientLayout = lazy(() => import('./components/layout/customer/ClientLayout'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const FleetPage = lazy(() => import('./pages/fleet/FleetPage'));
const BookingsPage = lazy(() => import('./pages/bookings/BookingsPage'));
const CustomersPage = lazy(() => import('./pages/customers/CustomersPage'));
const MaintenancePage = lazy(() => import('./pages/maintenance/MaintenancePage'));
const ReportsPage = lazy(() => import('./pages/reports/ReportsPage'));
const GestorDashboardPage = lazy(() => import('./pages/gestor/GestorDashboardPage'));
const GestorFleetPage = lazy(() => import('./pages/gestor/fleet/GestorFleetPage'));
const GestorBookingsPage = lazy(() => import('./pages/gestor/bookings/GestorBookingsPage'));
const GestorCustomersPage = lazy(() => import('./pages/gestor/customers/GestorCustomersPage'));
const GestorMaintenancePage = lazy(() => import('./pages/gestor/maintenance/GestorMaintenancePage'));
const GestorReportsPage = lazy(() => import('./pages/gestor/reports/GestorReportsPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const VehicleCatalogPage = lazy(() => import('./pages/public/VehicleCatalogPage'));
const VehicleDetailsPage = lazy(() => import('./pages/public/VehicleDetailsPage'));
const AboutUsPage = lazy(() => import('./pages/public/AboutUsPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const AccountPage = lazy(() => import('./pages/customer/AccountPage'));
const PaymentMethodsPage = lazy(() => import('./pages/customer/PaymentMethodsPage'));
const CheckoutPage = lazy(() => import('./pages/customer/CheckoutPage'));
const MyBookingsPage = lazy(() => import('./pages/customer/MyBookingsPage'));
const HistoryPage = lazy(() => import('./pages/customer/HistoryPage'));
const ReviewsPage = lazy(() => import('./pages/customer/ReviewsPage'));
const SupportPage = lazy(() => import('./pages/customer/SupportPage'));
const ClientDashboardPage = lazy(() => import('./pages/customer/ClientDashboardPage'));
const NewReservationPage = lazy(() => import('./pages/customer/NewReservationPage'));
const ReservationDetailsPage = lazy(() => import('./pages/reservations/ReservationDetailsPage'));
const LegalPage = lazy(() => import('./pages/public/LegalPage'));
const SupportManagementPage = lazy(() => import('./pages/support/SupportManagementPage'));
const ReviewManagementPage = lazy(() => import('./pages/reviews/ReviewManagementPage'));
const NotificationsPage = lazy(() => import('./pages/customer/NotificationsPage'));
const StaffManagementPage = lazy(() => import('./pages/admin/StaffManagementPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const AuditLogPage = lazy(() => import('./pages/admin/AuditLogPage'));

function App() {
  return (
    <Suspense fallback={<div className="min-vh-100 d-flex align-items-center justify-content-center text-secondary">A carregar...</div>}><Routes>
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
    </Routes></Suspense>
  );
}

export default App;
