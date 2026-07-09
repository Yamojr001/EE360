'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, DollarSign, TrendingDown, Calendar } from 'lucide-react';

export default function ExpensesPage() {
  const [selectedMonth, setSelectedMonth] = useState('April');
  const [selectedYear, setSelectedYear] = useState('2025');

  const expenses = [
    {
      id: '1',
      description: 'Textbooks and Stationery',
      category: 'Educational Materials',
      amount: 250000,
      date: '2025-04-15',
      approvedBy: 'Mrs. Ngozi Adeyemi',
      status: 'approved',
    },
    {
      id: '2',
      description: 'Generator Fuel',
      category: 'Utilities',
      amount: 45000,
      date: '2025-04-10',
      approvedBy: 'Mrs. Ngozi Adeyemi',
      status: 'approved',
    },
    {
      id: '3',
      description: 'Computer Maintenance',
      category: 'IT Equipment',
      amount: 75000,
      date: '2025-04-08',
      approvedBy: 'Mrs. Ngozi Adeyemi',
      status: 'pending',
    },
  ];

  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const expenseMonth = expenseDate.toLocaleString('default', { month: 'long' });
    const expenseYear = expenseDate.getFullYear().toString();
    return expenseMonth === selectedMonth && expenseYear === selectedYear;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = filteredExpenses.filter(e => e.status === 'pending').reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage school expenses
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="January">January</SelectItem>
            <SelectItem value="February">February</SelectItem>
            <SelectItem value="March">March</SelectItem>
            <SelectItem value="April">April</SelectItem>
            <SelectItem value="May">May</SelectItem>
            <SelectItem value="June">June</SelectItem>
            <SelectItem value="July">July</SelectItem>
            <SelectItem value="August">August</SelectItem>
            <SelectItem value="September">September</SelectItem>
            <SelectItem value="October">October</SelectItem>
            <SelectItem value="November">November</SelectItem>
            <SelectItem value="December">December</SelectItem>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalExpenses / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">{selectedMonth} {selectedYear}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(pendingExpenses / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredExpenses.filter(e => e.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses - {selectedMonth} {selectedYear}</CardTitle>
          <CardDescription>
            {filteredExpenses.length} expense entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{expense.description}</h3>
                    <p className="text-sm text-muted-foreground">
                      {expense.category} • {expense.date} • Approved by {expense.approvedBy}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold">₦{expense.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Amount</div>
                  </div>
                  <Badge
                    variant={expense.status === 'approved' ? 'default' : 'secondary'}
                  >
                    {expense.status}
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