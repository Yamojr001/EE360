import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Droplets, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Production { id: number; date: string; bags_produced: number; liters_used: number; cost: number; notes: string; }
interface WaterSale { id: number; date: string; quantity: number; unit_price: number; total_amount: number; buyer: string; distribution_area: string; payment_method?: string; payment_status?: string; }
interface WaterExpense { id: number; date: string; description: string; amount: number; vendor: string; notes: string; }

function ProductionForm({ onSave, onClose }: { onSave: (d: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], bags_produced: 0, liters_used: 0, cost: 0, notes: '' });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5 col-span-2"><Label>Date</Label><Input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></div>
        <div className="space-y-1.5"><Label>Bags Produced</Label><Input type="number" min={0} value={form.bags_produced} onChange={e => set('bags_produced', +e.target.value)} /></div>
        <div className="space-y-1.5"><Label>Litres Used</Label><Input type="number" min={0} value={form.liters_used} onChange={e => set('liters_used', +e.target.value)} /></div>
        <div className="space-y-1.5 col-span-2"><Label>Production Cost (₦)</Label><Input type="number" min={0} value={form.cost} onChange={e => set('cost', +e.target.value)} /></div>
      </div>
      <div className="space-y-1.5"><Label>Notes</Label><Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} /></div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1">Log Production</Button>
      </div>
    </form>
  );
}

function SaleForm({ onSave, onClose }: { onSave: (d: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], quantity: 0, unit_price: 50, total_amount: 0, buyer: '', distribution_area: '', payment_method: 'Cash', payment_status: 'Paid' });
  const set = (k: string, v: any) => setForm(p => {
    const n = { ...p, [k]: v };
    if (k === 'quantity' || k === 'unit_price') n.total_amount = n.quantity * n.unit_price;
    return n;
  });
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5 col-span-2"><Label>Date</Label><Input type="date" value={form.date} onChange={e => set('date', e.target.value)} required /></div>
        <div className="space-y-1.5"><Label>Bags Sold</Label><Input type="number" min={0} value={form.quantity} onChange={e => set('quantity', +e.target.value)} required /></div>
        <div className="space-y-1.5"><Label>Price/Bag (₦)</Label><Input type="number" min={0} value={form.unit_price} onChange={e => set('unit_price', +e.target.value)} required /></div>
        <div className="space-y-1.5"><Label>Total (₦)</Label><Input type="number" value={form.total_amount} onChange={e => set('total_amount', +e.target.value)} className="font-semibold" required /></div>
        <div className="space-y-1.5"><Label>Buyer</Label><Input value={form.buyer} onChange={e => set('buyer', e.target.value)} placeholder="Customer name" /></div>
        <div className="space-y-1.5 col-span-2"><Label>Distribution Area</Label><Input value={form.distribution_area} onChange={e => set('distribution_area', e.target.value)} placeholder="e.g. Market A, Zone 3" /></div>
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
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1">Record Sale</Button>
      </div>
    </form>
  );
}

function ExpenseForm({ onSave, onClose }: { onSave: (d: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], description: '', amount: 0, vendor: '', notes: '' });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5 col-span-2"><Label>Date</Label><Input type="date" value={form.date} onChange={e => set('date', e.target.value)} required /></div>
        <div className="space-y-1.5 col-span-2"><Label>Description *</Label><Input value={form.description} onChange={e => set('description', e.target.value)} required /></div>
        <div className="space-y-1.5"><Label>Amount (₦) *</Label><Input type="number" min={0} value={form.amount} onChange={e => set('amount', +e.target.value)} required /></div>
        <div className="space-y-1.5"><Label>Vendor</Label><Input value={form.vendor} onChange={e => set('vendor', e.target.value)} /></div>
      </div>
      <div className="space-y-1.5"><Label>Notes</Label><Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} /></div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1">Add Expense</Button>
      </div>
    </form>
  );
}

export default function WaterPage() {
  const qc = useQueryClient();
  const [prodOpen, setProdOpen] = useState(false);
  const [saleOpen, setSaleOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);

  const { data: production = [] } = useQuery<Production[]>({ queryKey: ['water-production'], queryFn: () => api.get('/water/production').then(r => r.data) });
  const { data: waterSales = [] } = useQuery<WaterSale[]>({ queryKey: ['water-sales'], queryFn: () => api.get('/water/sales').then(r => r.data) });
  const { data: waterExpenses = [] } = useQuery<WaterExpense[]>({ queryKey: ['water-expenses'], queryFn: () => api.get('/water/expenses').then(r => r.data) });

  const addProd = useMutation({ mutationFn: (d: any) => api.post('/water/production', d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['water-production'] }); toast.success('Production logged'); setProdOpen(false); } });
  const addSale = useMutation({ mutationFn: (d: any) => api.post('/water/sales', d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['water-sales'] }); toast.success('Sale recorded'); setSaleOpen(false); } });
  const addExp = useMutation({ mutationFn: (d: any) => api.post('/water/expenses', d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['water-expenses'] }); toast.success('Expense recorded'); setExpOpen(false); } });
  const delProd = useMutation({ mutationFn: (id: number) => api.delete(`/water/production/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['water-production'] }) });
  const delSale = useMutation({ mutationFn: (id: number) => api.delete(`/water/sales/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['water-sales'] }) });
  const delExp = useMutation({ mutationFn: (id: number) => api.delete(`/water/expenses/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['water-expenses'] }) });

  const totalBags = production.reduce((s, p) => s + Number(p.bags_produced), 0);
  const totalRevenue = waterSales.reduce((s, s2) => s + Number(s2.total_amount), 0);
  const prodCost = production.reduce((s, p) => s + Number(p.cost), 0);
  const expCost = waterExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalCost = prodCost + expCost;

  const chartData = production.slice(-7).map(p => ({ date: formatDate(p.date), bags: p.bags_produced }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Water Business</h2>
          <p className="text-muted-foreground text-sm">Sachet water production & sales management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setProdOpen(true)}><Plus className="w-4 h-4 mr-2" /> Log Production</Button>
          <Button onClick={() => setSaleOpen(true)}><Plus className="w-4 h-4 mr-2" /> Record Sale</Button>
          <Button variant="destructive" onClick={() => setExpOpen(true)}><Plus className="w-4 h-4 mr-2" /> Log Expense</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bags Produced', value: totalBags.toLocaleString(), icon: <Droplets className="w-4 h-4" /> },
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: <TrendingUp className="w-4 h-4" /> },
          { label: 'Total Cost', value: formatCurrency(totalCost), icon: <Droplets className="w-4 h-4" /> },
          { label: 'Net Profit', value: formatCurrency(totalRevenue - totalCost), icon: <TrendingUp className="w-4 h-4" /> },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <div className="text-primary">{s.icon}</div>
              </div>
              <p className="text-xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Production — Last 7 Records</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="bags" name="Bags Produced" fill="oklch(0.45 0.165 175)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="production">
        <TabsList>
          <TabsTrigger value="production">Production Log</TabsTrigger>
          <TabsTrigger value="sales">Sales Log</TabsTrigger>
          <TabsTrigger value="expenses">Expenses Log</TabsTrigger>
        </TabsList>

        <TabsContent value="production" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/40">
                  {['Date', 'Bags Produced', 'Litres Used', 'Cost', 'Notes', ''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>)}
                </tr></thead>
                <tbody>
                  {production.length === 0 ? <tr><td colSpan={6} className="text-center py-10 text-muted-foreground"><Droplets className="w-10 h-10 mx-auto mb-2 opacity-30" />No production logged yet</td></tr>
                    : production.map(p => (
                      <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                        <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(p.date)}</td>
                        <td className="px-4 py-3 font-semibold">{p.bags_produced}</td>
                        <td className="px-4 py-3">{p.liters_used}L</td>
                        <td className="px-4 py-3 text-destructive">{formatCurrency(p.cost)}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{p.notes || '—'}</td>
                        <td className="px-4 py-3"><button onClick={() => delProd.mutate(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/40">
                  {['Date', 'Bags', 'Price/Bag', 'Total', 'Buyer', 'Area', 'Payment', 'Status', ''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>)}
                </tr></thead>
                <tbody>
                  {waterSales.length === 0 ? <tr><td colSpan={9} className="text-center py-10 text-muted-foreground">No sales yet</td></tr>
                    : waterSales.map(s => (
                      <tr key={s.id} className="border-b border-border hover:bg-muted/30">
                        <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(s.date)}</td>
                        <td className="px-4 py-3 font-semibold">{s.quantity}</td>
                        <td className="px-4 py-3">₦{s.unit_price}</td>
                        <td className="px-4 py-3 font-semibold text-green-600">{formatCurrency(s.total_amount)}</td>
                        <td className="px-4 py-3">{s.buyer || '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{s.distribution_area || '—'}</td>
                        <td className="px-4 py-3 text-xs">{s.payment_method || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.payment_status === 'Credit' ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {s.payment_status || 'Paid'}
                          </span>
                        </td>
                        <td className="px-4 py-3"><button onClick={() => delSale.mutate(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/40">
                  {['Date', 'Description', 'Amount', 'Vendor', 'Notes', ''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>)}
                </tr></thead>
                <tbody>
                  {waterExpenses.length === 0 ? <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No expenses yet</td></tr>
                    : waterExpenses.map(e => (
                      <tr key={e.id} className="border-b border-border hover:bg-muted/30">
                        <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(e.date)}</td>
                        <td className="px-4 py-3 font-medium">{e.description}</td>
                        <td className="px-4 py-3 font-semibold text-destructive">{formatCurrency(e.amount)}</td>
                        <td className="px-4 py-3">{e.vendor || '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{e.notes || '—'}</td>
                        <td className="px-4 py-3"><button onClick={() => { if (confirm('Delete expense?')) delExp.mutate(e.id); }} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={prodOpen} onOpenChange={setProdOpen}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Log Production</DialogTitle></DialogHeader>
          <ProductionForm onSave={d => addProd.mutate(d)} onClose={() => setProdOpen(false)} />
        </DialogContent>
      </Dialog>
      <Dialog open={saleOpen} onOpenChange={setSaleOpen}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Record Water Sale</DialogTitle></DialogHeader>
          <SaleForm onSave={d => addSale.mutate(d)} onClose={() => setSaleOpen(false)} />
        </DialogContent>
      </Dialog>
      <Dialog open={expOpen} onOpenChange={setExpOpen}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Log Expense</DialogTitle></DialogHeader>
          <ExpenseForm onSave={d => addExp.mutate(d)} onClose={() => setExpOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
