import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  AlertTriangle, Plus, Search, Trash2, Filter, Image as ImageIcon, 
  CheckCircle2, Clock, AlertCircle, Eye, ShieldAlert, FileText, Check
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

export interface Incident {
  id: number;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  image_path: string | null;
  image_url: string | null;
  reported_date: string;
  sector_id: number | null;
  reported_by: number | null;
  resolution_notes: string | null;
  created_at: string;
  reporter?: { id: number; name: string; role: string };
  sector?: { id: number; name: string };
}

const FARM_CATEGORIES = [
  'Animal Health & Mortality',
  'Feed & Crop Damage',
  'Hatchery & Incubator Issue',
  'Equipment & Machinery Breakdown',
  'Facility & Pen Infrastructure',
  'Staffing & Operations',
  'Security & Theft',
  'Other'
];

const WATER_CATEGORIES = [
  'Water Purification & Filtration',
  'Bottling & Packaging Line',
  'Water Quality & Sanitation',
  'Delivery & Distribution Vehicle',
  'Equipment & Generator Breakdown',
  'Facility Infrastructure',
  'Staffing & Operations',
  'Security & Theft',
  'Other'
];

const ALL_CATEGORIES = Array.from(new Set([...FARM_CATEGORIES, ...WATER_CATEGORIES]));

const SEVERITY_COLORS: Record<string, string> = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 font-bold',
};

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-red-100 text-red-700 border-red-200',
  in_progress: 'bg-amber-100 text-amber-700 border-amber-200',
  resolved: 'bg-green-100 text-green-700 border-green-200',
};

function ProblemReportForm({ sectorId, onSave, onClose }: { sectorId?: number; onSave: (fd: FormData) => void; onClose: () => void }) {
  const categories = sectorId === 2 ? WATER_CATEGORIES : sectorId === 1 ? FARM_CATEGORIES : ALL_CATEGORIES;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [reportedDate, setReportedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sector, setSector] = useState<string>(sectorId ? String(sectorId) : '1');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please enter a title and description');
      return;
    }

    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('category', category);
    fd.append('severity', severity);
    fd.append('reported_date', reportedDate);
    // Sector id is automatically set from prop if available
    const finalSector = sectorId ? String(sectorId) : sector;
    if (finalSector) fd.append('sector_id', finalSector);
    if (imageFile) fd.append('image', imageFile);

    onSave(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Event / Problem Title *</Label>
        <Input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder={sectorId === 2 ? "e.g. Purification pump filter leak" : "e.g. Incubator temperature fluctuation"} 
          required 
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Category *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Severity Level *</Label>
          <Select value={severity} onValueChange={(v: any) => setSeverity(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="critical">Critical / Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={`grid ${!sectorId ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
        <div className="space-y-1.5">
          <Label>Event Date *</Label>
          <Input 
            type="date" 
            value={reportedDate} 
            onChange={e => setReportedDate(e.target.value)} 
            required 
          />
        </div>

        {/* Only show Sector selector if user is not bound to a single sector */}
        {!sectorId && (
          <div className="space-y-1.5">
            <Label>Sector *</Label>
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Farm Sector</SelectItem>
                <SelectItem value="2">Water Sector</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Problem Description *</Label>
        <Textarea 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="Describe what happened, cause if known, damage caused or assistance required..." 
          rows={3} 
          required 
        />
      </div>

      <div className="space-y-1.5">
        <Label>Attach Picture / Photo (Optional)</Label>
        <Input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          className="cursor-pointer"
        />
        {imagePreview && (
          <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden border border-border">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button" 
              onClick={() => { setImageFile(null); setImagePreview(null); }} 
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-xs"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white">Submit Problem Report</Button>
      </div>
    </form>
  );
}

export default function IncidentsPage() {
  const qc = useQueryClient();
  const { user, isSuperAdmin } = useAuth();
  const sectorId = user?.role === 'water_manager' ? 2 : user?.role === 'farm_manager' ? 1 : undefined;

  const [adminSectorTab, setAdminSectorTab] = useState<'all' | '1' | '2'>('all');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionStatus, setResolutionStatus] = useState<'open' | 'in_progress' | 'resolved'>('resolved');

  // Query params: filter by sector_id for sector managers, or by admin tab for admin
  const effectiveSectorId = sectorId ?? (adminSectorTab === 'all' ? undefined : Number(adminSectorTab));

  const { data: incidents = [], isLoading } = useQuery<Incident[]>({
    queryKey: ['incidents', effectiveSectorId],
    queryFn: () => api.get('/incidents', { params: { sector_id: effectiveSectorId } }).then(r => r.data),
  });

  const availableCategories = sectorId === 2 ? WATER_CATEGORIES : sectorId === 1 ? FARM_CATEGORIES : ALL_CATEGORIES;

  const createMut = useMutation({
    mutationFn: (fd: FormData) => api.post('/incidents', fd),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['incidents'] });
      toast.success('Problem report logged successfully!');
      setOpen(false);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to log problem report';
      toast.error(msg);
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/incidents/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['incidents'] });
      toast.success('Incident updated');
      setSelectedIncident(null);
    },
    onError: () => toast.error('Failed to update incident'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/incidents/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['incidents'] });
      toast.success('Incident deleted');
    },
  });

  const filtered = incidents.filter(item => {
    const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchSev = severityFilter === 'all' || item.severity === severityFilter;
    const matchSearch = !search || 
      item.title.toLowerCase().includes(search.toLowerCase()) || 
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSev && matchSearch;
  });

  const openCount = incidents.filter(i => i.status === 'open').length;
  const inProgressCount = incidents.filter(i => i.status === 'in_progress').length;
  const resolvedCount = incidents.filter(i => i.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" /> Reported Problems & Incidents
          </h2>
          <p className="text-muted-foreground text-sm">
            {sectorId === 2 
              ? 'Track water purification, bottling line, and distribution issues' 
              : sectorId === 1 
              ? 'Track animal health, mortality, feed, and farm equipment issues'
              : 'Audit operational issues, machinery failures, and incidents across all sectors'}
          </p>
        </div>
        
          <Button onClick={() => setOpen(true)} className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
            <Plus className="w-4 h-4 mr-2" /> Report Problem / Event
          </Button>
      </div>

      {/* Admin Sector Switcher Tabs */}
      {isSuperAdmin && (
        <Tabs value={adminSectorTab} onValueChange={(v: any) => setAdminSectorTab(v)}>
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="all">All Sectors</TabsTrigger>
            <TabsTrigger value="1">Farm Sector</TabsTrigger>
            <TabsTrigger value="2">Water Sector</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* KPI summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Reports</p>
              <p className="text-xl font-bold">{incidents.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Open Issues</p>
              <p className="text-xl font-bold text-red-600">{openCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">In Progress</p>
              <p className="text-xl font-bold text-amber-600">{inProgressCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Resolved</p>
              <p className="text-xl font-bold text-green-600">{resolvedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter toolbar */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-9" 
            placeholder="Search problems by title or description..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {availableCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>

        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports list */}
      {isLoading ? (
        <div className="grid gap-4">
          {[...Array(4)].map((_, i) => <Card key={i} className="animate-pulse h-32" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
            <h3 className="font-semibold text-lg mb-1">No Problem Reports Found</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-4">
              Everything appears clear or no reports match your current filters.
            </p>
            <Button onClick={() => setOpen(true)}>Report First Problem</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map(item => (
            <Card key={item.id} className="hover:border-primary/20 transition-all overflow-hidden">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Image thumbnail if attached */}
                  {item.image_url ? (
                    <div 
                      onClick={() => setViewImage(item.image_url)}
                      className="w-full md:w-36 h-36 shrink-0 rounded-lg overflow-hidden bg-muted cursor-pointer relative group border border-border"
                    >
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1">
                        <Eye className="w-4 h-4" /> View Photo
                      </div>
                    </div>
                  ) : (
                    <div className="w-full md:w-28 h-28 shrink-0 rounded-lg bg-muted/50 border border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-6 h-6 mb-1 opacity-40" />
                      <span className="text-[10px]">No Photo</span>
                    </div>
                  )}

                  {/* Main Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[item.status]}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium capitalize ${SEVERITY_COLORS[item.severity]}`}>
                          {item.severity} Priority
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-muted font-medium">
                          {item.category}
                        </span>
                        {item.sector && (
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-medium">
                            {item.sector.name}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Reported on {formatDate(item.reported_date)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold leading-snug">{item.title}</h3>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">{item.description}</p>

                    {/* Resolution notes if present */}
                    {item.resolution_notes && (
                      <div className="mt-3 p-3 rounded-lg bg-muted/60 border border-border text-xs space-y-1">
                        <span className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Action / Resolution Notes:
                        </span>
                        <p className="text-muted-foreground">{item.resolution_notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground border-t border-border mt-3">
                      <span>
                        Reported by: <span className="font-medium text-foreground">{item.reporter?.name || 'Staff'}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-xs" 
                          onClick={() => {
                            setSelectedIncident(item);
                            setResolutionStatus(item.status);
                            setResolutionNotes(item.resolution_notes || '');
                          }}
                        >
                          Update Status / Resolution
                        </Button>

                        <button 
                          onClick={() => { if (confirm('Delete this problem report?')) deleteMut.mutate(item.id); }} 
                          className="text-muted-foreground hover:text-destructive p-1"
                          title="Delete report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Report Problem / Incident
            </DialogTitle>
            <DialogDescription>
              Log an issue, machine breakdown, or emergency for record & resolution.
            </DialogDescription>
          </DialogHeader>
          <ProblemReportForm 
            sectorId={sectorId} 
            onSave={fd => createMut.mutate(fd)} 
            onClose={() => setOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Resolution Update Modal */}
      <Dialog open={!!selectedIncident} onOpenChange={o => !o && setSelectedIncident(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Problem Status</DialogTitle>
            <DialogDescription>
              Update status and record resolution steps taken for "{selectedIncident?.title}"
            </DialogDescription>
          </DialogHeader>
          {selectedIncident && (
            <form onSubmit={e => {
              e.preventDefault();
              updateMut.mutate({
                id: selectedIncident.id,
                data: {
                  status: resolutionStatus,
                  resolution_notes: resolutionNotes,
                }
              });
            }} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Status *</Label>
                <Select value={resolutionStatus} onValueChange={(v: any) => setResolutionStatus(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open (Unresolved)</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved / Fixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Resolution / Action Notes</Label>
                <Textarea 
                  value={resolutionNotes} 
                  onChange={e => setResolutionNotes(e.target.value)} 
                  placeholder="Describe repair done, technician called, or corrective measures taken..."
                  rows={3} 
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setSelectedIncident(null)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white">Save Updates</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Photo Lightbox Modal */}
      <Dialog open={!!viewImage} onOpenChange={o => !o && setViewImage(null)}>
        <DialogContent className="max-w-3xl p-2 bg-black border-none">
          {viewImage && (
            <div className="relative flex items-center justify-center max-h-[80vh]">
              <img src={viewImage} alt="Report Photo" className="max-h-[80vh] w-auto object-contain rounded-md" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
