import { useQuery } from '@tanstack/react-query';
import PublicNav from '@/components/layout/PublicNav';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { MapPin, Calendar, Users, Droplets, Bird, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const { data } = useQuery({
    queryKey: ['about-content'],
    queryFn: () => api.get('/about-content').then(r => r.data),
  });

  const about = data ?? {
    hero_title: 'Excellence Enterprise Farm',
    hero_subtitle: 'A fully integrated agribusiness — livestock, crops, and water production — built on decades of farming experience in Awka, Anambra State.',
    mission: 'To produce high-quality farm products using sustainable practices while leveraging technology to maximise yield, minimise waste, and create lasting value for our community.',
    founded: '2019',
    location: 'Awka, Anambra State, Nigeria',
    team: [
      { name: 'Chief Emmanuel Ezenwachi', role: 'Founder & Director',     bio: 'A visionary agribusiness entrepreneur with 20+ years of farming experience.' },
      { name: 'Emmanuel Okafor',          role: 'Farm Operations Manager', bio: 'Oversees day-to-day livestock and crop operations.' },
      { name: 'Fatima Suleiman',          role: 'Water Business Manager',  bio: 'Manages the sachet water plant, production schedules and distribution.' },
    ],
    stats: [
      { label: 'Years Operating', value: '7+' },
      { label: 'Animal Types',    value: '7'  },
      { label: 'Staff Employed',  value: '10+'},
      { label: 'Bags Water/Day',  value: '200'},
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="gradient-primary text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/15 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-5">About Us</span>
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">{about.hero_title}</h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">{about.hero_subtitle}</p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/70 text-sm">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{about.location}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />Founded {about.founded}</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-card border-y border-border py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {about.stats.map((s: any) => (
              <div key={s.label}>
                <p className="text-4xl font-extrabold text-primary">{s.value}</p>
                <p className="text-muted-foreground text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">Our Mission</span>
          </div>
          <blockquote className="text-2xl sm:text-3xl font-bold text-center text-foreground leading-relaxed border-l-4 border-primary pl-8 mt-6">
            "{about.mission}"
          </blockquote>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-foreground mb-12">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Bird className="w-8 h-8" />,
                title: 'Main Farm Operations',
                color: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
                iconBg: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
                items: ['Poultry (broiler & layer chickens)', 'Catfish pond management', 'Goat & sheep breeding', 'Ram fattening for festive markets', 'Rabbit rearing', 'Crop & produce sales'],
              },
              {
                icon: <Droplets className="w-8 h-8" />,
                title: 'Water Production Business',
                color: 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800',
                iconBg: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-400',
                items: ['Daily sachet water production', 'Quality-controlled packaging', 'Distribution across multiple zones', 'Bulk sales to hotels & markets', 'Raw water sourcing management', 'Staff scheduling & payroll'],
              },
            ].map(s => (
              <div key={s.title} className={`border rounded-2xl p-8 ${s.color}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${s.iconBg}`}>{s.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-5">{s.title}</h3>
                <ul className="space-y-3">
                  {s.items.map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground mb-3">Our Leadership Team</h2>
            <p className="text-muted-foreground">The people who keep Excellence Enterprise running every day.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {about.team.map((m: any) => (
              <div key={m.name} className="bg-card border border-border rounded-2xl p-6 text-center">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {m.name.charAt(0)}
                </div>
                <h3 className="font-bold text-foreground">{m.name}</h3>
                <p className="text-primary text-sm font-medium mt-0.5 mb-3">{m.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-primary py-16 text-white text-center">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-extrabold mb-3">See It in Action</h2>
          <p className="text-white/80 mb-6">Sign into the EE360 dashboard to explore real farm data.</p>
          <Button size="lg" variant="secondary" className="px-8 text-base" asChild>
            <Link href="/login">Open Dashboard <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Excellence Enterprise Farm · Powered by EE360
      </footer>
    </div>
  );
}
