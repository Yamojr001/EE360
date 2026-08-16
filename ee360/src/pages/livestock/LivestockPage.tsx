import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Trash2, Bird, Settings2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/lib/api';
import { capitalize } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

const STATUS_OPTIONS = ['active', 'sick', 'sold', 'deceased'];

const STATUS_COLOR: Record<string, string> = {
  active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  sick: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  sold: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  deceased: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

interface Animal {
  id: number; tag_id: string; type: string; breed: string;
  age_months: number; quantity: number; status: string;
  purchase_price: number; current_value: number; notes: string;
}

interface AnimalCategory {
  id: number; name: string; type: string;
}

function CategoryManageDialog({ open, onClose, sectorId }: { open: boolean; onClose: () => void; sectorId?: number }) {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [type, setType] = useState('animal');

  const { data: categories = [], isLoading } = useQuery<AnimalCategory[]>({
    queryKey: ['animal-categories', sectorId],
    queryFn: () => api.get('/animal-categories', { params: { sector_id: sectorId } }).then(r => r.data),
    enabled: open,
  });

  const createMut = useMutation({
    mutationFn: (d: any) => api.post('/animal-categories', { ...d, sector_id: sectorId }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['animal-categories'] }); toast.success('Category added'); setName(''); },
    onError: () => toast.error('Failed to add category'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/animal-categories/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['animal-categories'] }); toast.success('Category removed'); },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Manage Categories</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <Label>Category Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Chicken, Egg, Milk" />
            </div>
            <div className="w-32 space-y-1">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="animal">Animal</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="plant">Plant / Crop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => name && createMut.mutate({ name, type })} disabled={!name || createMut.isPending}>Add</Button>
          </div>

          <div className="border rounded-md divide-y max-h-64 overflow-y-auto">
            {isLoading ? <div className="p-4 text-center text-sm">Loading...</div> : categories.length === 0 ? <div className="p-4 text-center text-sm text-muted-foreground">No categories defined.</div> : categories.map(c => (
              <div key={c.id} className="flex justify-between items-center p-3 text-sm">
                <div>
                  <span className="font-medium">{c.name}</span>
                  <span className="ml-2 text-[10px] uppercase bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{c.type}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => deleteMut.mutate(c.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AnimalForm({ initial, categories, onSave, onClose }: { initial?: Partial<Animal>; categories: AnimalCategory[]; onSave: (d: any) => void; onClose: () => void }) {
  const [form, setForm] = useState<any>({ type: categories.filter(c => c.type === 'animal')[0]?.name || '', tag_id: '', breed: '', age_months: '', quantity: '', status: 'active', purchase_price: '', current_value: '', notes: '', ...initial });
  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));
  
  const animalCategories = categories.filter(c => c.type === 'animal');

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Animal Type *</Label>
          <Select value={form.type} onValueChange={v => set('type', v)}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {animalCategories.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Status *</Label>
          <Select value={form.status} onValueChange={v => set('status', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{capitalize(s)}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Tag / ID</Label>
          <Input value={form.tag_id} onChange={e => set('tag_id', e.target.value)} placeholder="e.g. HEN-001" />
        </div>
        <div className="space-y-1.5">
          <Label>Breed</Label>
          <Input value={form.breed} onChange={e => set('breed', e.target.value)} placeholder="e.g. Leghorn" />
        </div>
        <div className="space-y-1.5">
          <Label>Quantity</Label>
          <Input type="number" min={1} value={form.quantity} onChange={e => set('quantity', e.target.value === '' ? '' : +e.target.value)} placeholder="1" />
        </div>
        <div className="space-y-1.5">
          <Label>Age (months)</Label>
          <Input type="number" min={0} value={form.age_months} onChange={e => set('age_months', e.target.value === '' ? '' : +e.target.value)} placeholder="0" />
        </div>
        <div className="space-y-1.5">
          <Label>Purchase Price (₦)</Label>
          <Input type="number" min={0} value={form.purchase_price} onChange={e => set('purchase_price', e.target.value === '' ? '' : +e.target.value)} placeholder="0" />
        </div>
        <div className="space-y-1.5">
          <Label>Current Value (₦)</Label>
          <Input type="number" min={0} value={form.current_value} onChange={e => set('current_value', e.target.value === '' ? '' : +e.target.value)} placeholder="0" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Notes</Label>
        <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional notes…" rows={2} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={!form.type}>{initial?.id ? 'Update' : 'Add'} Animal</Button>
      </div>
    </form>
  );
}

export default function LivestockPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const sectorId = user?.role === 'water_manager' ? 2 : user?.role === 'farm_manager' ? 1 : undefined;

  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [editing, setEditing] = useState<Animal | null>(null);

  const { data: categories = [] } = useQuery<AnimalCategory[]>({
    queryKey: ['animal-categories', sectorId],
    queryFn: () => api.get('/animal-categories', { params: { sector_id: sectorId } }).then(r => r.data),
  });

  const { data: animals = [], isLoading } = useQuery<Animal[]>({
    queryKey: ['livestock', sectorId],
    queryFn: () => api.get('/livestock', { params: { sector_id: sectorId } }).then(r => r.data),
  });

  const createMut = useMutation({
    mutationFn: (d: any) => {
      const payload = { ...d, sector_id: sectorId };
      return editing ? api.put(`/livestock/${editing.id}`, payload) : api.post('/livestock', payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['livestock'] }); toast.success(editing ? 'Animal updated' : 'Animal added'); setOpen(false); setEditing(null); },
    onError: () => toast.error('Failed to save animal'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/livestock/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['livestock'] }); toast.success('Animal removed'); },
    onError: () => toast.error('Failed to delete'),
  });

  const animalCategories = categories.filter(c => c.type === 'animal');
  const categoryNames = ['all', ...animalCategories.map(c => c.name)];

  const filtered = animals.filter(a => {
    const matchTab = tab === 'all' || a.type === tab;
    const matchSearch = !search || a.tag_id.toLowerCase().includes(search.toLowerCase()) || a.breed.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = categoryNames.reduce((acc, t) => {
    acc[t] = t === 'all' ? animals.length : animals.filter(a => a.type === t).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Livestock</h2>
          <p className="text-muted-foreground text-sm">{animals.length} animals on record</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setManageOpen(true)}>
            <Settings2 className="w-4 h-4 mr-2" /> Categories
          </Button>
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Animal
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex items-center gap-3 flex-wrap">
          <TabsList className="flex-wrap h-auto gap-1">
            {categoryNames.map(t => (
              <TabsTrigger key={t} value={t} className="gap-1">
                {capitalize(t)}
                <span className="text-xs opacity-60 ml-0.5">({counts[t] || 0})</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="relative ml-auto flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9 w-full" placeholder="Search tag, breed…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {categoryNames.map(t => (
          <TabsContent key={t} value={t} className="mt-4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <Card key={i} className="animate-pulse h-40" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Bird className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No animals found{search ? ' for that search' : ''}.</p>
                <Button variant="outline" className="mt-3" onClick={() => { setEditing(null); setOpen(true); }}>Add your first animal</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(a => (
                  <Card key={a.id} className="hover:shadow-md hover:border-primary/30 transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-semibold text-sm">{a.tag_id || capitalize(a.type)}</p>
                            <p className="text-xs text-muted-foreground">{a.breed}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[a.status] || STATUS_COLOR.active}`}>{a.status}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-1 text-xs text-muted-foreground mb-3">
                        <span>Qty: <strong className="text-foreground">{a.quantity}</strong></span>
                        <span>Age: <strong className="text-foreground">{a.age_months}mo</strong></span>
                        <span>Value: <strong className="text-foreground">₦{a.current_value?.toLocaleString()}</strong></span>
                        <span>Cost: <strong className="text-foreground">₦{a.purchase_price?.toLocaleString()}</strong></span>
                      </div>
                      {a.notes && <p className="text-xs text-muted-foreground italic mb-3 line-clamp-2">{a.notes}</p>}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditing(a); setOpen(true); }}>
                          <Edit2 className="w-3 h-3 mr-1" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => { if (confirm('Remove this animal?')) deleteMut.mutate(a.id); }}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Animal' : 'Add New Animal'}</DialogTitle>
          </DialogHeader>
          <AnimalForm initial={editing ?? undefined} categories={categories} onSave={d => createMut.mutate(d)} onClose={() => { setOpen(false); setEditing(null); }} />
        </DialogContent>
      </Dialog>
      
      <CategoryManageDialog open={manageOpen} onClose={() => setManageOpen(false)} sectorId={sectorId} />
    </div>
  );
}
