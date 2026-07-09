'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, BookOpen, Calendar } from 'lucide-react';

interface ClassData {
  id: string;
  name: string;
  grade: string;
  teacher: string;
  students: number;
  subjects: number;
  schedule: string;
  status: string;
}

const GRADE_OPTIONS = ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'];

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassData[]>([
    {
      id: '1',
      name: 'JSS 1A',
      grade: 'JSS 1',
      teacher: 'Mrs. Ngozi Adeyemi',
      students: 28,
      subjects: 12,
      schedule: 'Mon-Fri, 8:00 AM - 2:00 PM',
      status: 'active',
    },
    {
      id: '2',
      name: 'JSS 2B',
      grade: 'JSS 2',
      teacher: 'Mr. Chinedu Okafor',
      students: 32,
      subjects: 13,
      schedule: 'Mon-Fri, 8:00 AM - 2:00 PM',
      status: 'active',
    },
    {
      id: '3',
      name: 'SSS 1A',
      grade: 'SSS 1',
      teacher: 'Miss Zainab Hassan',
      students: 35,
      subjects: 15,
      schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
      status: 'active',
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newGrade, setNewGrade] = useState('JSS 1');
  const [newTeacher, setNewTeacher] = useState('');
  const [newStudents, setNewStudents] = useState('20');
  const [newSubjects, setNewSubjects] = useState('10');
  const [newSchedule, setNewSchedule] = useState('Mon-Fri, 8:00 AM - 2:00 PM');

  const handleCreateClass = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const classItem: ClassData = {
      id: String(classes.length + 1),
      name: newClassName || `${newGrade} New`,
      grade: newGrade,
      teacher: newTeacher || 'Unassigned',
      students: Number(newStudents) || 0,
      subjects: Number(newSubjects) || 0,
      schedule: newSchedule,
      status: 'active',
    };

    setClasses((current) => [...current, classItem]);
    setIsDialogOpen(false);
    setNewClassName('');
    setNewGrade('JSS 1');
    setNewTeacher('');
    setNewStudents('20');
    setNewSubjects('10');
    setNewSchedule('Mon-Fri, 8:00 AM - 2:00 PM');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Classes</h1>
          <p className="text-muted-foreground mt-2">
            Manage class information and assignments
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="w-4 h-4" />
              Create Class
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogDescription>
                Add a new class to the school schedule.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateClass} className="space-y-4 py-2">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="class-name" className="text-sm font-medium">
                    Class Name
                  </label>
                  <Input
                    id="class-name"
                    value={newClassName}
                    onChange={(event) => setNewClassName(event.target.value)}
                    placeholder="e.g. JSS 3B"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="grade" className="text-sm font-medium">
                    Grade
                  </label>
                  <Select value={newGrade} onValueChange={setNewGrade}>
                    <SelectTrigger id="grade">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADE_OPTIONS.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="teacher" className="text-sm font-medium">
                    Teacher
                  </label>
                  <Input
                    id="teacher"
                    value={newTeacher}
                    onChange={(event) => setNewTeacher(event.target.value)}
                    placeholder="e.g. Mr. Chinedu Okafor"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="students" className="text-sm font-medium">
                    Students
                  </label>
                  <Input
                    id="students"
                    type="number"
                    value={newStudents}
                    onChange={(event) => setNewStudents(event.target.value)}
                    placeholder="Number of students"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="subjects" className="text-sm font-medium">
                    Subjects
                  </label>
                  <Input
                    id="subjects"
                    type="number"
                    value={newSubjects}
                    onChange={(event) => setNewSubjects(event.target.value)}
                    placeholder="Number of subjects"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="schedule" className="text-sm font-medium">
                    Schedule
                  </label>
                  <Input
                    id="schedule"
                    value={newSchedule}
                    onChange={(event) => setNewSchedule(event.target.value)}
                    placeholder="e.g. Mon-Fri, 8:00 AM - 2:00 PM"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Save Class
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">Active classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.reduce((sum, cls) => sum + cls.students, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Class Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(classes.reduce((sum, cls) => sum + cls.students, 0) / classes.length)}
            </div>
            <p className="text-xs text-muted-foreground">Students per class</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.reduce((sum, cls) => sum + cls.subjects, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Card key={cls.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{cls.name}</CardTitle>
                <Badge variant="outline">{cls.grade}</Badge>
              </div>
              <CardDescription>{cls.teacher}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{cls.students} students</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span>{cls.subjects} subjects</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{cls.schedule}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Class Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Class Distribution</CardTitle>
          <CardDescription>
            Students across different grade levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'].map((grade) => {
              const gradeClasses = classes.filter(cls => cls.grade === grade);
              const totalStudents = gradeClasses.reduce((sum, cls) => sum + cls.students, 0);

              return (
                <div key={grade} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{grade}</h3>
                      <p className="text-sm text-muted-foreground">
                        {gradeClasses.length} class{gradeClasses.length !== 1 ? 'es' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{totalStudents}</div>
                    <div className="text-sm text-muted-foreground">students</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}