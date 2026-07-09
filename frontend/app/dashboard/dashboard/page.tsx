'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, DollarSign, BookOpen } from 'lucide-react';

interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  totalRevenue: number;
  pendingFees: number;
  attendanceRate: number;
}

const lineChartData = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 4200, expenses: 2210 },
  { month: 'Mar', revenue: 3800, expenses: 2290 },
  { month: 'Apr', revenue: 4500, expenses: 2000 },
  { month: 'May', revenue: 4700, expenses: 2181 },
  { month: 'Jun', revenue: 5200, expenses: 2500 },
];

const studentByClassData = [
  { name: 'JSS 1', value: 85 },
  { name: 'JSS 2', value: 92 },
  { name: 'JSS 3', value: 78 },
  { name: 'SSS 1', value: 88 },
  { name: 'SSS 2', value: 95 },
  { name: 'SSS 3', value: 72 },
];

const COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 508,
    totalStaff: 42,
    totalRevenue: 2850000,
    pendingFees: 450000,
    attendanceRate: 94,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of school and farm operations
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
            <p className="text-xs text-muted-foreground">Active students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStaff}</div>
            <p className="text-xs text-muted-foreground">Teachers & administrators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(stats.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">School fees & sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">Current period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Financial Trend</CardTitle>
            <CardDescription>
              Monthly revenue vs expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Students by Class */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution by Class</CardTitle>
            <CardDescription>
              Total students per class
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={studentByClassData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {studentByClassData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
            <CardDescription>
              Latest student enrollments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-foreground">Student {i}</p>
                    <p className="text-xs text-muted-foreground">Class JSS {i}</p>
                  </div>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                    2 days ago
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
            <CardDescription>
              Items needing attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <p className="font-medium text-foreground">Fee Payments Due</p>
                  <p className="text-xs text-muted-foreground">₦{(stats.pendingFees / 1000).toFixed(0)}K pending</p>
                </div>
                <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                  Urgent
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Staff Attendance</p>
                  <p className="text-xs text-muted-foreground">5 records to verify</p>
                </div>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                  Pending
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
