'use client';

import { useState } from 'react';
import { Plus, Search, MapPin, DollarSign, Briefcase, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface FarmWorker {
  id: string;
  name: string;
  role: string;
  phone: string;
  location: string;
  wage: number;
  wageType: 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'inactive';
  dateJoined: string;
}

const mockWorkers: FarmWorker[] = [
  {
    id: '1',
    name: 'Okonkwo Chinedu',
    role: 'Field Supervisor',
    phone: '+234 805 123 4567',
    location: 'Main Farm - North Plot',
    wage: 8000,
    wageType: 'daily',
    status: 'active',
    dateJoined: '2022-06-15',
  },
  {
    id: '2',
    name: 'Zainab Muhammad',
    role: 'Livestock Handler',
    phone: '+234 806 234 5678',
    location: 'Livestock Pen - East Block',
    wage: 6500,
    wageType: 'daily',
    status: 'active',
    dateJoined: '2023-01-20',
  },
  {
    id: '3',
    name: 'Adeyemi Oluwaseun',
    role: 'Crop Worker',
    phone: '+234 807 345 6789',
    location: 'Crop Field - South Plot',
    wage: 5500,
    wageType: 'daily',
    status: 'active',
    dateJoined: '2023-03-10',
  },
  {
    id: '4',
    name: 'Amara Obi',
    role: 'Equipment Maintenance',
    phone: '+234 808 456 7890',
    location: 'Farm Store - Central',
    wage: 85000,
    wageType: 'monthly',
    status: 'inactive',
    dateJoined: '2021-11-05',
  },
];

export default function FarmWorkersPage() {
  const [workers, setWorkers] = useState<FarmWorker[]>(mockWorkers);
  const [filteredWorkers, setFilteredWorkers] = useState<FarmWorker[]>(mockWorkers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const results = workers.filter(
      (w) =>
        w.name.toLowerCase().includes(term.toLowerCase()) ||
        w.role.toLowerCase().includes(term.toLowerCase()) ||
        w.location.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredWorkers(results);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this worker?')) {
      const updated = workers.filter((w) => w.id !== id);
      setWorkers(updated);
      setFilteredWorkers(updated);
      toast.success('Worker deleted');
    }
  };

  const stats = [
    {
      label: 'Total Workers',
      value: workers.length,
      color: 'bg-primary/10',
    },
    {
      label: 'Active',
      value: workers.filter((w) => w.status === 'active').length,
      color: 'bg-green-100',
    },
    {
      label: 'Inactive',
      value: workers.filter((w) => w.status === 'inactive').length,
      color: 'bg-gray-100',
    },
    {
      label: 'Monthly Cost',
      value: `₦${workers
        .filter((w) => w.wageType === 'monthly')
        .reduce((sum, w) => sum + w.wage, 0)
        .toLocaleString()}`,
      color: 'bg-blue-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farm Workers</h1>
          <p className="text-muted-foreground">Manage farm staff and workers</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Worker
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Farm Worker</DialogTitle>
              <DialogDescription>Register a new farm worker</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Worker name" />
              <Input placeholder="Role/Position" />
              <Input placeholder="Phone number" />
              <Input placeholder="Location" />
              <Input type="number" placeholder="Daily wage" />
              <Button className="w-full">Add Worker</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold mt-2 ${stat.color} p-2 rounded-lg text-center`}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workers List */}
      <Card>
        <CardHeader>
          <CardTitle>Farm Workers Directory</CardTitle>
          <CardDescription>All registered farm workers and staff</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, role, or location..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="space-y-3">
            {filteredWorkers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No workers found</div>
            ) : (
              filteredWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{worker.name}</h3>
                      <Badge variant={worker.status === 'active' ? 'default' : 'secondary'}>
                        {worker.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="w-4 h-4" />
                        <span>{worker.role}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{worker.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">
                          ₦{worker.wage.toLocaleString()} {worker.wageType === 'daily' ? '/day' : '/month'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Joined: {new Date(worker.dateJoined).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(worker.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
