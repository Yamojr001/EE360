import { useEffect, useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight, Bird, Droplets, BarChart3, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    tag: 'Integrated Farm Management',
    headline: 'Run Your Farm',
    highlight: 'Like a Business',
    sub: 'EE360 gives you a complete view — livestock, sales, expenses, water production and workers — all in one platform.',
    cta: 'Start Managing',
    bgImage: '/EE1.png',
  },
  {
    tag: 'Livestock & Animal Records',
    headline: '7 Animal Types',
    highlight: 'One Dashboard',
    sub: 'Track chickens, goats, sheep, rams, fish, rabbits and more. Monitor health, productivity and profitability per species.',
    cta: 'Manage Livestock',
    href: '/dashboard/livestock',
    bgImage: '/EE2.png',
  },
  {
    tag: 'Sachet Water Production',
    headline: 'Water Business',
    highlight: 'Fully Managed',
    sub: 'Log every production run, track bag inventory, record sales by distribution area and monitor profitability daily.',
    cta: 'View Water Module',
    href: '/dashboard/water',
    bgImage: '/EE3.png',
  },
  {
    tag: 'Analytics & Reports',
    headline: 'Data-Driven',
    highlight: 'Farm Decisions',
    sub: 'Revenue vs expense charts, per-sector breakdowns, P&L summaries and worker payroll — all in real time.',
    cta: 'See Reports',
    href: '/dashboard/reports',
    bgImage: '/EE4.png',
  },
  {
    tag: 'Staff & Worker Tracking',
    headline: 'Empower Your',
    highlight: 'Workforce',
    sub: 'Manage staff schedules, track payroll, and optimize worker efficiency across all your farm operations.',
    cta: 'Manage Workers',
    href: '/dashboard/workers',
    bgImage: '/EE5.png',
  }
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  // Auto-advance every 5 s
  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(id);
  }, [emblaApi]);

  return (
    <div className="relative overflow-hidden">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {SLIDES.map((slide, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%] relative bg-cover bg-center" style={{ backgroundImage: `url(${slide.bgImage})` }}>
              {/* Overlay to ensure text legibility */}
              <div className="absolute inset-0 bg-black/50" />

              <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
                <span className="inline-flex items-center gap-1.5 bg-white/15 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-5">
                  {slide.tag}
                </span>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
                  {slide.headline}
                  <br />
                  <span className="text-white/60">{slide.highlight}</span>
                </h1>
                <p className="mt-5 text-lg text-white/75 max-w-xl leading-relaxed">
                  {slide.sub}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg px-7 text-base font-semibold" asChild>
                    <Link href="/login">
                      {slide.cta} <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-7 text-base" asChild>
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === selectedIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}
