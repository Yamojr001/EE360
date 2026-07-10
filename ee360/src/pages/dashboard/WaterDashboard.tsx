import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Droplets, TrendingUp, Wallet, Users, ArrowUpRight, Package } from 'lucide-react';

function KpiCard({ label, value, icon, sub }: any) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="w-8 h-8 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 rounded-lg flex items-center justify-center">{icon}</div>
      </div>
      <p className="text-2xl font-extrabold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export default function WaterDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['water-summary'],
    queryFn: () => api.get('/dashboard/water-summary').then(r => r.data),
    refetchInterval: 30000,
  });

  if (isLoading) return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-muted rounded-2xl" />)}
      </div>
      <div className="h-64 bg-muted rounded-2xl" />
    </div>
  );

  const d = data ?? {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Water Dashboard</h1>
          <p className="text-sm text-muted-foreground">Sachet water production & sales</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Water Revenue"     value={formatCurrency(d.revenue)}         icon={<TrendingUp className="w-4 h-4" />}   />
        <KpiCard label="Water Expenses"    value={formatCurrency(d.expenses)}        icon={<Wallet className="w-4 h-4" />}       />
        <KpiCard label="Net Profit"        value={formatCurrency(d.netProfit)}       icon={<ArrowUpRight className="w-4 h-4" />} />
        <KpiCard label="Bags Produced"     value={(d.totalBagsProduced ?? 0).toLocaleString()} icon={<Package className="w-4 h-4" />} sub={`${(d.totalBagsSold ?? 0).toLocaleString()} bags sold`}/>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Production trend */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold text-foreground mb-1">Production vs Sales</h3>
          <p className="text-xs text-muted-foreground mb-4">Bags produced and sold per month</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={d.productionChart ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="produced" stroke="oklch(0.52 0.18 220)" strokeWidth={2} dot={false} name="Produced" />
              <Line type="monotone" dataKey="sold"     stroke="oklch(0.52 0.18 175)" strokeWidth={2} dot={false} name="Sold" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by area */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold text-foreground mb-1">Revenue by Distribution Area</h3>
          <p className="text-xs text-muted-foreground mb-4">Where your bags go</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={d.salesByArea ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
              <XAxis dataKey="area" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
              <Bar dataKey="total" name="Revenue" fill="oklch(0.52 0.18 220)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent production */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-bold text-foreground mb-4">Recent Production Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {['Date','Bags Produced','Litres Used','Cost','Notes'].map(h => (
                  <th key={h} className="pb-2 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(d.recentProduction ?? []).map((p: any) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 pr-4 text-foreground font-medium">{p.date}</td>
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-cyan-500 rounded-full" />
                      {p.bags_produced.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{p.liters_used.toLocaleString()} L</td>
                  <td className="py-3 pr-4 font-semibold text-primary">{formatCurrency(p.cost)}</td>
                  <td className="py-3 text-muted-foreground text-xs">{p.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
