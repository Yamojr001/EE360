'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Egg, TrendingUp } from 'lucide-react';

interface Chicken {
  id: string;
  tagId: string;
  breed: string;
  age: number;
  status: 'active' | 'molting' | 'resting' | 'sick';
  eggProductionPerDay: number;
  eggSalesMonthly: number;
  feedCostDaily: number;
  notes: string;
}

const mockChickens: Chicken[] = [
  {
    id: '1',
    tagId: 'HEN-101',
    breed: 'Leghorn',
    age: 2,
    status: 'active',
    eggProductionPerDay: 0.9,
    eggSalesMonthly: 24000,
    feedCostDaily: 150,
    notes: 'Top producer',
  },
  {
    id: '2',
    tagId: 'HEN-102',
    breed: 'Leghorn',
    age: 2,
    status: 'active',
    eggProductionPerDay: 0.88,
    eggSalesMonthly: 23000,
    feedCostDaily: 150,
    notes: 'Consistent layers',
  },
  {
    id: '3',
    tagId: 'HEN-103',
    breed: 'Isa Brown',
    age: 1,
    status: 'active',
    eggProductionPerDay: 0.92,
    eggSalesMonthly: 26000,
    feedCostDaily: 160,
    notes: 'Recently matured',
  },
  {
    id: '4',
    tagId: 'HEN-104',
    breed: 'Leghorn',
    age: 3,
    status: 'molting',
    eggProductionPerDay: 0.3,
    eggSalesMonthly: 6000,
    feedCostDaily: 180,
    notes: 'Seasonal molt',
  },
  {
    id: '5',
    tagId: 'HEN-105',
    breed: 'Isa Brown',
    age: 2,
    status: 'sick',
    eggProductionPerDay: 0,
    eggSalesMonthly: 0,
    feedCostDaily: 120,
    notes: 'Under treatment',
  },
  {
    id: '6',
    tagId: 'ROOSTER-01',
    breed: 'Leghorn',
    age: 3,
    status: 'active',
    eggProductionPerDay: 0,
    eggSalesMonthly: 0,
    feedCostDaily: 180,
    notes: 'Breeding rooster',
  },
];

export default function ChickensPage() {
  const totalChickens = mockChickens.length;
  const activeHens = mockChickens.filter((c) => c.status === 'active').length;
  const totalDailyProduction = mockChickens.reduce((sum, c) => sum + c.eggProductionPerDay, 0);
  const totalMonthlyEggSales = mockChickens.reduce((sum, c) => sum + c.eggSalesMonthly, 0);
  const totalMonthlyFeed = mockChickens.reduce((sum, c) => sum + c.feedCostDaily * 30, 0);
  const netMonthlyProfit = totalMonthlyEggSales - totalMonthlyFeed;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Chicken Management</h1>
        <p className="text-muted-foreground mt-2">Track egg production and flock health</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Flock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChickens}</div>
            <p className="text-xs text-muted-foreground">Birds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeHens}</div>
            <p className="text-xs text-muted-foreground">Producing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Egg className="w-4 h-4" />
              Daily Eggs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalDailyProduction * 10) / 10}</div>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Egg Sales/Mo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalMonthlyEggSales / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Feed Cost/Mo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalMonthlyFeed / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Expense</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Net Profit/Mo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netMonthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₦{(netMonthlyProfit / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">After costs</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Chicken Button */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Chicken
        </Button>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Flock Inventory</CardTitle>
          <CardDescription>All birds with production and health tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Tag</th>
                  <th className="text-left py-3 px-4 font-medium">Breed</th>
                  <th className="text-center py-3 px-4 font-medium">Age</th>
                  <th className="text-center py-3 px-4 font-medium">Status</th>
                  <th className="text-right py-3 px-4 font-medium">Eggs/Day</th>
                  <th className="text-right py-3 px-4 font-medium">Monthly Sales</th>
                  <th className="text-right py-3 px-4 font-medium">Monthly Feed</th>
                  <th className="text-left py-3 px-4 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {mockChickens.map((chicken) => (
                  <tr key={chicken.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{chicken.tagId}</td>
                    <td className="py-3 px-4">{chicken.breed}</td>
                    <td className="py-3 px-4 text-center">{chicken.age} yr</td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={
                          chicken.status === 'active'
                            ? 'default'
                            : chicken.status === 'sick'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {chicken.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">{chicken.eggProductionPerDay}</td>
                    <td className="py-3 px-4 text-right font-bold">₦{chicken.eggSalesMonthly.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">₦{(chicken.feedCostDaily * 30).toLocaleString()}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{chicken.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Production Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Production Summary</CardTitle>
          <CardDescription>Monthly performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Egg Production</h4>
              <p className="text-2xl font-bold">
                {Math.round(totalDailyProduction * 30)} 
              </p>
              <p className="text-sm text-muted-foreground">eggs per month (approx)</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Revenue</h4>
              <p className="text-2xl font-bold text-green-600">
                ₦{totalMonthlyEggSales.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">monthly income</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Net Profit</h4>
              <p className={`text-2xl font-bold ${netMonthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₦{netMonthlyProfit.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">after all costs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
