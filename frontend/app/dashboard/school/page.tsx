'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, Calendar, BookOpen, TrendingUp, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function SchoolPage() {
  const stats = {
    totalStudents: 508,
    totalStaff: 42,
    averageAttendance: 94.2,
    activeClasses: 24,
    upcomingExams: 8,
    pendingAssignments: 23,
  };

  const quickActions = [
    {
      title: 'Manage Students',
      description: 'Add, edit, and view student records',
      href: '/dashboard/school/students',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Staff Directory',
      description: 'Manage teachers and administrators',
      href: '/dashboard/school/staff',
      icon: <UserCheck className="w-5 h-5" />,
      color: 'bg-green-500',
    },
    {
      title: 'Attendance',
      description: 'Track daily attendance records',
      href: '/dashboard/school/attendance',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Class Management',
      description: 'Organize classes and subjects',
      href: '/dashboard/school/classes',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-orange-500',
    },
  ];

  const recentActivities = [
    { type: 'Student', action: 'New enrollment', details: 'Chinedu Okafor - JSS 1', time: '2 hours ago' },
    { type: 'Staff', action: 'Attendance marked', details: 'Mathematics class - 28/30 present', time: '4 hours ago' },
    { type: 'Exam', action: 'Scheduled', details: 'Mathematics Final - JSS 3', time: '1 day ago' },
    { type: 'Assignment', action: 'Due soon', details: 'English Essay - SSS 1', time: '2 days ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">School Management</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive student and staff management system
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Active enrollment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStaff}</div>
            <p className="text-xs text-muted-foreground">Teachers & admin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageAttendance}%</div>
            <p className="text-xs text-muted-foreground">Current period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClasses}</div>
            <p className="text-xs text-muted-foreground">Running classes</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                  {action.icon}
                </div>
                <CardTitle className="text-sm">{action.title}</CardTitle>
                <CardDescription className="text-xs">{action.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full">
                  <Link href={action.href}>Go to {action.title}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest updates in school management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{activity.type}: {activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}