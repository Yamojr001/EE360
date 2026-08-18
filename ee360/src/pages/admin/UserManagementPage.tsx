import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ShieldCheck, Search, Users, Key, UserX } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface UserAccount {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'farm_manager' | 'water_manager';
  created_at: string;
}

export default function UserManagementPage() {
  const qc = useQueryClient();
  const { user: currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UserAccount | null>(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farm_manager' as 'super_admin' | 'farm_manager' | 'water_manager',
  });

  const { data: users = [], isLoading } = useQuery<UserAccount[]>({
    queryKey: ['portal-users'],
    queryFn: () => api.get('/users').then(r => r.data),
  });

  const createMut = useMutation({
    mutationFn: (body: any) => api.post('/users', body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['portal-users'] });
      toast.success('Portal user account created');
      closeDialog();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create user account'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: number; body: any }) => api.put(`/users/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['portal-users'] });
      toast.success('User account updated');
      closeDialog();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update user account'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['portal-users'] });
      toast.success('Portal access revoked and account deleted');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to revoke user access'),
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', email: '', password: '', role: 'farm_manager' });
    setOpen(true);
  };

  const openEdit = (u: UserAccount) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMut.mutate({ id: editing.id, body: form });
    } else {
      createMut.mutate(form);
    }
  };

  const filtered = users.filter(u => {
    if (!search) return true;
    const s = search.toLowerCase();
    return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.role.toLowerCase().includes(s);
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge className="bg-amber-500 text-white hover:bg-amber-600">Super Admin</Badge>;
      case 'farm_manager':
        return <Badge className="bg-blue-600 text-white hover:bg-blue-700">Farm Manager</Badge>;
      case 'water_manager':
        return <Badge className="bg-sky-600 text-white hover:bg-sky-700">Water Manager</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Portal User Accounts</h1>
            <p className="text-sm text-muted-foreground">Manage login credentials and access levels for system administrators & managers</p>
          </div>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold">
          <Plus className="w-4 h-4" /> Add User Account
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name, email, or role…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email / Login ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">System Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-4 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No user accounts found</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{u.name}</p>
                        {currentUser?.id === u.id && (
                          <span className="text-[10px] text-emerald-600 font-bold">(You)</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{u.email}</td>
                  <td className="px-4 py-3">{getRoleBadge(u.role)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Access
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Button size="sm" variant="ghost" className="h-8 px-2 text-xs gap-1" onClick={() => openEdit(u)}>
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </Button>
                      {currentUser?.id !== u.id && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 gap-1" 
                          onClick={() => {
                            if (confirm(`Revoke portal access and delete account for "${u.name}" (${u.email})?`)) {
                              deleteMut.mutate(u.id);
                            }
                          }}
                        >
                          <UserX className="w-3.5 h-3.5" /> Revoke Access
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog for Add / Edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Portal Account' : 'Add Portal User Account'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update user profile details or assign a new role.' : 'Create a new login credential for system management.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Full Name *</Label>
              <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. John Doe" />
            </div>

            <div className="space-y-1.5">
              <Label>Email Address (Login ID) *</Label>
              <Input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="manager@eefarm360.com" />
            </div>

            <div className="space-y-1.5">
              <Label>{editing ? 'New Password (leave blank to keep existing)' : 'Account Password *'}</Label>
              <Input type="password" required={!editing} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
            </div>

            <div className="space-y-1.5">
              <Label>Portal Access Role *</Label>
              <Select value={form.role} onValueChange={(v: any) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="farm_manager">Farm Manager (Farm Sector Only)</SelectItem>
                  <SelectItem value="water_manager">Water Manager (Water Sector Only)</SelectItem>
                  <SelectItem value="super_admin">Super Admin (Full Oversight & User Management)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 justify-end pt-3">
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button type="submit" disabled={createMut.isPending || updateMut.isPending} className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold">
                {editing ? 'Update Account' : 'Create Account'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
