'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Droplet, TrendingUp } from 'lucide-react';

interface FishPond {
  id: string;
  pondId: string;
  name: string;
  species: string;
  waterQuality: 'excellent' | 'good' | 'fair' | 'poor';
  fishCount: number;
  averageWeight: number;
  harvestReady: number;
  feedCostMonthly: number;
  estimatedHarvestDate: string;
  estimatedYieldKg: number;
  estimatedRevenue: number;
  notes: string;
}

const mockFishPonds: FishPond[] = [
  {
    id: '1',
    pondId: 'POND-001',
    name: 'North Pond',
    species: 'Tilapia',
    waterQuality: 'excellent',
    fishCount: 5000,
    averageWeight: 0.8,
    harvestReady: 120,
    feedCostMonthly: 25000,
    estimatedHarvestDate: '2026-06-01',
    estimatedYieldKg: 4000,
    estimatedRevenue: 480000,
    notes: 'Premium tilapia strain - fast growth',
  },
  {
    id: '2',
    pondId: 'POND-002',
    name: 'South Pond',
    species: 'Catfish',
    waterQuality: 'good',
    fishCount: 3000,
    averageWeight: 1.2,
    harvestReady: 80,
    feedCostMonthly: 18000,
    estimatedHarvestDate: '2026-05-15',
    estimatedYieldKg: 3600,
    estimatedRevenue: 360000,
    notes: 'Strong growth - ready for harvest soon',
  },
  {
    id: '3',
    pondId: 'POND-003',
    name: 'East Pond',
    species: 'Tilapia',
    waterQuality: 'good',
    fishCount: 4500,
    averageWeight: 0.6,
    harvestReady: 0,
    feedCostMonthly: 22000,
    estimatedHarvestDate: '2026-07-15',
    estimatedYieldKg: 2700,
    estimatedRevenue: 324000,
    notes: 'Young stock - 2 months to market size',
  },
  {
    id: '4',
    pondId: 'POND-004',
    name: 'West Pond',
    species: 'Catfish',
    waterQuality: 'fair',
    fishCount: 2500,
    averageWeight: 0.5,
    harvestReady: 0,
    feedCostMonthly: 15000,
    estimatedHarvestDate: '2026-08-01',
    estimatedYieldKg: 1250,
    estimatedRevenue: 125000,
    notes: 'Needs water quality monitoring - algae bloom',
  },
];

export default function FishPage() {
  const totalPonds = mockFishPonds.length;
  const totalFishCount = mockFishPonds.reduce((sum, p) => sum + p.fishCount, 0);
  const totalHarvestReady = mockFishPonds.reduce((sum, p) => sum + p.harvestReady, 0);
  const totalFeedCost = mockFishPonds.reduce((sum, p) => sum + p.feedCostMonthly, 0);
  const totalEstimatedRevenue = mockFishPonds.reduce((sum, p) => sum + p.estimatedRevenue, 0);
  const totalEstimatedYield = mockFishPonds.reduce((sum, p) => sum + p.estimatedYieldKg, 0);
  const projectedProfit = totalEstimatedRevenue - (totalFeedCost * 3); // Assuming 3 months until harvest

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fish Farming Management</h1>
        <p className="text-muted-foreground mt-2">Track aquaculture ponds and production</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Ponds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPonds}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Fish</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalFishCount / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">Stocked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ready to Harvest</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalHarvestReady}</div>
            <p className="text-xs text-muted-foreground">Fish</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Feed Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalFeedCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Expense</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Est. Yield (Next 3mo)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEstimatedYield.toLocaleString()}kg</div>
            <p className="text-xs text-muted-foreground">Production</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Proj. Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{(totalEstimatedRevenue / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">Next harvest</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Pond Button */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Pond
        </Button>
      </div>

      {/* Ponds Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fish Ponds</CardTitle>
          <CardDescription>All ponds with stock and production data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Pond ID</th>
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Species</th>
                  <th className="text-center py-3 px-4 font-medium">Water Quality</th>
                  <th className="text-right py-3 px-4 font-medium">Stock Count</th>
                  <th className="text-right py-3 px-4 font-medium">Avg Weight</th>
                  <th className="text-right py-3 px-4 font-medium">Ready to Harvest</th>
                  <th className="text-right py-3 px-4 font-medium">Harvest Date</th>
                  <th className="text-right py-3 px-4 font-medium">Est. Revenue</th>
                  <th className="text-left py-3 px-4 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {mockFishPonds.map((pond) => (
                  <tr key={pond.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{pond.pondId}</td>
                    <td className="py-3 px-4">{pond.name}</td>
                    <td className="py-3 px-4">{pond.species}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={
                          pond.waterQuality === 'excellent'
                            ? 'default'
                            : pond.waterQuality === 'good'
                            ? 'secondary'
                            : pond.waterQuality === 'fair'
                            ? 'outline'
                            : 'destructive'
                        }
                      >
                        {pond.waterQuality}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">{(pond.fishCount / 1000).toFixed(1)}K</td>
                    <td className="py-3 px-4 text-right">{pond.averageWeight}kg</td>
                    <td className="py-3 px-4 text-right font-bold text-green-600">{pond.harvestReady}</td>
                    <td className="py-3 px-4 text-right text-sm">{pond.estimatedHarvestDate}</td>
                    <td className="py-3 px-4 text-right font-bold">₦{pond.estimatedRevenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{pond.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Production Forecast */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Production Forecast</CardTitle>
            <CardDescription>Next 3 months projection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Est. Total Yield:</span>
                <span className="font-bold">{totalEstimatedYield.toLocaleString()}kg</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Revenue:</span>
                <span className="font-bold text-green-600">₦{totalEstimatedRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Feed Cost (3mo):</span>
                <span className="font-bold">₦{(totalFeedCost * 3).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profitability</CardTitle>
            <CardDescription>3-month cycle projection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Revenue:</span>
                <span className="font-bold text-green-600">₦{totalEstimatedRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Costs:</span>
                <span className="font-bold text-red-600">₦{(totalFeedCost * 3).toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-medium">Net Profit:</span>
                <span className={`font-bold ${projectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₦{projectedProfit.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pond Status</CardTitle>
            <CardDescription>Water quality overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Excellent:</span>
                <span className="font-bold text-green-600">
                  {mockFishPonds.filter((p) => p.waterQuality === 'excellent').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Good:</span>
                <span className="font-bold text-blue-600">
                  {mockFishPonds.filter((p) => p.waterQuality === 'good').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Fair/Poor:</span>
                <span className="font-bold text-yellow-600">
                  {mockFishPonds.filter((p) => p.waterQuality === 'fair' || p.waterQuality === 'poor').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {mockFishPonds.some((p) => p.waterQuality !== 'good' && p.waterQuality !== 'excellent') && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplet className="w-4 h-4 text-yellow-600" />
              Water Quality Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              {mockFishPonds
                .filter((p) => p.waterQuality !== 'good' && p.waterQuality !== 'excellent')
                .map((p) => (
                  <li key={p.id}>
                    <span className="font-medium">{p.name}</span> ({p.pondId}) - {p.waterQuality} water quality - {p.notes}
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
