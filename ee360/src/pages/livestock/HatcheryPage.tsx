import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, Search, Trash2, Edit2, Egg, Home, ExternalLink, 
  Phone, Building2, Percent, Layers, DollarSign 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

export interface HatcheryRecord {
  id: number;
  date: string;
  batch_number: string;
  animal_type: string;
  hatch_type: 'internal' | 'external';
  external_provider?: string | null;
  external_contact?: string | null;
  cost?: number | string | null;
  eggs_set: number;
  eggs_hatched: number;
  mortality: number;
  notes: string;
}

export default function HatcheryPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const sectorId = user?.role === 'water_manager' ? 2 : user?.role === 'farm_manager' ? 1 : undefined;

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'internal' | 'external'>('all');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<HatcheryRecord | null>(null);

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    batch_number: '',
    animal_type: '',
    hatch_type: 'internal' as 'internal' | 'external',
    external_provider: '',
    external_contact: '',
    cost: '',
    eggs_set: '',
    eggs_hatched: '',
    mortality: '',
    notes: ''
  });

  const { data: records = [], isLoading } = useQuery<HatcheryRecord[]>({
    queryKey: ['hatchery', sectorId],
    queryFn: () => api.get('/hatchery', { params: { sector_id: sectorId } }).then(r => r.data),
  });

  const createMut = useMutation({
    mutationFn: (d: any) => editing ? api.put(`/hatchery/${editing.id}`, d) : api.post('/hatchery', { ...d, sector_id: sectorId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hatchery'] });
      toast.success(editing ? 'Hatchery record updated' : 'Hatchery record added');
      setOpen(false);
      setEditing(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to save record';
      toast.error(msg);
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/hatchery/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hatchery'] });
      toast.success('Record deleted');
    },
    onError: () => toast.error('Failed to delete record'),
  });

  const openForm = (r?: HatcheryRecord) => {
    if (r) {
      setEditing(r);
      setForm({
        date: r.date,
        batch_number: r.batch_number || '',
        animal_type: r.animal_type || '',
        hatch_type: r.hatch_type || 'internal',
        external_provider: r.external_provider || '',
        external_contact: r.external_contact || '',
        cost: r.cost !== null && r.cost !== undefined ? String(r.cost) : '',
        eggs_set: r.eggs_set.toString(),
        eggs_hatched: r.eggs_hatched.toString(),
        mortality: r.mortality.toString(),
        notes: r.notes || ''
      });
    } else {
      setEditing(null);
      setForm({
        date: new Date().toISOString().split('T')[0],
        batch_number: '',
        animal_type: '',
        hatch_type: 'internal',
        external_provider: '',
        external_contact: '',
        cost: '',
        eggs_set: '',
        eggs_hatched: '',
        mortality: '',
        notes: ''
      });
    }
    setOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.hatch_type === 'external' && !form.external_provider.trim()) {
      toast.error('Please specify the external provider / person who did the hatching');
      return;
    }

    createMut.mutate({
      ...form,
      hatch_type: form.hatch_type,
      external_provider: form.hatch_type === 'external' ? form.external_provider.trim() : null,
      external_contact: form.hatch_type === 'external' ? form.external_contact.trim() : null,
      cost: form.hatch_type === 'external' && form.cost ? Number(form.cost) : 0,
      eggs_set: Number(form.eggs_set) || 0,
      eggs_hatched: Number(form.eggs_hatched) || 0,
      mortality: Number(form.mortality) || 0
    });
  };

  // KPIs
  const totalBatches = records.length;
  const internalRecords = records.filter(r => (r.hatch_type || 'internal') === 'internal');
  const externalRecords = records.filter(r => r.hatch_type === 'external');
  const totalEggsSet = records.reduce((sum, r) => sum + (Number(r.eggs_set) || 0), 0);
  const totalHatched = records.reduce((sum, r) => sum + (Number(r.eggs_hatched) || 0), 0);
  const internalHatched = internalRecords.reduce((sum, r) => sum + (Number(r.eggs_hatched) || 0), 0);
  const externalCost = externalRecords.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);
  const overallHatchRate = totalEggsSet > 0 ? ((totalHatched / totalEggsSet) * 100).toFixed(1) : '0.0';

  const filtered = records.filter(r => {
    const recType = r.hatch_type || 'internal';
    if (typeFilter !== 'all' && recType !== typeFilter) return false;

    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (r.batch_number || '').toLowerCase().includes(s) ||
      (r.animal_type || '').toLowerCase().includes(s) ||
      (r.external_provider || '').toLowerCase().includes(s) ||
      (r.notes || '').toLowerCase().includes(s)
    );
  });

  // Calculate live hatch preview in form
  const previewEggsSet = Number(form.eggs_set) || 0;
  const previewEggsHatched = Number(form.eggs_hatched) || 0;
  const previewHatchRate = previewEggsSet > 0 ? ((previewEggsHatched / previewEggsSet) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Egg className="w-6 h-6 text-emerald-600" /> Hatchery Records
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage internal farm incubation and external outsourced hatching batches, success rates, and service fees
          </p>
        </div>
        <Button onClick={() => openForm()} className="font-bold bg-emerald-800 hover:bg-emerald-900 text-white shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Add Hatch Record
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted text-foreground flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Batches</p>
              <p className="text-2xl font-bold">{totalBatches}</p>
              <p className="text-[11px] text-muted-foreground">{totalEggsSet.toLocaleString()} eggs set</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Internal (Farm)</p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{internalRecords.length}</p>
              <p className="text-[11px] text-muted-foreground">{internalHatched.toLocaleString()} hatched on-farm</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">External (Outsourced)</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{externalRecords.length}</p>
              <p className="text-[11px] text-muted-foreground">Fees: {formatCurrency(externalCost)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Overall Hatch Rate</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{overallHatchRate}%</p>
              <p className="text-[11px] text-muted-foreground">{totalHatched.toLocaleString()} total hatched</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <Tabs value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-3 w-full sm:w-[380px]">
            <TabsTrigger value="all">All ({records.length})</TabsTrigger>
            <TabsTrigger value="internal" className="flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" /> Internal ({internalRecords.length})
            </TabsTrigger>
            <TabsTrigger value="external" className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" /> External ({externalRecords.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-9 w-full" 
            placeholder="Search batch, animal, hatcher…" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      {/* Records Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Hatch Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Batch #</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Animal Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Hatched By / Location</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Eggs Set</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Hatched</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Mortality</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Hatch Rate</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Hatching Fee</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      <td colSpan={11} className="px-4 py-4"><div className="h-4 bg-muted animate-pulse rounded w-full" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-12 text-muted-foreground">
                      <Egg className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="font-medium text-sm">No hatchery records found</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {typeFilter === 'external' ? 'No external / outsourced batches found.' :
                         typeFilter === 'internal' ? 'No internal on-farm batches found.' :
                         'Add your first hatchery record using the button above.'}
                      </p>
                    </td>
                  </tr>
                ) : filtered.map(r => {
                  const hatchRate = r.eggs_set > 0 ? ((r.eggs_hatched / r.eggs_set) * 100).toFixed(1) : '0.0';
                  const isExternal = r.hatch_type === 'external';

                  return (
                    <tr key={r.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(r.date)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isExternal ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            <ExternalLink className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            External
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <Home className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            Internal
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium">{r.batch_number || '—'}</td>
                      <td className="px-4 py-3 font-medium">{r.animal_type}</td>
                      <td className="px-4 py-3">
                        {isExternal ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-blue-600" />
                              {r.external_provider || 'External Service'}
                            </span>
                            {r.external_contact && (
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3" /> {r.external_contact}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs flex items-center gap-1">
                            <Home className="w-3.5 h-3.5 text-emerald-600" /> On-Farm Hatchery
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">{r.eggs_set.toLocaleString()}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">{r.eggs_hatched.toLocaleString()}</td>
                      <td className="px-4 py-3 text-red-500">{r.mortality.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${
                          Number(hatchRate) >= 75 ? 'text-emerald-600 dark:text-emerald-400' :
                          Number(hatchRate) >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500'
                        }`}>
                          {hatchRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isExternal && Number(r.cost) > 0 ? (
                          <span className="font-semibold text-foreground text-xs">{formatCurrency(r.cost)}</span>
                        ) : (
                          <span className="text-muted-foreground/60 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => openForm(r)} 
                            className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"
                            title="Edit Record"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { if (confirm('Delete this hatchery record?')) deleteMut.mutate(r.id); }} 
                            className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-muted"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Add / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Egg className="w-5 h-5 text-emerald-600" />
              {editing ? 'Edit Hatchery Record' : 'Add Hatchery Record'}
            </DialogTitle>
            <DialogDescription>
              Select whether eggs were hatched within the farm or outsourced to an external provider.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            {/* Hatching Type Selector */}
            <div className="space-y-2">
              <Label className="font-semibold">Hatching Type *</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, hatch_type: 'internal' })}
                  className={`p-3 rounded-lg text-left transition-all border flex flex-col gap-1 ${
                    form.hatch_type === 'internal'
                      ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-md ${form.hatch_type === 'internal' ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                      <Home className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-foreground">Internal (Farm)</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Hatched on-site inside our farm facility / incubators</p>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, hatch_type: 'external' })}
                  className={`p-3 rounded-lg text-left transition-all border flex flex-col gap-1 ${
                    form.hatch_type === 'external'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-md ${form.hatch_type === 'external' ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-foreground">External</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Hatched by an external person or service provider</p>
                </button>
              </div>
            </div>

            {/* External Hatching Details (Shown conditionally) */}
            {form.hatch_type === 'external' && (
              <div className="p-3.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 dark:text-blue-300">
                  <Building2 className="w-4 h-4" /> External Hatcher Information
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Hatched By / Service Provider Name *</Label>
                  <Input 
                    value={form.external_provider} 
                    onChange={e => setForm({ ...form, external_provider: e.target.value })} 
                    placeholder="e.g. Alhaji Musa Hatchery, Dr. Bello, Sunrise Farm" 
                    required={form.hatch_type === 'external'}
                    className="bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Provider Phone / Contact</Label>
                    <Input 
                      value={form.external_contact} 
                      onChange={e => setForm({ ...form, external_contact: e.target.value })} 
                      placeholder="e.g. 0803 123 4567" 
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Hatching Cost / Fee (₦)</Label>
                    <Input 
                      type="number" 
                      min="0" 
                      step="any"
                      value={form.cost} 
                      onChange={e => setForm({ ...form, cost: e.target.value })} 
                      placeholder="e.g. 25000" 
                      className="bg-background"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Date *</Label>
                <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
              </div>

              <div className="space-y-1.5">
                <Label>Batch Number</Label>
                <Input value={form.batch_number} onChange={e => setForm({ ...form, batch_number: e.target.value })} placeholder="e.g. BATCH-001" />
              </div>

              <div className="space-y-1.5 col-span-2">
                <Label>Animal / Breed Type *</Label>
                <Input value={form.animal_type} onChange={e => setForm({ ...form, animal_type: e.target.value })} placeholder="e.g. Broiler, Layer, Catfish, Turkey" required />
              </div>

              <div className="space-y-1.5">
                <Label>Eggs / Seeds Set *</Label>
                <Input type="number" min="0" value={form.eggs_set} onChange={e => setForm({ ...form, eggs_set: e.target.value })} placeholder="0" required />
              </div>

              <div className="space-y-1.5">
                <Label>Successfully Hatched *</Label>
                <Input type="number" min="0" value={form.eggs_hatched} onChange={e => setForm({ ...form, eggs_hatched: e.target.value })} placeholder="0" required />
              </div>

              <div className="space-y-1.5 col-span-2">
                <Label>Mortality *</Label>
                <Input type="number" min="0" value={form.mortality} onChange={e => setForm({ ...form, mortality: e.target.value })} placeholder="0" required />
              </div>
            </div>

            {/* Live Calculation Preview */}
            {previewEggsSet > 0 && (
              <div className="p-2.5 rounded-md bg-muted/60 border text-xs flex items-center justify-between">
                <span className="text-muted-foreground">Calculated Hatch Rate:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{previewHatchRate}%</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Notes & Remarks</Label>
              <Textarea 
                value={form.notes} 
                onChange={e => setForm({ ...form, notes: e.target.value })} 
                rows={2} 
                placeholder="Incubator readings, delivery conditions, or extra observations..."
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMut.isPending} className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold">
                {editing ? 'Update Record' : 'Save Record'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
