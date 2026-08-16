import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, Edit2, Users, Phone, IdCard, Upload, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatCurrency, formatDate, getImageUrl } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

const ROLES = ['farm manager', 'animal caretaker', 'crop worker', 'water operator', 'driver', 'security', 'cleaner', 'other'];
const STATUS_COLOR: Record<string, string> = {
  active: 'bg-blue-100 text-blue-800', inactive: 'bg-gray-100 text-gray-600', on_leave: 'bg-yellow-100 text-yellow-800',
};

interface Worker { id: number; staff_id: string; name: string; photo?: string; role: string; phone: string; salary: number; hire_date: string; status: string; address: string; notes: string; }

function WorkerForm({ initial, onSave, onClose }: { initial?: Partial<Worker>; onSave: (d: FormData) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', role: 'animal caretaker', phone: '', salary: 0, hire_date: new Date().toISOString().split('T')[0], status: 'active', address: '', notes: '', ...initial });
  const [file, setFile] = useState<File | null>(null);
  
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== undefined && k !== 'photo') {
        fd.append(k, String(v));
      }
    });
    if (file) {
      fd.append('photo', file);
    }
    // If updating, Laravel requires _method=PUT when using FormData
    if (initial?.id) {
      fd.append('_method', 'PUT');
    }
    onSave(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center mb-4">
        <div className="relative w-24 h-24 rounded-full border-4 border-muted overflow-hidden bg-muted mb-2">
          {file ? (
            <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
          ) : initial?.photo ? (
            <img src={getImageUrl(initial.photo)} alt="Worker" className="w-full h-full object-cover" />
          ) : (
            <Users className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground opacity-50" />
          )}
          <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <Upload className="w-6 h-6 text-white" />
            <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
          </label>
        </div>
        <p className="text-xs text-muted-foreground">Upload worker photo</p>
      </div>

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

function IDCard({ worker }: { worker: Worker }) {
  const handlePrint = () => {
    // Basic window.print approach. We'll rely on CSS print styles to hide everything except the card.
    window.print();
  };

  return (
    <div className="flex flex-col items-center">
      <div id="print-section" className="w-[300px] h-[450px] relative bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col items-center border border-gray-100 print:shadow-none print:border-none" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Background Design */}
        <div className="absolute top-0 w-full h-32 bg-gradient-to-r from-blue-700 to-indigo-800" />
        <div className="absolute top-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        {/* Logo and Header */}
        <div className="z-10 mt-6 flex flex-col items-center text-white">
          <h2 className="text-xl font-black tracking-widest uppercase">EE360</h2>
          <p className="text-[10px] font-medium tracking-widest opacity-80 uppercase">Farm & Water Portal</p>
        </div>

        {/* Photo */}
        <div className="z-10 mt-6 w-32 h-32 bg-white rounded-full p-1 shadow-lg">
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-200">
            {worker.photo ? (
              <img src={getImageUrl(worker.photo)} className="w-full h-full object-cover" alt="ID" />
            ) : (
              <Users className="w-12 h-12 text-gray-400 mx-auto mt-10" />
            )}
          </div>
        </div>

        {/* Details */}
        <div className="z-10 mt-4 flex flex-col items-center text-center w-full px-6">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{worker.name}</h1>
          <p className="text-sm font-semibold text-blue-700 uppercase tracking-widest mt-1 mb-4">{worker.role}</p>
          
          <div className="w-full h-px bg-gray-200 mb-4" />
          
          <div className="flex w-full justify-between items-center text-xs text-gray-600 mb-2">
            <span className="font-medium text-gray-400 uppercase tracking-wider">ID Number</span>
            <span className="font-bold text-gray-900">{worker.staff_id || 'PENDING'}</span>
          </div>
          <div className="flex w-full justify-between items-center text-xs text-gray-600">
            <span className="font-medium text-gray-400 uppercase tracking-wider">Phone</span>
            <span className="font-bold text-gray-900">{worker.phone || 'N/A'}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 w-full bg-gray-900 py-3 text-center">
          <p className="text-[9px] text-gray-400 font-medium">Property of EE360 Farm & Water. If found, please return.</p>
        </div>
      </div>
      
      <Button onClick={() => handlePrint()} className="mt-6 gap-2 w-[300px]" variant="secondary">
        <Download className="w-4 h-4" /> Print ID Card
      </Button>
    </div>
  );
}

export default function WorkersPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Worker | null>(null);
  const [idCardOpen, setIdCardOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  
  const sectorId = user?.role === 'water_manager' ? 2 : user?.role === 'farm_manager' ? 1 : undefined;

  const { data: workers = [], isLoading } = useQuery<Worker[]>({
    queryKey: ['workers', sectorId],
    queryFn: () => api.get('/workers', { params: { sector_id: sectorId } }).then(r => r.data),
  });

  const saveMut = useMutation({
    mutationFn: (d: FormData) => {
      d.append('sector_id', String(sectorId || ''));
      // Using axios post for both because we use _method=PUT in the FormData for update
      return api.post(editing ? `/workers/${editing.id}` : '/workers', d, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['workers'] }); toast.success('Worker saved'); setOpen(false); setEditing(null); },
    onError: () => toast.error('Failed to save worker'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/workers/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['workers'] }); toast.success('Worker removed'); },
  });

  const filtered = workers.filter(w => !search || w.name.toLowerCase().includes(search.toLowerCase()) || w.role.toLowerCase().includes(search.toLowerCase()) || w.staff_id?.toLowerCase().includes(search.toLowerCase()));
  const active = workers.filter(w => w.status === 'active').length;
  const totalSalary = workers.filter(w => w.status === 'active').reduce((s, w) => s + Number(w.salary), 0);

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
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Active</p><p className="text-2xl font-bold text-blue-600">{active}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Monthly Payroll</p><p className="text-2xl font-bold text-destructive">{formatCurrency(totalSalary)}</p></CardContent></Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by name, ID or role…" value={search} onChange={e => setSearch(e.target.value)} />
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
            <Card key={w.id} className="hover:shadow-md hover:border-primary/30 transition-all overflow-hidden group">
              <CardContent className="p-0">
                <div className="p-5 border-b border-border/50 bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground font-bold shrink-0 overflow-hidden shadow-sm">
                        {w.photo ? <img src={getImageUrl(w.photo)} className="w-full h-full object-cover" alt="P" /> : w.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{w.name}</p>
                        <p className="text-xs text-muted-foreground capitalize font-medium">{w.role}</p>
                        <p className="text-[10px] text-primary/70 font-mono mt-0.5">{w.staff_id}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${STATUS_COLOR[w.status] ?? STATUS_COLOR.active}`}>{w.status.replace('_', ' ')}</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-muted-foreground mb-1">
                    {w.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{w.phone}</div>}
                    <div className="flex justify-between items-center bg-muted/40 p-2 rounded-lg mt-2">
                      <span className="font-medium">Hired: {formatDate(w.hire_date)}</span>
                      <span className="font-bold text-foreground">₦{w.salary?.toLocaleString()}/mo</span>
                    </div>
                  </div>
                </div>
                <div className="flex bg-muted/20">
                  <button onClick={() => { setSelectedWorker(w); setIdCardOpen(true); }} className="flex-1 py-2 text-xs font-medium hover:bg-muted/50 text-blue-600 border-r border-border/50 flex items-center justify-center gap-1.5 transition-colors">
                    <IdCard className="w-3.5 h-3.5" /> ID Card
                  </button>
                  <button onClick={() => { setEditing(w); setOpen(true); }} className="flex-1 py-2 text-xs font-medium hover:bg-muted/50 flex items-center justify-center gap-1.5 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => { if (confirm('Remove this worker?')) deleteMut.mutate(w.id); }} className="w-12 py-2 text-xs hover:bg-destructive/10 text-destructive flex items-center justify-center transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
      
      <Dialog open={idCardOpen} onOpenChange={setIdCardOpen}>
        <DialogContent className="max-w-md bg-muted/30 p-10 flex flex-col items-center">
          {selectedWorker && <IDCard worker={selectedWorker} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
