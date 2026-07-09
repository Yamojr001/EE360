'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Droplet } from 'lucide-react';

interface Production {
  id: string;
  date: string;
  quantity: number; // liters
  costPerLiter: number;
  totalCost: number;
  batchNumber: string;
  status: 'in-progress' | 'completed' | 'quality-check';
}

const mockProduction: Production[] = [
  {
    id: '1',
    date: '2026-04-15',
    quantity: 2500,
    costPerLiter: 5,
    totalCost: 12500,
    batchNumber: 'B2026-0415-001',
    status: 'completed',
  },
  {
    id: '2',
    date: '2026-04-14',
    quantity: 1800,
    costPerLiter: 5,
    totalCost: 9000,
    batchNumber: 'B2026-0414-001',
    status: 'completed',
  },
  {
    id: '3',
    date: '2026-04-13',
    quantity: 3200,
    costPerLiter: 5,
    totalCost: 16000,
    batchNumber: 'B2026-0413-001',
    status: 'quality-check',
  },
  {
    id: '4',
    date: '2026-04-12',
    quantity: 2200,
    costPerLiter: 5,
    totalCost: 11000,
    batchNumber: 'B2026-0412-001',
    status: 'completed',
  },
];

export default function ProductionPage() {
  const [production, setProduction] = useState<Production[]>(mockProduction);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProduction = production.filter(
    (p) =>
      p.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.date.includes(searchTerm)
  );

  const totalProduced = production.reduce((sum, p) => sum + p.quantity, 0);
  const totalCost = production.reduce((sum, p) => sum + p.totalCost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Production Management</h1>
        <p className="text-muted-foreground mt-2">Track and manage water production batches</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Produced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProduced.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Liters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalCost / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Production costs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{production.filter((p) => p.status === 'completed').length}</div>
            <p className="text-xs text-muted-foreground">Ready for sale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalCost / totalProduced).toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Per liter</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search batches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Production
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Production</DialogTitle>
              <DialogDescription>Log a new production batch</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Quantity (liters)" type="number" />
              <Input placeholder="Date" type="date" />
              <Button className="w-full">Record Batch</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Production Table */}
      <Card>
        <CardHeader>
          <CardTitle>Production Batches</CardTitle>
          <CardDescription>{filteredProduction.length} batches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Quantity (L)</TableHead>
                  <TableHead>Cost/L</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProduction.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                    <TableCell>{batch.date}</TableCell>
                    <TableCell>{batch.quantity.toLocaleString()}</TableCell>
                    <TableCell>₦{batch.costPerLiter}</TableCell>
                    <TableCell>₦{batch.totalCost.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          batch.status === 'completed'
                            ? 'default'
                            : batch.status === 'quality-check'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {batch.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
