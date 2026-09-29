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
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen flex relative">
      {/* Full background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/Gate.png')` }}
      >
        <div className="absolute inset-0 bg-black/50 lg:bg-black/20" />
      </div>

      {/* Left panel spacer (Desktop) */}
      <div className="hidden lg:block w-[45%] relative z-10" />

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10 lg:bg-background/70 lg:backdrop-blur-xl border-l border-border/50">
        <div className="absolute top-8 left-4 sm:left-8 z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-white/90 lg:text-muted-foreground hoverm:text-white lg:hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>

        <div className="w-full max-w-md bg-background/60 lg:bg-transparent p-8 lg:p-0 rounded-2xl shadow-xl lg:shadow-none border border-border/50 lg:border-none backdrop-blur-md lg:backdrop-blur-none">
          <div className="flex flex-col items-center text-center mb-8">
            <img src="/FarmLogo.png" alt="EEFarm360 logo" className="h-32 w-auto object-contain mb-6" />
            <h2 className="text-3xl font-bold text-foreground">Sign in</h2>
            <p className="text-muted-foreground mt-1">Access your farm management dashboard</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 bg">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
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
                name="password"
                type="password"
                autoComplete="current-password"
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

         
        </div>
      </div>
    </div>
  );
}
