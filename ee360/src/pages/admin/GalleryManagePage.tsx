import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Images, Calendar, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

const CATEGORIES = ['livestock', 'water', 'workers', 'general'];

const GRADIENT: Record<string, string> = {
  livestock: 'from-emerald-600 to-teal-700',
  water:     'from-cyan-600 to-blue-700',
  workers:   'from-amber-500 to-orange-600',
  general:   'from-violet-600 to-purple-700',
};

interface GalleryItem {
  id: number; title: string; description: string;
  image_url: string; category: string; created_at: string; posted_by: string;
}

const EMPTY: Omit<GalleryItem,'id'|'created_at'|'posted_by'> = {
  title: '', description: '', image_url: '', category: 'general',
};

export default function GalleryManagePage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen]     = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm]       = useState({ ...EMPTY });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: items = [], isLoading } = useQuery<GalleryItem[]>({
    queryKey: ['gallery'],
    queryFn: () => api.get('/gallery').then(r => r.data),
  });

  const createMut = useMutation({
    mutationFn: (body: any) => api.post('/gallery', { ...body, posted_by: user?.name }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['gallery'] }); toast.success('Photo added'); closeDialog(); },
    onError: () => toast.error('Failed to add photo'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: number; body: any }) => api.put(`/gallery/${id}`, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['gallery'] }); toast.success('Photo updated'); closeDialog(); },
    onError: () => toast.error('Failed to update'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/gallery/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['gallery'] }); toast.success('Deleted'); setDeleteId(null); },
    onError: () => toast.error('Failed to delete'),
  });

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setOpen(true); };
  const openEdit   = (item: GalleryItem) => { setEditing(item); setForm({ title: item.title, description: item.description, image_url: item.image_url, category: item.category }); setOpen(true); };
  const closeDialog = () => { setOpen(false); setEditing(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) updateMut.mutate({ id: editing.id, body: form });
    else         createMut.mutate(form);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <Images className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Gallery Manager</h1>
            <p className="text-sm text-muted-foreground">Add and manage public gallery photos</p>
          </div>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Add Photo
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="aspect-video bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              {/* Image / gradient placeholder */}
              <div className="relative aspect-video">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${GRADIENT[item.category] ?? 'from-gray-600 to-gray-700'} flex items-center justify-center`}>
                    <p className="text-white/30 text-xs font-medium">No image URL</p>
                  </div>
                )}
                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => openEdit(item)} className="gap-1">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(item.id)} className="gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize',
                    item.category === 'livestock' ? 'bg-emerald-100 text-emerald-700' :
                    item.category === 'water'     ? 'bg-cyan-100 text-cyan-700'     :
                    item.category === 'workers'   ? 'bg-amber-100 text-amber-700'   :
                                                    'bg-violet-100 text-violet-700',
                  )}>
                    {item.category}
                  </span>
                </div>
                <p className="font-semibold text-sm text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{item.created_at}</span>
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{item.posted_by}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Photo' : 'Add New Photo'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input placeholder="Poultry House" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Image URL <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input placeholder="https://..." type="url" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
              <p className="text-xs text-muted-foreground">Leave blank to use a category colour gradient.</p>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea placeholder="Brief caption for the photo…" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>
                {editing ? 'Save Changes' : 'Add Photo'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Delete Photo?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will remove the photo from the public gallery. This cannot be undone.</p>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" disabled={deleteMut.isPending} onClick={() => deleteId && deleteMut.mutate(deleteId)}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
