import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, Search, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { capitalize } from '@/lib/utils';

interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  description: string;
  created_at: string;
  user?: { name: string; role: string };
}

export default function ActivityLogsPage() {
  const [search, setSearch] = useState('');

  const { data: logs = [], isLoading } = useQuery<ActivityLog[]>({
    queryKey: ['activity-logs'],
    queryFn: () => api.get('/activity-logs').then(r => r.data),
    refetchInterval: 15000, // Refresh every 15s to keep it real-time
  });

  const filtered = logs.filter(l => {
    if (!search) return true;
    const s = search.toLowerCase();
    return l.description.toLowerCase().includes(s) || 
           (l.user?.name || '').toLowerCase().includes(s) ||
           l.action.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity Logs</h2>
          <p className="text-muted-foreground text-sm">System-wide audit trail of user actions</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9 w-full" placeholder="Search logs by user, action, or description…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">User</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Action</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(10)].map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      <td colSpan={4} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded w-full" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-muted-foreground">
                      <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      No logs found.
                    </td>
                  </tr>
                ) : filtered.map(log => (
                  <tr key={log.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <User className="w-3 h-3" />
                      </div>
                      <div>
                        <p>{log.user?.name || 'System'}</p>
                        <p className="text-[10px] text-muted-foreground leading-none capitalize">{log.user?.role?.replace('_', ' ')}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        log.action === 'created' ? 'bg-green-100 text-green-700' :
                        log.action === 'deleted' ? 'bg-red-100 text-red-700' :
                        log.action === 'updated' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {capitalize(log.action)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{log.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
