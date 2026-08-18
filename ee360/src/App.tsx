import { Switch, Route, Redirect } from 'wouter';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/auth-context';

// Public pages
import LandingPage    from '@/pages/LandingPage';
import AboutPage      from '@/pages/AboutPage';
import GalleryPage    from '@/pages/GalleryPage';
import ContactPage    from '@/pages/ContactPage';
import ApplyPage      from '@/pages/ApplyPage';
import LoginPage      from '@/pages/LoginPage';
import NotFound       from '@/pages/not-found';

// Dashboard layout + pages
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardPage   from '@/pages/DashboardPage';
import LivestockPage   from '@/pages/livestock/LivestockPage';
import SalesPage       from '@/pages/sales/SalesPage';
import ExpensesPage    from '@/pages/expenses/ExpensesPage';
import InventoryPage   from '@/pages/inventory/InventoryPage';
import WorkersPage     from '@/pages/workers/WorkersPage';
import VendorsPage     from '@/pages/vendors/VendorsPage';
import ReportsPage     from '@/pages/reports/ReportsPage';
import LedgerPage      from '@/pages/dashboard/LedgerPage';
import WaterPage       from '@/pages/water/WaterPage';
import FarmProductionPage from '@/pages/livestock/FarmProductionPage';
import HatcheryPage    from '@/pages/livestock/HatcheryPage';
import CustomersPage   from '@/pages/dashboard/CustomersPage';
import IncidentsPage   from '@/pages/incidents/IncidentsPage';

// Admin-only pages
import GalleryManagePage  from '@/pages/admin/GalleryManagePage';
import StaffDirectoryPage from '@/pages/admin/StaffDirectoryPage';
import ApplicationsPage   from '@/pages/admin/ApplicationsPage';
import ActivityLogsPage   from '@/pages/admin/ActivityLogsPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, isLoading, isSuperAdmin } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (adminOnly && !isSuperAdmin) return <Redirect to="/dashboard" />;
  return <>{children}</>;
}

export default function App() {
  const { isSuperAdmin, isFarmManager } = useAuth();

  return (
    <>
      <Switch>
        {/* ── Public ── */}
        <Route path="/"        component={LandingPage} />
        <Route path="/about"   component={AboutPage}   />
        <Route path="/gallery" component={GalleryPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/apply"   component={ApplyPage}   />
        <Route path="/login"   component={LoginPage}   />

        {/* ── Protected dashboard ── */}
        <Route path="/dashboard">
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route path="/dashboard/livestock">
          <ProtectedRoute>
            <DashboardLayout>
              <LivestockPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route path="/dashboard/hatchery">
          <ProtectedRoute>
            <DashboardLayout>
              <HatcheryPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route path="/dashboard/sales">
          <ProtectedRoute>
            <DashboardLayout>
              <SalesPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route path="/dashboard/production">
          <ProtectedRoute>
            <DashboardLayout>
              <FarmProductionPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route path="/dashboard/expenses">
          <ProtectedRoute>
            <DashboardLayout>
              <ExpensesPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route path="/dashboard/inventory">
          <ProtectedRoute>
            <DashboardLayout>
              <InventoryPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route path="/dashboard/workers">
          <ProtectedRoute>
            <DashboardLayout>
              <WorkersPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route path="/dashboard/customers">
          <ProtectedRoute>
            <DashboardLayout>
              <CustomersPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route path="/dashboard/incidents">
          <ProtectedRoute>
            <DashboardLayout>
              <IncidentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route path="/dashboard/vendors">
          <ProtectedRoute>
            <DashboardLayout>
              <VendorsPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route path="/dashboard/reports">
          <ProtectedRoute>
            <DashboardLayout>
              <ReportsPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        {/* Ledger */}
        <Route path="/dashboard/ledger">
          <ProtectedRoute>
            <DashboardLayout>
              <LedgerPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route path="/dashboard/water">
          <ProtectedRoute>
            <DashboardLayout>
              <WaterPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        {/* ── Admin-only ── */}
        <Route path="/dashboard/admin/applications">
          <ProtectedRoute adminOnly>
            <DashboardLayout>
              <ApplicationsPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route path="/dashboard/admin/gallery">
          <ProtectedRoute adminOnly>
            <DashboardLayout>
              <GalleryManagePage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route path="/dashboard/admin/staff">
          <ProtectedRoute adminOnly>
            <DashboardLayout>
              <StaffDirectoryPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route path="/dashboard/admin/users">
          <ProtectedRoute adminOnly>
            <DashboardLayout>
              <UserManagementPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route path="/dashboard/admin/logs">
          <ProtectedRoute adminOnly>
            <DashboardLayout>
              <ActivityLogsPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route component={NotFound} />
      </Switch>
      <Toaster richColors position="top-right" />
    </>
  );
}
