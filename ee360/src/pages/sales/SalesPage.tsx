import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, ShoppingCart, Filter, Printer, CheckCircle, Clock, FileMinus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { printReceipt } from '@/lib/printReceipt';
import { useAuth } from '@/contexts/auth-context';
import { CustomerCombobox } from '@/components/ui/customer-combobox';

const CAT_COLOR: Record<string, string> = {
  livestock: 'bg-blue-100 text-blue-800', eggs: 'bg-yellow-100 text-yellow-800',
  crops: 'bg-orange-100 text-orange-800', water: 'bg-blue-100 text-blue-800',
  fruits: 'bg-emerald-100 text-emerald-800', plantation: 'bg-green-100 text-green-800',
  'fruit production': 'bg-teal-100 text-teal-800', 'small plantation': 'bg-green-100 text-green-800',
  feed: 'bg-purple-100 text-purple-800', other: 'bg-gray-100 text-gray-800',
};

interface Sale { id: number; date: string; category: string; item: string; quantity: number; unit: string; unit_price: number; total_amount: number; amount_paid: number; buyer: string; notes: string; payment_method: string; payment_status: string; }
interface AnimalCategory { id: number; name: string; type: string; }

function SaleForm({ categories, sectorId, onSave, onClose }: { categories: string[]; sectorId?: number; onSave: (d: any) => void; onClose: () => void }) {
  const [form, setForm] = useState<any>({ date: new Date().toISOString().split('T')[0], category: categories[0] || 'livestock', item: '', quantity: '', unit: 'unit', unit_price: '', total_amount: 0, amount_paid: 0, buyer: '', customer_id: '', notes: '', payment_method: 'Cash', payment_status: 'paid' });
  const set = (k: string, v: any) => setForm((p: any) => {
    const next = { ...p, [k]: v };
    if (k === 'quantity' || k === 'unit_price') {
      const q = Number(next.quantity) || 0;
      const u = Number(next.unit_price) || 0;
      next.total_amount = q * u;
      if (next.payment_status === 'paid') next.amount_paid = next.total_amount;
    }
    if (k === 'payment_method' && (v === 'Drawing' || v === 'Draw')) {
      next.amount_paid = 0;
      next.payment_status = 'paid';
    }
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
            <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Item Description *</Label>
          <Input value={form.item} onChange={e => set('item', e.target.value)} placeholder="e.g. Broiler chickens" required />
        </div>
        <div className="space-y-1.5">
          <Label>Quantity</Label>
          <Input type="number" min={1} value={form.quantity} onChange={e => set('quantity', e.target.value === '' ? '' : +e.target.value)} placeholder="1" />
        </div>
        <div className="space-y-1.5">
          <Label>Unit</Label>
          <Select value={form.unit || 'pieces'} onValueChange={v => set('unit', v)}>
            <SelectTrigger><SelectValue placeholder="Select Unit" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">Kg</SelectItem>
              <SelectItem value="rolls">Rolls</SelectItem>
              <SelectItem value="bags">Bags</SelectItem>
              <SelectItem value="pieces">Pieces</SelectItem>
              <SelectItem value="crates">Crates</SelectItem>
              <SelectItem value="birds">Birds</SelectItem>
              <SelectItem value="liters">Liters</SelectItem>
              <SelectItem value="tonnes">Tonnes</SelectItem>
              <SelectItem value="units">Units</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Unit Price (₦)</Label>
          <Input type="number" min={0} value={form.unit_price} onChange={e => set('unit_price', e.target.value === '' ? '' : +e.target.value)} placeholder="0" />
        </div>
        <div className="space-y-1.5">
          <Label>Total Amount (₦)</Label>
          <Input type="number" min={0} value={form.total_amount || ''} onChange={e => set('total_amount', e.target.value === '' ? '' : +e.target.value)} className="font-semibold bg-muted" readOnly placeholder="0" />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Buyer Name</Label>
          <CustomerCombobox 
            value={form.buyer} 
            onChange={(name, id) => {
              set('buyer', name);
              if (id) set('customer_id', id);
            }} 
            sectorId={sectorId} 
          />
        </div>
        <div className="space-y-1.5">
          <Label>Payment Method</Label>
          <Select value={form.payment_method} onValueChange={v => set('payment_method', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="POS">POS</SelectItem>
              <SelectItem value="Drawing">Drawing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Amount Paid (₦)</Label>
          <Input 
            type="number" min={0} 
            value={form.amount_paid} 
            onChange={e => set('amount_paid', e.target.value === '' ? '' : +e.target.value)} 
            disabled={form.payment_method === 'Drawing' || form.payment_method === 'Draw'}
            placeholder="0" 
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Notes</Label>
        <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} placeholder="Optional notes…" />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1">Record New Sale</Button>
      </div>
    </form>
  );
}

function PaymentForm({ sale, onSave, onClose }: { sale: Sale; onSave: (d: any) => void; onClose: () => void }) {
  const [paid, setPaid] = useState<number | ''>(sale.amount_paid || 0);
  
  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ amount_paid: paid }); }} className="space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm border-b pb-2">
          <span className="text-muted-foreground">Total Amount:</span>
          <span className="font-bold">{formatCurrency(sale.total_amount)}</span>
        </div>
        <div className="flex justify-between items-center text-sm border-b pb-2">
          <span className="text-muted-foreground">Previously Paid:</span>
          <span className="font-bold text-blue-600">{formatCurrency(sale.amount_paid || 0)}</span>
        </div>
        <div className="flex justify-between items-center text-sm pb-2">
          <span className="text-muted-foreground">Remaining Balance:</span>
          <span className="font-bold text-destructive">{formatCurrency(sale.total_amount - (Number(sale.amount_paid) || 0))}</span>
        </div>
      </div>
      <div className="space-y-1.5 pt-2">
        <Label>Update Total Amount Paid (₦)</Label>
        <Input type="number" min={0} value={paid} onChange={e => setPaid(e.target.value === '' ? '' : +e.target.value)} required />
        <p className="text-xs text-muted-foreground">Enter the new total cumulative amount paid so far.</p>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1">Save Payment</Button>
      </div>
    </form>
  );
}

export default function SalesPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [paymentSale, setPaymentSale] = useState<Sale | null>(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const { user } = useAuth();
  const sectorId = user?.role === 'water_manager' ? 2 : user?.role === 'farm_manager' ? 1 : undefined;

  const { data: catData = [] } = useQuery<AnimalCategory[]>({
    queryKey: ['animal-categories', sectorId],
    queryFn: () => api.get('/animal-categories', { params: { sector_id: sectorId } }).then(r => r.data),
  });

  const { data: sales = [], isLoading } = useQuery<Sale[]>({
    queryKey: ['sales', sectorId],
    queryFn: () => api.get('/sales', { params: { sector_id: sectorId } }).then(r => r.data),
  });

  const createMut = useMutation({
    mutationFn: (d: any) => api.post('/sales', { ...d, sector_id: sectorId }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sales'] }); toast.success('Sale recorded!'); setOpen(false); },
    onError: () => toast.error('Failed to record sale'),
  });

  const updatePaymentMut = useMutation({
    mutationFn: (d: any) => api.put(`/sales/${paymentSale?.id}`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sales'] }); toast.success('Payment updated!'); setPaymentSale(null); },
    onError: () => toast.error('Failed to update payment'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/sales/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sales'] }); toast.success('Sale deleted'); },
  });

  const categories = Array.from(new Set(['livestock', 'crops', 'fruits', 'plantation', 'feed', 'other', ...catData.map(c => c.name)]));

  const filtered = sales.filter(s => {
    const matchCat = catFilter === 'all' || s.category === catFilter;
    const matchSearch = !search || s.item.toLowerCase().includes(search.toLowerCase()) || (s.buyer || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const total = filtered.filter(s => s.payment_method !== 'Drawing' && s.payment_method !== 'Draw').reduce((sum, s) => sum + Number(s.total_amount), 0);
  const cashTotal = filtered.filter(s => s.payment_method === 'Cash').reduce((sum, s) => sum + Number(s.amount_paid || s.total_amount), 0);
  const transferTotal = filtered.filter(s => s.payment_method === 'Transfer').reduce((sum, s) => sum + Number(s.amount_paid || s.total_amount), 0);
  const posTotal = filtered.filter(s => s.payment_method === 'POS').reduce((sum, s) => sum + Number(s.amount_paid || s.total_amount), 0);
  
  // Outstanding is total expected minus what's paid (exclude Drawing)
  const outstandingTotal = filtered.filter(s => s.payment_method !== 'Drawing' && s.payment_method !== 'Draw' && s.payment_status === 'partial').reduce((sum, s) => sum + (Number(s.total_amount) - Number(s.amount_paid || 0)), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sales</h2>
          <p className="text-muted-foreground text-sm">{sales.length} transactions on record</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" /> Record New Sale</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Record New Sale</DialogTitle></DialogHeader>
          <SaleForm categories={categories} sectorId={sectorId} onSave={d => createMut.mutate(d)} onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!paymentSale} onOpenChange={(o) => !o && setPaymentSale(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Log Payment</DialogTitle><DialogDescription>Update the amount paid for this sale.</DialogDescription></DialogHeader>
          {paymentSale && <PaymentForm sale={paymentSale} onSave={d => updatePaymentMut.mutate(d)} onClose={() => setPaymentSale(null)} />}
        </DialogContent>
      </Dialog>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs mb-1">Total Expected Revenue</p>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs mb-1">Total Paid In</p>
            <p className="text-sm font-bold mt-1 text-green-600">
              {formatCurrency(cashTotal + transferTotal + posTotal)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs mb-1">Outstanding Balance</p>
            <p className="text-xl font-bold text-orange-500">{formatCurrency(outstandingTotal)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by item or buyer…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          {[...Array(5)].map((_, i) => <Card key={i} className="animate-pulse h-24" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No sales records found.</p>
          <Button variant="outline" className="mt-3" onClick={() => setOpen(true)}>Record first sale</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => {
            const isPartial = s.payment_status === 'partial';
            const isDraw = s.payment_method === 'Drawing' || s.payment_method === 'Draw';
            
            return (
            <Card key={s.id} className={`hover:border-primary/20 transition-colors ${isPartial ? 'border-orange-200' : ''}`}>
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${CAT_COLOR[s.category] ?? CAT_COLOR.other}`}>
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold leading-tight mb-1">{s.item}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium bg-muted px-2 py-0.5 rounded capitalize">{s.category}</span>
                      <span>•</span>
                      <span>{s.quantity} {s.unit}</span>
                      <span>•</span>
                      <span>{formatDate(s.date)}</span>
                    </div>
                    {s.buyer && <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">Sold to: <span className="font-medium text-foreground">{s.buyer}</span></p>}
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 sm:border-l sm:pl-4">
                  <div className="text-right flex-1 sm:flex-none">
                    <p className="font-bold text-lg">{formatCurrency(s.total_amount)}</p>
                    <div className="flex items-center justify-end gap-1.5 text-[10px] uppercase font-bold mt-0.5">
                      {isDraw ? (
                        <span className="text-purple-600 flex items-center gap-1"><FileMinus className="w-3 h-3"/> DRAWING</span>
                      ) : isPartial ? (
                        <span className="text-orange-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {formatCurrency(s.amount_paid)} PAID</span>
                      ) : (
                        <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> PAID</span>
                      )}
                      <span className="bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{s.payment_method}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {isPartial && !isDraw && (
                      <Button size="sm" onClick={() => setPaymentSale(s)} className="h-7 text-[10px] bg-orange-100 text-orange-700 hover:bg-orange-200 hover:text-orange-800" variant="secondary">Log Payment</Button>
                    )}
                    <Button size="sm" variant="outline" className="h-7 w-8 px-0" onClick={() => printReceipt(s)} title="Print Receipt"><Printer className="w-4 h-4" /></Button>
                    <Button size="sm" variant="outline" className="h-7 w-8 px-0 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => { if (confirm('Delete this record?')) deleteMut.mutate(s.id); }} title="Delete Record"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )})}
        </div>
      )}
    </div>
  );
}
