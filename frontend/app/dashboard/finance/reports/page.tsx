'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, TrendingUp, DollarSign, Users, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState('2025');

  const reports = [
    {
      id: '1',
      title: 'Financial Summary Report',
      description: 'Complete overview of income, expenses, and financial health',
      type: 'financial',
      period: 'Monthly',
      generatedDate: '2025-04-15',
      status: 'ready',
    },
    {
      id: '2',
      title: 'Student Enrollment Report',
      description: 'Student registration and demographic analysis',
      type: 'academic',
      period: 'Quarterly',
      generatedDate: '2025-04-10',
      status: 'ready',
    },
    {
      id: '3',
      title: 'Staff Performance Report',
      description: 'Teacher evaluation and attendance summary',
      type: 'hr',
      period: 'Monthly',
      generatedDate: '2025-04-08',
      status: 'processing',
    },
    {
      id: '4',
      title: 'Farm Operations Report',
      description: 'Crop yields, livestock health, and farm productivity',
      type: 'farm',
      period: 'Monthly',
      generatedDate: '2025-04-05',
      status: 'ready',
    },
  ];

  const stats = {
    totalRevenue: 2850000,
    totalExpenses: 1850000,
    netIncome: 1000000,
    outstandingFees: 450000,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
          <p className="text-muted-foreground mt-2">
            Generate and view comprehensive financial reports
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(stats.totalRevenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(stats.totalExpenses / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{(stats.netIncome / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Profit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₦{(stats.outstandingFees / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Report Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            Download or view generated reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    report.type === 'financial' ? 'bg-green-100' :
                    report.type === 'academic' ? 'bg-blue-100' :
                    report.type === 'hr' ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    {report.type === 'financial' && <DollarSign className="w-5 h-5 text-green-600" />}
                    {report.type === 'academic' && <BookOpen className="w-5 h-5 text-blue-600" />}
                    {report.type === 'hr' && <Users className="w-5 h-5 text-purple-600" />}
                    {report.type === 'farm' && <TrendingUp className="w-5 h-5 text-orange-600" />}
                  </div>
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {report.description} • {report.period} • Generated {report.generatedDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      report.status === 'ready' ? 'default' :
                      report.status === 'processing' ? 'secondary' : 'outline'
                    }
                  >
                    {report.status}
                  </Badge>
                  {report.status === 'ready' && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Financial Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Income statements, expense reports, budgets
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Student Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Enrollment, attendance, performance analytics
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Academic Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Grades, exam results, curriculum tracking
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Farm Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Crop yields, livestock, farm productivity
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}