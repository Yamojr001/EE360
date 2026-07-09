'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, AlertCircle } from 'lucide-react';

interface Ram {
  id: string;
  tagId: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  status: 'healthy' | 'sick' | 'breeding';
  breedingQuality: 'premium' | 'standard' | 'developing';
  purchasePrice: number;
  currentValue: number;
  offspringSold: number;
  offspringRevenue: number;
  notes: string;
}

const mockRams: Ram[] = [
  {
    id: '1',
    tagId: 'RAM-001',
    name: 'Sultan',
    breed: 'Dorper',
    age: 6,
    weight: 120,
    status: 'breeding',
    breedingQuality: 'premium',
    purchasePrice: 85000,
    currentValue: 95000,
    offspringSold: 24,
    offspringRevenue: 840000,
    notes: 'Excellent genetics - producing premium lambs',
  },
  {
    id: '2',
    tagId: 'RAM-002',
    name: 'King',
    breed: 'Dorset',
    age: 4,
    weight: 115,
    status: 'healthy',
    breedingQuality: 'premium',
    purchasePrice: 75000,
    currentValue: 88000,
    offspringSold: 18,
    offspringRevenue: 630000,
    notes: 'Strong breeding performance',
  },
  {
    id: '3',
    tagId: 'RAM-003',
    name: 'Duke',
    breed: 'Merino',
    age: 3,
    weight: 95,
    status: 'healthy',
    breedingQuality: 'standard',
    purchasePrice: 45000,
    currentValue: 52000,
    offspringSold: 8,
    offspringRevenue: 280000,
    notes: 'Good growth potential',
  },
  {
    id: '4',
    tagId: 'RAM-004',
    name: 'Young Bucks',
    breed: 'Dorper',
    age: 1,
    weight: 45,
    status: 'healthy',
    breedingQuality: 'developing',
    purchasePrice: 35000,
    currentValue: 38000,
    offspringSold: 0,
    offspringRevenue: 0,
    notes: 'Young - developing breeding qualities',
  },
  {
    id: '5',
    tagId: 'RAM-005',
    name: 'Chief',
    breed: 'Dorset',
    age: 5,
    weight: 110,
    status: 'sick',
    breedingQuality: 'premium',
    purchasePrice: 80000,
    currentValue: 50000,
    offspringSold: 20,
    offspringRevenue: 700000,
    notes: 'Under medical care - temporarily reduced value',
  },
];

export default function RamsPage() {
  const totalRams = mockRams.length;
  const healthyCount = mockRams.filter((r) => r.status !== 'sick').length;
  const premiumCount = mockRams.filter((r) => r.breedingQuality === 'premium').length;
  const totalValue = mockRams.reduce((sum, r) => sum + r.currentValue, 0);
  const totalInvestment = mockRams.reduce((sum, r) => sum + r.purchasePrice, 0);
  const totalOffspringRevenue = mockRams.reduce((sum, r) => sum + r.offspringRevenue, 0);
  const totalProfit = totalOffspringRevenue + (totalValue - totalInvestment);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Ram Management</h1>
        <p className="text-muted-foreground mt-2">Premium breeding stock and offspring tracking</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Rams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRams}</div>
            <p className="text-xs text-muted-foreground">In herd</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Premium Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{premiumCount}</div>
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
            <CardTitle className="text-sm font-medium">Offspring Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{(totalOffspringRevenue / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Total Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₦{(totalProfit / 1000000).toFixed(2)}M
            </div>
            <p className="text-xs text-muted-foreground">Revenue + growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Ram Button */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Ram
        </Button>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ram Inventory</CardTitle>
          <CardDescription>Breeding stock with genetics and performance data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Tag</th>
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Breed</th>
                  <th className="text-right py-3 px-4 font-medium">Age/Weight</th>
                  <th className="text-center py-3 px-4 font-medium">Quality</th>
                  <th className="text-center py-3 px-4 font-medium">Status</th>
                  <th className="text-right py-3 px-4 font-medium">Offspring Sold</th>
                  <th className="text-right py-3 px-4 font-medium">Current Value</th>
                  <th className="text-left py-3 px-4 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {mockRams.map((ram) => (
                  <tr key={ram.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{ram.tagId}</td>
                    <td className="py-3 px-4">{ram.name}</td>
                    <td className="py-3 px-4">{ram.breed}</td>
                    <td className="py-3 px-4 text-right">
                      {ram.age} yrs / {ram.weight}kg
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={
                          ram.breedingQuality === 'premium'
                            ? 'default'
                            : ram.breedingQuality === 'standard'
                            ? 'secondary'
                            : 'outline'
                        }
                        className={
                          ram.breedingQuality === 'premium'
                            ? 'bg-purple-600'
                            : ram.breedingQuality === 'standard'
                            ? ''
                            : ''
                        }
                      >
                        {ram.breedingQuality}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={
                          ram.status === 'healthy'
                            ? 'default'
                            : ram.status === 'breeding'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {ram.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-bold">{ram.offspringSold}</td>
                    <td className="py-3 px-4 text-right font-bold">₦{ram.currentValue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{ram.notes}</td>
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
            <CardTitle>Breeding Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Premium Breeding Stock:</span>
                <span className="font-bold">{premiumCount}/{totalRams}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Offspring Sold:</span>
                <span className="font-bold">{mockRams.reduce((sum, r) => sum + r.offspringSold, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Offspring/Ram:</span>
                <span className="font-bold">
                  {(mockRams.reduce((sum, r) => sum + r.offspringSold, 0) / totalRams).toFixed(1)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Breeding Revenue:</span>
                <span className="font-bold text-green-600">₦{(totalOffspringRevenue / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between">
                <span>Asset Value Growth:</span>
                <span className="font-bold text-green-600">
                  ₦{((totalValue - totalInvestment) / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Return:</span>
                <span className="font-bold text-green-600">₦{(totalProfit / 1000000).toFixed(2)}M</span>
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
                <span>Healthy/Available:</span>
                <span className="font-bold text-green-600">{healthyCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Under Medical Care:</span>
                <span className="font-bold text-red-600">
                  {mockRams.filter((r) => r.status === 'sick').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Currently Breeding:</span>
                <span className="font-bold text-blue-600">
                  {mockRams.filter((r) => r.status === 'breeding').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {mockRams.some((r) => r.status === 'sick') && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              Health Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              {mockRams
                .filter((r) => r.status === 'sick')
                .map((r) => (
                  <li key={r.id}>
                    <span className="font-medium">{r.name}</span> ({r.tagId}) - {r.notes}
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
