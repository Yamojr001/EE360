'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, AlertCircle } from 'lucide-react';

interface LivestockRecord {
  id: string;
  type: 'cattle' | 'goat' | 'pig' | 'poultry' | 'sheep';
  breed: string;
  quantity: number;
  age: string;
  weight: number;
  status: 'healthy' | 'sick' | 'quarantine' | 'sold';
  lastVetCheck: string;
}

// Mock data
const mockLivestock: LivestockRecord[] = [
  {
    id: '1',
    type: 'cattle',
    breed: 'Holstein Friesian',
    quantity: 5,
    age: '2-3 years',
    weight: 600,
    status: 'healthy',
    lastVetCheck: '2025-03-15',
  },
  {
    id: '2',
    type: 'goat',
    breed: 'Boer Goat',
    quantity: 12,
    age: '1-2 years',
    weight: 80,
    status: 'healthy',
    lastVetCheck: '2025-03-20',
  },
  {
    id: '3',
    type: 'poultry',
    breed: 'Broiler',
    quantity: 500,
    age: '6 weeks',
    weight: 2.2,
    status: 'healthy',
    lastVetCheck: '2025-04-01',
  },
  {
    id: '4',
    type: 'pig',
    breed: 'Large White',
    quantity: 8,
    age: '4-5 months',
    weight: 120,
    status: 'healthy',
    lastVetCheck: '2025-03-10',
  },
  {
    id: '5',
    type: 'cattle',
    breed: 'Jersey',
    quantity: 2,
    age: '1 year',
    weight: 400,
    status: 'sick',
    lastVetCheck: '2025-04-05',
  },
];

const statusBadgeVariant = {
  healthy: 'default',
  sick: 'destructive',
  quarantine: 'outline',
  sold: 'secondary',
} as const;

const typeLabel = {
  cattle: 'Cattle',
  goat: 'Goat',
  pig: 'Pig',
  poultry: 'Poultry',
  sheep: 'Sheep',
};

export default function LivestockPage() {
  const [livestock, setLivestock] = useState<LivestockRecord[]>(mockLivestock);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredLivestock = livestock.filter(
    (record) =>
      (record.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        typeLabel[record.type].toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === 'all' || record.status === filterStatus)
  );

  const handleDeleteLivestock = (id: string) => {
    setLivestock(livestock.filter((l) => l.id !== id));
  };

  const totalAnimals = livestock.reduce((sum, record) => sum + record.quantity, 0);
  const healthyAnimals = livestock
    .filter((r) => r.status === 'healthy')
    .reduce((sum, r) => sum + r.quantity, 0);
  const sickAnimals = livestock
    .filter((r) => r.status === 'sick')
    .reduce((sum, r) => sum + r.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Livestock Management</h1>
        <p className="text-muted-foreground mt-2">
          Track livestock inventory and health status
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnimals}</div>
            <p className="text-xs text-muted-foreground">All livestock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{healthyAnimals}</div>
            <p className="text-xs text-muted-foreground">Good health status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sick/Quarantine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{sickAnimals}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{livestock.length}</div>
            <p className="text-xs text-muted-foreground">Livestock groups</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert for sick animals */}
      {sickAnimals > 0 && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100">Animals Requiring Attention</h3>
            <p className="text-sm text-red-700 dark:text-red-300">
              {sickAnimals} animal{sickAnimals !== 1 ? 's' : ''} {sickAnimals === 1 ? 'is' : 'are'} sick or in quarantine. Schedule veterinary visits.
            </p>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search livestock..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="all">All Status</option>
            <option value="healthy">Healthy</option>
            <option value="sick">Sick</option>
            <option value="quarantine">Quarantine</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Livestock
        </Button>
      </div>

      {/* Livestock Table */}
      <Card>
        <CardHeader>
          <CardTitle>Livestock Inventory</CardTitle>
          <CardDescription>
            {filteredLivestock.length} record{filteredLivestock.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Avg. Weight (kg)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Vet Check</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLivestock.length > 0 ? (
                  filteredLivestock.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{typeLabel[record.type]}</TableCell>
                      <TableCell>{record.breed}</TableCell>
                      <TableCell>{record.quantity}</TableCell>
                      <TableCell>{record.age}</TableCell>
                      <TableCell>{record.weight}</TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant[record.status]}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(record.lastVetCheck).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => handleDeleteLivestock(record.id)}
                          className="p-2 hover:bg-destructive/10 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No livestock found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
