'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, TrendingUp } from 'lucide-react';

interface Sheep {
  id: string;
  tagId: string;
  name: string;
  breed: string;
  gender: 'male' | 'female';
  age: number;
  weight: number;
  woolGradePerShearing: string;
  woolWeightPerShearing: number;
  woolYield: number;
  status: 'healthy' | 'sick' | 'nursing';
  purchasePrice: number;
  currentValue: number;
  woolSalesYearly: number;
  notes: string;
}

const mockSheep: Sheep[] = [
  {
    id: '1',
    tagId: 'SHEEP-001',
    name: 'Queen',
    breed: 'Merino',
    gender: 'female',
    age: 4,
    weight: 65,
    woolGradePerShearing: 'Premium',
    woolWeightPerShearing: 6.5,
    woolYield: 95,
    status: 'healthy',
    purchasePrice: 25000,
    currentValue: 30000,
    woolSalesYearly: 65000,
    notes: 'Excellent wool quality - finest grade',
  },
  {
    id: '2',
    tagId: 'SHEEP-002',
    name: 'Diamond',
    breed: 'Merino',
    gender: 'female',
    age: 3,
    weight: 62,
    woolGradePerShearing: 'Premium',
    woolWeightPerShearing: 6.2,
    woolYield: 94,
    status: 'healthy',
    purchasePrice: 22000,
    currentValue: 28000,
    woolSalesYearly: 62000,
    notes: 'Superior wool fiber diameter',
  },
  {
    id: '3',
    tagId: 'SHEEP-003',
    name: 'Ruby',
    breed: 'Dorper',
    gender: 'female',
    age: 2,
    weight: 58,
    woolGradePerShearing: 'Standard',
    woolWeightPerShearing: 5.0,
    woolYield: 92,
    status: 'nursing',
    purchasePrice: 18000,
    currentValue: 20000,
    woolSalesYearly: 40000,
    notes: 'Nursing lamb - reduced productivity',
  },
  {
    id: '4',
    tagId: 'SHEEP-004',
    name: 'Jasper',
    breed: 'Merino',
    gender: 'male',
    age: 5,
    weight: 75,
    woolGradePerShearing: 'Premium',
    woolWeightPerShearing: 7.5,
    woolYield: 96,
    status: 'healthy',
    purchasePrice: 28000,
    currentValue: 32000,
    woolSalesYearly: 75000,
    notes: 'Breeding ram - excellent genetics',
  },
  {
    id: '5',
    tagId: 'SHEEP-005',
    name: 'Pearl',
    breed: 'Dorper',
    gender: 'female',
    age: 1,
    weight: 45,
    woolGradePerShearing: 'Standard',
    woolWeightPerShearing: 4.0,
    woolYield: 90,
    status: 'healthy',
    purchasePrice: 15000,
    currentValue: 18000,
    woolSalesYearly: 32000,
    notes: 'Young producer - good potential',
  },
];

export default function SheepPage() {
  const totalSheep = mockSheep.length;
  const healthyCount = mockSheep.filter((s) => s.status === 'healthy').length;
  const femaleCount = mockSheep.filter((s) => s.gender === 'female').length;
  const totalValue = mockSheep.reduce((sum, s) => sum + s.currentValue, 0);
  const totalInvestment = mockSheep.reduce((sum, s) => sum + s.purchasePrice, 0);
  const profit = totalValue - totalInvestment;
  const totalWoolSales = mockSheep.reduce((sum, s) => sum + s.woolSalesYearly, 0);
  const avgWoolPerShearing = (mockSheep.reduce((sum, s) => sum + s.woolWeightPerShearing, 0) / totalSheep).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sheep Management</h1>
        <p className="text-muted-foreground mt-2">Track wool production and breeding stock</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sheep</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSheep}</div>
            <p className="text-xs text-muted-foreground">Herd</p>
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
            <p className="text-xs text-muted-foreground">Breeders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Package className="w-4 h-4" />
              Avg Wool/Shear
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgWoolPerShearing}kg</div>
            <p className="text-xs text-muted-foreground">Per sheep</p>
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
            <CardTitle className="text-sm font-medium">Yearly Wool Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{totalWoolSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Sheep Button */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Sheep
        </Button>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sheep Inventory</CardTitle>
          <CardDescription>All sheep with wool production and health data</CardDescription>
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
                  <th className="text-right py-3 px-4 font-medium">Wool/Shear</th>
                  <th className="text-right py-3 px-4 font-medium">Grade</th>
                  <th className="text-right py-3 px-4 font-medium">Yearly Sales</th>
                  <th className="text-left py-3 px-4 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {mockSheep.map((sheep) => (
                  <tr key={sheep.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{sheep.tagId}</td>
                    <td className="py-3 px-4">{sheep.name}</td>
                    <td className="py-3 px-4">{sheep.breed}</td>
                    <td className="py-3 px-4 text-center capitalize">{sheep.gender}</td>
                    <td className="py-3 px-4 text-right">
                      {sheep.age} yrs / {sheep.weight}kg
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={
                          sheep.status === 'healthy'
                            ? 'default'
                            : sheep.status === 'sick'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {sheep.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-bold">{sheep.woolWeightPerShearing}kg</td>
                    <td className="py-3 px-4 text-center">{sheep.woolGradePerShearing}</td>
                    <td className="py-3 px-4 text-right font-bold text-green-600">₦{sheep.woolSalesYearly.toLocaleString()}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{sheep.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Production Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Wool Production</CardTitle>
            <CardDescription>Annual yield and quality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Avg per Shearing:</span>
                <span className="font-bold">{avgWoolPerShearing}kg</span>
              </div>
              <div className="flex justify-between">
                <span>Annual (2x shearing):</span>
                <span className="font-bold">
                  {(parseFloat(avgWoolPerShearing) * 2 * totalSheep).toFixed(0)}kg
                </span>
              </div>
              <div className="flex justify-between">
                <span>Average Grade:</span>
                <span className="font-bold">Premium</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Analysis</CardTitle>
            <CardDescription>Wool sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Yearly Wool Sales:</span>
                <span className="font-bold text-green-600">₦{totalWoolSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Per Sheep Yearly:</span>
                <span className="font-bold">₦{(totalWoolSales / totalSheep).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Asset Growth:</span>
                <span className="font-bold text-green-600">₦{profit.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Herd Health</CardTitle>
            <CardDescription>Current status overview</CardDescription>
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
                  {mockSheep.filter((s) => s.status === 'nursing').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Under Care:</span>
                <span className="font-bold text-red-600">
                  {mockSheep.filter((s) => s.status === 'sick').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
