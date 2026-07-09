'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  BookOpen,
  Tractor,
  DollarSign,
  BarChart3,
  Menu,
  X,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  children?: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: 'School (EE Academy)',
      href: '/dashboard/school',
      icon: <BookOpen className="w-5 h-5" />,
      children: [
        { label: 'Students', href: '/dashboard/school/students', icon: <Users className="w-4 h-4" /> },
        { label: 'Staff', href: '/dashboard/school/staff', icon: <Users className="w-4 h-4" /> },
        { label: 'Staff Attendance', href: '/dashboard/school/staff-attendance', icon: <BookOpen className="w-4 h-4" /> },
        { label: 'Student Attendance', href: '/dashboard/school/attendance', icon: <BookOpen className="w-4 h-4" /> },
        { label: 'Classes', href: '/dashboard/school/classes', icon: <BookOpen className="w-4 h-4" /> },
        { label: 'Results', href: '/dashboard/school/results', icon: <BarChart3 className="w-4 h-4" /> },
      ],
    },
    {
      label: 'Farm - Livestock Sales',
      href: '/dashboard/farm',
      icon: <Tractor className="w-5 h-5" />,
      children: [
        { label: 'Parrots', href: '/dashboard/farm/parrots', icon: <Tractor className="w-4 h-4" /> },
        { label: 'Rabbits', href: '/dashboard/farm/rabbits', icon: <Tractor className="w-4 h-4" /> },
        { label: 'Chickens', href: '/dashboard/farm/chickens', icon: <Tractor className="w-4 h-4" /> },
        { label: 'Goats', href: '/dashboard/farm/goats', icon: <Tractor className="w-4 h-4" /> },
        { label: 'Rams', href: '/dashboard/farm/rams', icon: <Tractor className="w-4 h-4" /> },
        { label: 'Sheep', href: '/dashboard/farm/sheep', icon: <Tractor className="w-4 h-4" /> },
        { label: 'Fish', href: '/dashboard/farm/fish', icon: <Tractor className="w-4 h-4" /> },
        { label: 'Sales', href: '/dashboard/farm/sales', icon: <DollarSign className="w-4 h-4" /> },
        { label: 'Expenses', href: '/dashboard/farm/expenses', icon: <DollarSign className="w-4 h-4" /> },
      ],
    },
    {
      label: 'Sachet Water',
      href: '/dashboard/water',
      icon: <DollarSign className="w-5 h-5" />,
      children: [
        { label: 'Production', href: '/dashboard/water/production', icon: <BarChart3 className="w-4 h-4" /> },
        { label: 'Inventory', href: '/dashboard/water/inventory', icon: <Users className="w-4 h-4" /> },
        { label: 'Sales', href: '/dashboard/water/sales', icon: <DollarSign className="w-4 h-4" /> },
        { label: 'Distribution', href: '/dashboard/water/distribution', icon: <Tractor className="w-4 h-4" /> },
        { label: 'Expenses', href: '/dashboard/water/expenses', icon: <DollarSign className="w-4 h-4" /> },
      ],
    },
    {
      label: 'Finance',
      href: '/dashboard/finance',
      icon: <DollarSign className="w-5 h-5" />,
      children: [
        { label: 'All Transactions', href: '/dashboard/finance/transactions', icon: <DollarSign className="w-4 h-4" /> },
        { label: 'Income', href: '/dashboard/finance/income', icon: <DollarSign className="w-4 h-4" /> },
        { label: 'Expenses', href: '/dashboard/finance/expenses', icon: <DollarSign className="w-4 h-4" /> },
        { label: 'Reports', href: '/dashboard/finance/reports', icon: <BarChart3 className="w-4 h-4" /> },
      ],
    },
    {
      label: 'Analytics',
      href: '/dashboard/analytics',
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          'bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col',
          isOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">EA</span>
              </div>
              <span className="font-bold text-sidebar-foreground truncate">Excellence</span>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-sidebar-accent rounded-lg text-sidebar-foreground"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  )}
                >
                  {item.icon}
                  {isOpen && <span className="font-medium truncate">{item.label}</span>}
                </Link>

                {/* Submenu */}
                {isOpen && item.children && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                            isChildActive
                              ? 'bg-sidebar-primary/10 text-sidebar-primary font-medium'
                              : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                          )}
                        >
                          {child.icon}
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Settings & Logout */}
        <div className="border-t border-sidebar-border p-2 space-y-1">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <Settings className="w-5 h-5" />
            {isOpen && <span className="font-medium">Settings</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
