import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, Edit2, Egg } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

interface HatcheryRecord {
  id: number;
  date: string;
  batch_number: string;
  animal_type: string;
  eggs_set: number;
  eggs_hatched: number;
  mortality: number;
  notes: string;
}

export default function HatcheryPage() {
  const qc = useQueryClient();
  const { user, isSuperAdmin } = useAuth();
  const sectorId = user?.role === 'water_manager' ? 2 : user?.role === 'farm_manager' ? 1 : undefined;

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<HatcheryRecord | null>(null);

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    batch_number: '',
    animal_type: '',
    eggs_set: '',
    eggs_hatched: '',
    mortality: '',
    notes: ''
  });

  const { data: records = [], isLoading } = useQuery<HatcheryRecord[]>({
    queryKey: ['hatchery', sectorId],
    queryFn: () => api.get('/hatchery', { params: { sector_id: sectorId } }).then(r => r.data),
  });

  const createMut = useMutation({
    mutationFn: (d: any) => editing ? api.put(`/hatchery/${editing.id}`, d) : api.post('/hatchery', { ...d, sector_id: sectorId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hatchery'] });
      toast.success(editing ? 'Record updated' : 'Record added');
      setOpen(false);
      setEditing(null);
    },
    onError: () => toast.error('Failed to save record'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/hatchery/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hatchery'] });
      toast.success('Record deleted');
    },
  });

  const openForm = (r?: HatcheryRecord) => {
    if (r) {
      setEditing(r);
      setForm({
        date: r.date,
        batch_number: r.batch_number || '',
        animal_type: r.animal_type || '',
        eggs_set: r.eggs_set.toString(),
        eggs_hatched: r.eggs_hatched.toString(),
        mortality: r.mortality.toString(),
        notes: r.notes || ''
      });
    } else {
      setEditing(null);
      setForm({
        date: new Date().toISOString().split('T')[0],
        batch_number: '',
        animal_type: '',
        eggs_set: '',
        eggs_hatched: '',
        mortality: '',
        notes: ''
      });
    }
    setOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    createMut.mutate({
      ...form,
      eggs_set: Number(form.eggs_set),
      eggs_hatched: Number(form.eggs_hatched),
      mortality: Number(form.mortality)
    });
  };

  const filtered = records.filter(r => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (r.batch_number || '').toLowerCase().includes(s) || (r.animal_type || '').toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Hatchery Records
            {isSuperAdmin && <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">Admin View Only</span>}
          </h2>
          <p className="text-muted-foreground text-sm">Manage hatch batches and incubation success rates</p>
        </div>
        {!isSuperAdmin && <Button onClick={() => openForm()} className="font-bold bg-emerald-800 hover:bg-emerald-900 text-white"><Plus className="w-4 h-4 mr-2" /> Add Record</Button>}
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9 w-full" placeholder="Search by batch or type…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Batch #</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Animal Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Eggs Set</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Hatched</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Mortality</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Hatch Rate</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      <td colSpan={8} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded w-full" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-muted-foreground">
                      <Egg className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      No hatchery records found.
                    </td>
                  </tr>
                ) : filtered.map(r => {
                  const hatchRate = r.eggs_set > 0 ? ((r.eggs_hatched / r.eggs_set) * 100).toFixed(1) : '0.0';
                  return (
                    <tr key={r.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(r.date)}</td>
                      <td className="px-4 py-3 font-medium">{r.batch_number || '—'}</td>
                      <td className="px-4 py-3">{r.animal_type}</td>
                      <td className="px-4 py-3">{r.eggs_set}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-600">{r.eggs_hatched}</td>
                      <td className="px-4 py-3 text-red-500">{r.mortality}</td>
                      <td className="px-4 py-3 font-medium">{hatchRate}%</td>
                      <td className="px-4 py-3">
                        {!isSuperAdmin && (
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => openForm(r)} className="text-muted-foreground hover:text-foreground">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => { if (confirm('Delete this record?')) deleteMut.mutate(r.id); }} className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Hatchery Record' : 'Add Hatchery Record'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Date *</Label>
                <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label>Batch Number</Label>
                <Input value={form.batch_number} onChange={e => setForm({ ...form, batch_number: e.target.value })} placeholder="e.g. BATCH-001" />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Animal Type *</Label>
                <Input value={form.animal_type} onChange={e => setForm({ ...form, animal_type: e.target.value })} placeholder="e.g. Broiler, Catfish" required />
              </div>
              <div className="space-y-1.5">
                <Label>Eggs / Seeds Set *</Label>
                <Input type="number" min="0" value={form.eggs_set} onChange={e => setForm({ ...form, eggs_set: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label>Successfully Hatched *</Label>
                <Input type="number" min="0" value={form.eggs_hatched} onChange={e => setForm({ ...form, eggs_hatched: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label>Mortality *</Label>
                <Input type="number" min="0" value={form.mortality} onChange={e => setForm({ ...form, mortality: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMut.isPending}>{editing ? 'Update' : 'Save'} Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
