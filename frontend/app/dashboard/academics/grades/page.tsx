'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Users, BookOpen } from 'lucide-react';

export default function GradesPage() {
  const [selectedClass, setSelectedClass] = useState('JSS 3');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');

  const grades = [
    {
      id: '1',
      studentName: 'Chinedu Okafor',
      regNumber: 'EEA/2024/001',
      subject: 'Mathematics',
      score: 85,
      grade: 'A',
      term: 'Term 1',
      class: 'JSS 3',
    },
    {
      id: '2',
      studentName: 'Amara Nwosu',
      regNumber: 'EEA/2024/002',
      subject: 'Mathematics',
      score: 78,
      grade: 'B',
      term: 'Term 1',
      class: 'JSS 3',
    },
    {
      id: '3',
      studentName: 'Zainab Hassan',
      regNumber: 'EEA/2024/003',
      subject: 'English',
      score: 92,
      grade: 'A+',
      term: 'Term 1',
      class: 'JSS 3',
    },
  ];

  const filteredGrades = grades.filter(
    grade => grade.class === selectedClass && grade.term === selectedTerm
  );

  const averageScore = filteredGrades.length > 0
    ? Math.round(filteredGrades.reduce((sum, grade) => sum + grade.score, 0) / filteredGrades.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Grades</h1>
          <p className="text-muted-foreground mt-2">
            View and manage student grades and performance
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <BookOpen className="w-4 h-4 mr-2" />
          Enter Grades
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="JSS 1">JSS 1</SelectItem>
            <SelectItem value="JSS 2">JSS 2</SelectItem>
            <SelectItem value="JSS 3">JSS 3</SelectItem>
            <SelectItem value="SSS 1">SSS 1</SelectItem>
            <SelectItem value="SSS 2">SSS 2</SelectItem>
            <SelectItem value="SSS 3">SSS 3</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedTerm} onValueChange={setSelectedTerm}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Term" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Term 1">Term 1</SelectItem>
            <SelectItem value="Term 2">Term 2</SelectItem>
            <SelectItem value="Term 3">Term 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground">Class average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredGrades.length}</div>
            <p className="text-xs text-muted-foreground">With grades</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredGrades.filter(g => g.grade.startsWith('A')).length} A-grades
            </div>
            <p className="text-xs text-muted-foreground">Excellent performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Grades - {selectedClass} ({selectedTerm})</CardTitle>
          <CardDescription>
            Grades for {filteredGrades.length} students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredGrades.map((grade) => (
              <div
                key={grade.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{grade.studentName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {grade.regNumber} • {grade.subject}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold">{grade.score}%</div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                  <Badge
                    variant={
                      grade.grade.startsWith('A') ? 'default' :
                      grade.grade.startsWith('B') ? 'secondary' :
                      grade.grade.startsWith('C') ? 'outline' : 'destructive'
                    }
                  >
                    {grade.grade}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}