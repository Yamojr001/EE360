'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Download, Eye } from 'lucide-react';
import { PayrollForm } from '@/components/finance/payroll-form';

interface PayrollRecord {
  id: string;
  staffId: string;
  staffName: string;
  position: string;
  month: string;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'draft' | 'approved' | 'paid';
}

// Mock data
const mockPayroll: PayrollRecord[] = [
  {
    id: '1',
    staffId: 'STF001',
    staffName: 'Mrs. Ngozi Adeyemi',
    position: 'Principal',
    month: 'April',
    year: 2025,
    baseSalary: 250000,
    allowances: 50000,
    deductions: 10000,
    netSalary: 290000,
    status: 'paid',
  },
  {
    id: '2',
    staffId: 'STF002',
    staffName: 'Mr. Chinedu Okafor',
    position: 'Mathematics Teacher',
    month: 'April',
    year: 2025,
    baseSalary: 120000,
    allowances: 20000,
    deductions: 5000,
    netSalary: 135000,
    status: 'paid',
  },
  {
    id: '3',
    staffId: 'STF003',
    staffName: 'Miss Zainab Hassan',
    position: 'English Teacher',
    month: 'April',
    year: 2025,
    baseSalary: 120000,
    allowances: 20000,
    deductions: 5000,
    netSalary: 135000,
    status: 'approved',
  },
  {
    id: '4',
    staffId: 'STF004',
    staffName: 'Mr. Adekunle Bello',
    position: 'Farm Manager',
    month: 'April',
    year: 2025,
    baseSalary: 150000,
    allowances: 25000,
    deductions: 7000,
    netSalary: 168000,
    status: 'draft',
  },
];

const statusBadgeVariant = {
  draft: 'outline',
  approved: 'secondary',
  paid: 'default',
} as const;

export default function PayrollPage() {
  const [payroll, setPayroll] = useState<PayrollRecord[]>(mockPayroll);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('April');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredPayroll = payroll.filter(
    (record) =>
      (record.month === selectedMonth || selectedMonth === 'All') &&
      (record.year.toString() === selectedYear || selectedYear === 'All') &&
      (record.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.staffId.includes(searchTerm))
  );

  const handleAddPayroll = (data: any) => {
    const newRecord: PayrollRecord = {
      id: String(payroll.length + 1),
      ...data,
      status: 'draft',
    };
    setPayroll([...payroll, newRecord]);
    setIsDialogOpen(false);
  };

  const totalNetSalary = filteredPayroll.reduce((sum, record) => sum + record.netSalary, 0);
  const totalAllowances = filteredPayroll.reduce((sum, record) => sum + record.allowances, 0);
  const totalDeductions = filteredPayroll.reduce((sum, record) => sum + record.deductions, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payroll Management</h1>
        <p className="text-muted-foreground mt-2">
          Calculate and manage staff salaries and payments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Net Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalNetSalary / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">{filteredPayroll.length} staff members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Allowances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalAllowances / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Benefits &amp; incentives</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalDeductions / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Taxes &amp; contributions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredPayroll.filter((r) => r.status === 'paid').length}
            </div>
            <p className="text-xs text-muted-foreground">Completed payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="All">All Months</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="All">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Calculate Payroll
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Calculate Payroll</DialogTitle>
                <DialogDescription>
                  Create a new payroll entry for a staff member
                </DialogDescription>
              </DialogHeader>
              <PayrollForm onSubmit={handleAddPayroll} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Records</CardTitle>
          <CardDescription>
            {filteredPayroll.length} record{filteredPayroll.length !== 1 ? 's' : ''} for {selectedMonth} {selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Base Salary</TableHead>
                  <TableHead>Allowances</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayroll.length > 0 ? (
                  filteredPayroll.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.staffName}</TableCell>
                      <TableCell>{record.position}</TableCell>
                      <TableCell>₦{(record.baseSalary / 1000).toFixed(0)}K</TableCell>
                      <TableCell className="text-green-600">₦{(record.allowances / 1000).toFixed(0)}K</TableCell>
                      <TableCell className="text-red-600">₦{(record.deductions / 1000).toFixed(0)}K</TableCell>
                      <TableCell className="font-semibold">₦{(record.netSalary / 1000).toFixed(0)}K</TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant[record.status]}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <button className="p-2 hover:bg-muted rounded-lg">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No payroll records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
