import { useAuth } from '@/contexts/auth-context';
import SuperAdminDashboard from './dashboard/SuperAdminDashboard';
import FarmDashboard       from './dashboard/FarmDashboard';
import WaterDashboard      from './dashboard/WaterDashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  if (user?.role === 'super_admin')   return <SuperAdminDashboard />;
  if (user?.role === 'water_manager') return <WaterDashboard />;
  return <FarmDashboard />;
}
