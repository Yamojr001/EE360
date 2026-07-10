import { Switch, Route, Redirect } from 'wouter';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/auth-context';

// Public pages
import LandingPage    from '@/pages/LandingPage';
import AboutPage      from '@/pages/AboutPage';
import GalleryPage    from '@/pages/GalleryPage';
import ContactPage    from '@/pages/ContactPage';
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
import ReportsPage     from '@/pages/reports/ReportsPage';
import WaterPage       from '@/pages/water/WaterPage';

// Admin-only pages
import GalleryManagePage  from '@/pages/admin/GalleryManagePage';
import StaffDirectoryPage from '@/pages/admin/StaffDirectoryPage';
import ContentManagePage  from '@/pages/admin/ContentManagePage';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, isLoading, isSuperAdmin } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (adminOnly && !isSuperAdmin) return <Redirect to="/dashboard" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <Switch>
        {/* ── Public ── */}
        <Route path="/"        component={LandingPage} />
        <Route path="/about"   component={AboutPage}   />
        <Route path="/gallery" component={GalleryPage} />
        <Route path="/contact" component={ContactPage} />
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

        <Route path="/dashboard/sales">
          <ProtectedRoute>
            <DashboardLayout>
              <SalesPage />
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

        <Route path="/dashboard/reports">
          <ProtectedRoute>
            <DashboardLayout>
              <ReportsPage />
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

        <Route path="/dashboard/admin/content">
          <ProtectedRoute adminOnly>
            <DashboardLayout>
              <ContentManagePage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        <Route component={NotFound} />
      </Switch>
      <Toaster richColors position="top-right" />
    </>
  );
}
