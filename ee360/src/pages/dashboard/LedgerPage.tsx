import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { TrendingUp, TrendingDown, RefreshCcw, Package, Droplets, Bird, BookOpen, Layers } from 'lucide-react';

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
  
  const { user, isSuperAdmin, isWaterManager, isFarmManager } = useAuth();
  
  // Set default sector tab based on role
  const defaultTab = isWaterManager ? 'water' : isFarmManager ? 'farm' : 'all';
  const [sectorTab, setSectorTab] = useState(defaultTab);

  const sectorId = isWaterManager ? 2 : isFarmManager ? 1 : undefined;

  const { data: ledger = [], isLoading } = useQuery<LedgerItem[]>({
    queryKey: ['ledger', sectorId],
    queryFn: () => api.get('/ledger', { params: { sector_id: sectorId } }).then(res => res.data),
  });

  const filtered = ledger.filter(item => {
    const matchDate = !dateFilter || item.date === dateFilter;
    const matchSector = isSuperAdmin 
      ? (sectorTab === 'all' || (item.sector || '').toLowerCase() === sectorTab.toLowerCase())
      : true; // Backend already strictly filtered by sector for managers
    return matchDate && matchSector;
  });

  const totalIn = filtered.filter(i => i.is_income).reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalOut = filtered.filter(i => !i.is_income).reduce((s, i) => s + Number(i.amount || 0), 0);
  const netBalance = totalIn - totalOut;

  const getIcon = (item: LedgerItem) => {
    if ((item.sector || '').toLowerCase() === 'water' || item.type.includes('Water')) return <Droplets className="w-4 h-4 text-blue-600" />;
    if ((item.sector || '').toLowerCase() === 'farm' || item.type.includes('Livestock') || item.type.includes('Farm')) return <Bird className="w-4 h-4 text-emerald-600" />;
    if (item.type.includes('Inventory')) return <Package className="w-4 h-4 text-amber-600" />;
    return <RefreshCcw className="w-4 h-4 text-purple-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Daily Ledger
          </h2>
          <p className="text-muted-foreground text-sm">
            {isWaterManager ? 'Water Sector Financial & Operations Ledger' :
             isFarmManager ? 'Farm Sector Financial & Operations Ledger' :
             'Unified financial timeline with separated Farm and Water sectors'}
          </p>
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

      {/* Sector Tabs — Only visible to Super Admin / Oversight users */}
      {isSuperAdmin && (
        <Tabs value={sectorTab} onValueChange={setSectorTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full sm:w-96">
            <TabsTrigger value="all" className="gap-1.5 font-bold">
              <Layers className="w-4 h-4" /> All Sectors
            </TabsTrigger>
            <TabsTrigger value="farm" className="gap-1.5 font-bold text-emerald-700">
              <Bird className="w-4 h-4" /> Farm Sector
            </TabsTrigger>
            <TabsTrigger value="water" className="gap-1.5 font-bold text-blue-700">
              <Droplets className="w-4 h-4" /> Water Sector
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-emerald-800">Recorded Income / Sales</p>
              <h3 className="text-2xl font-bold text-emerald-900">{formatCurrency(totalIn)}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50/50 border-red-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg"><TrendingDown className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-red-800">Recorded Expenses</p>
              <h3 className="text-2xl font-bold text-red-900">{formatCurrency(totalOut)}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className={netBalance >= 0 ? "bg-blue-50/50 border-blue-100" : "bg-amber-50/50 border-amber-100"}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${netBalance >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Net Sector Cashflow</p>
              <h3 className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-900' : 'text-amber-900'}`}>{formatCurrency(netBalance)}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="py-4 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            {isWaterManager ? 'Water Sector Activity Log' :
             isFarmManager ? 'Farm Sector Activity Log' :
             sectorTab === 'all' ? 'Combined All Sectors Activity Log' :
             sectorTab === 'farm' ? 'Farm Sector Activity Log' : 'Water Sector Activity Log'}
          </CardTitle>
          <span className="text-xs text-muted-foreground">{filtered.length} entries</span>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading ledger...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No activities recorded for this sector on the selected date.</div>
          ) : (
            <div className="divide-y">
              {filtered.map(item => (
                <div key={item.id} className="p-4 hover:bg-muted/30 flex items-center gap-4 transition-colors">
                  <div className={`p-2 rounded-full shrink-0 ${item.is_income ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {getIcon(item)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">{item.type}</p>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          (item.sector || '').toLowerCase() === 'water' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.sector} Sector
                        </span>
                      </div>
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
