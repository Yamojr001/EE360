import { useState } from 'react';
import PublicNav from '@/components/layout/PublicNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react';

const CONTACT_INFO = [
  { icon: <MapPin className="w-5 h-5" />,  label: 'Location',         value: 'Awka, Anambra State, Nigeria' },
  { icon: <Phone className="w-5 h-5" />,   label: 'Phone',            value: '+234 (0) 800 EE FARM' },
  { icon: <Mail className="w-5 h-5" />,    label: 'Email',            value: 'info@excellenceenterprise.farm' },
  { icon: <Clock className="w-5 h-5" />,   label: 'Operating Hours',  value: 'Mon – Sat: 7am – 6pm' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated send
    setSent(true);
    toast.success('Message sent! We\'ll get back to you shortly.');
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="gradient-primary text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block bg-white/15 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-4">Get in Touch</span>
          <h1 className="text-5xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-white/80 text-lg">Reach out to Excellence Enterprise Farm — whether you're a buyer, partner or investor.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-14">

          {/* Info cards */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Our Contact Details</h2>
            <p className="text-muted-foreground mb-8">Visit us on the farm or reach out through any of the channels below.</p>

            <div className="space-y-4 mb-10">
              {CONTACT_INFO.map(c => (
                <div key={c.label} className="flex items-start gap-4 bg-card border border-border rounded-xl p-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">{c.icon}</div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{c.label}</p>
                    <p className="text-foreground font-medium mt-0.5">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <h3 className="font-bold text-foreground mb-3">Interested in our products?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {['Fresh broiler chickens & eggs','Live goats, sheep & rams','Catfish (live or smoked)','Sachet water — bulk orders welcome','Custom farm produce orders'].map(i => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{i}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card border border-border rounded-2xl p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Message Received!</h3>
                <p className="text-muted-foreground text-sm max-w-xs">Thank you for reaching out. The EE360 team will get back to you within one business day.</p>
                <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Send Another</Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-1">Send a Message</h2>
                <p className="text-muted-foreground text-sm mb-6">We typically reply within one business day.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Your name</Label>
                      <Input id="name" placeholder="Alhaji Musa" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email address</Label>
                      <Input id="email" type="email" placeholder="you@example.com" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Bulk catfish order" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message" rows={5}
                      placeholder="Tell us what you need…"
                      required
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full h-11 text-base">Send Message</Button>
                </form>
              </>
            )}
          </div>

        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Excellence Enterprise Farm · Powered by EE360
      </footer>
    </div>
  );
}
