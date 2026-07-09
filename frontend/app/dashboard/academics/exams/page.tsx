'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Users } from 'lucide-react';

export default function ExamsPage() {
  const [exams] = useState([
    {
      id: '1',
      subject: 'Mathematics',
      class: 'JSS 3',
      date: '2024-12-15',
      time: '10:00 AM',
      duration: '2 hours',
      status: 'scheduled',
    },
    {
      id: '2',
      subject: 'English Language',
      class: 'SSS 1',
      date: '2024-12-16',
      time: '9:00 AM',
      duration: '1.5 hours',
      status: 'scheduled',
    },
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exams</h1>
          <p className="text-muted-foreground mt-2">
            Schedule and manage examinations
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Exam
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length}</div>
            <p className="text-xs text-muted-foreground">This term</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exams.filter(e => e.status === 'scheduled').length}
            </div>
            <p className="text-xs text-muted-foreground">Upcoming exams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">This term</p>
          </CardContent>
        </Card>
      </div>

      {/* Exams List */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Exams</CardTitle>
          <CardDescription>
            Upcoming examinations for all classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{exam.subject}</h3>
                    <p className="text-sm text-muted-foreground">
                      {exam.class} • {exam.date} • {exam.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{exam.duration}</Badge>
                  <Badge
                    variant={exam.status === 'scheduled' ? 'default' : 'secondary'}
                  >
                    {exam.status}
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