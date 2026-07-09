'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, AlertCircle, TrendingUp } from 'lucide-react';

interface Parrot {
  id: string;
  name: string;
  breed: string;
  age: number;
  status: 'healthy' | 'sick' | 'recovery';
  acquiredDate: string;
  purchasePrice: number;
  currentValue: number;
  notes: string;
}

const mockParrots: Parrot[] = [
  {
    id: '1',
    name: 'Polly',
    breed: 'African Grey',
    age: 3,
    status: 'healthy',
    acquiredDate: '2023-01-15',
    purchasePrice: 75000,
    currentValue: 85000,
    notes: 'Premium breeding bird',
  },
  {
    id: '2',
    name: 'Kiwi',
    breed: 'Amazon',
    age: 2,
    status: 'healthy',
    acquiredDate: '2023-06-20',
    purchasePrice: 65000,
    currentValue: 72000,
    notes: 'Good temperament',
  },
  {
    id: '3',
    name: 'Sunny',
    breed: 'Macaw',
    age: 5,
    status: 'healthy',
    acquiredDate: '2021-03-10',
    purchasePrice: 120000,
    currentValue: 140000,
    notes: 'Excellent breeding performance',
  },
  {
    id: '4',
    name: 'Rio',
    breed: 'Cockatiel',
    age: 1,
    status: 'recovery',
    acquiredDate: '2025-01-05',
    purchasePrice: 45000,
    currentValue: 42000,
    notes: 'Under medication - improving',
  },
];

export default function ParrotsPage() {
  const totalParrots = mockParrots.length;
  const healthyCount = mockParrots.filter((p) => p.status === 'healthy').length;
  const totalValue = mockParrots.reduce((sum, p) => sum + p.currentValue, 0);
  const totalInvestment = mockParrots.reduce((sum, p) => sum + p.purchasePrice, 0);
  const profit = totalValue - totalInvestment;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Parrot Management</h1>
        <p className="text-muted-foreground mt-2">Track breeding inventory and health status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Parrots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParrots}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{healthyCount}</div>
            <p className="text-xs text-muted-foreground">Active birds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current assets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₦{profit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Value growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Parrot Button */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Parrot
        </Button>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Parrot Inventory</CardTitle>
          <CardDescription>All parrots with health and value tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Breed</th>
                  <th className="text-center py-3 px-4 font-medium">Age</th>
                  <th className="text-center py-3 px-4 font-medium">Status</th>
                  <th className="text-right py-3 px-4 font-medium">Acquired</th>
                  <th className="text-right py-3 px-4 font-medium">Current Value</th>
                  <th className="text-left py-3 px-4 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {mockParrots.map((parrot) => (
                  <tr key={parrot.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{parrot.name}</td>
                    <td className="py-3 px-4">{parrot.breed}</td>
                    <td className="py-3 px-4 text-center">{parrot.age} years</td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={
                          parrot.status === 'healthy'
                            ? 'default'
                            : parrot.status === 'sick'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {parrot.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right text-sm">{parrot.acquiredDate}</td>
                    <td className="py-3 px-4 text-right font-bold">₦{parrot.currentValue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{parrot.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Health Alert Card */}
      {mockParrots.some((p) => p.status !== 'healthy') && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              Health Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              {mockParrots
                .filter((p) => p.status !== 'healthy')
                .map((p) => (
                  <li key={p.id}>
                    <span className="font-medium">{p.name}</span> - {p.status.charAt(0).toUpperCase() + p.status.slice(1)}{' '}
                    ({p.notes})
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
