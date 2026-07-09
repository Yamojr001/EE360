'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, AlertCircle, Milk } from 'lucide-react';

interface Goat {
  id: string;
  tagId: string;
  name: string;
  breed: string;
  gender: 'male' | 'female';
  age: number;
  weight: number;
  status: 'healthy' | 'sick' | 'nursing';
  milkProductionDaily: number;
  purchasePrice: number;
  currentValue: number;
  notes: string;
}

const mockGoats: Goat[] = [
  {
    id: '1',
    tagId: 'GOAT-001',
    name: 'Bella',
    breed: 'Nubian',
    gender: 'female',
    age: 4,
    weight: 65,
    status: 'healthy',
    milkProductionDaily: 3.5,
    purchasePrice: 35000,
    currentValue: 40000,
    notes: 'Premium milk producer',
  },
  {
    id: '2',
    tagId: 'GOAT-002',
    name: 'Daisy',
    breed: 'Alpine',
    gender: 'female',
    age: 3,
    weight: 58,
    status: 'healthy',
    milkProductionDaily: 3.2,
    purchasePrice: 32000,
    currentValue: 38000,
    notes: 'Excellent health',
  },
  {
    id: '3',
    tagId: 'GOAT-003',
    name: 'Luna',
    breed: 'Saanen',
    gender: 'female',
    age: 2,
    weight: 52,
    status: 'nursing',
    milkProductionDaily: 2.8,
    purchasePrice: 28000,
    currentValue: 32000,
    notes: 'Nursing 1 kid - productivity reduced',
  },
  {
    id: '4',
    tagId: 'GOAT-004',
    name: 'Billy',
    breed: 'Nubian',
    gender: 'male',
    age: 5,
    weight: 85,
    status: 'healthy',
    milkProductionDaily: 0,
    purchasePrice: 42000,
    currentValue: 45000,
    notes: 'Breeding male - high quality offspring',
  },
  {
    id: '5',
    tagId: 'GOAT-005',
    name: 'Nanny',
    breed: 'Alpine',
    gender: 'female',
    age: 6,
    weight: 60,
    status: 'sick',
    milkProductionDaily: 0,
    purchasePrice: 30000,
    currentValue: 18000,
    notes: 'Under treatment - temporary reduced value',
  },
];

export default function GoatsPage() {
  const totalGoats = mockGoats.length;
  const femaleCount = mockGoats.filter((g) => g.gender === 'female').length;
  const healthyCount = mockGoats.filter((g) => g.status === 'healthy').length;
  const totalDailyMilk = mockGoats.reduce((sum, g) => sum + (g.gender === 'female' ? g.milkProductionDaily : 0), 0);
  const totalValue = mockGoats.reduce((sum, g) => sum + g.currentValue, 0);
  const totalInvestment = mockGoats.reduce((sum, g) => sum + g.purchasePrice, 0);
  const profit = totalValue - totalInvestment;

  // Assuming milk is sold at ₦500 per liter
  const monthlyMilkRevenue = totalDailyMilk * 30 * 500;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Goat Management</h1>
        <p className="text-muted-foreground mt-2">Track breeding and milk production</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Goats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGoats}</div>
            <p className="text-xs text-muted-foreground">Herd size</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Females</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{femaleCount}</div>
            <p className="text-xs text-muted-foreground">Producers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Milk className="w-4 h-4" />
              Daily Milk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDailyMilk.toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">Production</p>
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

      {/* Add New Goat Button */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Goat
        </Button>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Goat Inventory</CardTitle>
          <CardDescription>All goats with production and health status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Tag</th>
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Breed</th>
                  <th className="text-center py-3 px-4 font-medium">Gender</th>
                  <th className="text-right py-3 px-4 font-medium">Age/Weight</th>
                  <th className="text-center py-3 px-4 font-medium">Status</th>
                  <th className="text-right py-3 px-4 font-medium">Milk/Day</th>
                  <th className="text-right py-3 px-4 font-medium">Current Value</th>
                  <th className="text-left py-3 px-4 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {mockGoats.map((goat) => (
                  <tr key={goat.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{goat.tagId}</td>
                    <td className="py-3 px-4">{goat.name}</td>
                    <td className="py-3 px-4">{goat.breed}</td>
                    <td className="py-3 px-4 text-center capitalize">{goat.gender}</td>
                    <td className="py-3 px-4 text-right">
                      {goat.age} yrs / {goat.weight}kg
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={
                          goat.status === 'healthy'
                            ? 'default'
                            : goat.status === 'sick'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {goat.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">{goat.milkProductionDaily}L</td>
                    <td className="py-3 px-4 text-right font-bold">₦{goat.currentValue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{goat.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Production & Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Milk Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Daily Milk:</span>
                <span className="font-bold">{totalDailyMilk.toFixed(1)} liters</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Production:</span>
                <span className="font-bold">{(totalDailyMilk * 30).toFixed(0)} liters</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Revenue:</span>
                <span className="font-bold text-green-600">₦{monthlyMilkRevenue.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Herd Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Healthy:</span>
                <span className="font-bold text-green-600">{healthyCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Nursing:</span>
                <span className="font-bold text-blue-600">
                  {mockGoats.filter((g) => g.status === 'nursing').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Under Treatment:</span>
                <span className="font-bold text-red-600">
                  {mockGoats.filter((g) => g.status === 'sick').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Alerts */}
      {mockGoats.some((g) => g.status !== 'healthy') && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              Herd Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              {mockGoats
                .filter((g) => g.status !== 'healthy')
                .map((g) => (
                  <li key={g.id}>
                    <span className="font-medium">{g.name}</span> ({g.tagId}) - {g.status.charAt(0).toUpperCase() + g.status.slice(1)} - {g.notes}
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
