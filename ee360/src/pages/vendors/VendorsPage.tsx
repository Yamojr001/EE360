import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, Edit2, Store, Phone, Mail, MapPin } from 'lucide-react';
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
import { useAuth } from '@/contexts/auth-context';

const TYPES = ['vendor', 'supplier', 'both'];

interface Vendor { id: number; name: string; type: string; contact_person: string; phone: string; email: string; address: string; notes: string; sector_id?: number | null; }

function VendorForm({ initial, onSave, onClose }: { initial?: Partial<Vendor>; onSave: (d: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', type: 'supplier', contact_person: '', phone: '', email: '', address: '', notes: '', ...initial });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1.5"><Label>Company / Vendor Name *</Label><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Agro Supplies Ltd" required /></div>
        <div className="col-span-2 sm:col-span-1 space-y-1.5"><Label>Type</Label>
          <Select value={form.type} onValueChange={v => set('type', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="supplier">Supplier (We buy from them)</SelectItem>
              <SelectItem value="vendor">Vendor (We sell to them)</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 sm:col-span-1 space-y-1.5"><Label>Contact Person</Label><Input value={form.contact_person} onChange={e => set('contact_person', e.target.value)} placeholder="John Doe" /></div>
        <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="08012345678" /></div>
        <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="contact@example.com" /></div>
        <div className="col-span-2 space-y-1.5"><Label>Address</Label><Input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Full physical address" /></div>
      </div>
      <div className="space-y-1.5"><Label>Notes</Label><Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} placeholder="Any specific agreements or notes..." /></div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1">{initial?.id ? 'Update' : 'Add'} Record</Button>
      </div>
    </form>
  );
}

export default function VendorsPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [search, setSearch] = useState('');
  
  const sectorId = user?.role === 'water_manager' ? 2 : user?.role === 'farm_manager' ? 1 : undefined;

  const { data: vendors = [], isLoading } = useQuery<Vendor[]>({
    queryKey: ['vendors', sectorId],
    queryFn: () => api.get('/vendors', { params: { sector_id: sectorId } }).then(r => r.data),
  });

  const saveMut = useMutation({
    mutationFn: (d: any) => {
      const payload = { ...d, sector_id: sectorId };
      return editing ? api.put(`/vendors/${editing.id}`, payload) : api.post('/vendors', payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vendors'] }); toast.success('Vendor/Supplier saved'); setOpen(false); setEditing(null); },
    onError: () => toast.error('Failed to save vendor'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/vendors/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vendors'] }); toast.success('Record removed'); },
  });

  const filtered = vendors.filter(v => !search || v.name.toLowerCase().includes(search.toLowerCase()) || (v.contact_person && v.contact_person.toLowerCase().includes(search.toLowerCase())));
  const suppliersCount = vendors.filter(v => v.type === 'supplier' || v.type === 'both').length;
  const vendorsCount = vendors.filter(v => v.type === 'vendor' || v.type === 'both').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vendors & Suppliers</h2>
          <p className="text-muted-foreground text-sm">Manage business contacts and supply chains</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Add New</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Total Records</p><p className="text-2xl font-bold">{vendors.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Suppliers</p><p className="text-2xl font-bold text-blue-600">{suppliersCount}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Buyers/Vendors</p><p className="text-2xl font-bold text-green-600">{vendorsCount}</p></CardContent></Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by name or contact..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Card key={i} className="animate-pulse h-40" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Store className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No vendors or suppliers found.</p>
          <Button variant="outline" className="mt-3" onClick={() => setOpen(true)}>Add your first record</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(v => (
            <Card key={v.id} className="hover:shadow-md hover:border-primary/30 transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {v.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm line-clamp-1">{v.name}</p>
                      <Badge variant="outline" className="text-[10px] uppercase mt-1">
                        {v.type === 'both' ? 'Vendor & Supplier' : v.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs text-muted-foreground mb-4 pt-2 border-t border-border/50">
                  {v.contact_person && <p className="font-medium text-foreground">Attn: {v.contact_person}</p>}
                  {v.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{v.phone}</div>}
                  {v.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{v.email}</div>}
                  {v.address && <div className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" /><span className="line-clamp-2">{v.address}</span></div>}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditing(v); setOpen(true); }}><Edit2 className="w-3 h-3 mr-1" /> Edit</Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => { if (confirm('Delete this record?')) deleteMut.mutate(v.id); }}><Trash2 className="w-3 h-3" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Vendor / Supplier</DialogTitle></DialogHeader>
          <VendorForm initial={editing ?? undefined} onSave={d => saveMut.mutate(d)} onClose={() => { setOpen(false); setEditing(null); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
