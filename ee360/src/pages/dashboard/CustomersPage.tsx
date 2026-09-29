import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, Search, Trash2, Edit2, Users, MapPin, Phone, 
  Eye, Wallet, AlertCircle, CheckCircle2, FileMinus, 
  Coins, ArrowUpRight, Droplets, Wheat, Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

interface Customer {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  sector_id?: number;
  total_purchases: number;
  total_paid: number;
  commercial_debt: number;
  total_drawings: number;
  water_drawing_bags?: number;
  balance: number; // Remaining balance (+ debt or - credit)
  pending_count: number;
  partial_count: number;
  farm_purchases?: number;
  water_purchases?: number;
  created_at?: string;
}

interface Transaction {
  id: number;
  date: string;
  sector_label?: string;
  product_type?: string;
  item?: string;
  category?: string;
  quantity?: number;
  unit?: string;
  unit_price?: number;
  total_amount: number;
  amount_paid: number;
  payment_method?: string;
  payment_status?: string;
  distribution_area?: string;
  notes?: string;
}

export default function CustomersPage() {
  const qc = useQueryClient();
  const { user, isSuperAdmin } = useAuth();
  const sectorId = user?.role === 'water_manager' ? 2 : user?.role === 'farm_manager' ? 1 : undefined;

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'debtors' | 'drawings' | 'settled'>('all');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [payingCustomer, setPayingCustomer] = useState<Customer | null>(null);

  // Form states
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [payAmount, setPayAmount] = useState<number | ''>('');
  const [payMethod, setPayMethod] = useState('Cash');

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ['customers', sectorId],
    queryFn: () => api.get('/customers', { params: { sector_id: sectorId } }).then(r => r.data),
  });

  // Query customer statement history when viewing
  const { data: statementData, isLoading: isLoadingStatement } = useQuery({
    queryKey: ['customer-statement', viewingCustomer?.id],
    queryFn: () => viewingCustomer ? api.get(`/customers/${viewingCustomer.id}`).then(r => r.data) : null,
    enabled: !!viewingCustomer,
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

  const payMut = useMutation({
    mutationFn: (d: { id: number; amount: number; payment_method: string }) => 
      api.post(`/customers/${d.id}/payments`, { amount: d.amount, payment_method: d.payment_method }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
      qc.invalidateQueries({ queryKey: ['customer-statement', viewingCustomer?.id] });
      qc.invalidateQueries({ queryKey: ['water-summary'] });
      qc.invalidateQueries({ queryKey: ['super-summary'] });
      toast.success('Payment recorded successfully!');
      setPayingCustomer(null);
      setPayAmount('');
    },
    onError: () => toast.error('Failed to record payment'),
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

  const openPayDialog = (c: Customer) => {
    setPayingCustomer(c);
    setPayAmount(c.balance > 0 ? c.balance : '');
    setPayMethod('Cash');
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingCustomer || !payAmount || payAmount <= 0) return;
    payMut.mutate({
      id: payingCustomer.id,
      amount: Number(payAmount),
      payment_method: payMethod,
    });
  };

  // KPI Calculations
  const totalCustomers = customers.length;
  const totalDebt = customers.reduce((acc, c) => acc + (c.balance > 0 ? c.balance : 0), 0);
  const totalCredit = customers.reduce((acc, c) => acc + (c.balance < 0 ? Math.abs(c.balance) : 0), 0);
  const totalDrawings = customers.reduce((acc, c) => acc + (c.total_drawings || 0), 0);

  const debtorsCount = customers.filter(c => c.balance > 0).length;
  const drawingsCount = customers.filter(c => (c.total_drawings || 0) > 0).length;
  const settledCount = customers.filter(c => c.balance === 0).length;

  const filtered = customers.filter(c => {
    // Search filter
    if (search) {
      const s = search.toLowerCase();
      const matchSearch = c.name.toLowerCase().includes(s) ||
        (c.phone || '').toLowerCase().includes(s) ||
        (c.address || '').toLowerCase().includes(s);
      if (!matchSearch) return false;
    }

    // Tab filter
    if (activeTab === 'debtors') return c.balance > 0;
    if (activeTab === 'drawings') return (c.total_drawings || 0) > 0;
    if (activeTab === 'settled') return c.balance === 0;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Customers & Debtors Ledger
          </h2>
          <p className="text-muted-foreground text-sm">
            Track customer profiles, commercial purchases, drawings, and real-time remaining balances (+ or −)
          </p>
        </div>
        <Button onClick={() => openForm()} className="font-bold bg-emerald-800 hover:bg-emerald-900 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Customer
        </Button>
      </div>

      {/* KPI Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Total Customers</p>
              <p className="text-xl font-black text-foreground">{totalCustomers}</p>
              <p className="text-[11px] text-muted-foreground">{debtorsCount} with open balance</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-50/20 dark:bg-amber-950/10">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase">Outstanding Receivables (Debt)</p>
              <p className="text-xl font-black text-amber-600 dark:text-amber-300">+{formatCurrency(totalDebt)}</p>
              <p className="text-[11px] text-muted-foreground">{debtorsCount} debtor{debtorsCount === 1 ? '' : 's'} owing money</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-purple-50/20 dark:bg-purple-950/10">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-600 flex items-center justify-center shrink-0">
              <FileMinus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase">Total Drawings</p>
              <p className="text-xl font-black text-purple-600 dark:text-purple-300">{formatCurrency(totalDrawings)}</p>
              <p className="text-[11px] text-muted-foreground">{drawingsCount} account{drawingsCount === 1 ? '' : 's'} with drawings</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase">Settled Accounts</p>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-300">{settledCount}</p>
              <p className="text-[11px] text-muted-foreground">Zero outstanding balance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex bg-muted p-1 rounded-xl gap-1 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              "px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap",
              activeTab === 'all' ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            All Customers ({customers.length})
          </button>
          <button
            onClick={() => setActiveTab('debtors')}
            className={cn(
              "px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap",
              activeTab === 'debtors' ? "bg-background text-amber-600 shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Debtors / Unpaid ({debtorsCount})
          </button>
          <button
            onClick={() => setActiveTab('drawings')}
            className={cn(
              "px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap",
              activeTab === 'drawings' ? "bg-background text-purple-600 shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Drawings ({drawingsCount})
          </button>
          <button
            onClick={() => setActiveTab('settled')}
            className={cn(
              "px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap",
              activeTab === 'settled' ? "bg-background text-emerald-600 shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Settled ({settledCount})
          </button>
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-9 w-full" 
            placeholder="Search customer, phone or address…" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      {/* Main Customers & Balances Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Customer Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Contact & Address</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Purchases / Invoiced</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Amount Paid</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Drawings</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-foreground">Remaining Balance (+ / −)</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      <td colSpan={7} className="px-4 py-4"><div className="h-5 bg-muted animate-pulse rounded w-full" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-muted-foreground">
                      <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      No customers found matching your criteria.
                    </td>
                  </tr>
                ) : filtered.map(c => {
                  const bal = Number(c.balance) || 0;
                  const isOwed = bal > 0;
                  const isCredit = bal < 0;
                  const isSettled = bal === 0;

                  return (
                    <tr key={c.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      {/* Name & Initial Avatar */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs",
                            isOwed ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300" :
                            isCredit ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300" :
                            "bg-primary/10 text-primary"
                          )}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground block">{c.name}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {c.sector_id === 2 ? (
                                <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                  <Droplets className="w-2.5 h-2.5" /> Water
                                </span>
                              ) : c.sector_id === 1 ? (
                                <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                  <Wheat className="w-2.5 h-2.5" /> Farm
                                </span>
                              ) : (
                                <span className="text-[10px] text-muted-foreground">General</span>
                              )}
                              {(c.pending_count > 0 || c.partial_count > 0) && (
                                <span className="text-[10px] bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-1 py-0.2 rounded font-bold">
                                  {c.pending_count + c.partial_count} unpaid
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone & Address */}
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {c.phone && (
                          <div className="flex items-center gap-1 mb-0.5 text-foreground">
                            <Phone className="w-3 h-3 text-muted-foreground shrink-0" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                        {c.address ? (
                          <div className="flex items-start gap-1 max-w-[200px] truncate text-[11px]">
                            <MapPin className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                            <span className="truncate">{c.address}</span>
                          </div>
                        ) : !c.phone ? '—' : null}
                      </td>

                      {/* Total Purchases */}
                      <td className="px-4 py-3 text-right">
                        <span className="font-bold text-foreground">{formatCurrency(c.total_purchases)}</span>
                      </td>

                      {/* Amount Paid */}
                      <td className="px-4 py-3 text-right">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(c.total_paid)}</span>
                      </td>

                      {/* Drawings */}
                      <td className="px-4 py-3 text-right">
                        {c.total_drawings > 0 ? (
                          <div>
                            <span className="font-bold text-purple-600 dark:text-purple-400">
                              {formatCurrency(c.total_drawings)}
                            </span>
                            {c.water_drawing_bags && c.water_drawing_bags > 0 ? (
                              <p className="text-[10px] text-muted-foreground font-medium">({c.water_drawing_bags} bags)</p>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>

                      {/* Remaining Balance (+ or -) */}
                      <td className="px-4 py-3 text-center">
                        {isOwed && (
                          <span className="inline-flex flex-col items-center px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300/50 shadow-2xs">
                            <span className="text-xs font-black tracking-tight">+{formatCurrency(bal)}</span>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-700 dark:text-amber-400">Customer Owes</span>
                          </span>
                        )}
                        {isCredit && (
                          <span className="inline-flex flex-col items-center px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 border border-purple-300/50 shadow-2xs">
                            <span className="text-xs font-black tracking-tight">−{formatCurrency(Math.abs(bal))}</span>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-purple-700 dark:text-purple-400">Credit Balance</span>
                          </span>
                        )}
                        {isSettled && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200/50">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ₦0.00 Settled
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Statement */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg hover:bg-muted"
                            onClick={() => setViewingCustomer(c)}
                            title="View Statement & History"
                          >
                            <Eye className="w-4 h-4 text-primary" />
                          </Button>

                          {/* Quick Pay if owes */}
                          {isOwed && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                              onClick={() => openPayDialog(c)}
                              title="Record Payment / Settle Debt"
                            >
                              <Wallet className="w-4 h-4" />
                            </Button>
                          )}

                          {/* Edit */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                            onClick={() => openForm(c)}
                            title="Edit Profile"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>

                          {/* Delete */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-destructive"
                            onClick={() => { if (confirm(`Delete profile for ${c.name}?`)) deleteMut.mutate(c.id); }}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Statement & Transaction History Modal */}
      <Dialog open={!!viewingCustomer} onOpenChange={o => { if (!o) setViewingCustomer(null); }}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-xl">
              <div className="flex items-center gap-2">
                <span>Statement: {viewingCustomer?.name}</span>
              </div>
              {viewingCustomer && viewingCustomer.balance > 0 && (
                <Button 
                  size="sm" 
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                  onClick={() => openPayDialog(viewingCustomer)}
                >
                  <Wallet className="w-3.5 h-3.5 mr-1.5" /> Record Payment
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          {viewingCustomer && (
            <div className="space-y-4 pt-2">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="bg-muted/40 border border-border rounded-xl p-2.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Invoiced</span>
                  <p className="text-sm font-black text-foreground">{formatCurrency(statementData?.summary?.total_purchases ?? viewingCustomer.total_purchases)}</p>
                </div>
                <div className="bg-muted/40 border border-border rounded-xl p-2.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Paid</span>
                  <p className="text-sm font-black text-emerald-600">{formatCurrency(statementData?.summary?.total_paid ?? viewingCustomer.total_paid)}</p>
                </div>
                <div className="bg-muted/40 border border-border rounded-xl p-2.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Drawings</span>
                  <p className="text-sm font-black text-purple-600">{formatCurrency(statementData?.summary?.total_drawings ?? viewingCustomer.total_drawings)}</p>
                </div>
                <div className={cn(
                  "border rounded-xl p-2.5",
                  viewingCustomer.balance > 0 ? "bg-amber-50 dark:bg-amber-950/20 border-amber-300/50 text-amber-700 dark:text-amber-300" :
                  viewingCustomer.balance < 0 ? "bg-purple-50 dark:bg-purple-950/20 border-purple-300/50 text-purple-700 dark:text-purple-300" :
                  "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300/50 text-emerald-700 dark:text-emerald-300"
                )}>
                  <span className="text-[10px] uppercase font-bold">Remaining Balance</span>
                  <p className="text-base font-black">
                    {viewingCustomer.balance > 0 ? `+${formatCurrency(viewingCustomer.balance)}` :
                     viewingCustomer.balance < 0 ? `−${formatCurrency(Math.abs(viewingCustomer.balance))}` :
                     '₦0.00 Settled'}
                  </p>
                </div>
              </div>

              {/* Transactions Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  All Sales & Invoices ({statementData?.transactions?.length ?? 0})
                </h4>
                <div className="border border-border rounded-xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted/60 border-b border-border text-muted-foreground font-medium">
                        <th className="text-left px-3 py-2">Date</th>
                        <th className="text-left px-3 py-2">Sector</th>
                        <th className="text-left px-3 py-2">Item / Product</th>
                        <th className="text-right px-3 py-2">Qty</th>
                        <th className="text-right px-3 py-2">Total</th>
                        <th className="text-right px-3 py-2">Paid</th>
                        <th className="text-center px-3 py-2">Method</th>
                        <th className="text-center px-3 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingStatement ? (
                        <tr><td colSpan={8} className="text-center py-6 text-muted-foreground">Loading statement…</td></tr>
                      ) : !statementData?.transactions || statementData.transactions.length === 0 ? (
                        <tr><td colSpan={8} className="text-center py-6 text-muted-foreground">No transaction records found.</td></tr>
                      ) : (
                        statementData.transactions.map((tx: Transaction, idx: number) => {
                          const isDrawing = tx.payment_method === 'Drawing' || tx.payment_method === 'Draw';
                          const due = Math.max(0, (Number(tx.total_amount) || 0) - (Number(tx.amount_paid) || 0));

                          return (
                            <tr key={idx} className="border-b border-border/60 hover:bg-muted/20">
                              <td className="px-3 py-2 font-medium">{formatDate(tx.date)}</td>
                              <td className="px-3 py-2">
                                <span className={cn(
                                  "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                  tx.sector_label === 'Water' ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                )}>
                                  {tx.sector_label}
                                </span>
                              </td>
                              <td className="px-3 py-2 font-medium text-foreground">
                                {tx.product_type ? `${tx.product_type} water` : tx.item || 'Item'}
                              </td>
                              <td className="px-3 py-2 text-right">
                                {tx.quantity?.toLocaleString()} {tx.unit || ''}
                              </td>
                              <td className="px-3 py-2 text-right font-bold">
                                {formatCurrency(tx.total_amount)}
                              </td>
                              <td className="px-3 py-2 text-right font-bold text-emerald-600">
                                {formatCurrency(tx.amount_paid)}
                              </td>
                              <td className="px-3 py-2 text-center">
                                <span className={cn(
                                  "px-1.5 py-0.5 rounded text-[10px] font-medium",
                                  isDrawing ? "bg-purple-100 text-purple-800" : "bg-muted text-muted-foreground"
                                )}>
                                  {tx.payment_method || 'Cash'}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-center">
                                {isDrawing ? (
                                  <span className="text-purple-700 font-bold text-[10px]">Drawing</span>
                                ) : due > 0 ? (
                                  <span className="text-amber-600 font-bold text-[10px]">
                                    Due: {formatCurrency(due)}
                                  </span>
                                ) : (
                                  <span className="text-emerald-600 font-bold text-[10px]">Paid</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add / Edit Customer Profile Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Customer Profile' : 'Add Customer Profile'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label>Customer Name *</Label>
              <Input 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
                placeholder="e.g. Musa Abubakar" 
                required 
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone Number (Optional)</Label>
              <Input 
                value={form.phone} 
                onChange={e => setForm({ ...form, phone: e.target.value })} 
                placeholder="e.g. 08012345678" 
              />
            </div>
            <div className="space-y-1.5">
              <Label>Address (Optional)</Label>
              <Input 
                value={form.address} 
                onChange={e => setForm({ ...form, address: e.target.value })} 
                placeholder="e.g. No. 12 Katsina Rd, Kano" 
              />
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMut.isPending || !form.name.trim()}>
                {editing ? 'Update' : 'Save'} Customer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Record Payment / Debt Settlement Dialog */}
      <Dialog open={!!payingCustomer} onOpenChange={o => { if (!o) setPayingCustomer(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              <span>Record Debt Payment</span>
            </DialogTitle>
          </DialogHeader>
          {payingCustomer && (
            <form onSubmit={handleRecordPayment} className="space-y-4 pt-2">
              <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3 rounded-xl">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-bold text-foreground">{payingCustomer.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-amber-800 dark:text-amber-300 font-semibold">Current Balance Owed:</span>
                  <span className="font-black text-amber-700 dark:text-amber-300 text-sm">
                    +{formatCurrency(payingCustomer.balance)}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Payment Amount (₦)</Label>
                <Input
                  type="number"
                  min={0.01}
                  step="any"
                  value={payAmount}
                  onChange={e => setPayAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0.00"
                  required
                  className="font-bold text-base"
                />
                <div className="flex gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setPayAmount(payingCustomer.balance)}
                  >
                    Pay Full Debt ({formatCurrency(payingCustomer.balance)})
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Payment Method Received</Label>
                <Select value={payMethod} onValueChange={setPayMethod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="POS">POS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setPayingCustomer(null)}>Cancel</Button>
                <Button 
                  type="submit" 
                  disabled={payMut.isPending || !payAmount || payAmount <= 0}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  {payMut.isPending ? 'Saving…' : 'Record Payment'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
