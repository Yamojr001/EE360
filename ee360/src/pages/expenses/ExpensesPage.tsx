import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, Wallet, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CATEGORIES = ['feed', 'medicine', 'equipment', 'labour', 'transport', 'utilities', 'maintenance', 'other'];
const CAT_COLORS = ['oklch(0.45 0.165 175)', 'oklch(0.55 0.14 200)', 'oklch(0.65 0.18 165)', 'oklch(0.62 0.22 25)', 'oklch(0.65 0.15 95)', 'oklch(0.35 0.14 25)', 'oklch(0.5 0.12 200)', 'oklch(0.7 0.05 200)'];
const CAT_BG: Record<string, string> = {
  feed: 'bg-green-100 text-green-800', medicine: 'bg-blue-100 text-blue-800',
  equipment: 'bg-purple-100 text-purple-800', labour: 'bg-yellow-100 text-yellow-800',
  transport: 'bg-orange-100 text-orange-800', utilities: 'bg-teal-100 text-teal-800',
  maintenance: 'bg-red-100 text-red-800', other: 'bg-gray-100 text-gray-800',
};

interface Expense { id: number; date: string; category: string; description: string; amount: number; vendor: string; notes: string; }

function ExpenseForm({ onSave, onClose }: { onSave: (d: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], category: 'feed', description: '', amount: 0, vendor: '', notes: '' });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
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
          <Label>Description *</Label>
          <Input value={form.description} onChange={e => set('description', e.target.value)} placeholder="What was this expense for?" required />
        </div>
        <div className="space-y-1.5">
          <Label>Amount (₦) *</Label>
          <Input type="number" min={0} value={form.amount} onChange={e => set('amount', +e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Vendor / Supplier</Label>
          <Input value={form.vendor} onChange={e => set('vendor', e.target.value)} placeholder="Who was paid?" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Notes</Label>
        <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1">Add Expense</Button>
      </div>
    </form>
  );
}

export default function ExpensesPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ['expenses'],
    queryFn: () => api.get('/expenses').then(r => r.data),
  });

  const createMut = useMutation({
    mutationFn: (d: any) => api.post('/expenses', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['expenses'] }); toast.success('Expense added'); setOpen(false); },
    onError: () => toast.error('Failed to add expense'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/expenses/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['expenses'] }); toast.success('Expense deleted'); },
  });

  const filtered = expenses.filter(e => {
    const matchCat = catFilter === 'all' || e.category === catFilter;
    const matchSearch = !search || e.description.toLowerCase().includes(search.toLowerCase()) || e.vendor.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  // Pie chart data
  const pieData = CATEGORIES.map((c, i) => ({
    name: c, value: expenses.filter(e => e.category === c).reduce((s, e) => s + e.amount, 0), fill: CAT_COLORS[i],
  })).filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Expenses</h2>
          <p className="text-muted-foreground text-sm">{expenses.length} expense entries</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" /> Add Expense</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Summary cards */}
        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Card><CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Total (filtered)</p>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(total)}</p>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">This Month</p>
              <p className="text-2xl font-bold">{formatCurrency(expenses.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).reduce((s, e) => s + e.amount, 0))}</p>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Entries</p>
              <p className="text-2xl font-bold">{filtered.length}</p>
            </CardContent></Card>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search description or vendor…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger className="w-44"><Filter className="w-3.5 h-3.5 mr-1.5" /><SelectValue /></SelectTrigger>
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
                      {['Date', 'Category', 'Description', 'Amount', 'Vendor', ''].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? [...Array(4)].map((_, i) => (
                      <tr key={i} className="border-b border-border">
                        {[...Array(6)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded" /></td>)}
                      </tr>
                    )) : filtered.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">
                        <Wallet className="w-10 h-10 mx-auto mb-2 opacity-30" />No expenses found
                      </td></tr>
                    ) : filtered.map(e => (
                      <tr key={e.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(e.date)}</td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${CAT_BG[e.category] ?? CAT_BG.other}`}>{e.category}</span></td>
                        <td className="px-4 py-3 font-medium">{e.description}</td>
                        <td className="px-4 py-3 font-semibold text-destructive">{formatCurrency(e.amount)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{e.vendor || '—'}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => { if (confirm('Delete expense?')) deleteMut.mutate(e.id); }} className="text-muted-foreground hover:text-destructive transition-colors">
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
        </div>

        {/* Pie chart */}
        <Card>
          <CardHeader><CardTitle className="text-sm">By Category</CardTitle></CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-sm text-center py-8">No data yet</p>}
            <div className="space-y-1.5 mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                    <span className="capitalize text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(d.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
          <ExpenseForm onSave={d => createMut.mutate(d)} onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
