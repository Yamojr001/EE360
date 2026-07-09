'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Download, TrendingUp, Award, Users } from 'lucide-react';

export default function ResultsPage() {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [searchTerm, setSearchTerm] = useState('');

  const results = [
    {
      id: '1',
      studentName: 'Chinedu Okafor',
      regNumber: 'EEA/2024/001',
      class: 'JSS 3',
      term: 'Term 1',
      averageScore: 85.5,
      grade: 'A',
      position: 1,
      subjects: 8,
      status: 'published',
    },
    {
      id: '2',
      studentName: 'Amara Nwosu',
      regNumber: 'EEA/2024/002',
      class: 'JSS 3',
      term: 'Term 1',
      averageScore: 78.2,
      grade: 'B',
      position: 2,
      subjects: 8,
      status: 'published',
    },
    {
      id: '3',
      studentName: 'Zainab Hassan',
      regNumber: 'EEA/2024/003',
      class: 'JSS 3',
      term: 'Term 1',
      averageScore: 92.1,
      grade: 'A+',
      position: 1,
      subjects: 8,
      status: 'draft',
    },
  ];

  const filteredResults = results.filter(result => {
    const matchesClass = selectedClass === 'all' || result.class === selectedClass;
    const matchesTerm = result.term === selectedTerm;
    const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.regNumber.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesClass && matchesTerm && matchesSearch;
  });

  const classAverage = filteredResults.length > 0
    ? (filteredResults.reduce((sum, result) => sum + result.averageScore, 0) / filteredResults.length).toFixed(1)
    : '0.0';

  const topPerformers = filteredResults.filter(r => r.grade.startsWith('A')).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Results</h1>
          <p className="text-muted-foreground mt-2">
            View and manage student academic results
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Publish Results
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classAverage}%</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topPerformers}</div>
            <p className="text-xs text-muted-foreground">A-grade students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredResults.filter(r => r.status === 'published').length}
            </div>
            <p className="text-xs text-muted-foreground">Available to students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredResults.length}</div>
            <p className="text-xs text-muted-foreground">With results</p>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Results - {selectedTerm}</CardTitle>
          <CardDescription>
            {filteredResults.length} student results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{result.studentName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {result.regNumber} • {result.class} • Position {result.position}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-lg font-bold">{result.averageScore}%</div>
                    <div className="text-sm text-muted-foreground">Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{result.subjects}</div>
                    <div className="text-sm text-muted-foreground">Subjects</div>
                  </div>
                  <Badge
                    variant={
                      result.grade.startsWith('A') ? 'default' :
                      result.grade.startsWith('B') ? 'secondary' :
                      result.grade.startsWith('C') ? 'outline' : 'destructive'
                    }
                  >
                    {result.grade}
                  </Badge>
                  <Badge
                    variant={result.status === 'published' ? 'default' : 'secondary'}
                  >
                    {result.status}
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