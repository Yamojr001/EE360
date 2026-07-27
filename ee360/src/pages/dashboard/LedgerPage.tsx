import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { TrendingUp, TrendingDown, RefreshCcw, Package, Droplets, Bird, BookOpen } from 'lucide-react';

interface LedgerItem {
  id: string;
  date: string;
  type: string;
  description: string;
  amount: number;
  sector: string;
  is_income: boolean;
  notes: string;
}

export default function LedgerPage() {
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  const { user } = useAuth();
  const sectorId = user?.role === 'water_manager' ? 2 : user?.role === 'farm_manager' ? 1 : undefined;

  const { data: ledger = [], isLoading } = useQuery<LedgerItem[]>({
    queryKey: ['ledger', sectorId],
    queryFn: () => api.get('/ledger', { params: { sector_id: sectorId } }).then(res => res.data),
  });

  const filtered = ledger.filter(item => !dateFilter || item.date === dateFilter);

  const totalIn = filtered.filter(i => i.is_income).reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalOut = filtered.filter(i => !i.is_income).reduce((s, i) => s + Number(i.amount || 0), 0);

  const getIcon = (item: LedgerItem) => {
    if (item.type.includes('Water')) return <Droplets className="w-4 h-4" />;
    if (item.type.includes('Livestock') || item.type.includes('Farm')) return <Bird className="w-4 h-4" />;
    if (item.type.includes('Inventory')) return <Package className="w-4 h-4" />;
    return <RefreshCcw className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Daily Ledger
          </h2>
          <p className="text-muted-foreground text-sm">Unified timeline of all farm & water activities</p>
        </div>
        <div className="flex items-center gap-3">
          <Label>Filter Date:</Label>
          <Input 
            type="date" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-40"
          />
          <button onClick={() => setDateFilter('')} className="text-xs text-blue-600 hover:underline">Clear</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-emerald-800">Total Recorded Income/Value</p>
              <h3 className="text-2xl font-bold text-emerald-900">{formatCurrency(totalIn)}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50/50 border-red-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg"><TrendingDown className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-red-800">Total Recorded Expenses</p>
              <h3 className="text-2xl font-bold text-red-900">{formatCurrency(totalOut)}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="py-4 border-b">
          <CardTitle className="text-lg">Activity Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading ledger...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No activities recorded on this date.</div>
          ) : (
            <div className="divide-y">
              {filtered.map(item => (
                <div key={item.id} className="p-4 hover:bg-muted/30 flex items-center gap-4 transition-colors">
                  <div className={`p-2 rounded-full shrink-0 ${item.is_income ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {getIcon(item)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-sm truncate">{item.type}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(item.date)}</span>
                    </div>
                    <p className="text-sm text-foreground/80">{item.description}</p>
                    {item.notes && <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.notes}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    {item.amount > 0 ? (
                      <span className={`font-bold ${item.is_income ? 'text-emerald-600' : 'text-red-600'}`}>
                        {item.is_income ? '+' : '-'}{formatCurrency(item.amount)}
                      </span>
                    ) : (
                      <span className="text-xs font-medium bg-muted px-2 py-1 rounded">Logged</span>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1 capitalize">{item.sector} Sector</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
