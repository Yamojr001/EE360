'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, AlertCircle, Activity } from 'lucide-react';

interface Rabbit {
  id: string;
  tagId: string;
  breed: string;
  gender: 'male' | 'female';
  age: number;
  weight: number;
  status: 'healthy' | 'sick' | 'pregnant';
  acquiredDate: string;
  purchasePrice: number;
  currentValue: number;
  feedCost: number;
  notes: string;
}

const mockRabbits: Rabbit[] = [
  {
    id: '1',
    tagId: 'RBT-001',
    breed: 'New Zealand White',
    gender: 'female',
    age: 2,
    weight: 4.5,
    status: 'healthy',
    acquiredDate: '2024-01-10',
    purchasePrice: 12000,
    currentValue: 13500,
    feedCost: 800,
    notes: 'High reproduction rate',
  },
  {
    id: '2',
    tagId: 'RBT-002',
    breed: 'Flemish Giant',
    gender: 'male',
    age: 3,
    weight: 5.8,
    status: 'healthy',
    acquiredDate: '2023-06-15',
    purchasePrice: 18000,
    currentValue: 20000,
    feedCost: 1200,
    notes: 'Premium breeding male',
  },
  {
    id: '3',
    tagId: 'RBT-003',
    breed: 'California',
    gender: 'female',
    age: 1,
    weight: 3.2,
    status: 'pregnant',
    acquiredDate: '2025-02-01',
    purchasePrice: 15000,
    currentValue: 16500,
    feedCost: 900,
    notes: 'Due in 2 weeks',
  },
  {
    id: '4',
    tagId: 'RBT-004',
    breed: 'New Zealand White',
    gender: 'male',
    age: 1,
    weight: 4.0,
    status: 'healthy',
    acquiredDate: '2025-01-20',
    purchasePrice: 11000,
    currentValue: 12000,
    feedCost: 800,
    notes: 'Young breeding prospect',
  },
  {
    id: '5',
    tagId: 'RBT-005',
    breed: 'Angora',
    gender: 'female',
    age: 2,
    weight: 3.8,
    status: 'sick',
    acquiredDate: '2024-03-05',
    purchasePrice: 20000,
    currentValue: 14000,
    feedCost: 600,
    notes: 'Under treatment for respiratory issue',
  },
];

export default function RabbitsPage() {
  const totalRabbits = mockRabbits.length;
  const healthyCount = mockRabbits.filter((r) => r.status === 'healthy').length;
  const femaleCount = mockRabbits.filter((r) => r.gender === 'female').length;
  const totalValue = mockRabbits.reduce((sum, r) => sum + r.currentValue, 0);
  const totalMonthlyFeed = mockRabbits.reduce((sum, r) => sum + r.feedCost * 30, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Rabbit Management</h1>
        <p className="text-muted-foreground mt-2">Track breeding stock and production rates</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Rabbits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRabbits}</div>
            <p className="text-xs text-muted-foreground">In herd</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{healthyCount}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Females</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{femaleCount}</div>
            <p className="text-xs text-muted-foreground">Breeding stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Assets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalMonthlyFeed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Estimated</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Rabbit Button */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Rabbit
        </Button>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rabbit Inventory</CardTitle>
          <CardDescription>Breeding stock with health and production status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Tag ID</th>
                  <th className="text-left py-3 px-4 font-medium">Breed</th>
                  <th className="text-center py-3 px-4 font-medium">Gender</th>
                  <th className="text-center py-3 px-4 font-medium">Age</th>
                  <th className="text-right py-3 px-4 font-medium">Weight (kg)</th>
                  <th className="text-center py-3 px-4 font-medium">Status</th>
                  <th className="text-right py-3 px-4 font-medium">Value</th>
                  <th className="text-left py-3 px-4 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {mockRabbits.map((rabbit) => (
                  <tr key={rabbit.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{rabbit.tagId}</td>
                    <td className="py-3 px-4">{rabbit.breed}</td>
                    <td className="py-3 px-4 text-center capitalize">{rabbit.gender}</td>
                    <td className="py-3 px-4 text-center">{rabbit.age} yr</td>
                    <td className="py-3 px-4 text-right">{rabbit.weight}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={
                          rabbit.status === 'healthy'
                            ? 'default'
                            : rabbit.status === 'sick'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {rabbit.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-bold">₦{rabbit.currentValue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{rabbit.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Alert Section */}
      {mockRabbits.some((r) => r.status !== 'healthy') && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              Health Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              {mockRabbits
                .filter((r) => r.status !== 'healthy')
                .map((r) => (
                  <li key={r.id}>
                    <span className="font-medium">{r.tagId}</span> - {r.status.charAt(0).toUpperCase() + r.status.slice(1)} -
                    {r.notes}
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
