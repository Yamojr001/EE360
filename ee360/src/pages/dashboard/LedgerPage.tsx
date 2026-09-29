import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCcw, 
  Package, 
  Droplets, 
  Bird, 
  BookOpen, 
  Layers, 
  Calendar, 
  ArrowRight, 
  History, 
  ListFilter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

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

interface DailyStock {
  date: string;
  opening_stock: number;
  total_production: number;
  total_wasted: number;
  net_production: number;
  total_sales: number;
  sales_revenue: number;
  drawing_bags: number;
  drawing_amount: number;
  production_cost: number;
  closing_stock: number;
  net_change: number;
}

interface DailyStockHistoryItem {
  date: string;
  opening_stock: number;
  production_gross: number;
  production_waste: number;
  production_net: number;
  sales_quantity: number;
  sales_revenue: number;
  closing_stock: number;
  net_change: number;
}

interface FarmDaily {
  date: string;
  total_sales: number;
  sales_revenue: number;
  transactions: number;
  animals_added: number;
}

export default function LedgerPage() {
  const todayStr = new Date().toISOString().split('T')[0];
  const [dateFilter, setDateFilter] = useState(todayStr);
  const [viewTab, setViewTab] = useState<'feed' | 'stock_history'>('feed');
  
  const { user, isSuperAdmin, isWaterManager, isFarmManager } = useAuth();
  
  // Set default sector tab based on role
  const defaultTab = isWaterManager ? 'water' : isFarmManager ? 'farm' : 'all';
  const [sectorTab, setSectorTab] = useState(defaultTab);

  const sectorId = isWaterManager ? 2 : isFarmManager ? 1 : undefined;

  const { data, isLoading } = useQuery<{
    activities?: LedgerItem[];
    dailyStock?: DailyStock;
    farmDaily?: FarmDaily;
    dailyHistory?: DailyStockHistoryItem[];
  } | LedgerItem[]>({
    queryKey: ['ledger', sectorId, dateFilter],
    queryFn: () => api.get('/ledger', { params: { sector_id: sectorId, date: dateFilter } }).then(res => res.data),
  });

  const ledger: LedgerItem[] = Array.isArray(data) ? data : (data?.activities ?? []);
  const dailyStock: DailyStock | null = !Array.isArray(data) ? (data?.dailyStock ?? null) : null;
  const farmDaily: FarmDaily | null = !Array.isArray(data) ? (data?.farmDaily ?? null) : null;
  const dailyHistory: DailyStockHistoryItem[] = !Array.isArray(data) ? (data?.dailyHistory ?? []) : [];

  const filtered = ledger.filter(item => {
    const itemDate = (item.date || '').split('T')[0];
    const matchDate = !dateFilter || itemDate === dateFilter;
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

  const netDayChange = dailyStock ? dailyStock.net_change : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Daily Ledger & Stock Tracker
          </h2>
          <p className="text-muted-foreground text-sm">
            {isWaterManager ? 'Water Sector Stock Balance & Operations Ledger' :
             isFarmManager ? 'Farm Sector Financial & Operations Ledger' :
             'Unified daily ledger tracking opening stock, production, sales, closing stock, and cashflows'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Label className="text-xs font-semibold text-muted-foreground">Select Date:</Label>
          <Input 
            type="date" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-40 h-9 text-xs"
          />
          <Button 
            variant={dateFilter === todayStr ? 'secondary' : 'outline'} 
            size="sm" 
            className="h-9 text-xs"
            onClick={() => setDateFilter(todayStr)}
          >
            Today
          </Button>
          {dateFilter && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 text-xs text-blue-600 hover:text-blue-800"
              onClick={() => setDateFilter('')}
            >
              All Days
            </Button>
          )}
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

      {/* Daily Stock & Inventory Balance Tracker (Water / Enterprise) */}
      {(sectorTab === 'water' || sectorTab === 'all' || isWaterManager || isSuperAdmin) && (
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 rounded-xl">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  Daily Water Stock Balance Tracker
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {dateFilter ? formatDate(dateFilter) : 'Today'}
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Track factory bags flow: Opening Stock + Total Production − Total Sales = Closing Stock
                </p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-medium flex items-center gap-2 self-start sm:self-auto bg-muted/60 px-3 py-1.5 rounded-lg">
              <span>Net Day Movement:</span>
              <span className={`font-bold ${netDayChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {netDayChange >= 0 ? `+${netDayChange.toLocaleString()}` : netDayChange.toLocaleString()} bags
              </span>
            </div>
          </div>

          {/* 4 Core Stock KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. Opening Stock */}
            <div className="bg-muted/30 border border-border/70 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Opening Stock</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">START OF DAY</span>
              </div>
              <div className="mt-2">
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  {dailyStock ? Number(dailyStock.opening_stock).toLocaleString() : '0'}
                  <span className="text-sm font-normal text-muted-foreground ml-1">bags</span>
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Stock balance available at morning start
                </p>
              </div>
            </div>

            {/* 2. Total Production */}
            <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Total Production</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">+ PRODUCED</span>
              </div>
              <div className="mt-2">
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-700 dark:text-emerald-300">
                  +{dailyStock ? Number(dailyStock.total_production).toLocaleString() : '0'}
                  <span className="text-sm font-normal text-emerald-600/80 ml-1">bags</span>
                </p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                  <span>Net valid: <strong className="text-emerald-700 dark:text-emerald-400">{dailyStock ? Number(dailyStock.net_production).toLocaleString() : '0'}</strong></span>
                  {Number(dailyStock?.total_wasted || 0) > 0 && (
                    <span className="text-destructive font-medium">({dailyStock?.total_wasted} waste)</span>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Total Sales */}
            <div className="bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">Total Sales</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">- SOLD</span>
              </div>
              <div className="mt-2">
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-amber-700 dark:text-amber-300">
                  -{dailyStock ? Number(dailyStock.total_sales).toLocaleString() : '0'}
                  <span className="text-sm font-normal text-amber-600/80 ml-1">bags</span>
                </p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                  <span>Sales: <strong className="text-foreground">{formatCurrency(dailyStock?.sales_revenue || 0)}</strong></span>
                  {Number(dailyStock?.drawing_bags || 0) > 0 && (
                    <span className="text-purple-600 font-medium">({dailyStock?.drawing_bags} draw)</span>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Closing Stock */}
            <div className="bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/50 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-300">Closing Stock</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">END OF DAY</span>
              </div>
              <div className="mt-2">
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-blue-700 dark:text-blue-300">
                  {dailyStock ? Number(dailyStock.closing_stock).toLocaleString() : '0'}
                  <span className="text-sm font-normal text-blue-600/80 ml-1">bags</span>
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Remaining factory inventory
                </p>
              </div>
            </div>
          </div>

          {/* Visual Equation Ribbon */}
          <div className="bg-muted/40 rounded-xl p-3 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-medium text-foreground">
            <span className="flex items-center gap-1">
              <span className="text-muted-foreground">Opening Stock:</span>
              <span className="font-bold">{dailyStock ? Number(dailyStock.opening_stock).toLocaleString() : 0}</span>
            </span>
            <span className="font-bold text-muted-foreground">+</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span>Net Production:</span>
              <span className="font-bold">+{dailyStock ? Number(dailyStock.net_production).toLocaleString() : 0}</span>
            </span>
            <span className="font-bold text-muted-foreground">−</span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <span>Total Sales:</span>
              <span className="font-bold">−{dailyStock ? Number(dailyStock.total_sales).toLocaleString() : 0}</span>
            </span>
            <span className="font-bold text-muted-foreground">=</span>
            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
              <span>Closing Stock:</span>
              <span>{dailyStock ? Number(dailyStock.closing_stock).toLocaleString() : 0} bags</span>
            </span>
          </div>
        </div>
      )}

      {/* Farm Daily Operations Card (if Farm tab or Super Admin) */}
      {(sectorTab === 'farm' || sectorTab === 'all' || isFarmManager) && farmDaily && (
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3 border-b border-border/60 pb-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-xl">
              <Bird className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Farm Daily Activity Summary</h3>
              <p className="text-xs text-muted-foreground">Sales orders, items dispatched, and livestock logs on {dateFilter ? formatDate(dateFilter) : 'today'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-muted/30 border border-border/70 rounded-xl p-3.5">
              <span className="text-xs text-muted-foreground font-medium">Farm Units Sold</span>
              <p className="text-2xl font-bold text-foreground mt-1">{Number(farmDaily.total_sales).toLocaleString()}</p>
            </div>
            <div className="bg-muted/30 border border-border/70 rounded-xl p-3.5">
              <span className="text-xs text-muted-foreground font-medium">Farm Sales Revenue</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(farmDaily.sales_revenue)}</p>
            </div>
            <div className="bg-muted/30 border border-border/70 rounded-xl p-3.5">
              <span className="text-xs text-muted-foreground font-medium">Sales Invoices Logged</span>
              <p className="text-2xl font-bold text-foreground mt-1">{farmDaily.transactions}</p>
            </div>
            <div className="bg-muted/30 border border-border/70 rounded-xl p-3.5">
              <span className="text-xs text-muted-foreground font-medium">New Livestock Logged</span>
              <p className="text-2xl font-bold text-blue-600 mt-1">+{farmDaily.animals_added}</p>
            </div>
          </div>
        </div>
      )}

      {/* Financial Flow KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-300 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Recorded Income / Sales</p>
              <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{formatCurrency(totalIn)}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50/50 border-red-100 dark:bg-red-950/20 dark:border-red-900/40">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-300 rounded-lg"><TrendingDown className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">Recorded Expenses</p>
              <h3 className="text-2xl font-bold text-red-900 dark:text-red-100">{formatCurrency(totalOut)}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className={netBalance >= 0 ? "bg-blue-50/50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40" : "bg-amber-50/50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/40"}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${netBalance >= 0 ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-300' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-300'}`}>
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-300">Net Sector Cashflow</p>
              <h3 className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-900 dark:text-blue-100' : 'text-amber-900 dark:text-amber-100'}`}>{formatCurrency(netBalance)}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Ledger Section with View Switcher (Activity Feed vs 7-Day Stock History) */}
      <Card>
        <CardHeader className="py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {viewTab === 'feed' ? (
                <>
                  <ListFilter className="w-5 h-5 text-primary" />
                  {isWaterManager ? 'Water Sector Activity Log' :
                   isFarmManager ? 'Farm Sector Activity Log' :
                   sectorTab === 'all' ? 'Combined All Sectors Activity Log' :
                   sectorTab === 'farm' ? 'Farm Sector Activity Log' : 'Water Sector Activity Log'}
                </>
              ) : (
                <>
                  <History className="w-5 h-5 text-blue-600" />
                  Daily Stock Movement History (Recent 7 Days)
                </>
              )}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {viewTab === 'feed' 
                ? `${filtered.length} activities logged for ${dateFilter ? formatDate(dateFilter) : 'all dates'}`
                : 'Day-by-day opening stock, production, sales, and closing stock progression'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setViewTab('feed')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                viewTab === 'feed' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Activities Log ({filtered.length})
            </button>
            <button
              onClick={() => setViewTab('stock_history')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewTab === 'stock_history' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-blue-600" />
              Stock Ledger History
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {viewTab === 'feed' ? (
            /* Activities Feed */
            isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading ledger...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No activities recorded for this sector on the selected date.</div>
            ) : (
              <div className="divide-y">
                {filtered.map(item => (
                  <div key={item.id} className="p-4 hover:bg-muted/30 flex items-center gap-4 transition-colors">
                    <div className={`p-2 rounded-full shrink-0 ${item.is_income ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300'}`}>
                      {getIcon(item)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm truncate">{item.type}</p>
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            (item.sector || '').toLowerCase() === 'water' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
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
                        <span className={`font-bold ${item.is_income ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {item.is_income ? '+' : '-'}{formatCurrency(item.amount)}
                        </span>
                      ) : (
                        <span className="text-xs font-medium bg-muted px-2 py-1 rounded">Logged</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* 7-Day Stock Movement History Table */
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Opening Stock</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Gross Produced</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Waste</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Net Valid</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Total Sold</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Net Change</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Closing Stock</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Sales Revenue</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dailyHistory.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground text-xs">
                        No historical stock records available.
                      </td>
                    </tr>
                  ) : (
                    dailyHistory.map(row => {
                      const isSelected = row.date === dateFilter;
                      return (
                        <tr 
                          key={row.date} 
                          className={`hover:bg-muted/30 transition-colors ${isSelected ? 'bg-primary/5 font-medium' : ''}`}
                        >
                          <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">
                            <span className="flex items-center gap-1.5">
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                              {formatDate(row.date)}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-foreground">
                            {Number(row.opening_stock).toLocaleString()} <span className="text-xs text-muted-foreground">bags</span>
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            {Number(row.production_gross) > 0 ? `+${Number(row.production_gross).toLocaleString()}` : '0'}
                          </td>
                          <td className="px-4 py-3 text-destructive font-medium">
                            {Number(row.production_waste) > 0 ? `-${Number(row.production_waste).toLocaleString()}` : '0'}
                          </td>
                          <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                            {Number(row.production_net) > 0 ? `+${Number(row.production_net).toLocaleString()}` : '0'}
                          </td>
                          <td className="px-4 py-3 font-semibold text-amber-600 dark:text-amber-400">
                            {Number(row.sales_quantity) > 0 ? `-${Number(row.sales_quantity).toLocaleString()}` : '0'}
                          </td>
                          <td className="px-4 py-3 font-bold">
                            <span className={row.net_change > 0 ? 'text-emerald-600' : row.net_change < 0 ? 'text-amber-600' : 'text-muted-foreground'}>
                              {row.net_change > 0 ? `+${row.net_change.toLocaleString()}` : row.net_change.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-black text-blue-600 dark:text-blue-400">
                            {Number(row.closing_stock).toLocaleString()} <span className="text-xs font-normal text-muted-foreground">bags</span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-foreground">
                            {formatCurrency(row.sales_revenue)}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => {
                                setDateFilter(row.date);
                                setViewTab('feed');
                              }}
                              className="text-xs text-primary hover:underline font-semibold"
                            >
                              View Day
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
