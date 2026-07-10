import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PublicNav from '@/components/layout/PublicNav';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { Bird, Droplets, Users, Globe, X, Calendar } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  livestock: <Bird className="w-4 h-4" />,
  water:     <Droplets className="w-4 h-4" />,
  workers:   <Users className="w-4 h-4" />,
  general:   <Globe className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  livestock: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  water:     'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
  workers:   'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  general:   'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
};

const GRADIENT_BG: Record<string, string> = {
  livestock: 'from-emerald-600 to-teal-700',
  water:     'from-cyan-600 to-blue-700',
  workers:   'from-amber-500 to-orange-600',
  general:   'from-violet-600 to-purple-700',
};

const FILTERS = ['all', 'livestock', 'water', 'workers', 'general'];

export default function GalleryPage() {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState<any | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => api.get('/gallery').then(r => r.data),
  });

  const filtered = filter === 'all' ? items : items.filter((i: any) => i.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="gradient-primary text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block bg-white/15 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-4">Photo Gallery</span>
          <h1 className="text-5xl font-extrabold mb-4">Life on the Farm</h1>
          <p className="text-white/80 text-lg">A glimpse into daily operations at Excellence Enterprise — from the animal pens to the water plant.</p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all',
                filter === f ? 'bg-primary text-primary-foreground shadow' : 'bg-muted/60 text-muted-foreground hover:bg-muted',
              )}
            >
              {f === 'all' ? 'All Photos' : f}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No photos in this category yet.</div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((item: any) => (
              <div
                key={item.id}
                className="break-inside-avoid cursor-pointer group relative rounded-xl overflow-hidden border border-border"
                onClick={() => setLightbox(item)}
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className={`w-full aspect-square bg-gradient-to-br ${GRADIENT_BG[item.category] ?? 'from-gray-600 to-gray-700'} flex flex-col items-center justify-center p-4`}>
                    <div className="text-white/30 mb-2">{CATEGORY_ICONS[item.category]}</div>
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-sm font-semibold leading-tight">{item.title}</p>
                    <p className="text-white/70 text-xs mt-0.5">{item.description}</p>
                  </div>
                </div>
                {/* Category badge */}
                <div className="absolute top-2 left-2">
                  <span className={cn('flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full', CATEGORY_COLORS[item.category])}>
                    {CATEGORY_ICONS[item.category]} {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X className="w-8 h-8" />
          </button>
          <div
            className="bg-card rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {lightbox.image_url ? (
              <img src={lightbox.image_url} alt={lightbox.title} className="w-full max-h-96 object-cover" />
            ) : (
              <div className={`w-full h-64 bg-gradient-to-br ${GRADIENT_BG[lightbox.category] ?? 'from-gray-600 to-gray-700'} flex items-center justify-center`}>
                <div className="text-white/30 scale-[3]">{CATEGORY_ICONS[lightbox.category]}</div>
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-xl font-bold text-foreground">{lightbox.title}</h2>
                <span className={cn('flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0', CATEGORY_COLORS[lightbox.category])}>
                  {CATEGORY_ICONS[lightbox.category]} {lightbox.category}
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">{lightbox.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{lightbox.created_at}</span>
                <span>By {lightbox.posted_by}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Excellence Enterprise Farm · Powered by EE360
      </footer>
    </div>
  );
}
