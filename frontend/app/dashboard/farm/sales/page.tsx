'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp } from 'lucide-react';

interface Sale {
  id: string;
  date: string;
  livestock: string;
  quantity: number;
  unit: string;
  buyer: string;
  pricePerUnit: number;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
}

const mockSales: Sale[] = [
  {
    id: '1',
    date: '2026-04-15',
    livestock: 'Parrot (African Grey)',
    quantity: 1,
    unit: 'bird',
    buyer: 'Pet Boutique Lagos',
    pricePerUnit: 85000,
    totalAmount: 85000,
    paymentStatus: 'paid',
  },
  {
    id: '2',
    date: '2026-04-14',
    livestock: 'Rabbit (New Zealand)',
    quantity: 3,
    unit: 'birds',
    buyer: 'Premium Meat Supplier',
    pricePerUnit: 15000,
    totalAmount: 45000,
    paymentStatus: 'paid',
  },
  {
    id: '3',
    date: '2026-04-12',
    livestock: 'Chicken Eggs',
    quantity: 360,
    unit: 'crates',
    buyer: 'City Market Hub',
    pricePerUnit: 4500,
    totalAmount: 1620000,
    paymentStatus: 'paid',
  },
  {
    id: '4',
    date: '2026-04-10',
    livestock: 'Goat Milk',
    quantity: 120,
    unit: 'liters',
    buyer: 'Dairy Cooperative',
    pricePerUnit: 500,
    totalAmount: 60000,
    paymentStatus: 'paid',
  },
  {
    id: '5',
    date: '2026-04-09',
    livestock: 'Ram (Dorper - Breeding)',
    quantity: 1,
    unit: 'bird',
    buyer: 'Large Farm Complex',
    pricePerUnit: 95000,
    totalAmount: 95000,
    paymentStatus: 'pending',
  },
  {
    id: '6',
    date: '2026-04-08',
    livestock: 'Sheep Wool',
    quantity: 25,
    unit: 'kg',
    buyer: 'Textile Factory',
    pricePerUnit: 2500,
    totalAmount: 62500,
    paymentStatus: 'paid',
  },
  {
    id: '7',
    date: '2026-04-07',
    livestock: 'Tilapia',
    quantity: 180,
    unit: 'kg',
    buyer: 'Fish Market Downtown',
    pricePerUnit: 2000,
    totalAmount: 360000,
    paymentStatus: 'paid',
  },
  {
    id: '8',
    date: '2026-04-05',
    livestock: 'Catfish',
    quantity: 150,
    unit: 'kg',
    buyer: 'Restaurant Chain',
    pricePerUnit: 2500,
    totalAmount: 375000,
    paymentStatus: 'partial',
  },
];

export default function FarmSalesPage() {
  const totalSales = mockSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const paidSales = mockSales
    .filter((s) => s.paymentStatus === 'paid')
    .reduce((sum, s) => sum + s.totalAmount, 0);
  const pendingSales = mockSales
    .filter((s) => s.paymentStatus === 'pending' || s.paymentStatus === 'partial')
    .reduce((sum, s) => sum + s.totalAmount, 0);
  
  // Breakdown by livestock type
  const livestockBreakdown = {
    parrots: mockSales.filter((s) => s.livestock.includes('Parrot')).reduce((sum, s) => sum + s.totalAmount, 0),
    rabbits: mockSales.filter((s) => s.livestock.includes('Rabbit')).reduce((sum, s) => sum + s.totalAmount, 0),
    chickens: mockSales.filter((s) => s.livestock.includes('Chicken')).reduce((sum, s) => sum + s.totalAmount, 0),
    goats: mockSales.filter((s) => s.livestock.includes('Goat')).reduce((sum, s) => sum + s.totalAmount, 0),
    rams: mockSales.filter((s) => s.livestock.includes('Ram')).reduce((sum, s) => sum + s.totalAmount, 0),
    sheep: mockSales.filter((s) => s.livestock.includes('Sheep')).reduce((sum, s) => sum + s.totalAmount, 0),
    fish: mockSales.filter((s) => s.livestock.includes('ilapia') || s.livestock.includes('atfish')).reduce((sum, s) => sum + s.totalAmount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Farm Sales & Revenue</h1>
        <p className="text-muted-foreground mt-2">Track all livestock and product sales across the farm</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalSales / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">{mockSales.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{(paidSales / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">Received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending/Partial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">₦{(pendingSales / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">Outstanding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((paidSales / totalSales) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">Payment received</p>
          </CardContent>
        </Card>
      </div>

      {/* Livestock Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Sales by Livestock Type</CardTitle>
          <CardDescription>Revenue breakdown across all farm products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(livestockBreakdown).map(([type, amount]) => (
              <div key={type} className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium capitalize mb-1">{type}</div>
                <div className="text-lg font-bold">₦{(amount / 1000).toFixed(0)}K</div>
                <div className="text-xs text-muted-foreground">
                  {((amount / totalSales) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Sale Button */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Record Sale
        </Button>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales Transactions</CardTitle>
          <CardDescription>All farm sales with payment status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Livestock/Product</th>
                  <th className="text-center py-3 px-4 font-medium">Quantity</th>
                  <th className="text-left py-3 px-4 font-medium">Buyer</th>
                  <th className="text-right py-3 px-4 font-medium">Price/Unit</th>
                  <th className="text-right py-3 px-4 font-medium">Total Amount</th>
                  <th className="text-center py-3 px-4 font-medium">Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {mockSales.map((sale) => (
                  <tr key={sale.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{sale.date}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{sale.livestock}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {sale.quantity} {sale.unit}
                    </td>
                    <td className="py-3 px-4">{sale.buyer}</td>
                    <td className="py-3 px-4 text-right">₦{sale.pricePerUnit.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-bold">₦{sale.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Summary</CardTitle>
            <CardDescription>Current period overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Sales:</span>
                <span className="font-bold">₦{(totalSales / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between">
                <span>Collected:</span>
                <span className="font-bold text-green-600">₦{(paidSales / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between">
                <span>Outstanding:</span>
                <span className="font-bold text-yellow-600">₦{(pendingSales / 1000000).toFixed(2)}M</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
            <CardDescription>Sales activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Transactions:</span>
                <span className="font-bold">{mockSales.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed (Paid):</span>
                <span className="font-bold text-green-600">
                  {mockSales.filter((s) => s.paymentStatus === 'paid').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Pending Payment:</span>
                <span className="font-bold text-yellow-600">
                  {mockSales.filter((s) => s.paymentStatus !== 'paid').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>By revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {Object.entries(livestockBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([type, amount]) => (
                  <li key={type} className="flex justify-between">
                    <span className="capitalize">{type}</span>
                    <span className="font-bold">₦{(amount / 1000000).toFixed(2)}M</span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
