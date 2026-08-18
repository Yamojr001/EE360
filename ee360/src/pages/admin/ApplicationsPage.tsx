import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Search, GraduationCap, Briefcase, Award, CheckCircle, XCircle, Clock, Eye, Trash2, Settings, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

interface Application {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  institution?: string;
  course_of_study?: string;
  application_type: 'siwes' | 'internship' | 'nysc';
  duration_months?: string;
  start_date?: string;
  passport_photo?: string;
  passport_url?: string;
  document_path?: string;
  document_url?: string;
  cover_letter?: string;
  status: 'pending' | 'accepted' | 'rejected';
  admin_notes?: string;
  created_at: string;
}

interface PortalSettings {
  siwes_open: boolean;
  internship_open: boolean;
  nysc_open: boolean;
}

const TYPE_COLOR: Record<string, string> = {
  siwes: 'bg-blue-100 text-blue-800 border-blue-200',
  internship: 'bg-purple-100 text-purple-800 border-purple-200',
  nysc: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  accepted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

export default function ApplicationsPage() {
  const qc = useQueryClient();
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [manageSettingsOpen, setManageSettingsOpen] = useState(false);

  // Queries
  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ['admin-applications', typeFilter, statusFilter, search],
    queryFn: () => api.get('/applications', {
      params: { type: typeFilter, status: statusFilter, search }
    }).then(r => r.data),
  });

  const { data: settings } = useQuery<PortalSettings>({
    queryKey: ['public-application-settings'],
    queryFn: () => api.get('/public/applications/settings').then(r => r.data),
  });

  // Settings State
  const [siwesOpen, setSiwesOpen] = useState(true);
  const [internshipOpen, setInternshipOpen] = useState(true);
  const [nyscOpen, setNyscOpen] = useState(true);

  // Sync settings state when modal opens
  const openSettingsModal = () => {
    if (settings) {
      setSiwesOpen(settings.siwes_open);
      setInternshipOpen(settings.internship_open);
      setNyscOpen(settings.nysc_open);
    }
    setManageSettingsOpen(true);
  };

  // Mutations
  const updateStatusMut = useMutation({
    mutationFn: ({ id, status, admin_notes }: { id: number; status: string; admin_notes?: string }) =>
      api.put(`/applications/${id}`, { status, admin_notes }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-applications'] });
      toast.success('Application status updated!');
      setSelectedApp(null);
    },
    onError: () => toast.error('Failed to update application'),
  });

  const updateSettingsMut = useMutation({
    mutationFn: (d: PortalSettings) => api.post('/applications/settings', d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['public-application-settings'] });
      toast.success('Portal intake settings updated!');
      setManageSettingsOpen(false);
    },
    onError: () => toast.error('Failed to update settings'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/applications/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-applications'] });
      toast.success('Application deleted');
      setSelectedApp(null);
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">SIWES / Internship / NYSC Applications</h2>
          <p className="text-muted-foreground text-sm">
            Review and manage student attachment and NYSC posting applications.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openSettingsModal}>
            <Settings className="w-4 h-4 mr-2 text-emerald-600" /> Portal Controls
          </Button>
          <Button asChild className="bg-emerald-700 hover:bg-emerald-800 text-white">
            <Link href="/apply" target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" /> Open Application Portal
            </Link>
          </Button>
        </div>
      </div>

      {/* Intake Status Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase">SIWES Intake</span>
                <p className="font-bold text-slate-900">{settings?.siwes_open ? 'OPEN FOR APPLICATION' : 'CLOSED'}</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded font-bold ${settings?.siwes_open ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              {settings?.siwes_open ? 'Active' : 'Paused'}
            </span>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-purple-600" />
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase">Internship Intake</span>
                <p className="font-bold text-slate-900">{settings?.internship_open ? 'OPEN FOR APPLICATION' : 'CLOSED'}</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded font-bold ${settings?.internship_open ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              {settings?.internship_open ? 'Active' : 'Paused'}
            </span>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-emerald-600" />
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase">NYSC Corp Intake</span>
                <p className="font-bold text-slate-900">{settings?.nysc_open ? 'OPEN FOR APPLICATION' : 'CLOSED'}</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded font-bold ${settings?.nysc_open ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              {settings?.nysc_open ? 'Active' : 'Paused'}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="siwes">SIWES</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="nysc">NYSC</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search name, phone, school..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Applications Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-muted-foreground text-xs font-semibold text-left">
                  <th className="px-4 py-3">Applicant</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Institution & Department</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Submitted Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}><td colSpan={7} className="p-4"><div className="h-4 bg-muted animate-pulse rounded" /></td></tr>
                  ))
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-muted-foreground">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  applications.map(app => (
                    <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {app.passport_url ? (
                            <img src={app.passport_url} alt={app.full_name} className="w-9 h-9 rounded-full object-cover border" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs">
                              {app.full_name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{app.full_name}</p>
                            <p className="text-xs text-muted-foreground">{app.duration_months || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded border ${TYPE_COLOR[app.application_type] || 'bg-slate-100'}`}>
                          {app.application_type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{app.institution || '—'}</p>
                        <p className="text-xs text-muted-foreground">{app.course_of_study || '—'}</p>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <p className="font-semibold">{app.phone}</p>
                        <p className="text-muted-foreground">{app.email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {formatDate(app.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded border ${STATUS_COLOR[app.status]}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)}>
                          <Eye className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View & Review Modal */}
      {selectedApp && (
        <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                Application Details — <span className="uppercase text-emerald-700">{selectedApp.application_type}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-2">
              <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                {selectedApp.passport_url ? (
                  <img src={selectedApp.passport_url} alt={selectedApp.full_name} className="w-20 h-24 rounded-lg object-cover border shadow-sm" />
                ) : (
                  <div className="w-20 h-24 rounded-lg bg-slate-200 text-slate-500 font-bold flex items-center justify-center text-lg border">
                    No Photo
                  </div>
                )}
                <div className="space-y-1 flex-1">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{selectedApp.full_name}</h3>
                  <p className="text-xs text-emerald-700 font-bold uppercase">{selectedApp.application_type} Applicant</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs pt-2">
                    <p><strong>Email:</strong> {selectedApp.email}</p>
                    <p><strong>Phone:</strong> {selectedApp.phone}</p>
                    <p><strong>Institution:</strong> {selectedApp.institution || '—'}</p>
                    <p><strong>Course:</strong> {selectedApp.course_of_study || '—'}</p>
                    <p><strong>Duration:</strong> {selectedApp.duration_months || '—'}</p>
                    <p><strong>Start Date:</strong> {selectedApp.start_date ? formatDate(selectedApp.start_date) : '—'}</p>
                  </div>
                </div>
              </div>

              {selectedApp.cover_letter && (
                <div className="space-y-1.5">
                  <Label className="font-bold">Cover Note / Statement of Purpose</Label>
                  <div className="p-3 bg-muted rounded-lg text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                    {selectedApp.cover_letter}
                  </div>
                </div>
              )}

              {selectedApp.document_url && (
                <div className="p-3 border rounded-lg flex items-center justify-between bg-blue-50/50 border-blue-200">
                  <span className="text-xs font-semibold text-blue-900">Uploaded CV / Attachment Document</span>
                  <Button size="sm" variant="outline" asChild className="bg-white">
                    <a href={selectedApp.document_url} target="_blank" rel="noopener noreferrer">
                      Download File <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </Button>
                </div>
              )}

              {/* Status Update Form */}
              <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900 space-y-3">
                <Label className="font-bold text-sm">Review & Update Status</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={selectedApp.status === 'pending' ? 'default' : 'outline'}
                    className={selectedApp.status === 'pending' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                    onClick={() => updateStatusMut.mutate({ id: selectedApp.id, status: 'pending' })}
                  >
                    <Clock className="w-4 h-4 mr-1" /> Pending
                  </Button>
                  <Button
                    type="button"
                    variant={selectedApp.status === 'accepted' ? 'default' : 'outline'}
                    className={selectedApp.status === 'accepted' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                    onClick={() => updateStatusMut.mutate({ id: selectedApp.id, status: 'accepted' })}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Accept
                  </Button>
                  <Button
                    type="button"
                    variant={selectedApp.status === 'rejected' ? 'default' : 'outline'}
                    className={selectedApp.status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
                    onClick={() => updateStatusMut.mutate({ id: selectedApp.id, status: 'rejected' })}
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this application record?')) {
                        deleteMut.mutate(selectedApp.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete Application
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedApp(null)}>Close</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Manage Intake Settings Modal */}
      <Dialog open={manageSettingsOpen} onOpenChange={setManageSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Portal Intake Controls</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-2">
            <p className="text-xs text-muted-foreground">
              Select which application types are open to candidates. You can open 1, 2, or all 3 intake portals.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                <div>
                  <span className="font-bold text-sm block">SIWES Intake</span>
                  <span className="text-xs text-slate-500">Allow SIWES industrial training submissions</span>
                </div>
                <Switch checked={siwesOpen} onCheckedChange={setSiwesOpen} />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                <div>
                  <span className="font-bold text-sm block">Internship Intake</span>
                  <span className="text-xs text-slate-500">Allow professional internship submissions</span>
                </div>
                <Switch checked={internshipOpen} onCheckedChange={setInternshipOpen} />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                <div>
                  <span className="font-bold text-sm block">NYSC Corp Intake</span>
                  <span className="text-xs text-slate-500">Allow NYSC primary assignment submissions</span>
                </div>
                <Switch checked={nyscOpen} onCheckedChange={setNyscOpen} />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setManageSettingsOpen(false)}>Cancel</Button>
              <Button
                disabled={updateSettingsMut.isPending}
                className="bg-emerald-700 hover:bg-emerald-800 text-white"
                onClick={() => updateSettingsMut.mutate({
                  siwes_open: siwesOpen,
                  internship_open: internshipOpen,
                  nysc_open: nyscOpen,
                })}
              >
                Save Portal Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
