import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, TrendingUp, Wallet, ArrowUpRight, Shield, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { useAuth } from '@/contexts/auth-context';

const COLORS = ['#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#f97316', '#14b8a6'];

interface Summary {
  totalRevenue: number; totalExpenses: number; netProfit: number;
  revenueBySector?: { sector: string; revenue: number }[];
  expenseBySector?: { sector: string; expenses: number }[];
  revenueByCategory: { category: string; total: number }[];
  expenseByCategory: { category: string; total: number }[];
  monthlyTrend: { month: string; revenue: number; expenses: number }[];
  livestockByType?: { type: string; count: number; value: number }[];
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [sector, setSector] = useState<'all' | '1' | '2'>(
    user?.role === 'farm_manager' ? '1' : user?.role === 'water_manager' ? '2' : 'all'
  );
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 6);
    return d.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);

  const sectorId = sector === 'all' ? undefined : Number(sector);

  const { data, isLoading } = useQuery<Summary>({
    queryKey: ['reports-summary', sectorId, fromDate, toDate],
    queryFn: () => api.get('/reports/summary', {
      params: { sector_id: sectorId, from: fromDate, to: toDate },
    }).then(r => r.data),
  });

  const handleExportCSV = () => {
    if (!data) return;
    const rows = [
      ['Report', 'EE360 Business Financial Summary'],
      ['Date Range', `${fromDate} to ${toDate}`],
      ['Sector Filter', sector === 'all' ? 'All Sectors' : sector === '1' ? 'Farm' : 'Water'],
      [],
      ['Metric', 'Amount (NGN)'],
      ['Total Revenue', data.totalRevenue],
      ['Total Expenses', data.totalExpenses],
      ['Net Profit', data.netProfit],
      [],
      ['Revenue by Category'],
      ...data.revenueByCategory.map(r => [r.category, r.total]),
      [],
      ['Expense by Category'],
      ...data.expenseByCategory.map(e => [e.category, e.total]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EE360_Report_${fromDate}_to_${toDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-muted rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-muted rounded-xl" />)}
        </div>
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    );
  }

  const profitMargin = data?.totalRevenue ? ((data.netProfit / data.totalRevenue) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Financial & Operations Reports</h2>
          <p className="text-muted-foreground text-sm">Comprehensive performance metrics and analytics</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {user?.role === 'super_admin' && (
            <Select value={sector} onValueChange={v => setSector(v as any)}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Sector" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="1">Farm Sector</SelectItem>
                <SelectItem value="2">Water Sector</SelectItem>
              </SelectContent>
            </Select>
          )}

          <div className="flex items-center gap-1 text-xs border rounded-md px-2 py-1 bg-background">
            <span className="text-muted-foreground">From</span>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="bg-transparent font-medium"
            />
            <span className="text-muted-foreground">To</span>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="bg-transparent font-medium"
            />
          </div>

          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-1" /> Export CSV
          </Button>
          <Button variant="default" size="sm" onClick={handlePrint}>
            Print Report
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(data?.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total earnings in period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Wallet className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(data?.totalExpenses || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total operating costs</p>
          </CardContent>
        </Card>

        <Card className="ring-2 ring-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <ArrowUpRight className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(data?.netProfit || 0) >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {formatCurrency(data?.netProfit || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Revenue minus expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Shield className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{profitMargin}%</div>
            <p className="text-xs text-muted-foreground mt-1">Net profit ratio</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Trend (Monthly)</CardTitle>
          <CardDescription>Revenue vs Expenses over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data?.monthlyTrend ?? []}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₦${v.toLocaleString()}`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#8b5cf6" fill="url(#gRev)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" fill="url(#gExp)" strokeWidth={2.5} />
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
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₦${v.toLocaleString()}`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="total" name="Revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
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
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₦${v.toLocaleString()}`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="value" name="Value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
