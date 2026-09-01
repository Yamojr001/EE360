import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, Edit2, Users, MapPin, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';

interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  sector_id: number;
}

export default function CustomersPage() {
  const qc = useQueryClient();
  const { user, isSuperAdmin } = useAuth();
  const sectorId = user?.role === 'water_manager' ? 2 : user?.role === 'farm_manager' ? 1 : undefined;

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ['customers', sectorId],
    queryFn: () => api.get('/customers', { params: { sector_id: sectorId } }).then(r => r.data),
  });

  const createMut = useMutation({
    mutationFn: (d: any) => editing ? api.put(`/customers/${editing.id}`, d) : api.post('/customers', { ...d, sector_id: sectorId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
      toast.success(editing ? 'Customer updated' : 'Customer added');
      setOpen(false);
      setEditing(null);
    },
    onError: () => toast.error('Failed to save customer'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/customers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted');
    },
  });

  const openForm = (c?: Customer) => {
    if (c) {
      setEditing(c);
      setForm({ name: c.name, phone: c.phone || '', address: c.address || '' });
    } else {
      setEditing(null);
      setForm({ name: '', phone: '', address: '' });
    }
    setOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    createMut.mutate(form);
  };

  const filtered = customers.filter(c => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(s) ||
      (c.phone || '').toLowerCase().includes(s) ||
      (c.address || '').toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Regular Customers
            {isSuperAdmin && <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">Admin View Only</span>}
          </h2>
          <p className="text-muted-foreground text-sm">Manage customer profiles, contacts and addresses</p>
        </div>
        {!isSuperAdmin && <Button onClick={() => openForm()} className="font-bold bg-emerald-800 hover:bg-emerald-900 text-white"><Plus className="w-4 h-4 mr-2" /> Add Customer</Button>}
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9 w-full" placeholder="Search by name, phone or address…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Address</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground w-20"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      <td colSpan={4} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded w-full" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-muted-foreground">
                      <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      No customers found.
                    </td>
                  </tr>
                ) : filtered.map(c => (
                  <tr key={c.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          {c.phone}
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs">
                      {c.address ? (
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{c.address}</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {!isSuperAdmin && (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => openForm(c)} className="text-muted-foreground hover:text-foreground">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => { if (confirm('Delete this customer?')) deleteMut.mutate(c.id); }} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label>Customer Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Musa Abubakar" required />
            </div>
            <div className="space-y-1.5">
              <Label>Phone Number (Optional)</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="e.g. 08012345678" />
            </div>
            <div className="space-y-1.5">
              <Label>Address (Optional)</Label>
              <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="e.g. No. 12 Katsina Rd, Kano" />
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMut.isPending || !form.name.trim()}>{editing ? 'Update' : 'Save'} Customer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
