import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { BookOpen, Save, Plus, Trash2, Loader2 } from 'lucide-react';

interface AboutContent {
  hero_title: string; hero_subtitle: string; mission: string;
  founded: string; location: string;
  team: { name: string; role: string; bio: string }[];
  stats: { label: string; value: string }[];
}

export default function ContentManagePage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<AboutContent>({
    queryKey: ['about-content'],
    queryFn: () => api.get('/about-content').then(r => r.data),
  });

  const [form, setForm] = useState<AboutContent | null>(null);

  useEffect(() => { if (data && !form) setForm(data); }, [data]);

  const updateMut = useMutation({
    mutationFn: (body: AboutContent) => api.put('/about-content', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['about-content'] }); toast.success('About page updated'); },
    onError: () => toast.error('Failed to save'),
  });

  if (isLoading || !form) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  );

  const setField = (key: keyof AboutContent, val: any) => setForm(prev => prev ? { ...prev, [key]: val } : prev);

  const updateTeamMember = (i: number, field: string, val: string) =>
    setField('team', form.team.map((m, idx) => idx === i ? { ...m, [field]: val } : m));

  const updateStat = (i: number, field: string, val: string) =>
    setField('stats', form.stats.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); updateMut.mutate(form); };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">About Page Editor</h1>
          <p className="text-sm text-muted-foreground">Edit content shown on the public About page</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hero */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-foreground flex items-center gap-2">
            <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center text-xs font-bold">1</span>
            Hero Section
          </h2>
          <div className="space-y-1.5">
            <Label>Farm Name / Hero Title</Label>
            <Input value={form.hero_title} onChange={e => setField('hero_title', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Hero Subtitle</Label>
            <Textarea rows={2} value={form.hero_subtitle} onChange={e => setField('hero_subtitle', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Founded Year</Label>
              <Input value={form.founded} onChange={e => setField('founded', e.target.value)} placeholder="2019" />
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input value={form.location} onChange={e => setField('location', e.target.value)} placeholder="Awka, Anambra State" />
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-foreground flex items-center gap-2">
            <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center text-xs font-bold">2</span>
            Mission Statement
          </h2>
          <Textarea rows={4} value={form.mission} onChange={e => setField('mission', e.target.value)} />
        </div>

        {/* Stats */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center text-xs font-bold">3</span>
              Key Stats
            </h2>
            <Button type="button" size="sm" variant="outline" className="gap-1" onClick={() => setField('stats', [...form.stats, { label: '', value: '' }])}>
              <Plus className="w-3.5 h-3.5" /> Add Stat
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {form.stats.map((s, i) => (
              <div key={i} className="flex gap-2 items-center bg-muted/30 rounded-xl p-3">
                <div className="flex-1 space-y-1.5">
                  <Input placeholder="Value (e.g. 7+)" value={s.value} onChange={e => updateStat(i, 'value', e.target.value)} className="h-8 text-sm" />
                  <Input placeholder="Label (e.g. Animal Types)" value={s.label} onChange={e => updateStat(i, 'label', e.target.value)} className="h-8 text-sm" />
                </div>
                <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive" onClick={() => setField('stats', form.stats.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center text-xs font-bold">4</span>
              Leadership Team
            </h2>
            <Button type="button" size="sm" variant="outline" className="gap-1" onClick={() => setField('team', [...form.team, { name: '', role: '', bio: '' }])}>
              <Plus className="w-3.5 h-3.5" /> Add Member
            </Button>
          </div>
          <div className="space-y-4">
            {form.team.map((m, i) => (
              <div key={i} className="bg-muted/30 rounded-xl p-4 space-y-2.5 relative">
                <button type="button" className="absolute top-3 right-3 text-destructive hover:text-destructive/80" onClick={() => setField('team', form.team.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Name</Label>
                    <Input value={m.name} onChange={e => updateTeamMember(i, 'name', e.target.value)} placeholder="Full Name" className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Role / Title</Label>
                    <Input value={m.role} onChange={e => updateTeamMember(i, 'role', e.target.value)} placeholder="Farm Manager" className="h-8 text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Bio</Label>
                  <Textarea rows={2} value={m.bio} onChange={e => updateTeamMember(i, 'bio', e.target.value)} placeholder="Brief bio…" className="text-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" className="gap-2 px-8" disabled={updateMut.isPending}>
            {updateMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
