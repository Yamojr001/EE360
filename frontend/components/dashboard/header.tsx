'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserInfo {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
        } else {
          // Fallback: use demo user if API fails
          setUser({
            userId: 'demo-user-1',
            email: 'demo@ee360.edu',
            firstName: 'Demo',
            lastName: 'Admin',
            role: 'admin',
          });
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        // Fallback: use demo user
        setUser({
          userId: 'demo-user-1',
          email: 'demo@ee360.edu',
          firstName: 'Demo',
          lastName: 'Admin',
          role: 'admin',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      // Clear localStorage token
      localStorage.removeItem('token');
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect even if API call fails
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  const getUserInitials = () => {
    if (!user) return '?';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  const roleLabel = user?.role?.replace('_', ' ').toUpperCase() || 'User';

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 lg:px-8">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground hidden md:block">
          Welcome back!
        </h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* User Menu */}
        {!isLoading && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-sm">
                  <span className="font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">{roleLabel}</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-foreground">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <p className="text-xs text-primary mt-1">{roleLabel}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <button className="w-full cursor-pointer flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button
                  className="w-full cursor-pointer flex items-center gap-2 text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
