'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Zap, Package, Users } from 'lucide-react';

interface Expense {
  id: string;
  date: string;
  category: 'materials' | 'utilities' | 'labor' | 'transport' | 'maintenance';
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  notes: string;
}

const mockExpenses: Expense[] = [
  {
    id: '1',
    date: '2026-04-15',
    category: 'materials',
    description: 'Polyethylene sachets - 50000 pieces',
    amount: 25000,
    status: 'paid',
    notes: 'Weekly supply from supplier',
  },
  {
    id: '2',
    date: '2026-04-15',
    category: 'utilities',
    description: 'Electricity bill - April',
    amount: 15000,
    status: 'paid',
    notes: 'Factory operations',
  },
  {
    id: '3',
    date: '2026-04-14',
    category: 'labor',
    description: 'Weekly payroll - 8 workers',
    amount: 32000,
    status: 'paid',
    notes: 'Production staff wages',
  },
  {
    id: '4',
    date: '2026-04-14',
    category: 'transport',
    description: 'Fuel and logistics',
    amount: 8500,
    status: 'pending',
    notes: 'Delivery vehicle expenses',
  },
  {
    id: '5',
    date: '2026-04-13',
    category: 'maintenance',
    description: 'Filter and pump maintenance',
    amount: 5500,
    status: 'pending',
    notes: 'Equipment servicing',
  },
  {
    id: '6',
    date: '2026-04-12',
    category: 'materials',
    description: 'Water treatment chemicals',
    amount: 12000,
    status: 'overdue',
    notes: 'Chlorine and purification kits',
  },
];

const categoryIcons = {
  materials: Package,
  utilities: Zap,
  labor: Users,
  transport: 'Truck',
  maintenance: 'Wrench',
};

export default function ExpensesPage() {
  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
  const paidExpenses = mockExpenses
    .filter((e) => e.status === 'paid')
    .reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = mockExpenses
    .filter((e) => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount, 0);
  const overdueExpenses = mockExpenses
    .filter((e) => e.status === 'overdue')
    .reduce((sum, e) => sum + e.amount, 0);

  const categoryBreakdown = {
    materials: mockExpenses
      .filter((e) => e.category === 'materials')
      .reduce((sum, e) => sum + e.amount, 0),
    utilities: mockExpenses
      .filter((e) => e.category === 'utilities')
      .reduce((sum, e) => sum + e.amount, 0),
    labor: mockExpenses
      .filter((e) => e.category === 'labor')
      .reduce((sum, e) => sum + e.amount, 0),
    transport: mockExpenses
      .filter((e) => e.category === 'transport')
      .reduce((sum, e) => sum + e.amount, 0),
    maintenance: mockExpenses
      .filter((e) => e.category === 'maintenance')
      .reduce((sum, e) => sum + e.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Expenses Tracking</h1>
        <p className="text-muted-foreground mt-2">Monitor production costs and operational expenses</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{paidExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Settled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">₦{pendingExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Due soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₦{overdueExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Urgent</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="w-4 h-4" />
              Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">₦{categoryBreakdown.materials.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Raw materials</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Utilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">₦{categoryBreakdown.utilities.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Power & water</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Labor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">₦{categoryBreakdown.labor.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Salaries & wages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transport</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">₦{categoryBreakdown.transport.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Logistics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">₦{categoryBreakdown.maintenance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Equipment care</p>
          </CardContent>
        </Card>
      </div>

      {/* New Expense Button */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Log Expense
        </Button>
      </div>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>All operational expenses and costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Description</th>
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-right py-3 px-4 font-medium">Amount</th>
                  <th className="text-center py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{expense.date}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-xs text-muted-foreground">{expense.notes}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="capitalize">
                        {expense.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-bold">₦{expense.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={
                          expense.status === 'paid'
                            ? 'default'
                            : expense.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {expense.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
