import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Filter, Download } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const COLORS = ['oklch(0.45 0.165 175)', 'oklch(0.62 0.22 25)', 'oklch(0.65 0.18 165)', 'oklch(0.55 0.14 200)', 'oklch(0.65 0.15 95)'];

export default function ReportsPage() {
  const { user } = useAuth();
  const sectorId = user?.role === 'water_manager' ? 2 : user?.role === 'farm_manager' ? 1 : undefined;

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['reports', sectorId, dateFrom, dateTo],
    queryFn: () => api.get('/reports/summary', { params: { sector_id: sectorId, from: dateFrom, to: dateTo } }).then(r => r.data),
  });

  const handleDownloadReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Report Type,Value\n"
      + `Total Revenue,${data?.totalRevenue ?? 0}\n`
      + `Total Expenses,${data?.totalExpenses ?? 0}\n`
      + `Net Profit,${(data?.totalRevenue ?? 0) - (data?.totalExpenses ?? 0)}\n`;
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${dateFrom || 'all'}_to_${dateTo || 'all'}.csv`);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground text-sm">Full financial overview of {sectorId === 2 ? 'Water Sector' : sectorId === 1 ? 'Farm Sector' : 'EE Farm'}</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground"><Filter className="inline w-3 h-3 mr-1"/> Date Range:</span>
            <Input type="date" className="h-9 text-xs w-auto" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <span className="text-muted-foreground text-xs">to</span>
            <Input type="date" className="h-9 text-xs w-auto" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
          <Button onClick={handleDownloadReport} size="sm" variant="outline" className="h-9">
            <Download className="w-4 h-4 mr-2" /> Download CSV
          </Button>
        </div>
      </div>

      {/* P&L Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(revenue), icon: <TrendingUp className="w-4 h-4" />, color: 'text-blue-600' },
          { label: 'Total Expenses', value: formatCurrency(expenses), icon: <TrendingDown className="w-4 h-4" />, color: 'text-destructive' },
          { label: 'Net Profit', value: formatCurrency(profit), icon: <DollarSign className="w-4 h-4" />, color: profit >= 0 ? 'text-primary' : 'text-destructive' },
          { label: 'Profit Margin', value: `${margin}%`, icon: <BarChart3 className="w-4 h-4" />, color: 'text-secondary' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <div className={s.color}>{s.icon}</div>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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
