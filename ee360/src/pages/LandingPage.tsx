import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import PublicNav from '@/components/layout/PublicNav';
import HeroCarousel from '@/components/HeroCarousel';
import {
  Bird, ShoppingCart, Wallet, Package, Droplets, Users, BarChart3, ArrowRight,
  CheckCircle2, TrendingUp, Shield, Zap, Globe, Star,
} from 'lucide-react';

const FEATURES = [
  { icon: <Bird />,        title: 'Livestock',          desc: 'Track 7 animal types — chickens, goats, sheep, rams, fish, rabbits and more.' },
  { icon: <ShoppingCart />,title: 'Sales Tracking',      desc: 'Log every sale with buyer details, quantities and auto-totals.' },
  { icon: <Wallet />,      title: 'Expense Control',    desc: 'Categorise costs. Know exactly where every naira goes.' },
  { icon: <Package />,     title: 'Inventory',          desc: 'Real-time stock with low-stock alerts before you run out.' },
  { icon: <Droplets />,    title: 'Water Business',     desc: 'Production, inventory and distribution for sachet water.' },
  { icon: <Users />,       title: 'Workers & Payroll',  desc: 'Manage farm and water staff, salaries and attendance.' },
  { icon: <BarChart3 />,   title: 'Analytics',          desc: 'Visual P&L, trend charts and period reports.' },
  { icon: <Globe />,       title: 'Deploy Anywhere',    desc: 'Vercel frontend + your own VPS backend. Full data ownership.' },
];

const STATS = [
  { value: '7+',   label: 'Animal Types' },
  { value: '2',    label: 'Sectors Managed' },
  { value: '100%', label: 'Data Ownership' },
  { value: '24/7', label: 'Always Available' },
];

const TESTIMONIALS = [
  { name: 'Chief Emmanuel E.', role: 'Farm Director', quote: 'EE360 gave me full visibility over both the farm and the water plant from one screen. I can now make real decisions with real numbers.' },
  { name: 'Emmanuel O.',       role: 'Farm Manager',  quote: 'Tracking 430 birds, 12 goats and 500 fish used to be a nightmare. Now I log everything in minutes and know exactly what each animal costs.' },
  { name: 'Fatima S.',         role: 'Water Manager', quote: 'The water module paid for itself in the first week — I found a distribution route that was losing money and fixed it immediately.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* ── HERO CAROUSEL ── */}
      <HeroCarousel />

      {/* ── STATS STRIP ── */}
      <section className="gradient-primary py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center text-white">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-4xl font-extrabold">{s.value}</p>
                <p className="text-white/70 mt-1 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Features</span>
            <h2 className="text-4xl font-extrabold text-foreground mb-4">Everything Your Farm Needs</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From a single animal record to full financial reports — every module you need to run a modern integrated farm.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="group bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-bold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO SECTORS ── */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-foreground mb-3">Two Independent Sectors</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Each business unit has its own manager, workers, P&L and dashboard — all visible to the super admin.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                emoji: '🐓', title: 'Main Farm',
                color: 'from-emerald-500/10 to-green-500/5 border-emerald-200 dark:border-emerald-900',
                badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                items: ['Livestock (7 animal types)','Farm Sales & Revenue','Feed & Medicine Expenses','Inventory & Stock Control','Farm Worker Payroll'],
              },
              {
                emoji: '💧', title: 'Water Production',
                color: 'from-cyan-500/10 to-blue-500/5 border-cyan-200 dark:border-cyan-900',
                badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
                items: ['Daily Production Logs','Sachet Water Sales','Raw Water & Packaging Expenses','Distribution Area Tracking','Water Staff Payroll'],
              },
            ].map(s => (
              <div key={s.title} className={`bg-gradient-to-br ${s.color} border rounded-2xl p-8`}>
                <div className="text-4xl mb-4">{s.emoji}</div>
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="text-2xl font-extrabold text-foreground">{s.title}</h3>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.badge}`}>Independent Sector</span>
                </div>
                <ul className="space-y-2.5">
                  {s.items.map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-foreground mb-3">From the Team</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">What the people running the farm every day say about EE360.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ── */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-foreground mb-5">Built for Nigerian Farm Owners</h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                EE360 was designed for integrated agribusinesses — where you manage livestock, produce water, pay workers and track every naira, all at once.
              </p>
              <ul className="space-y-3">
                {['Role-based access — super admin, farm manager, water manager','Staff records without login accounts','Cross-sector analytics in one command centre','Deploy frontend to Vercel, backend to your VPS','Beautiful mobile-friendly interface','Export reports for investors and banks'].map(w => (
                  <li key={w} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              {[
                { icon: <TrendingUp />, title: 'Live Profit & Loss per Sector',  desc: 'Farm P&L and Water P&L tracked independently — plus a combined super admin view.' },
                { icon: <Shield />,     title: 'Your Server, Your Data',         desc: 'Laravel backend runs on your own VPS. No third-party cloud lock-in ever.' },
                { icon: <Zap />,       title: 'Role-Based Access Control',      desc: 'Managers see only their sector. Super admin sees everything. Staff are recorded but cannot log in.' },
              ].map(c => (
                <div key={c.title} className="flex gap-4 bg-card border border-border rounded-xl p-5">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">{c.icon}</div>
                  <div>
                    <h4 className="font-semibold text-foreground">{c.title}</h4>
                    <p className="text-muted-foreground text-sm mt-0.5">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="gradient-primary py-20 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold mb-4">Ready to Take Control?</h2>
          <p className="text-white/80 text-lg mb-8">Sign in and manage your entire farm operation the smart way.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-10 text-base shadow-lg" asChild>
              <Link href="/login">Open Dashboard <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8 text-base" asChild>
              <Link href="/about">About the Farm</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">360</span>
              </div>
              <span className="font-semibold text-sm">EE360 Farm Management</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              {[{ label: 'About', href: '/about' }, { label: 'Gallery', href: '/gallery' }, { label: 'Contact', href: '/contact' }, { label: 'Sign In', href: '/login' }].map(l => (
                <Link key={l.href} href={l.href} className="hover:text-foreground transition-colors">{l.label}</Link>
              ))}
            </div>
            <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} Excellence Enterprise</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
