'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, BookOpen, Tractor, Calendar, Download } from 'lucide-react';
import { useState } from 'react';

const revenueData = [
  { month: 'Jan', revenue: 400000, expenses: 240000, profit: 160000 },
  { month: 'Feb', revenue: 420000, expenses: 221000, profit: 199000 },
  { month: 'Mar', revenue: 380000, expenses: 229000, profit: 151000 },
  { month: 'Apr', revenue: 450000, expenses: 200000, profit: 250000 },
  { month: 'May', revenue: 470000, expenses: 218000, profit: 252000 },
  { month: 'Jun', revenue: 520000, expenses: 250000, profit: 270000 },
];

const studentPerformanceData = [
  { subject: 'Mathematics', average: 78, passRate: 85 },
  { subject: 'English', average: 82, passRate: 90 },
  { subject: 'Science', average: 75, passRate: 80 },
  { subject: 'Social Studies', average: 80, passRate: 88 },
  { subject: 'Arts', average: 85, passRate: 92 },
];

const attendanceData = [
  { month: 'Jan', attendance: 94 },
  { month: 'Feb', attendance: 96 },
  { month: 'Mar', attendance: 92 },
  { month: 'Apr', attendance: 95 },
  { month: 'May', attendance: 97 },
  { month: 'Jun', attendance: 93 },
];

const farmProductivityData = [
  { month: 'Jan', crops: 1200, livestock: 800 },
  { month: 'Feb', crops: 1100, livestock: 850 },
  { month: 'Mar', crops: 1300, livestock: 900 },
  { month: 'Apr', crops: 1400, livestock: 950 },
  { month: 'May', crops: 1350, livestock: 1000 },
  { month: 'Jun', crops: 1500, livestock: 1050 },
];

const gradeDistributionData = [
  { name: 'A Grade', value: 35, color: '#10b981' },
  { name: 'B Grade', value: 28, color: '#0ea5e9' },
  { name: 'C Grade', value: 22, color: '#f59e0b' },
  { name: 'D Grade', value: 10, color: '#ef4444' },
  { name: 'F Grade', value: 5, color: '#8b5cf6' },
];

const COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const stats = {
    totalRevenue: 2640000,
    totalExpenses: 1358000,
    netProfit: 1282000,
    averageAttendance: 94.5,
    totalStudents: 508,
    totalStaff: 42,
    farmYield: 2850,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights into school and farm performance
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{(stats.totalRevenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Student Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">79.2%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              +2.1% from last term
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageAttendance}%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              +1.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Tractor className="w-4 h-4 text-orange-600" />
              Farm Yield
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.farmYield}kg</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-red-600" />
              -3.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Financial performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, '']} />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Student performance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Academic Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance Analysis</CardTitle>
          <CardDescription>Average scores and pass rates by subject</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#0ea5e9" name="Average Score (%)" />
              <Bar dataKey="passRate" fill="#10b981" name="Pass Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Attendance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Trends</CardTitle>
          <CardDescription>Monthly attendance rates</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[85, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Attendance Rate']} />
              <Line type="monotone" dataKey="attendance" stroke="#8b5cf6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Farm Productivity */}
      <Card>
        <CardHeader>
          <CardTitle>Farm Productivity</CardTitle>
          <CardDescription>Crops and livestock yield over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={farmProductivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}kg`, '']} />
              <Legend />
              <Line type="monotone" dataKey="crops" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="livestock" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">SSS 2</div>
            <p className="text-sm text-muted-foreground">95.2% average score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Best Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">English</div>
            <p className="text-sm text-muted-foreground">90% pass rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Farm Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">87%</div>
            <p className="text-sm text-muted-foreground">Resource utilization</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}