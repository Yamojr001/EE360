'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, BarChart3, Plus, TrendingUp, Award, Users } from 'lucide-react';
import Link from 'next/link';

export default function AcademicsPage() {
  const stats = {
    totalAssignments: 156,
    upcomingExams: 8,
    averageGrade: 79.2,
    completionRate: 92.5,
  };

  const quickActions = [
    {
      title: 'Create Assignment',
      description: 'Assign homework or projects',
      href: '/dashboard/academics/assignments',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Schedule Exam',
      description: 'Plan and organize examinations',
      href: '/dashboard/academics/exams',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-green-500',
    },
    {
      title: 'Enter Grades',
      description: 'Record student performance',
      href: '/dashboard/academics/grades',
      icon: <Award className="w-5 h-5" />,
      color: 'bg-purple-500',
    },
  ];

  const upcomingEvents = [
    { type: 'Exam', subject: 'Mathematics', class: 'JSS 3', date: 'Dec 15, 2024', time: '10:00 AM' },
    { type: 'Assignment Due', subject: 'English', class: 'SSS 1', date: 'Dec 12, 2024', time: '5:00 PM' },
    { type: 'Exam', subject: 'Science', class: 'JSS 2', date: 'Dec 18, 2024', time: '9:00 AM' },
    { type: 'Assignment Due', subject: 'Social Studies', class: 'SSS 2', date: 'Dec 14, 2024', time: '4:00 PM' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Academic Management</h1>
        <p className="text-muted-foreground mt-2">
          Curriculum planning, assessments, and academic tracking
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Total Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssignments}</div>
            <p className="text-xs text-muted-foreground">This term</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600" />
              Upcoming Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingExams}</div>
            <p className="text-xs text-muted-foreground">Next 2 weeks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              Average Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageGrade}%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              +2.1% from last term
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-600" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Assignment submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Academic Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                    {action.icon}
                  </div>
                  <CardTitle className="text-base">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Academic Events</CardTitle>
          <CardDescription>Exams and assignment deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    event.type === 'Exam' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {event.type === 'Exam' ? (
                      <Calendar className="w-5 h-5 text-red-600" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{event.subject} - {event.type}</h3>
                    <p className="text-sm text-muted-foreground">
                      {event.class} • {event.date} at {event.time}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance Overview</CardTitle>
          <CardDescription>Average scores by subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { subject: 'Mathematics', score: 78, trend: '+1.2%', color: 'text-blue-600' },
              { subject: 'English', score: 82, trend: '+2.1%', color: 'text-green-600' },
              { subject: 'Science', score: 75, trend: '-0.5%', color: 'text-orange-600' },
              { subject: 'Social Studies', score: 80, trend: '+1.8%', color: 'text-purple-600' },
              { subject: 'Arts', score: 85, trend: '+3.2%', color: 'text-pink-600' },
              { subject: 'Physical Education', score: 88, trend: '+0.9%', color: 'text-indigo-600' },
            ].map((subject) => (
              <div key={subject.subject} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{subject.subject}</h3>
                  <span className={`text-sm ${subject.color}`}>{subject.trend}</span>
                </div>
                <div className="text-2xl font-bold">{subject.score}%</div>
                <p className="text-xs text-muted-foreground">Average score</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}