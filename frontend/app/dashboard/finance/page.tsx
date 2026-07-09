'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, TrendingDown, FileText, Plus, CreditCard, Receipt } from 'lucide-react';
import Link from 'next/link';

export default function FinancePage() {
  const stats = {
    totalRevenue: 2850000,
    totalExpenses: 1358000,
    netIncome: 1492000,
    outstandingFees: 450000,
    monthlyGrowth: 12.5,
  };

  const quickActions = [
    {
      title: 'Record School Fees',
      description: 'Track student fee payments',
      href: '/dashboard/finance/fees',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'bg-green-500',
    },
    {
      title: 'Process Payroll',
      description: 'Calculate and pay staff salaries',
      href: '/dashboard/finance/payroll',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Log Expenses',
      description: 'Record operational costs',
      href: '/dashboard/finance/expenses',
      icon: <Receipt className="w-5 h-5" />,
      color: 'bg-orange-500',
    },
    {
      title: 'View Reports',
      description: 'Financial statements and analytics',
      href: '/dashboard/finance/reports',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-purple-500',
    },
  ];

  const recentTransactions = [
    { type: 'Income', description: 'School Fees - JSS 1A', amount: 150000, date: 'Dec 10, 2024' },
    { type: 'Income', description: 'Farm Produce Sales', amount: 75000, date: 'Dec 9, 2024' },
    { type: 'Expense', description: 'Teacher Salaries', amount: 450000, date: 'Dec 1, 2024' },
    { type: 'Expense', description: 'Fertilizer Purchase', amount: 120000, date: 'Nov 28, 2024' },
    { type: 'Income', description: 'School Fees - SSS 2B', amount: 200000, date: 'Nov 25, 2024' },
  ];

  const feeCollection = [
    { class: 'JSS 1', collected: 850000, total: 900000, percentage: 94.4 },
    { class: 'JSS 2', collected: 920000, total: 950000, percentage: 96.8 },
    { class: 'JSS 3', collected: 780000, total: 850000, percentage: 91.8 },
    { class: 'SSS 1', collected: 1100000, total: 1150000, percentage: 95.7 },
    { class: 'SSS 2', collected: 950000, total: 1000000, percentage: 95.0 },
    { class: 'SSS 3', collected: 650000, total: 700000, percentage: 92.9 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Financial Management</h1>
        <p className="text-muted-foreground mt-2">
          Revenue tracking, expense management, and financial reporting
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{(stats.totalRevenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₦{(stats.totalExpenses / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Net Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₦{(stats.netIncome / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              +{stats.monthlyGrowth}% this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-orange-600" />
              Outstanding Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₦{(stats.outstandingFees / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Pending payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Financial Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Fee Collection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Collection by Class</CardTitle>
          <CardDescription>Payment status for current term</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feeCollection.map((fee, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{fee.class}</span>
                    <span className="text-sm text-muted-foreground">
                      ₦{fee.collected.toLocaleString()} / ₦{fee.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${fee.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{fee.percentage}% collected</span>
                    <span>₦{(fee.total - fee.collected).toLocaleString()} remaining</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest financial activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'Income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'Income' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <div className={`font-bold ${
                  transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'Income' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Budget vs Actual</CardTitle>
            <CardDescription>December 2024 budget tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Staff Salaries</span>
                <div className="text-right">
                  <div className="font-medium">₦450K / ₦480K</div>
                  <div className="text-xs text-green-600">93.8% of budget</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Utilities</span>
                <div className="text-right">
                  <div className="font-medium">₦85K / ₦100K</div>
                  <div className="text-xs text-green-600">85% of budget</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Maintenance</span>
                <div className="text-right">
                  <div className="font-medium">₦120K / ₦150K</div>
                  <div className="text-xs text-green-600">80% of budget</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Farm Supplies</span>
                <div className="text-right">
                  <div className="font-medium">₦95K / ₦120K</div>
                  <div className="text-xs text-orange-600">79.2% of budget</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Health Indicators</CardTitle>
            <CardDescription>Key performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Current Ratio</span>
                <span className="font-medium text-green-600">2.4:1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Debt-to-Equity</span>
                <span className="font-medium text-green-600">0.3:1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Operating Margin</span>
                <span className="font-medium text-green-600">34.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Fee Collection Rate</span>
                <span className="font-medium text-blue-600">94.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Expense Ratio</span>
                <span className="font-medium text-orange-600">47.6%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}