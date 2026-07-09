'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, TrendingUp } from 'lucide-react';

interface Sale {
  id: string;
  date: string;
  customer: string;
  quantity: number; // sachets
  pricePerSachet: number;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
}

const mockSales: Sale[] = [
  {
    id: '1',
    date: '2026-04-15',
    customer: 'Market A (Lekki)',
    quantity: 500,
    pricePerSachet: 50,
    totalAmount: 25000,
    paymentStatus: 'paid',
  },
  {
    id: '2',
    date: '2026-04-15',
    customer: 'Shop B (VI)',
    quantity: 300,
    pricePerSachet: 50,
    totalAmount: 15000,
    paymentStatus: 'paid',
  },
  {
    id: '3',
    date: '2026-04-14',
    customer: 'Distributor C',
    quantity: 1000,
    pricePerSachet: 45,
    totalAmount: 45000,
    paymentStatus: 'paid',
  },
  {
    id: '4',
    date: '2026-04-14',
    customer: 'Store D',
    quantity: 800,
    pricePerSachet: 50,
    totalAmount: 40000,
    paymentStatus: 'pending',
  },
];

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = sales.filter(
    (s) =>
      s.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.date.includes(searchTerm)
  );

  const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalQuantity = sales.reduce((sum, s) => sum + s.quantity, 0);
  const paidAmount = sales.filter((s) => s.paymentStatus === 'paid').reduce((sum, s) => sum + s.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sales Management</h1>
        <p className="text-muted-foreground mt-2">Track customer sales and revenue</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalSales / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">All sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Sachets sold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{(paidAmount / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₦{((totalSales - paidAmount) / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Unpaid amount</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Record Sale
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Sale</DialogTitle>
              <DialogDescription>Log a new customer sale</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Customer name" />
              <Input placeholder="Quantity (sachets)" type="number" />
              <Input placeholder="Price per sachet" type="number" />
              <Input placeholder="Date" type="date" />
              <Button className="w-full">Record Sale</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Transactions</CardTitle>
          <CardDescription>{filteredSales.length} transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price/Sachet</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell className="font-medium">{sale.customer}</TableCell>
                    <TableCell>{sale.quantity.toLocaleString()}</TableCell>
                    <TableCell>₦{sale.pricePerSachet}</TableCell>
                    <TableCell className="font-semibold">₦{sale.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          sale.paymentStatus === 'paid'
                            ? 'default'
                            : sale.paymentStatus === 'pending'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {sale.paymentStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
