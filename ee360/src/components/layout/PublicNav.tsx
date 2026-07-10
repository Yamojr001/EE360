import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { label: 'Home',    href: '/'        },
  { label: 'About',   href: '/about'   },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

export default function PublicNav() {
  const [open, setOpen] = useState(false);
  const [pathname] = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-extrabold text-[11px]">360</span>
          </div>
          <span className="font-bold text-base">EE360</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                pathname === l.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" className="shadow-sm" asChild>
            <Link href="/login">
              Get Started <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-md text-muted-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 pt-2 space-y-1">
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted/60"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/login" onClick={() => setOpen(false)}>Sign in</Link>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link href="/login" onClick={() => setOpen(false)}>Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
