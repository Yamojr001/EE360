'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Phone, Mail, Badge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import { StaffForm } from '@/components/school/staff-form';
import { toast } from 'sonner';

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: 'active' | 'inactive' | 'on-leave';
  dateJoined: string;
  salaryScale?: string;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data
  const mockStaff: Staff[] = [
    {
      id: '1',
      firstName: 'Abdullah',
      lastName: 'Muhammad',
      email: 'abdullah.muhammad@excellence.edu',
      phone: '+234 801 123 4567',
      position: 'Principal',
      department: 'Administration',
      status: 'active',
      dateJoined: '2020-01-15',
      salaryScale: 'A1',
    },
    {
      id: '2',
      firstName: 'Zahra',
      lastName: 'Ibrahim',
      email: 'zahra.ibrahim@excellence.edu',
      phone: '+234 802 234 5678',
      position: 'Mathematics Teacher',
      department: 'Academics',
      status: 'active',
      dateJoined: '2021-09-01',
      salaryScale: 'B2',
    },
    {
      id: '3',
      firstName: 'Yusuf',
      lastName: 'Abdul',
      email: 'yusuf.abdul@excellence.edu',
      phone: '+234 803 345 6789',
      position: 'Farm Manager',
      department: 'Agriculture',
      status: 'active',
      dateJoined: '2021-03-10',
      salaryScale: 'B3',
    },
    {
      id: '4',
      firstName: 'Maryam',
      lastName: 'Hassan',
      email: 'maryam.hassan@excellence.edu',
      phone: '+234 804 456 7890',
      position: 'English Teacher',
      department: 'Academics',
      status: 'on-leave',
      dateJoined: '2022-08-20',
      salaryScale: 'C1',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(false);
    setStaff(mockStaff);
    setFilteredStaff(mockStaff);
  }, []);

  useEffect(() => {
    const results = staff.filter(
      (s) =>
        s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStaff(results);
  }, [searchTerm, staff]);

  const handleAddStaff = (data: any) => {
    const newStaff: Staff = {
      id: Math.random().toString(),
      ...data,
      status: 'active',
      dateJoined: new Date().toISOString().split('T')[0],
    };
    setStaff([...staff, newStaff]);
    setIsOpen(false);
    toast.success('Staff member added successfully');
  };

  const handleUpdateStaff = (data: any) => {
    if (editingStaff) {
      const updated = staff.map((s) =>
        s.id === editingStaff.id ? { ...s, ...data } : s
      );
      setStaff(updated);
      setEditingStaff(null);
      setIsOpen(false);
      toast.success('Staff member updated successfully');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setStaff(staff.filter((s) => s.id !== id));
      toast.success('Staff member deleted');
    }
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    'on-leave': 'bg-yellow-100 text-yellow-800',
  };

  const stats = [
    {
      label: 'Total Staff',
      value: staff.length,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Active',
      value: staff.filter((s) => s.status === 'active').length,
      color: 'bg-green-100 text-green-700',
    },
    {
      label: 'On Leave',
      value: staff.filter((s) => s.status === 'on-leave').length,
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      label: 'Departments',
      value: new Set(staff.map((s) => s.department)).size,
      color: 'bg-blue-100 text-blue-700',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">Manage teachers, administrators, and farm workers</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingStaff(null)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingStaff ? 'Edit Staff' : 'Add New Staff'}</DialogTitle>
              <DialogDescription>
                {editingStaff
                  ? 'Update staff information'
                  : 'Add a new staff member to the system'}
              </DialogDescription>
            </DialogHeader>
            <StaffForm
              initialData={editingStaff}
              onSubmit={editingStaff ? handleUpdateStaff : handleAddStaff}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
              <div className={`mt-2 text-3xl font-bold ${stat.color} rounded-lg p-2 text-center`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
          <CardDescription>View and manage all staff members</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredStaff.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No staff members found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.firstName} {member.lastName}
                      </TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {member.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {member.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <BadgeComponent
                          className={`${statusColors[member.status as keyof typeof statusColors]} capitalize`}
                        >
                          {member.status}
                        </BadgeComponent>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingStaff(member);
                              setIsOpen(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(member.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
