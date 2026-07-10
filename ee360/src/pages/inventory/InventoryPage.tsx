import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Search, Trash2, Edit2, Package, AlertTriangle,
  Mail, Send, CheckCircle2, Eye, X, Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatCurrency, cn } from '@/lib/utils';

const CATEGORIES = ['feed', 'medicine', 'equipment', 'packaging', 'chemicals', 'other'];

const CATEGORY_COLORS: Record<string, string> = {
  feed:       'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  medicine:   'bg-blue-100    text-blue-700    dark:bg-blue-950    dark:text-blue-300',
  equipment:  'bg-violet-100  text-violet-700  dark:bg-violet-950  dark:text-violet-300',
  packaging:  'bg-amber-100   text-amber-700   dark:bg-amber-950   dark:text-amber-300',
  chemicals:  'bg-rose-100    text-rose-700    dark:bg-rose-950    dark:text-rose-300',
  other:      'bg-gray-100    text-gray-700    dark:bg-gray-800    dark:text-gray-300',
};

interface Item {
  id: number; name: string; category: string; quantity: number;
  unit: string; unit_cost: number; min_stock_level: number;
  supplier: string; notes: string;
}

/* ── Item Form ────────────────────────────────────────────────────── */
function ItemForm({ initial, onSave, onClose }: {
  initial?: Partial<Item>; onSave: (d: any) => void; onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: '', category: 'feed', quantity: 0, unit: 'bags',
    unit_cost: 0, min_stock_level: 10, supplier: '', notes: '', ...initial,
  });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label>Item Name *</Label>
          <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Poultry Finisher Feed" required />
        </div>
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={form.category} onValueChange={v => set('category', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Unit</Label>
          <Input value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="bags, litres, packs…" />
        </div>
        <div className="space-y-1.5">
          <Label>Quantity in Stock</Label>
          <Input type="number" min={0} value={form.quantity || ''} onChange={e => set('quantity', +e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Unit Cost (₦)</Label>
          <Input type="number" min={0} value={form.unit_cost || ''} onChange={e => set('unit_cost', +e.target.value)} />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Minimum Stock Level <span className="text-muted-foreground text-xs">(alert threshold)</span></Label>
          <Input type="number" min={0} value={form.min_stock_level || ''} onChange={e => set('min_stock_level', +e.target.value)} />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Supplier</Label>
          <Input value={form.supplier} onChange={e => set('supplier', e.target.value)} placeholder="Supplier name" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1">{initial?.id ? 'Save Changes' : 'Add Item'}</Button>
      </div>
    </form>
  );
}

/* ── Email Alert Dialog ───────────────────────────────────────────── */
interface AlertResult {
  sent: boolean; preview: boolean; messageId: string | null;
  previewPayload?: { to: string; subject: string; html: string };
}

function EmailAlertDialog({
  items, open, onClose,
}: { items: Item[]; open: boolean; onClose: () => void }) {
  const [to, setTo] = useState('admin@ee360.farm');
  const [tab, setTab] = useState<'compose' | 'preview' | 'sent'>('compose');
  const [result, setResult] = useState<AlertResult | null>(null);
  const [html, setHtml] = useState('');

  const sendMut = useMutation({
    mutationFn: () => api.post<AlertResult>('/inventory/send-alert', {
      to, items: items.map(i => ({
        name: i.name, category: i.category, quantity: i.quantity,
        unit: i.unit, min_stock_level: i.min_stock_level, supplier: i.supplier,
      })),
    }).then(r => r.data),
    onSuccess: (data) => {
      setResult(data);
      if (data.previewPayload?.html) setHtml(data.previewPayload.html);
      setTab('sent');
      if (data.sent) toast.success('Alert email sent successfully!');
      else toast.info('Email preview generated (SMTP not configured)');
    },
    onError: () => toast.error('Failed to send alert email'),
  });

  const previewMut = useMutation({
    mutationFn: () => api.post<AlertResult>('/inventory/preview-alert', {
      to, items: items.map(i => ({
        name: i.name, category: i.category, quantity: i.quantity,
        unit: i.unit, min_stock_level: i.min_stock_level, supplier: i.supplier,
      })),
    }).then(r => r.data),
    onSuccess: (data) => {
      if (data.previewPayload?.html) { setHtml(data.previewPayload.html); setTab('preview'); }
    },
  });

  const handleClose = () => { setTab('compose'); setResult(null); setHtml(''); onClose(); };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" /> Low-Stock Alert Email
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        {tab !== 'sent' && (
          <div className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
            {(['compose','preview'] as const).map(t => (
              <button key={t}
                onClick={() => { if (t === 'preview' && !html) previewMut.mutate(); else setTab(t); }}
                className={cn('px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors',
                  tab === t ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}
              >
                {t === 'preview' ? (previewMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin inline" /> : 'Preview Email') : 'Compose'}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto min-h-0">
          {/* ── Compose ── */}
          {tab === 'compose' && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label>Send alert to</Label>
                <Input
                  type="email" value={to} onChange={e => setTo(e.target.value)}
                  placeholder="manager@example.com"
                />
                <p className="text-xs text-muted-foreground">The alert will be delivered to this email address.</p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> {items.length} item{items.length !== 1 ? 's' : ''} will be included in this alert
                </p>
                <div className="space-y-2">
                  {items.map(i => {
                    const pct = Math.min(100, (i.quantity / Math.max(1, i.min_stock_level)) * 100);
                    return (
                      <div key={i.id} className="flex items-center gap-3 bg-white dark:bg-amber-950/50 rounded-lg p-2.5">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-foreground truncate">{i.name}</span>
                            <span className="text-xs font-bold text-destructive ml-2 shrink-0">{i.quantity}/{i.min_stock_level} {i.unit}</span>
                          </div>
                          <Progress value={pct} className="h-1.5 [&>div]:bg-destructive" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-muted/40 rounded-xl p-4 text-sm text-muted-foreground space-y-1.5">
                <p className="font-semibold text-foreground flex items-center gap-2"><Eye className="w-4 h-4" /> What gets sent</p>
                <ul className="space-y-1 text-xs">
                  <li>• Formatted HTML table with all low-stock items</li>
                  <li>• Current stock vs minimum level for each item</li>
                  <li>• Supplier names for quick reorder</li>
                  <li>• Date stamp and farm name in the footer</li>
                </ul>
                <p className="text-xs mt-2 pt-2 border-t border-border">
                  <strong>Note:</strong> If SMTP is not configured, a full email preview is returned instead of a live send. Configure <code className="bg-muted px-1 rounded">SMTP_HOST</code>, <code className="bg-muted px-1 rounded">SMTP_USER</code> and <code className="bg-muted px-1 rounded">SMTP_PASS</code> env vars to enable real delivery.
                </p>
              </div>
            </div>
          )}

          {/* ── Email Preview ── */}
          {tab === 'preview' && html && (
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 flex items-center justify-between border-b border-border">
                <span className="text-xs text-muted-foreground font-medium">Email Preview</span>
                <span className="text-xs text-muted-foreground">To: {to}</span>
              </div>
              <iframe
                srcDoc={html}
                className="w-full border-0"
                style={{ height: '420px' }}
                title="Email preview"
                sandbox="allow-same-origin"
              />
            </div>
          )}

          {/* ── Sent / Preview result ── */}
          {tab === 'sent' && result && (
            <div className="space-y-5">
              <div className={cn(
                'rounded-2xl p-6 text-center',
                result.sent ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900'
                            : 'bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900',
              )}>
                {result.sent ? (
                  <>
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200">Email Sent!</h3>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">Alert delivered to <strong>{to}</strong></p>
                    {result.messageId && (
                      <p className="text-xs text-emerald-600/70 mt-2 font-mono">ID: {result.messageId}</p>
                    )}
                  </>
                ) : (
                  <>
                    <Eye className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200">Preview Mode</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1 max-w-xs mx-auto">
                      SMTP not configured — this is how the email will look when delivered.
                    </p>
                  </>
                )}
              </div>

              {/* Show the email in an iframe */}
              {html && (
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-muted/50 px-4 py-2 text-xs text-muted-foreground border-b border-border font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email Content
                  </div>
                  <iframe
                    srcDoc={html}
                    className="w-full border-0"
                    style={{ height: '380px' }}
                    title="Sent email"
                    sandbox="allow-same-origin"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 justify-end border-t border-border pt-4 shrink-0">
          <Button variant="outline" onClick={handleClose}>
            {tab === 'sent' ? 'Close' : 'Cancel'}
          </Button>
          {tab === 'compose' && (
            <>
              <Button variant="outline" onClick={() => previewMut.mutate()} disabled={previewMut.isPending}>
                {previewMut.isPending ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Eye className="w-4 h-4 mr-1.5" />}
                Preview
              </Button>
              <Button onClick={() => sendMut.mutate()} disabled={sendMut.isPending || !to}>
                {sendMut.isPending ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Send className="w-4 h-4 mr-1.5" />}
                Send Alert
              </Button>
            </>
          )}
          {tab === 'preview' && (
            <Button onClick={() => sendMut.mutate()} disabled={sendMut.isPending || !to}>
              {sendMut.isPending ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Send className="w-4 h-4 mr-1.5" />}
              Send Alert
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Main Page ────────────────────────────────────────────────────── */
export default function InventoryPage() {
  const qc = useQueryClient();
  const [open, setOpen]           = useState(false);
  const [editing, setEditing]     = useState<Item | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [search, setSearch]       = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const { data: items = [], isLoading } = useQuery<Item[]>({
    queryKey: ['inventory'],
    queryFn: () => api.get('/inventory').then(r => r.data),
  });

  const saveMut = useMutation({
    mutationFn: (d: any) => editing ? api.put(`/inventory/${editing.id}`, d) : api.post('/inventory', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['inventory'] }); toast.success('Item saved'); setOpen(false); setEditing(null); },
    onError: () => toast.error('Failed to save item'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/inventory/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['inventory'] }); toast.success('Deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const lowStock    = items.filter(i => i.quantity <= i.min_stock_level);
  const totalValue  = items.reduce((s, i) => s + i.quantity * i.unit_cost, 0);
  const categories  = ['all', ...Array.from(new Set(items.map(i => i.category)))];

  const filtered = items
    .filter(i => catFilter === 'all' || i.category === catFilter)
    .filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.supplier.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">Inventory</h2>
            <p className="text-sm text-muted-foreground">{items.length} items · {formatCurrency(totalValue)} total value</p>
          </div>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Items</p>
          <p className="text-2xl font-extrabold text-foreground">{items.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Stock Value</p>
          <p className="text-2xl font-extrabold text-foreground">{formatCurrency(totalValue)}</p>
        </div>
        <div className={cn('border rounded-xl p-4', lowStock.length > 0 ? 'bg-red-50 dark:bg-red-950/20 border-destructive/30' : 'bg-card border-border')}>
          <p className={cn('text-xs mb-1', lowStock.length > 0 ? 'text-destructive/70' : 'text-muted-foreground')}>Low Stock Alerts</p>
          <p className={cn('text-2xl font-extrabold', lowStock.length > 0 ? 'text-destructive' : 'text-foreground')}>{lowStock.length}</p>
        </div>
      </div>

      {/* ── Low-Stock Alert Banner ── */}
      {lowStock.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900 dark:text-amber-200">
                  {lowStock.length} Item{lowStock.length !== 1 ? 's' : ''} Need Restocking
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
                  Stock has fallen at or below the minimum threshold. Send an email alert to the farm manager.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setAlertOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white shrink-0 gap-2"
              size="sm"
            >
              <Mail className="w-4 h-4" /> Send Alert Email
            </Button>
          </div>

          {/* Low-stock item chips */}
          <div className="flex flex-wrap gap-2">
            {lowStock.map(i => (
              <div key={i.id} className="flex items-center gap-1.5 bg-white dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg px-2.5 py-1.5">
                <span className="w-2 h-2 bg-destructive rounded-full shrink-0" />
                <span className="text-xs font-semibold text-foreground">{i.name}</span>
                <span className="text-xs text-destructive font-bold">
                  {i.quantity}/{i.min_stock_level} {i.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search items or supplier…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map(c => (
            <button key={c}
              onClick={() => setCatFilter(c)}
              className={cn('px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors',
                catFilter === c ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              )}
            >{c === 'all' ? 'All Categories' : c}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-44 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No items found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(item => {
            const pct   = item.min_stock_level > 0 ? Math.min(100, (item.quantity / item.min_stock_level) * 100) : 100;
            const isLow = item.quantity <= item.min_stock_level;
            return (
              <div key={item.id} className={cn(
                'group bg-card border rounded-2xl p-5 transition-all hover:shadow-md',
                isLow ? 'border-destructive/40 bg-red-50/30 dark:bg-red-950/10' : 'border-border hover:border-primary/30',
              )}>
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {isLow && <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" />}
                      <p className="font-bold text-sm text-foreground truncate">{item.name}</p>
                    </div>
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize', CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other)}>
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Stock bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Stock level</span>
                    <span className={cn('font-bold', isLow ? 'text-destructive' : 'text-foreground')}>
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <Progress value={pct} className={cn('h-2', isLow && '[&>div]:bg-destructive')} />
                  <p className="text-[10px] text-muted-foreground mt-1">Min: {item.min_stock_level} {item.unit}</p>
                </div>

                {/* Value row */}
                <div className="flex justify-between text-xs text-muted-foreground mb-4">
                  <span>₦{item.unit_cost.toLocaleString()} / {item.unit}</span>
                  <span className="font-semibold text-foreground">{formatCurrency(item.quantity * item.unit_cost)}</span>
                </div>

                {item.supplier && (
                  <p className="text-[11px] text-muted-foreground mb-3 truncate">📦 {item.supplier}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1" onClick={() => { setEditing(item); setOpen(true); }}>
                    <Edit2 className="w-3 h-3" /> Edit
                  </Button>
                  <Button
                    variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    onClick={() => { if (confirm(`Delete "${item.name}"?`)) deleteMut.mutate(item.id); }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Item Dialog */}
      <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Inventory Item</DialogTitle></DialogHeader>
          <ItemForm
            initial={editing ?? undefined}
            onSave={d => saveMut.mutate(d)}
            onClose={() => { setOpen(false); setEditing(null); }}
          />
        </DialogContent>
      </Dialog>

      {/* Email Alert Dialog */}
      <EmailAlertDialog items={lowStock} open={alertOpen} onClose={() => setAlertOpen(false)} />
    </div>
  );
}
