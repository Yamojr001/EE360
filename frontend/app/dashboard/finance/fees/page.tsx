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
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { FeeForm } from '@/components/finance/fee-form';

interface SchoolFee {
  id: string;
  amount: number;
  dueDate: string;
  academicYear: string;
  term: string;
  description?: string;
  status: 'active' | 'archived' | 'upcoming';
}

// Mock data
const mockFees: SchoolFee[] = [
  {
    id: '1',
    amount: 150000,
    dueDate: '2024-09-30',
    academicYear: '2024/2025',
    term: 'Term 1',
    description: 'First term school fees',
    status: 'active',
  },
  {
    id: '2',
    amount: 150000,
    dueDate: '2024-12-20',
    academicYear: '2024/2025',
    term: 'Term 2',
    description: 'Second term school fees',
    status: 'upcoming',
  },
  {
    id: '3',
    amount: 150000,
    dueDate: '2025-03-31',
    academicYear: '2024/2025',
    term: 'Term 3',
    description: 'Third term school fees',
    status: 'upcoming',
  },
];

const statusBadgeVariant = {
  active: 'default',
  archived: 'secondary',
  upcoming: 'outline',
} as const;

export default function FeesPage() {
  const [fees, setFees] = useState<SchoolFee[]>(mockFees);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<SchoolFee | null>(null);

  const filteredFees = fees.filter(
    (fee) =>
      fee.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.academicYear.includes(searchTerm) ||
      fee.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFee = (data: any) => {
    if (editingFee) {
      setFees(fees.map((f) => (f.id === editingFee.id ? { ...editingFee, ...data } : f)));
      setEditingFee(null);
    } else {
      const newFee: SchoolFee = {
        id: String(fees.length + 1),
        ...data,
        status: 'upcoming',
      };
      setFees([...fees, newFee]);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteFee = (id: string) => {
    setFees(fees.filter((f) => f.id !== id));
  };

  const handleEditFee = (fee: SchoolFee) => {
    setEditingFee(fee);
    setIsDialogOpen(true);
  };

  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const activeFees = fees.filter((f) => f.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">School Fees Management</h1>
        <p className="text-muted-foreground mt-2">
          Configure and manage school fees for all terms
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Fee Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalFees / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">All terms combined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeFees}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Terms Configured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fees.length}</div>
            <p className="text-xs text-muted-foreground">Fee schedules</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by term or year..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => setEditingFee(null)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Fee Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingFee ? 'Edit Fee Schedule' : 'Create Fee Schedule'}
              </DialogTitle>
              <DialogDescription>
                {editingFee ? 'Update fee information' : 'Create a new fee schedule for the institution'}
              </DialogDescription>
            </DialogHeader>
            <FeeForm
              initialData={editingFee ? {
                term: editingFee.term as "Term 1" | "Term 2" | "Term 3",
                dueDate: editingFee.dueDate,
                amount: editingFee.amount,
                academicYear: editingFee.academicYear,
                description: editingFee.description,
              } : undefined}
              onSubmit={handleAddFee}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Fees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Schedules</CardTitle>
          <CardDescription>
            {filteredFees.length} fee schedule{filteredFees.length !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFees.length > 0 ? (
                  filteredFees.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell className="font-medium">{fee.academicYear}</TableCell>
                      <TableCell>{fee.term}</TableCell>
                      <TableCell className="font-semibold">₦{(fee.amount / 1000).toFixed(0)}K</TableCell>
                      <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant[fee.status]}>
                          {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditFee(fee)}
                            className="p-2 hover:bg-muted rounded-lg"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDeleteFee(fee.id)}
                            className="p-2 hover:bg-destructive/10 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No fees found
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
