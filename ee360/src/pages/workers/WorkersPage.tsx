import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, Edit2, Users, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

const ROLES = ['farm manager', 'animal caretaker', 'crop worker', 'water operator', 'driver', 'security', 'cleaner', 'other'];
const STATUS_COLOR: Record<string, string> = {
  active: 'bg-green-100 text-green-800', inactive: 'bg-gray-100 text-gray-600', on_leave: 'bg-yellow-100 text-yellow-800',
};

interface Worker { id: number; name: string; role: string; phone: string; salary: number; hire_date: string; status: string; address: string; notes: string; }

function WorkerForm({ initial, onSave, onClose }: { initial?: Partial<Worker>; onSave: (d: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', role: 'animal caretaker', phone: '', salary: 0, hire_date: new Date().toISOString().split('T')[0], status: 'active', address: '', notes: '', ...initial });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1.5"><Label>Full Name *</Label><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Worker's full name" required /></div>
        <div className="space-y-1.5"><Label>Role</Label>
          <Select value={form.role} onValueChange={v => set('role', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5"><Label>Status</Label>
          <Select value={form.status} onValueChange={v => set('status', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="08012345678" /></div>
        <div className="space-y-1.5"><Label>Monthly Salary (₦)</Label><Input type="number" min={0} value={form.salary} onChange={e => set('salary', +e.target.value)} /></div>
        <div className="col-span-2 space-y-1.5"><Label>Hire Date</Label><Input type="date" value={form.hire_date} onChange={e => set('hire_date', e.target.value)} /></div>
        <div className="col-span-2 space-y-1.5"><Label>Address</Label><Input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Home address" /></div>
      </div>
      <div className="space-y-1.5"><Label>Notes</Label><Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} /></div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1">{initial?.id ? 'Update' : 'Add'} Worker</Button>
      </div>
    </form>
  );
}

export default function WorkersPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Worker | null>(null);
  const [search, setSearch] = useState('');

  const { data: workers = [], isLoading } = useQuery<Worker[]>({
    queryKey: ['workers'],
    queryFn: () => api.get('/workers').then(r => r.data),
  });

  const saveMut = useMutation({
    mutationFn: (d: any) => editing ? api.put(`/workers/${editing.id}`, d) : api.post('/workers', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['workers'] }); toast.success('Worker saved'); setOpen(false); setEditing(null); },
    onError: () => toast.error('Failed to save worker'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/workers/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['workers'] }); toast.success('Worker removed'); },
  });

  const filtered = workers.filter(w => !search || w.name.toLowerCase().includes(search.toLowerCase()) || w.role.toLowerCase().includes(search.toLowerCase()));
  const active = workers.filter(w => w.status === 'active').length;
  const totalSalary = workers.filter(w => w.status === 'active').reduce((s, w) => s + w.salary, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Workers</h2>
          <p className="text-muted-foreground text-sm">{workers.length} workers on record</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Add Worker</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Total Workers</p><p className="text-2xl font-bold">{workers.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Active</p><p className="text-2xl font-bold text-green-600">{active}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Monthly Payroll</p><p className="text-2xl font-bold text-destructive">{formatCurrency(totalSalary)}</p></CardContent></Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search workers…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Card key={i} className="animate-pulse h-40" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No workers found.</p>
          <Button variant="outline" className="mt-3" onClick={() => setOpen(true)}>Add first worker</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(w => (
            <Card key={w.id} className="hover:shadow-md hover:border-primary/30 transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {w.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{w.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{w.role}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLOR[w.status] ?? STATUS_COLOR.active}`}>{w.status.replace('_', ' ')}</span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground mb-3">
                  {w.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{w.phone}</div>}
                  <div className="flex justify-between">
                    <span>Hired: {formatDate(w.hire_date)}</span>
                    <span className="font-semibold text-foreground">₦{w.salary?.toLocaleString()}/mo</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditing(w); setOpen(true); }}><Edit2 className="w-3 h-3 mr-1" /> Edit</Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => { if (confirm('Remove this worker?')) deleteMut.mutate(w.id); }}><Trash2 className="w-3 h-3" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Worker</DialogTitle></DialogHeader>
          <WorkerForm initial={editing ?? undefined} onSave={d => saveMut.mutate(d)} onClose={() => { setOpen(false); setEditing(null); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
