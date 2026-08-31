import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, cn } from '@/lib/utils';
import api from '@/lib/api';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, BarChart3, Filter, Download,
  Search, ArrowUpRight, ArrowDownRight, Layers, FileSpreadsheet, CheckCircle2, Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const COLORS = ['oklch(0.45 0.165 175)', 'oklch(0.62 0.22 25)', 'oklch(0.65 0.18 165)', 'oklch(0.55 0.14 200)', 'oklch(0.65 0.15 95)'];

interface SystemTransaction {
  id: string;
  date: string | null;
  sector: 'farm' | 'water';
  type: string;
  category: string;
  description: string;
  party: string;
  amount: number;
  amount_paid: number;
  payment_status: string;
  payment_method: string;
  is_income: boolean;
  notes?: string;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const sectorId = user?.role === 'water_manager' ? 2 : user?.role === 'farm_manager' ? 1 : undefined;

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [sectorFilter, setSectorFilter] = useState<'all' | 'farm' | 'water'>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['reports', sectorId, dateFrom, dateTo],
    queryFn: () => api.get('/reports/summary', { params: { sector_id: sectorId, from: dateFrom, to: dateTo } }).then(r => r.data),
  });

  const transactions: SystemTransaction[] = data?.transactions ?? [];

  const filteredTransactions = transactions.filter(t => {
    // Type filter
    if (typeFilter === 'income' && !t.is_income) return false;
    if (typeFilter === 'expense' && t.is_income) return false;

    // Sector filter
    if (sectorFilter !== 'all' && t.sector !== sectorFilter) return false;

    // Search query
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      t.description.toLowerCase().includes(s) ||
      t.category.toLowerCase().includes(s) ||
      t.party.toLowerCase().includes(s) ||
      t.type.toLowerCase().includes(s) ||
      (t.date || '').includes(s)
    );
  });

  const handleDownloadReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Sector,Transaction Type,Category,Description,Party (Buyer/Vendor),Payment Method,Payment Status,Amount (NGN),Impact\n";

    filteredTransactions.forEach(t => {
      const cleanDesc = `"${t.description.replace(/"/g, '""')}"`;
      const cleanParty = `"${t.party.replace(/"/g, '""')}"`;
      const impact = t.is_income ? 'INCOME' : 'EXPENSE';
      const amountVal = t.is_income ? t.amount : -t.amount;
      csvContent += `${t.date || 'N/A'},${t.sector.toUpperCase()},${t.type},${t.category},${cleanDesc},${cleanParty},${t.payment_method},${t.payment_status},${amountVal},${impact}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `detailed_transactions_report_${dateFrom || 'all'}_to_${dateTo || 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="h-10 bg-muted w-32 animate-pulse rounded"></div>
        <div className="h-10 bg-muted w-32 animate-pulse rounded"></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Card key={i} className="animate-pulse h-28" />)}
      </div>
      {[...Array(2)].map((_, i) => <Card key={i} className="animate-pulse h-64" />)}
    </div>
  );

  const revenue = data?.totalRevenue ?? 0;
  const expenses = data?.totalExpenses ?? 0;
  const profit = revenue - expenses;
  const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0';

  const totalFilteredIncome = filteredTransactions.filter(t => t.is_income).reduce((s, t) => s + t.amount, 0);
  const totalFilteredExpense = filteredTransactions.filter(t => !t.is_income).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            System Reports & Financial Ledger
          </h2>
          <p className="text-muted-foreground text-sm">
            Full itemized transactions log and financial analysis for {sectorId === 2 ? 'Water Sector' : sectorId === 1 ? 'Farm Sector' : 'EE Farm (All Sectors)'}
          </p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-card border px-3 py-1.5 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-medium text-muted-foreground">Period:</span>
            <Input type="date" className="h-7 text-xs w-auto border-0 p-0 focus-visible:ring-0" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <span className="text-muted-foreground">to</span>
            <Input type="date" className="h-7 text-xs w-auto border-0 p-0 focus-visible:ring-0" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
          <Button onClick={handleDownloadReport} size="sm" className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold gap-2">
            <Download className="w-4 h-4" /> Download Full CSV
          </Button>
        </div>
      </div>

      {/* P&L Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(revenue), icon: <TrendingUp className="w-4 h-4" />, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Total Expenses', value: formatCurrency(expenses), icon: <TrendingDown className="w-4 h-4" />, color: 'text-rose-600 dark:text-rose-400' },
          { label: 'Net Profit', value: formatCurrency(profit), icon: <DollarSign className="w-4 h-4" />, color: profit >= 0 ? 'text-emerald-700 font-extrabold' : 'text-rose-700 font-extrabold' },
          { label: 'Profit Margin', value: `${margin}%`, icon: <BarChart3 className="w-4 h-4" />, color: 'text-indigo-600 dark:text-indigo-400' },
        ].map(s => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                <div className={s.color}>{s.icon}</div>
              </div>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed System Transactions Log Table */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="pb-3 border-b border-border bg-muted/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" /> System Transactions Log
              </CardTitle>
              <CardDescription>
                Detailed breakdown of all revenue sales, operational expenses, and payments ({filteredTransactions.length} records)
              </CardDescription>
            </div>

            {/* Controls / Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search description, party..."
                  className="pl-8 h-8 text-xs"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* Type Filter */}
              <div className="flex bg-muted p-0.5 rounded-lg text-xs font-medium">
                {(['all', 'income', 'expense'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={cn(
                      'px-2.5 py-1 rounded-md capitalize transition-colors',
                      typeFilter === t ? 'bg-card text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Sector Filter for Super Admin */}
              {!sectorId && (
                <div className="flex bg-muted p-0.5 rounded-lg text-xs font-medium">
                  {(['all', 'farm', 'water'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setSectorFilter(s)}
                      className={cn(
                        'px-2.5 py-1 rounded-md capitalize transition-colors',
                        sectorFilter === s ? 'bg-card text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {s === 'all' ? 'All Sectors' : `${s} Sector`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">Sector</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">Type & Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">Description / Details</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">Party (Buyer/Vendor)</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">Payment Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">Amount (₦)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-muted-foreground">
                      <Layers className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      No system transactions found matching the selected date or search filter.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(t => (
                    <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium whitespace-nowrap">{t.date || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase',
                          t.sector === 'farm' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                              : 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                        )}>
                          {t.sector}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {t.is_income ? (
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          )}
                          <div>
                            <p className="font-bold text-foreground">{t.type}</p>
                            <p className="text-[10px] text-muted-foreground capitalize">{t.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground max-w-xs truncate" title={t.description}>
                        {t.description}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-medium">{t.party}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold capitalize',
                            t.payment_status === 'completed' || t.payment_status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          )}>
                            {t.payment_status === 'completed' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                            {t.payment_status || 'completed'}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-mono">({t.payment_method})</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-extrabold text-sm whitespace-nowrap">
                        <span className={t.is_income ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}>
                          {t.is_income ? '+' : '-'}{formatCurrency(t.amount)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Summary */}
          {filteredTransactions.length > 0 && (
            <div className="bg-muted/30 border-t border-border px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-semibold">
              <span className="text-muted-foreground">Showing {filteredTransactions.length} transaction entries</span>
              <div className="flex items-center gap-4">
                <span className="text-emerald-700 dark:text-emerald-400">Total Income: +{formatCurrency(totalFilteredIncome)}</span>
                <span className="text-rose-700 dark:text-rose-400">Total Expenses: -{formatCurrency(totalFilteredExpense)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue vs Expenses trend */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Expenses — Monthly Trend</CardTitle>
          <CardDescription>12-month comparison (Not affected by date filter)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data?.monthlyTrend ?? []}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.45 0.165 175)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="oklch(0.45 0.165 175)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.62 0.22 25)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="oklch(0.62 0.22 25)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₦${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="oklch(0.45 0.165 175)" fill="url(#gRev)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="oklch(0.62 0.22 25)" fill="url(#gExp)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by category */}
        <Card>
          <CardHeader><CardTitle>Revenue by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data?.revenueByCategory ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₦${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="total" name="Revenue" fill="oklch(0.45 0.165 175)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense breakdown */}
        <Card>
          <CardHeader><CardTitle>Expense Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={data?.expenseByCategory ?? []} cx="50%" cy="50%" outerRadius={80} dataKey="total" nameKey="category">
                  {(data?.expenseByCategory ?? []).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {(data?.expenseByCategory ?? []).map((c: any, i: number) => (
                <div key={c.category} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="capitalize text-muted-foreground">{c.category}</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(c.total)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Livestock value */}
      {data?.livestockByType && data.livestockByType.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Livestock Inventory Value</CardTitle><CardDescription>Current estimated value by animal type</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.livestockByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₦${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="value" name="Value" fill="oklch(0.65 0.18 165)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
