import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Search, Edit2, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

interface AnimalCategory {
  id: number; name: string; type: string;
}

interface FarmProduction {
  id: number;
  date: string;
  category_id?: number;
  item_name?: string;
  quantity: number;
  unit?: string;
  notes?: string;
  sector_id: number;
  category?: AnimalCategory;
}

function ProductionForm({ initial, categories, onSave, onClose }: { initial?: Partial<FarmProduction>; categories: AnimalCategory[]; onSave: (d: any) => void; onClose: () => void }) {
  const [form, setForm] = useState<any>({
    date: initial?.date || new Date().toISOString().split('T')[0],
    category_id: initial?.category_id || (categories.length > 0 ? categories[0].id : ''),
    quantity: initial?.quantity || '',
    unit: initial?.unit || '',
    notes: initial?.notes || '',
  });

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5 col-span-2">
          <Label>Date *</Label>
          <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
        </div>
        <div className="space-y-1.5 col-span-2">
          <Label>Product Category *</Label>
          <Select value={form.category_id ? String(form.category_id) : ''} onValueChange={v => set('category_id', Number(v))}>
            <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Quantity *</Label>
          <Input type="number" min={0} step="0.01" value={form.quantity} onChange={e => set('quantity', e.target.value === '' ? '' : +e.target.value)} placeholder="0" required />
        </div>
        <div className="space-y-1.5">
          <Label>Unit</Label>
          <Select value={form.unit} onValueChange={v => set('unit', v)}>
            <SelectTrigger><SelectValue placeholder="e.g. crates, pieces" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pieces">Pieces</SelectItem>
              <SelectItem value="crates">Crates</SelectItem>
              <SelectItem value="trays">Trays</SelectItem>
              <SelectItem value="baskets">Baskets</SelectItem>
              <SelectItem value="bags">Bags</SelectItem>
              <SelectItem value="bunches">Bunches</SelectItem>
              <SelectItem value="buckets">Buckets</SelectItem>
              <SelectItem value="liters">Liters</SelectItem>
              <SelectItem value="kg">Kg</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Notes</Label>
        <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any notes…" rows={2} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1">{initial?.id ? 'Update' : 'Log'} Production</Button>
      </div>
    </form>
  );
}

export default function FarmProductionPage() {
  const qc = useQueryClient();
  const { user, isSuperAdmin } = useAuth();
  const sectorId = 1; // Only for Farm Sector

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FarmProduction | null>(null);

  const { data: categories = [] } = useQuery<AnimalCategory[]>({
    queryKey: ['animal-categories', sectorId],
    queryFn: () => api.get('/animal-categories', { params: { sector_id: sectorId } }).then(r => r.data),
  });
  
  const productCategories = categories.filter(c => c.type === 'product' || c.type === 'plant' || c.type === 'crop');

  const { data: productions = [], isLoading } = useQuery<FarmProduction[]>({
    queryKey: ['farm-production', sectorId],
    queryFn: () => api.get('/farm-production', { params: { sector_id: sectorId } }).then(r => r.data),
  });

  const createMut = useMutation({
    mutationFn: (d: any) => {
      const payload = { ...d, sector_id: sectorId };
      const cat = productCategories.find(c => c.id === d.category_id);
      if (cat) payload.item_name = cat.name;
      return editing ? api.put(`/farm-production/${editing.id}`, payload) : api.post('/farm-production', payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['farm-production'] }); toast.success(editing ? 'Production updated' : 'Production logged'); setOpen(false); setEditing(null); },
    onError: () => toast.error('Failed to save production'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/farm-production/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['farm-production'] }); toast.success('Production removed'); },
  });

  const filtered = productions.filter(p => {
    if (!search) return true;
    const name = (p.category?.name || p.item_name || '').toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Daily Production
          </h2>
          <p className="text-muted-foreground text-sm">Log daily eggs, milk, and other farm yields</p>
        </div>
        
          <Button onClick={() => { setEditing(null); setOpen(true); }} className="font-bold bg-emerald-800 hover:bg-emerald-900 text-white">
            <Plus className="w-4 h-4 mr-2" /> Log Production
          </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9 w-full" placeholder="Search product…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Quantity</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Notes</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      <td colSpan={5} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded w-full" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-muted-foreground">
                      <Layers className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      No production logged yet.
                    </td>
                  </tr>
                ) : filtered.map(p => (
                  <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(p.date)}</td>
                    <td className="px-4 py-3 font-semibold">{p.category?.name || p.item_name || '—'}</td>
                    <td className="px-4 py-3 font-bold text-primary">{p.quantity} <span className="text-xs text-muted-foreground font-normal">{p.unit}</span></td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{p.notes || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => { setEditing(p); setOpen(true); }} className="text-muted-foreground hover:text-foreground">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => { if (confirm('Delete this record?')) deleteMut.mutate(p.id); }} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Production' : 'Log Daily Production'}</DialogTitle>
          </DialogHeader>
          <ProductionForm 
            initial={editing ?? undefined} 
            categories={productCategories} 
            onSave={d => createMut.mutate(d)} 
            onClose={() => { setOpen(false); setEditing(null); }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
