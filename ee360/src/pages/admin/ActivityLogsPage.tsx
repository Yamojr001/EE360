import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, Search, User, Eye, Tag, Database, Shield, CheckCircle2, FileText, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { formatDate, capitalize } from '@/lib/utils';

interface ActivityLog {
  id: number;
  user_id: number | null;
  action: string;
  description: string;
  model_type?: string | null;
  model_id?: number | null;
  created_at: string;
  user?: { id: number; name: string; role: string; email?: string } | null;
}

export default function ActivityLogsPage() {
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  const { data: logs = [], isLoading } = useQuery<ActivityLog[]>({
    queryKey: ['activity-logs'],
    queryFn: () => api.get('/activity-logs').then(r => r.data),
    refetchInterval: 15000,
  });

  const filtered = logs.filter(l => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      l.description?.toLowerCase().includes(s) ||
      (l.user?.name || '').toLowerCase().includes(s) ||
      (l.user?.email || '').toLowerCase().includes(s) ||
      l.action?.toLowerCase().includes(s) ||
      (l.model_type || '').toLowerCase().includes(s)
    );
  });

  const getActionColor = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('create') || a.includes('add')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (a.includes('delete') || a.includes('remove') || a.includes('revoke')) return 'bg-red-100 text-red-800 border-red-200';
    if (a.includes('update') || a.includes('edit')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (a.includes('login') || a.includes('auth')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const formatModelName = (modelType?: string | null) => {
    if (!modelType) return 'N/A';
    const parts = modelType.split('\\');
    return parts[parts.length - 1].replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity Logs</h2>
          <p className="text-muted-foreground text-sm">Real-time system audit trail & operational history</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 w-full"
            placeholder="Search logs by user, action, or description…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-medium text-muted-foreground">
                  <th className="text-left px-4 py-3">Time</th>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Action</th>
                  <th className="text-left px-4 py-3">Description</th>
                  <th className="text-right px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      <td colSpan={5} className="px-4 py-3">
                        <div className="h-4 bg-muted animate-pulse rounded w-full" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-muted-foreground">
                      <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      No activity logs found.
                    </td>
                  </tr>
                ) : (
                  filtered.map(log => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="border-b border-border hover:bg-muted/40 cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString('en-NG', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                            {log.user?.name ? log.user.name.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div>
                            <p className="leading-snug">{log.user?.name || 'System / Auto'}</p>
                            {log.user?.role && (
                              <p className="text-[10px] text-muted-foreground leading-none capitalize">
                                {log.user.role.replace('_', ' ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${getActionColor(log.action)}`}>
                          {capitalize(log.action)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-md truncate">
                        {log.description}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs gap-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                        >
                          <Eye className="w-3.5 h-3.5" /> View
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

      {/* Activity Log Full Details Modal */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => { if (!open) setSelectedLog(null); }}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-primary" />
              Activity Log Details #{selectedLog?.id}
            </DialogTitle>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-5 pt-2">
              {/* Header Status Strip */}
              <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold border ${getActionColor(selectedLog.action)}`}>
                    {selectedLog.action.toUpperCase()}
                  </span>
                  <span className="text-xs text-muted-foreground">Log Entry #{selectedLog.id}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold">
                    {new Date(selectedLog.created_at).toLocaleDateString('en-NG', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(selectedLog.created_at).toLocaleTimeString('en-NG')}
                  </p>
                </div>
              </div>

              {/* User Metadata */}
              <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> User Information
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-semibold">{selectedLog.user?.name || 'System Auto Action'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">System Role</p>
                    <p className="font-medium capitalize">{selectedLog.user?.role?.replace('_', ' ') || 'N/A'}</p>
                  </div>
                  {selectedLog.user?.email && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Email Address</p>
                      <p className="font-mono text-xs text-primary">{selectedLog.user.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Description */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Event Description
                </p>
                <div className="bg-muted/30 border border-border rounded-lg p-4 text-sm font-medium leading-relaxed text-foreground">
                  {selectedLog.description}
                </div>
              </div>

              {/* Module & Technical Metadata */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card border border-border rounded-lg p-3">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Database className="w-3 h-3" /> Target Entity / Module
                  </p>
                  <p className="text-xs font-semibold mt-1">{formatModelName(selectedLog.model_type)}</p>
                  {selectedLog.model_type && (
                    <p className="text-[10px] font-mono text-muted-foreground truncate">{selectedLog.model_type}</p>
                  )}
                </div>

                <div className="bg-card border border-border rounded-lg p-3">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Record ID
                  </p>
                  <p className="text-xs font-semibold mt-1">
                    {selectedLog.model_id ? `#${selectedLog.model_id}` : 'None'}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Database Prim Key</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedLog(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
