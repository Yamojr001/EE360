import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Droplets, TrendingUp, Printer, Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { printReceipt } from '@/lib/printReceipt';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '@/contexts/auth-context';

interface Production { id: number; date: string; bags_produced: number; bags_wasted?: number; waste_reason?: string; liters_used: number; cost: number; notes: string; deleted_at?: string; deleter?: { name: string }; }
interface WaterSale { id: number; date: string; quantity: number; unit_price: number; total_amount: number; buyer: string; distribution_area: string; payment_method?: string; payment_status?: string; }
interface WaterExpense { id: number; date: string; description: string; amount: number; vendor: string; notes: string; }
interface InventoryItem { id: number; name: string; category: string; quantity: number; unit: string; units_per_package?: number; unit_cost: number; min_stock_level: number; supplier: string; notes: string; }

function ProductionForm({ onSave, onClose, inventoryItems = [] }: { onSave: (d: any) => void; onClose: () => void; inventoryItems?: InventoryItem[] }) {
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], bags_produced: '', bags_wasted: '', waste_reason: '', liters_used: '', cost: '', notes: '' });
  const [usedInv, setUsedInv] = useState<Record<number, { checked: boolean, qty: number }>>({});
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const items_used = Object.entries(usedInv)
      .filter(([_, v]) => v.checked && v.qty > 0)
      .map(([id, v]) => {
        const item = inventoryItems?.find(i => i.id === Number(id));
        let finalQty = v.qty;
        if (item?.unit.toLowerCase() === 'bags' && (item.units_per_package || 0) > 0) {
          finalQty = Number((v.qty / (item.units_per_package || 1)).toFixed(4));
        }
        return { inventory_id: Number(id), quantity: finalQty };
      });
    onSave({ 
      ...form, 
      bags_produced: Number(form.bags_produced) || 0,
      bags_wasted: Number(form.bags_wasted) || 0,
      liters_used: Number(form.liters_used) || 0,
      cost: Number(form.cost) || 0,
      items_used 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5 col-span-2"><Label>Date</Label><Input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></div>
        <div className="space-y-1.5"><Label>Bags Produced</Label><Input type="number" min={0} value={form.bags_produced} onChange={e => set('bags_produced', e.target.value)} placeholder="0" required /></div>
        <div className="space-y-1.5"><Label>Litres Used</Label><Input type="number" min={0} value={form.liters_used} onChange={e => set('liters_used', e.target.value)} placeholder="0" /></div>
        <div className="space-y-1.5"><Label>Bags Wasted/Damaged</Label><Input type="number" min={0} value={form.bags_wasted} onChange={e => set('bags_wasted', e.target.value)} placeholder="0" /></div>
        <div className="space-y-1.5"><Label>Production Cost (₦)</Label><Input type="number" min={0} value={form.cost} onChange={e => set('cost', e.target.value)} placeholder="0" /></div>
        {Number(form.bags_wasted) > 0 && (
          <div className="space-y-1.5 col-span-2"><Label>Waste Reason</Label><Input value={form.waste_reason} onChange={e => set('waste_reason', e.target.value)} placeholder="e.g. Machine fault, leakages" required /></div>
        )}
      </div>

      {inventoryItems.length > 0 ? (
        <div className="space-y-2 border-t pt-3">
          <Label>Inventory Used (Check to subtract from stock)</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {inventoryItems.map(item => (
              <div key={item.id} className="flex items-center gap-2 p-2 border rounded-md bg-muted/20">
                <Checkbox
                  checked={usedInv[item.id]?.checked || false}
                  onCheckedChange={checked => setUsedInv(p => ({ ...p, [item.id]: { checked: !!checked, qty: p[item.id]?.qty || 1 } }))}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Stock: {item.quantity} {item.unit}</p>
                </div>
                {usedInv[item.id]?.checked && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 w-32">
                      <Input
                        type="number" min={0.01} step={0.01}
                        className="h-7 text-xs px-2"
                        value={usedInv[item.id]?.qty || ''}
                        placeholder={`Enter ${item.unit.toLowerCase() === 'bags' ? 'grams' : item.unit}`}
                        onChange={e => setUsedInv(p => ({ ...p, [item.id]: { ...p[item.id], qty: Number(e.target.value) } }))}
                      />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {item.unit.toLowerCase() === 'bags' && (item.units_per_package || 0) > 0 ? 'grams' : item.unit}
                      </span>
                    </div>
                    {(item.units_per_package || 0) > 0 && (
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {item.unit.toLowerCase() === 'bags'
                          ? `= ${((usedInv[item.id]?.qty || 0) / (item.units_per_package || 1)).toFixed(3)} bags deducted`
                          : `= ${((usedInv[item.id]?.qty || 0) * (item.units_per_package || 1)).toLocaleString()} total units`
                        }
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border-t pt-3">
          <p className="text-xs text-muted-foreground italic">No water inventory items available to deduct. Add items in the Inventory tab first.</p>
        </div>
      )}

      <div className="space-y-1.5"><Label>Notes</Label><Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} /></div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1">Log Production</Button>
      </div>
    </form>
  );
}

function SaleForm({ onSave, onClose }: { onSave: (d: any) => void; onClose: () => void }) {
  const [form, setForm] = useState<any>({ date: new Date().toISOString().split('T')[0], quantity: '', unit_price: '', total_amount: 0, buyer: '', distribution_area: '', payment_method: 'Cash', payment_status: 'Paid' });
  const set = (k: string, v: any) => setForm((p: any) => {
    const n = { ...p, [k]: v };
    if (k === 'quantity' || k === 'unit_price') {
      const q = Number(n.quantity) || 0;
      const u = Number(n.unit_price) || 0;
      n.total_amount = q * u;
    }
    return n;
  });
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5 col-span-2"><Label>Date</Label><Input type="date" value={form.date} onChange={e => set('date', e.target.value)} required /></div>
        <div className="space-y-1.5"><Label>Bags Sold</Label><Input type="number" min={0} value={form.quantity} onChange={e => set('quantity', e.target.value === '' ? '' : +e.target.value)} placeholder="0" required /></div>
        <div className="space-y-1.5"><Label>Price/Bag (₦)</Label><Input type="number" min={0} value={form.unit_price} onChange={e => set('unit_price', e.target.value === '' ? '' : +e.target.value)} placeholder="0" required /></div>
        <div className="space-y-1.5"><Label>Total (₦)</Label><Input type="number" value={form.total_amount || ''} onChange={e => set('total_amount', e.target.value === '' ? '' : +e.target.value)} className="font-semibold bg-muted" placeholder="0" readOnly required /></div>
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
        <Button type="submit" className="flex-1">Record New Sale</Button>
      </div>
    </form>
  );
}

function ExpenseForm({ onSave, onClose }: { onSave: (d: any) => void; onClose: () => void }) {
  const [form, setForm] = useState<any>({ date: new Date().toISOString().split('T')[0], description: '', amount: '', vendor: '', notes: '' });
  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5 col-span-2"><Label>Date</Label><Input type="date" value={form.date} onChange={e => set('date', e.target.value)} required /></div>
        <div className="space-y-1.5 col-span-2"><Label>Description *</Label><Input value={form.description} onChange={e => set('description', e.target.value)} required /></div>
        <div className="space-y-1.5"><Label>Amount (₦) *</Label><Input type="number" min={0} value={form.amount} onChange={e => set('amount', e.target.value === '' ? '' : +e.target.value)} placeholder="0" required /></div>
        <div className="space-y-1.5"><Label>Vendor</Label><Input value={form.vendor} onChange={e => set('vendor', e.target.value)} /></div>
      </div>
      <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} /></div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1">Add Expense</Button>
      </div>
    </form>
  );
}

function InventoryForm({ onSave, onClose }: { onSave: (d: any) => void; onClose: () => void }) {
  const [form, setForm] = useState<any>({ name: '', category: 'water', quantity: '', unit: 'rolls', units_per_package: '', unit_cost: '', min_stock_level: '', supplier: '', notes: '' });
  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const isRolls = form.unit.toLowerCase() === 'rolls' || form.unit.toLowerCase() === 'roll';

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5 col-span-2"><Label>Item Name *</Label><Input value={form.name} onChange={e => set('name', e.target.value)} required /></div>
        <div className="space-y-1.5"><Label>Quantity *</Label><Input type="number" min={0} value={form.quantity} onChange={e => set('quantity', e.target.value === '' ? '' : +e.target.value)} placeholder="0" required /></div>
        <div className="space-y-1.5">
          <Label>Unit</Label>
          <Select value={form.unit} onValueChange={v => set('unit', v)}>
            <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="rolls">Rolls</SelectItem>
              <SelectItem value="bags">Bags</SelectItem>
              <SelectItem value="kg">Kg</SelectItem>
              <SelectItem value="liters">Liters</SelectItem>
              <SelectItem value="pieces">Pieces</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isRolls && (
          <div className="space-y-1.5 col-span-2"><Label>Units per Roll (e.g. sachets per roll)</Label><Input type="number" min={1} value={form.units_per_package} onChange={e => set('units_per_package', e.target.value === '' ? '' : +e.target.value)} placeholder="0" /></div>
        )}
        {form.unit.toLowerCase() === 'bags' && (
          <div className="space-y-1.5 col-span-2"><Label>Weight per Bag (e.g. grams)</Label><Input type="number" min={1} value={form.units_per_package} onChange={e => set('units_per_package', e.target.value === '' ? '' : +e.target.value)} placeholder="0" /></div>
        )}

        <div className="space-y-1.5"><Label>Unit Cost (₦)</Label><Input type="number" min={0} value={form.unit_cost} onChange={e => set('unit_cost', e.target.value === '' ? '' : +e.target.value)} placeholder="0" /></div>
        <div className="space-y-1.5"><Label>Min Stock Level</Label><Input type="number" min={0} value={form.min_stock_level} onChange={e => set('min_stock_level', e.target.value === '' ? '' : +e.target.value)} placeholder="10" /></div>
        <div className="space-y-1.5 col-span-2"><Label>Supplier</Label><Input value={form.supplier} onChange={e => set('supplier', e.target.value)} /></div>
      </div>
      <div className="space-y-1.5"><Label>Notes</Label><Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} /></div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1">Save Item</Button>
      </div>
    </form>
  );
}

export default function WaterPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const sectorId = user?.role === 'water_manager' ? 2 : user?.role === 'farm_manager' ? 1 : undefined;

  const [prodOpen, setProdOpen] = useState(false);
  const [saleOpen, setSaleOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const [invOpen, setInvOpen] = useState(false);

  const { data: production = [] } = useQuery<Production[]>({ queryKey: ['water-production', sectorId], queryFn: () => api.get('/water/production', { params: { sector_id: sectorId } }).then(r => r.data) });
  const { data: waterSales = [] } = useQuery<WaterSale[]>({ queryKey: ['water-sales', sectorId], queryFn: () => api.get('/water/sales', { params: { sector_id: sectorId } }).then(r => r.data) });
  const { data: waterExpenses = [] } = useQuery<WaterExpense[]>({ queryKey: ['water-expenses', sectorId], queryFn: () => api.get('/water/expenses', { params: { sector_id: sectorId } }).then(r => r.data) });
  
  // Use the same inventory endpoint but filter to water items natively
  const { data: allInventory = [] } = useQuery<InventoryItem[]>({ 
    queryKey: ['inventory', sectorId], 
    queryFn: () => api.get('/inventory', { params: { sector_id: sectorId } }).then(r => r.data) 
  });
  const waterInventory = allInventory.filter(i => i.category === 'water');

  const addProd = useMutation({ mutationFn: (d: any) => api.post('/water/production', { ...d, sector_id: sectorId }), onSuccess: () => { qc.invalidateQueries({ queryKey: ['water-production'] }); qc.invalidateQueries({ queryKey: ['inventory'] }); toast.success('Production logged'); setProdOpen(false); } });
  const addSale = useMutation({ mutationFn: (d: any) => api.post('/water/sales', { ...d, sector_id: sectorId }), onSuccess: () => { qc.invalidateQueries({ queryKey: ['water-sales'] }); toast.success('Sale recorded'); setSaleOpen(false); } });
  const addExp = useMutation({ mutationFn: (d: any) => api.post('/water/expenses', { ...d, sector_id: sectorId }), onSuccess: () => { qc.invalidateQueries({ queryKey: ['water-expenses'] }); toast.success('Expense recorded'); setExpOpen(false); } });
  const addInv = useMutation({ mutationFn: (d: any) => api.post('/inventory', { ...d, sector_id: sectorId }), onSuccess: () => { qc.invalidateQueries({ queryKey: ['inventory'] }); toast.success('Inventory added'); setInvOpen(false); } });

  const delProd = useMutation({ mutationFn: (id: number) => api.delete(`/water/production/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['water-production'] }) });
  const delSale = useMutation({ mutationFn: (id: number) => api.delete(`/water/sales/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['water-sales'] }) });
  const delExp = useMutation({ mutationFn: (id: number) => api.delete(`/water/expenses/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['water-expenses'] }) });
  const delInv = useMutation({ mutationFn: (id: number) => api.delete(`/inventory/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory'] }) });

  const activeProduction = production.filter(p => !p.deleted_at);
  const totalProduced = activeProduction.reduce((s, p) => s + Number(p.bags_produced || 0), 0);
  const totalWasted = activeProduction.reduce((s, p) => s + Number(p.bags_wasted || 0), 0);
  const netBags = totalProduced - totalWasted;
  
  const totalRevenue = waterSales.reduce((s, s2) => s + Number(s2.total_amount), 0);
  const prodCost = activeProduction.reduce((s, p) => s + Number(p.cost), 0);
  const expCost = waterExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalCost = prodCost + expCost;

  // Include waste in chart
  const chartData = activeProduction.slice(-7).reverse().map(p => ({ 
    date: formatDate(p.date), 
    produced: Number(p.bags_produced) - Number(p.bags_wasted || 0),
    wasted: Number(p.bags_wasted || 0)
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Water Business</h2>
          <p className="text-muted-foreground text-sm">Sachet water production & sales management</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setProdOpen(true)}><Droplets className="w-4 h-4 mr-2" /> Log Production</Button>
          <Button variant="outline" onClick={() => setInvOpen(true)}><Package className="w-4 h-4 mr-2" /> Stock Inventory</Button>
          <Button onClick={() => setSaleOpen(true)}><Plus className="w-4 h-4 mr-2" /> Record New Sale</Button>
          <Button variant="destructive" onClick={() => setExpOpen(true)}><Plus className="w-4 h-4 mr-2" /> Log Expense</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Gross Production</p>
            <p className="text-xl font-bold">{totalProduced.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4">
            <p className="text-xs text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Total Waste</p>
            <p className="text-xl font-bold text-red-700">{totalWasted.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <p className="text-xs text-blue-600 mb-1">Net Valid Bags</p>
            <p className="text-xl font-bold text-blue-700">{netBags.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
            <p className="text-xl font-bold">{formatCurrency(totalRevenue - totalCost)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Production vs Waste (Last 7 Records)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="produced" name="Valid Production" stackId="a" fill="#0ea5e9" radius={[0, 0, 0, 0]} />
              <Bar dataKey="wasted" name="Waste" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="production">
        <TabsList>
          <TabsTrigger value="production">Production & Waste Log</TabsTrigger>
          <TabsTrigger value="sales">Sales Log</TabsTrigger>
          <TabsTrigger value="expenses">Expenses Log</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="production" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/40">
                  {['Date', 'Total Produced', 'Waste', 'Net valid', 'Cost', 'Notes/Reason', ''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>)}
                </tr></thead>
                <tbody>
                  {production.length === 0 ? <tr><td colSpan={7} className="text-center py-10 text-muted-foreground"><Droplets className="w-10 h-10 mx-auto mb-2 opacity-30" />No production logged yet</td></tr>
                    : production.map(p => (
                      <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                        <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(p.date)}</td>
                        <td className="px-4 py-3 font-semibold text-muted-foreground">
                          {p.bags_produced}
                          {p.deleted_at && <span className="ml-2 text-xs font-bold bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">Deleted by {p.deleter?.name || 'Admin'}</span>}
                        </td>
                        <td className="px-4 py-3 text-red-600 font-semibold">{p.bags_wasted || 0}</td>
                        <td className="px-4 py-3 text-blue-600 font-bold">{Number(p.bags_produced) - Number(p.bags_wasted || 0)}</td>
                        <td className="px-4 py-3 text-destructive">{formatCurrency(p.cost)}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {p.waste_reason ? <span className="text-red-600 mr-2 font-medium">Waste: {p.waste_reason}</span> : null}
                          {p.notes}
                        </td>
                        <td className="px-4 py-3">
                          {!p.deleted_at && (
                            <button onClick={() => { if (confirm('Delete production log?')) delProd.mutate(p.id); }} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                          )}
                        </td>
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
                        <td className="px-4 py-3 font-semibold text-blue-600">{formatCurrency(s.total_amount)}</td>
                        <td className="px-4 py-3">{s.buyer || '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{s.distribution_area || '—'}</td>
                        <td className="px-4 py-3 text-xs">{s.payment_method || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.payment_status === 'Credit' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                            {s.payment_status || 'Paid'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => printReceipt(s, 'water')} className="text-muted-foreground hover:text-primary" title="Print Receipt">
                              <Printer className="w-4 h-4" />
                            </button>
                            <button onClick={() => delSale.mutate(s.id)} className="text-muted-foreground hover:text-destructive" title="Delete Sale">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
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

        <TabsContent value="inventory" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/40">
                  {['Item Name', 'Quantity', 'Unit Cost', 'Total Value', 'Min Stock', 'Supplier', ''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>)}
                </tr></thead>
                <tbody>
                  {waterInventory.length === 0 ? <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">No inventory items found for water sector.</td></tr>
                    : waterInventory.map(i => (
                      <tr key={i.id} className="border-b border-border hover:bg-muted/30">
                        <td className="px-4 py-3 font-semibold">{i.name}</td>
                        <td className="px-4 py-3 font-medium">
                          <span className={i.quantity <= i.min_stock_level ? 'text-destructive font-bold' : ''}>
                            {i.quantity} {i.unit}
                          </span>
                          {(i.units_per_package || 0) > 0 && <span className="text-xs text-muted-foreground ml-2">({i.units_per_package}/unit)</span>}
                        </td>
                        <td className="px-4 py-3">{formatCurrency(i.unit_cost)}</td>
                        <td className="px-4 py-3 text-blue-600 font-semibold">{formatCurrency(i.quantity * i.unit_cost)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{i.min_stock_level}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{i.supplier || '—'}</td>
                        <td className="px-4 py-3"><button onClick={() => { if (confirm('Delete item?')) delInv.mutate(i.id); }} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={prodOpen} onOpenChange={setProdOpen}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Log Production & Waste</DialogTitle></DialogHeader>
          <ProductionForm inventoryItems={waterInventory} onSave={d => addProd.mutate(d)} onClose={() => setProdOpen(false)} />
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
      <Dialog open={invOpen} onOpenChange={setInvOpen}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Add Stock</DialogTitle></DialogHeader>
          <InventoryForm onSave={d => addInv.mutate(d)} onClose={() => setInvOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
