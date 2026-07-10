import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import PublicNav from '@/components/layout/PublicNav';
import { ArrowRight, Check, Droplets, Leaf } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative px-6 pt-12 pb-24 lg:px-12 lg:pt-20 lg:pb-32 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase">
            <Leaf className="w-4 h-4" />
            <span>Built by farmers, for farmers.</span>
          </div>
          <h1 className="text-6xl lg:text-[5rem] font-extrabold tracking-tight text-foreground leading-[1.05]">
            Real farming.<br />
            <span className="text-primary">Real numbers.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-lg font-medium">
            EE FARM 360 replaces messy notebooks and guesswork with a simple system to track your animals, your water business, and your daily profits.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button size="lg" className="gradient-primary text-primary-foreground shadow-xl shadow-primary/20 rounded-full px-8 text-lg h-14 font-semibold transition-all hover:-translate-y-0.5" asChild>
              <Link href="/login">Open Dashboard</Link>
            </Button>
            <Button size="lg" variant="ghost" className="rounded-full px-8 text-lg h-14 text-muted-foreground hover:bg-muted font-semibold" asChild>
              <Link href="/about">Our Story</Link>
            </Button>
          </div>
        </div>
        
        <div className="lg:w-1/2 relative w-full mt-10 lg:mt-0">
          {/* Organic image shape wrapper */}
          <div className="aspect-[4/3] md:aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative rotate-1 hover:rotate-0 transition-transform duration-500 border border-border">
            <img src="/EE1.png" alt="EE Farm Overview" className="object-cover w-full h-full scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
          </div>
        </div>
      </section>

      {/* The Two Halves of the Farm */}
      <section className="py-24 md:py-32 bg-card text-card-foreground relative overflow-hidden border-t border-border">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl lg:text-6xl font-extrabold mb-6 text-foreground leading-tight">One farm.<br/><span className="text-muted-foreground">Two major operations.</span></h2>
            <p className="text-xl text-muted-foreground leading-relaxed">We built EE FARM 360 to handle the two most important pillars of our business without complicating our day.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
            {/* Livestock Block */}
            <div className="space-y-8">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-8 shadow-xl relative group border border-border">
                <img src="/EE3.png" alt="Livestock" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-foreground border border-border">Sector 01</div>
              </div>
              <h3 className="text-4xl font-bold text-foreground tracking-tight">Livestock & Animals</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you have 500 birds or 50 goats, keeping them healthy is a full-time job. 
                We track every feed bag, every medicine dosage, and every daily egg count so you know exactly what each animal costs to raise.
              </p>
              <ul className="space-y-4 pt-4 border-t border-border">
                {['Track chickens, goats, fish & more', 'Monitor daily feed consumption', 'Log sickness and treatments', 'Calculate exact profit per sale'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg text-foreground/80 font-medium">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Water Block */}
            <div className="space-y-8 md:mt-32">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-8 shadow-xl relative group border border-border">
                <img src="/EE2.png" alt="Water Production" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-foreground border border-border">Sector 02</div>
              </div>
              <h3 className="text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
                Pure Water Plant
                <Droplets className="w-8 h-8 text-blue-500" />
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Water production moves fast. You produce bags today, and they are out for delivery tomorrow. 
                Our system logs your daily production runs, tracks your distribution trucks, and secures your cash flow.
              </p>
              <ul className="space-y-4 pt-4 border-t border-border">
                {['Log daily sachet water production', 'Track inventory in the warehouse', 'Monitor distribution routes', 'Keep exact records of daily sales'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg text-foreground/80 font-medium">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 text-blue-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Staff & Reports */}
      <section className="py-24 md:py-32 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Photo Collage */}
          <div className="lg:w-1/2 order-2 lg:order-1 relative">
             <div className="grid grid-cols-2 gap-4 md:gap-6 relative z-10">
                <div className="space-y-4 md:space-y-6 mt-12">
                  <img src="/EE4.png" alt="Farm Reports" className="rounded-3xl object-cover aspect-[4/5] w-full shadow-lg border border-border" />
                </div>
                <div className="space-y-4 md:space-y-6">
                  <img src="/EE5.png" alt="Farm Staff" className="rounded-3xl object-cover aspect-[4/5] w-full shadow-lg border border-border" />
                </div>
             </div>
             {/* Decorative blob */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl -z-10 opacity-70"></div>
          </div>
          
          <div className="lg:w-1/2 order-1 lg:order-2 space-y-8">
            <h2 className="text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
              Manage your people.<br/>
              <span className="text-muted-foreground">See your profits.</span>
            </h2>
            <div className="w-20 h-2 bg-primary rounded-full"></div>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              A farm is only as good as the people running it. EE FARM 360 makes it incredibly easy to manage your workers' schedules, track their monthly salaries, and see how their hard work translates into profit.
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              And when the month ends? You don't need an accountant. Our simple, clear charts show you exactly where your money went and what came back.
            </p>
            
            <div className="pt-6">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 h-14 text-lg font-bold shadow-xl transition-all hover:scale-105" asChild>
                <Link href="/login">Explore The Dashboard <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="gradient-primary py-32 text-center px-6 relative overflow-hidden">
        {/* Background texture overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
        
        <div className="max-w-4xl mx-auto space-y-10 relative z-10">
          <h2 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight">Ready to run your farm the smart way?</h2>
          <p className="text-2xl text-white/90 font-medium max-w-2xl mx-auto">
            Stop drowning in paperwork. Join EE FARM 360 today and take complete, effortless control of your business.
          </p>
          <div className="pt-8 flex justify-center gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-12 h-16 text-xl font-bold shadow-2xl transition-transform hover:scale-105" asChild>
              <Link href="/login">Open Your Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-muted py-12 text-center border-t border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-extrabold text-sm">360</span>
             </div>
             <span className="font-bold text-lg text-foreground">EE FARM 360</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
             <Link href="/about" className="hover:text-foreground transition-colors">Our Story</Link>
             <Link href="/gallery" className="hover:text-foreground transition-colors">Gallery</Link>
             <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
          <p className="text-muted-foreground text-sm font-medium">© {new Date().getFullYear()} Built by farmers, for farmers.</p>
        </div>
      </footer>
    </div>
  );
}
