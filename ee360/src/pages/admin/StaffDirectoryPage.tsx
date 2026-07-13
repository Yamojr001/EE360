import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, UserCog, Search, Users, Bird, Droplets } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

const SECTORS    = ['farm','water'];
const STATUSES   = ['active','on_leave','terminated'];

interface Worker {
  id: number; name: string; role_title: string; phone: string;
  salary: number; hire_date: string; status: string; sector: string;
  address: string; notes: string;
}

const EMPTY: Omit<Worker,'id'> = {
  name:'', role_title:'', phone:'', salary:0, hire_date:'', status:'active', sector:'farm', address:'', notes:'',
};

const STATUS_COLOR: Record<string,string> = {
  active:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  on_leave:   'bg-amber-100   text-amber-700   dark:bg-amber-950   dark:text-amber-300',
  terminated: 'bg-red-100     text-red-700     dark:bg-red-950     dark:text-red-300',
};

export default function StaffDirectoryPage() {
  const qc = useQueryClient();
  const [open, setOpen]       = useState(false);
  const [editing, setEditing] = useState<Worker | null>(null);
  const [form, setForm]       = useState<Omit<Worker,'id'>>({ ...EMPTY });
  const [search, setSearch]   = useState('');
  const [sectorFilter, setSectorFilter] = useState<'all'|'farm'|'water'>('all');

  const { data: workers = [], isLoading } = useQuery<Worker[]>({
    queryKey: ['all-workers'],
    queryFn: () => api.get('/workers').then(r => r.data),
  });

  const createMut = useMutation({
    mutationFn: (body: any) => api.post('/workers', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['all-workers'] }); toast.success('Staff member added'); closeDialog(); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: number; body: any }) => api.put(`/workers/${id}`, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['all-workers'] }); toast.success('Updated'); closeDialog(); },
  });
  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/workers/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['all-workers'] }); toast.success('Removed'); },
  });

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setOpen(true); };
  const openEdit   = (w: Worker) => { setEditing(w); setForm({ name: w.name, role_title: w.role_title, phone: w.phone, salary: w.salary, hire_date: w.hire_date, status: w.status, sector: w.sector, address: w.address, notes: w.notes }); setOpen(true); };
  const closeDialog = () => { setOpen(false); setEditing(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) updateMut.mutate({ id: editing.id, body: form });
    else createMut.mutate(form);
  };

  const filtered = workers
    .filter(w => sectorFilter === 'all' || w.sector === sectorFilter)
    .filter(w => !search || w.name.toLowerCase().includes(search.toLowerCase()) || w.role_title.toLowerCase().includes(search.toLowerCase()));

  const farmCount  = workers.filter(w => w.sector === 'farm'  && w.status === 'active').length;
  const waterCount = workers.filter(w => w.sector === 'water' && w.status === 'active').length;
  const totalPayroll = workers.filter(w => w.status === 'active').reduce((a, w) => a + Number(w.salary), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <UserCog className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Staff Directory</h1>
            <p className="text-sm text-muted-foreground">All staff across both sectors — view-only for non-admins</p>
          </div>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" />Add Staff</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Staff',     value: workers.length,             icon: <Users className="w-4 h-4" />,   color: 'bg-card' },
          { label: 'Farm Workers',    value: farmCount,                  icon: <Bird className="w-4 h-4" />,    color: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900' },
          { label: 'Water Workers',   value: waterCount,                 icon: <Droplets className="w-4 h-4" />,color: 'bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-900' },
          { label: 'Monthly Payroll', value: formatCurrency(totalPayroll),icon: <UserCog className="w-4 h-4" />,color: 'bg-card' },
        ].map(s => (
          <div key={s.label} className={cn('border rounded-xl p-4', s.color)}>
            <div className="flex items-center gap-2 text-muted-foreground mb-1.5">{s.icon}<span className="text-xs">{s.label}</span></div>
            <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or role…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {(['all','farm','water'] as const).map(f => (
            <button
              key={f}
              onClick={() => setSectorFilter(f)}
              className={cn('px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors',
                sectorFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted/60 text-muted-foreground hover:bg-muted')}
            >
              {f === 'all' ? 'All Sectors' : `${f} Sector`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                {['Name','Role','Sector','Phone','Salary','Status','Since'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-4 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No staff found</td></tr>
              ) : filtered.map(w => (
                <tr key={w.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {w.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{w.name}</p>
                        <p className="text-xs text-muted-foreground">{w.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{w.role_title}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full capitalize',
                      w.sector === 'farm' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                          : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300'
                    )}>{w.sector}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{w.phone}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{formatCurrency(w.salary)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full capitalize', STATUS_COLOR[w.status])}>
                      {w.status.replace('_',' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{w.hire_date}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(w)}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => deleteMut.mutate(w.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label>Full Name *</Label>
                <Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Chukwuemeka Obi" />
              </div>
              <div className="space-y-1.5">
                <Label>Job Title *</Label>
                <Input required value={form.role_title} onChange={e => setForm({...form, role_title: e.target.value})} placeholder="Animal Caretaker" />
              </div>
              <div className="space-y-1.5">
                <Label>Sector *</Label>
                <Select value={form.sector} onValueChange={v => setForm({...form, sector: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SECTORS.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="08012345678" />
              </div>
              <div className="space-y-1.5">
                <Label>Monthly Salary (₦)</Label>
                <Input type="number" value={form.salary || ''} onChange={e => setForm({...form, salary: +e.target.value})} placeholder="40000" />
              </div>
              <div className="space-y-1.5">
                <Label>Hire Date</Label>
                <Input type="date" value={form.hire_date} onChange={e => setForm({...form, hire_date: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm({...form, status: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace('_',' ')}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Address / Location</Label>
                <Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Awka" />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-1">
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button type="submit">{editing ? 'Save Changes' : 'Add Staff'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
