'use client';

import { useState } from 'react';
import { Plus, Search, Clock, CheckCircle2, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AssignmentForm } from '@/components/academics/assignment-form';
import { toast } from 'sonner';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  description: string;
  totalPoints: number;
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Chapter 5 Questions',
    subject: 'Mathematics',
    class: 'JSS2A',
    dueDate: '2024-04-15',
    status: 'pending',
    description: 'Answer all questions from page 120-125',
    totalPoints: 20,
  },
  {
    id: '2',
    title: 'Shakespeare Essay',
    subject: 'English',
    class: 'SSS1A',
    dueDate: '2024-04-12',
    status: 'in-progress',
    description: 'Write a 500-word essay on Hamlet',
    totalPoints: 50,
  },
  {
    id: '3',
    title: 'Science Experiment Report',
    subject: 'Biology',
    class: 'JSS3A',
    dueDate: '2024-04-18',
    status: 'pending',
    description: 'Document photosynthesis experiment results',
    totalPoints: 30,
  },
  {
    id: '4',
    title: 'Historical Research',
    subject: 'History',
    class: 'SSS2A',
    dueDate: '2024-04-10',
    status: 'completed',
    description: 'Research on Nigerian Independence Movement',
    totalPoints: 40,
  },
];

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  const filteredAssignments = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAssignment = (data: any) => {
    const newAssignment: Assignment = {
      id: Math.random().toString(),
      ...data,
      status: 'pending',
    };
    setAssignments([...assignments, newAssignment]);
    setIsOpen(false);
    toast.success('Assignment created successfully');
  };

  const handleUpdateAssignment = (data: any) => {
    if (editingAssignment) {
      const updated = assignments.map((a) =>
        a.id === editingAssignment.id ? { ...a, ...data } : a
      );
      setAssignments(updated);
      setEditingAssignment(null);
      setIsOpen(false);
      toast.success('Assignment updated successfully');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this assignment?')) {
      setAssignments(assignments.filter((a) => a.id !== id));
      toast.success('Assignment deleted');
    }
  };

  const stats = [
    {
      label: 'Total',
      value: assignments.length,
      color: 'bg-primary/10',
    },
    {
      label: 'Pending',
      value: assignments.filter((a) => a.status === 'pending').length,
      color: 'bg-yellow-100',
    },
    {
      label: 'In Progress',
      value: assignments.filter((a) => a.status === 'in-progress').length,
      color: 'bg-blue-100',
    },
    {
      label: 'Completed',
      value: assignments.filter((a) => a.status === 'completed').length,
      color: 'bg-green-100',
    },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">Create and manage student assignments</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAssignment(null)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAssignment ? 'Edit Assignment' : 'Create Assignment'}</DialogTitle>
              <DialogDescription>
                {editingAssignment ? 'Update assignment details' : 'Create a new assignment for students'}
              </DialogDescription>
            </DialogHeader>
            <AssignmentForm
              initialData={editingAssignment}
              onSubmit={editingAssignment ? handleUpdateAssignment : handleAddAssignment}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold mt-2 p-2 rounded-lg ${stat.color} text-center`}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
          <CardDescription>Manage assignments across all classes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="space-y-3">
            {filteredAssignments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No assignments found</div>
            ) : (
              filteredAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{assignment.title}</h3>
                      <Badge className={`${statusColors[assignment.status as keyof typeof statusColors]} capitalize`}>
                        {assignment.status}
                      </Badge>
                      {isOverdue(assignment.dueDate) && assignment.status !== 'completed' && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                    </div>
                    <div className="grid gap-2 md:grid-cols-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Subject:</span> {assignment.subject}
                      </div>
                      <div>
                        <span className="font-medium">Class:</span> {assignment.class}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Points:</span> {assignment.totalPoints}
                      </div>
                    </div>
                    <p className="text-sm mt-2 text-muted-foreground">{assignment.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingAssignment(assignment);
                        setIsOpen(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(assignment.id)}
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
