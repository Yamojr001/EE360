import { useLocation } from 'wouter';
import { Bell, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':                   'Overview',
  '/dashboard/livestock':         'Livestock Management',
  '/dashboard/sales':             'Farm Sales',
  '/dashboard/expenses':          'Farm Expenses',
  '/dashboard/inventory':         'Inventory',
  '/dashboard/water':             'Water Business',
  '/dashboard/workers':           'Workers',
  '/dashboard/reports':           'Reports & Analytics',
  '/dashboard/admin/gallery':     'Gallery Manager',
  '/dashboard/admin/staff':       'Staff Directory',
  '/dashboard/admin/content':     'About Page Editor',
};

function getTitle(path: string) {
  return PAGE_TITLES[path] ?? 'EE360';
}

export default function Header() {
  const [pathname] = useLocation();
  const { user } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const initials = user ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-xl font-bold text-foreground">{getTitle(pathname)}</h1>
        <p className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
        </button>

        <div className="flex items-center gap-2.5 ml-1 pl-3 border-l border-border">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          {user && (
            <div className="hidden md:block">
              <p className="text-sm font-semibold leading-tight">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
