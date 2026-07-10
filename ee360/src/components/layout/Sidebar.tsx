import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Bird, ShoppingCart, Wallet, Package,
  Droplets, Users, BarChart3, ChevronLeft, ChevronRight, LogOut,
  Images, BookOpen, UserCog, Layers, FlaskConical,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface NavItem { label: string; href: string; icon: React.ReactNode; }

const FARM_NAV: NavItem[] = [
  { label: 'Farm Dashboard', href: '/dashboard',            icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Livestock',      href: '/dashboard/livestock',  icon: <Bird className="w-4 h-4" /> },
  { label: 'Farm Sales',     href: '/dashboard/sales',      icon: <ShoppingCart className="w-4 h-4" /> },
  { label: 'Farm Expenses',  href: '/dashboard/expenses',   icon: <Wallet className="w-4 h-4" /> },
  { label: 'Inventory',      href: '/dashboard/inventory',  icon: <Package className="w-4 h-4" /> },
  { label: 'Farm Workers',   href: '/dashboard/workers',    icon: <Users className="w-4 h-4" /> },
  { label: 'Reports',        href: '/dashboard/reports',    icon: <BarChart3 className="w-4 h-4" /> },
];

const WATER_NAV: NavItem[] = [
  { label: 'Water Dashboard', href: '/dashboard',        icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Water Business',  href: '/dashboard/water',  icon: <Droplets className="w-4 h-4" /> },
  { label: 'Water Workers',   href: '/dashboard/workers',icon: <Users className="w-4 h-4" /> },
  { label: 'Reports',         href: '/dashboard/reports',icon: <BarChart3 className="w-4 h-4" /> },
];

const SUPER_ADMIN_NAV: { section: string; items: NavItem[] }[] = [
  {
    section: 'Overview',
    items: [
      { label: 'Command Centre', href: '/dashboard', icon: <Layers className="w-4 h-4" /> },
      { label: 'Full Reports',   href: '/dashboard/reports', icon: <BarChart3 className="w-4 h-4" /> },
    ],
  },
  {
    section: 'Farm Sector',
    items: [
      { label: 'Livestock',     href: '/dashboard/livestock', icon: <Bird className="w-4 h-4" /> },
      { label: 'Farm Sales',    href: '/dashboard/sales',     icon: <ShoppingCart className="w-4 h-4" /> },
      { label: 'Farm Expenses', href: '/dashboard/expenses',  icon: <Wallet className="w-4 h-4" /> },
      { label: 'Inventory',     href: '/dashboard/inventory', icon: <Package className="w-4 h-4" /> },
    ],
  },
  {
    section: 'Water Sector',
    items: [
      { label: 'Water Business', href: '/dashboard/water', icon: <Droplets className="w-4 h-4" /> },
    ],
  },
  {
    section: 'People',
    items: [
      { label: 'All Workers',      href: '/dashboard/workers',        icon: <Users className="w-4 h-4" /> },
      { label: 'Staff Directory',  href: '/dashboard/admin/staff',    icon: <UserCog className="w-4 h-4" /> },
    ],
  },
  {
    section: 'Content',
    items: [
      { label: 'Gallery Manager', href: '/dashboard/admin/gallery',  icon: <Images className="w-4 h-4" /> },
      { label: 'About Content',   href: '/dashboard/admin/content',  icon: <BookOpen className="w-4 h-4" /> },
    ],
  },
];

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const [pathname] = useLocation();
  const active = item.href === '/dashboard'
    ? pathname === '/dashboard'
    : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150',
        active
          ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
        collapsed && 'justify-center px-2',
      )}
      title={collapsed ? item.label : undefined}
    >
      <span className="shrink-0">{item.icon}</span>
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, isSuperAdmin, isFarmManager, logout } = useAuth();

  const roleBadge = user?.role === 'super_admin' ? 'Super Admin'
    : user?.role === 'farm_manager' ? 'Farm Manager'
    : 'Water Manager';

  const sectorColor = user?.role === 'super_admin' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
    : user?.role === 'farm_manager' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
    : 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-400';

  return (
    <aside className={cn(
      'h-screen flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 shrink-0',
      collapsed ? 'w-[62px]' : 'w-56',
    )}>
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 gradient-primary rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-[10px]">360</span>
            </div>
            <div>
              <p className="font-bold text-sidebar-foreground text-sm leading-none">EE360</p>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Farm System</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 gradient-primary rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-[10px]">360</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-muted-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-3 py-2 border-b border-sidebar-border">
          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide', sectorColor)}>
            {roleBadge}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {isSuperAdmin ? (
          SUPER_ADMIN_NAV.map((group) => (
            <div key={group.section} className="mb-1">
              {!collapsed && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 py-1.5 mt-1">
                  {group.section}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map(item => <NavLink key={item.href} item={item} collapsed={collapsed} />)}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-0.5">
            {(isFarmManager ? FARM_NAV : WATER_NAV).map(item => (
              <NavLink key={item.href} item={item} collapsed={collapsed} />
            ))}
          </div>
        )}
      </nav>

      {/* User footer */}
      <div className="border-t border-sidebar-border p-2 space-y-0.5">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">{user.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors',
            collapsed && 'justify-center px-2',
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
