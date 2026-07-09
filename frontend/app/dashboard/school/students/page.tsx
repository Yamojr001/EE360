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
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { StudentForm } from '@/components/school/student-form';

interface Student {
  id: string;
  regNumber: string;
  name: string;
  email: string;
  class: string;
  status: 'active' | 'graduated' | 'transferred' | 'suspended';
}

// Mock data for MVP
const mockStudents: Student[] = [
  {
    id: '1',
    regNumber: 'EEA/2024/001',
    name: 'Muhammad Ibrahim',
    email: 'muhammad@excellence.edu',
    class: 'JSS 1',
    status: 'active',
  },
  {
    id: '2',
    regNumber: 'EEA/2024/002',
    name: 'Fatima Abdul',
    email: 'fatima@excellence.edu',
    class: 'JSS 2',
    status: 'active',
  },
  {
    id: '3',
    regNumber: 'EEA/2024/003',
    name: 'Omar Hassan',
    email: 'omar@excellence.edu',
    class: 'SSS 1',
    status: 'active',
  },
  {
    id: '4',
    regNumber: 'EEA/2024/004',
    name: 'Aisha Musa',
    email: 'aisha@excellence.edu',
    class: 'SSS 2',
    status: 'active',
  },
  {
    id: '5',
    regNumber: 'EEA/2023/045',
    name: 'Khadija Ahmed',
    email: 'khadija@excellence.edu',
    class: 'SSS 3',
    status: 'graduated',
  },
];

const statusBadgeVariant = {
  active: 'default',
  graduated: 'secondary',
  transferred: 'outline',
  suspended: 'destructive',
} as const;

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = (data: any) => {
    if (editingStudent) {
      // Update existing
      setStudents(
        students.map((s) =>
          s.id === editingStudent.id
            ? { ...editingStudent, ...data }
            : s
        )
      );
      setEditingStudent(null);
    } else {
      // Add new
      const newStudent: Student = {
        id: String(students.length + 1),
        ...data,
        status: 'active',
      };
      setStudents([...students, newStudent]);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage student registrations and records
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, reg number, or email..."
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
              onClick={() => setEditingStudent(null)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </DialogTitle>
              <DialogDescription>
                {editingStudent
                  ? 'Update student information'
                  : 'Register a new student in the system'}
              </DialogDescription>
            </DialogHeader>
            <StudentForm
              initialData={editingStudent || undefined}
              onSubmit={handleAddStudent}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Registration #</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.regNumber}
                      </TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant[student.status]}>
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="p-2 hover:bg-muted rounded-lg"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
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
                      No students found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter((s) => s.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Enrolled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Graduated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter((s) => s.status === 'graduated').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
