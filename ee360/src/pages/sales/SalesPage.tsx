import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, TrendingUp, ShoppingCart, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const CATEGORIES = ['livestock', 'eggs', 'crops', 'water', 'feed', 'other'];
const CAT_COLOR: Record<string, string> = {
  livestock: 'bg-green-100 text-green-800', eggs: 'bg-yellow-100 text-yellow-800',
  crops: 'bg-orange-100 text-orange-800', water: 'bg-blue-100 text-blue-800',
  feed: 'bg-purple-100 text-purple-800', other: 'bg-gray-100 text-gray-800',
};

interface Sale { id: number; date: string; category: string; item: string; quantity: number; unit: string; unit_price: number; total_amount: number; buyer: string; notes: string; payment_method: string; payment_status: string; }

function SaleForm({ onSave, onClose }: { onSave: (d: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], category: 'livestock', item: '', quantity: 1, unit: 'unit', unit_price: 0, total_amount: 0, buyer: '', notes: '', payment_method: 'Cash', payment_status: 'Paid' });
  const set = (k: string, v: any) => setForm(p => {
    const next = { ...p, [k]: v };
    if (k === 'quantity' || k === 'unit_price') next.total_amount = next.quantity * next.unit_price;
    return next;
  });

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Date *</Label>
          <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Category *</Label>
          <Select value={form.category} onValueChange={v => set('category', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Item Description *</Label>
          <Input value={form.item} onChange={e => set('item', e.target.value)} placeholder="e.g. Broiler chickens" required />
        </div>
        <div className="space-y-1.5">
          <Label>Quantity</Label>
          <Input type="number" min={1} value={form.quantity} onChange={e => set('quantity', +e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Unit</Label>
          <Input value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="e.g. kg, birds, bags" />
        </div>
        <div className="space-y-1.5">
          <Label>Unit Price (₦)</Label>
          <Input type="number" min={0} value={form.unit_price} onChange={e => set('unit_price', +e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Total Amount (₦)</Label>
          <Input type="number" min={0} value={form.total_amount} onChange={e => set('total_amount', +e.target.value)} className="font-semibold" />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Buyer Name</Label>
          <Input value={form.buyer} onChange={e => set('buyer', e.target.value)} placeholder="Customer name" />
        </div>
        <div className="space-y-1.5">
          <Label>Payment Method</Label>
          <Select value={form.payment_method} onValueChange={v => set('payment_method', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Transfer">Transfer</SelectItem>
              <SelectItem value="POS">POS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Payment Status</Label>
          <Select value={form.payment_status} onValueChange={v => set('payment_status', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Credit">Credit (Unpaid)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Notes</Label>
        <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} placeholder="Optional notes…" />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1">Record Sale</Button>
      </div>
    </form>
  );
}

export default function SalesPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const { data: sales = [], isLoading } = useQuery<Sale[]>({
    queryKey: ['sales'],
    queryFn: () => api.get('/sales').then(r => r.data),
  });

  const createMut = useMutation({
    mutationFn: (d: any) => api.post('/sales', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sales'] }); toast.success('Sale recorded!'); setOpen(false); },
    onError: () => toast.error('Failed to record sale'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/sales/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sales'] }); toast.success('Sale deleted'); },
  });

  const filtered = sales.filter(s => {
    const matchCat = catFilter === 'all' || s.category === catFilter;
    const matchSearch = !search || s.item.toLowerCase().includes(search.toLowerCase()) || s.buyer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const total = filtered.reduce((sum, s) => sum + Number(s.total_amount), 0);
  const thisMonth = sales.filter(s => new Date(s.date).getMonth() === new Date().getMonth()).reduce((sum, s) => sum + Number(s.total_amount), 0);
  
  const cashTotal = filtered.filter(s => s.payment_method === 'Cash').reduce((sum, s) => sum + Number(s.total_amount), 0);
  const transferTotal = filtered.filter(s => s.payment_method === 'Transfer').reduce((sum, s) => sum + Number(s.total_amount), 0);
  const posTotal = filtered.filter(s => s.payment_method === 'POS').reduce((sum, s) => sum + Number(s.total_amount), 0);
  const creditTotal = filtered.filter(s => s.payment_status === 'Credit').reduce((sum, s) => sum + Number(s.total_amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sales</h2>
          <p className="text-muted-foreground text-sm">{sales.length} transactions on record</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" /> Record Sale</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs mb-1">Total Revenue</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs mb-1">Cash / Transfer / POS</p>
            <p className="text-sm font-bold mt-1 text-muted-foreground">
              {formatCurrency(cashTotal)} / {formatCurrency(transferTotal)} / {formatCurrency(posTotal)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs mb-1">On Credit (Unpaid)</p>
            <p className="text-xl font-bold text-orange-500">{formatCurrency(creditTotal)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs mb-1">Transactions</p>
            <p className="text-xl font-bold">{filtered.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search item or buyer…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-40"><Filter className="w-3.5 h-3.5 mr-1.5" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {['Date', 'Category', 'Item', 'Qty', 'Total', 'Buyer', 'Payment', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {[...Array(8)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded" /></td>)}
                  </tr>
                )) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">
                    <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    No sales found
                  </td></tr>
                ) : filtered.map(s => (
                  <tr key={s.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(s.date)}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${CAT_COLOR[s.category] ?? CAT_COLOR.other}`}>{s.category}</span></td>
                    <td className="px-4 py-3 font-medium">{s.item}</td>
                    <td className="px-4 py-3">{s.quantity} {s.unit}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">{formatCurrency(s.total_amount)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.buyer || '—'}</td>
                    <td className="px-4 py-3 text-xs">{s.payment_method || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.payment_status === 'Credit' ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {s.payment_status || 'Paid'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => { if (confirm('Delete this sale?')) deleteMut.mutate(s.id); }} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Record New Sale</DialogTitle></DialogHeader>
          <SaleForm onSave={d => createMut.mutate(d)} onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
