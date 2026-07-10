import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [email, setEmail]       = useState('admin@ee360.farm');
  const [password, setPassword] = useState('password');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] gradient-primary p-12 text-white">
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="font-extrabold text-sm">360</span>
          </div>
          <span className="font-bold text-xl">EE360</span>
        </Link>

        <div>
          <blockquote className="text-3xl font-bold leading-snug mb-4">
            "Manage every part of your farm — from animals to finances — in one powerful platform."
          </blockquote>
          <p className="text-white/70 text-sm">EE360 Farm Management System</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Livestock Types', value: '7+' },
            { label: 'Reports Generated', value: '∞' },
            { label: 'Uptime', value: '99.9%' },
            { label: 'Built For', value: 'Nigerian Farms' },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-white/70 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="mb-8">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <span className="font-extrabold text-sm text-white">360</span>
              </div>
              <span className="font-bold text-xl">EE360</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Sign in</h2>
            <p className="text-muted-foreground mt-1">Access your farm management dashboard</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@ee360.farm"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in…</>
                : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo: <code className="bg-muted px-1 rounded">admin@ee360.farm</code>{' '}
            / <code className="bg-muted px-1 rounded">password</code>
          </p>
        </div>
      </div>
    </div>
  );
}
