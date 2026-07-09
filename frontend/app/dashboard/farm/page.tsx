'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertCircle, Plus } from 'lucide-react';

export default function FarmPage() {
  // Summary statistics
  const livestockStats = {
    parrots: { count: 4, value: 3920000 },
    rabbits: { count: 5, value: 730500 },
    chickens: { count: 6, value: 1300000 },
    goats: { count: 5, value: 1850000 },
    rams: { count: 5, value: 4630000 },
    sheep: { count: 5, value: 1280000 },
    fish: { count: 4, value: 1295000 },
  };

  const totalLivestock = Object.values(livestockStats).reduce((sum, stat) => sum + (stat.count || 0), 0);
  const totalAssetValue = Object.values(livestockStats).reduce((sum, stat) => sum + (stat.value || 0), 0);
  const monthlyRevenue = 3972000; // From sales
  const monthlyExpenses = 600000; // Feed and maintenance
  const monthlyProfit = monthlyRevenue - monthlyExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Farm Management</h1>
        <p className="text-muted-foreground mt-2">Complete livestock and aquaculture management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Livestock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLivestock}</div>
            <p className="text-xs text-muted-foreground">Animals & stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Asset Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalAssetValue / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">All livestock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{(monthlyRevenue / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">All products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₦{(monthlyExpenses / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">Feed & operations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Monthly Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₦{(monthlyProfit / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">Net income</p>
          </CardContent>
        </Card>
      </div>

      {/* Livestock Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Livestock Categories</CardTitle>
          <CardDescription>Summary of all farm divisions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">🦜 Parrots</h3>
              <p className="text-sm">
                <span className="font-bold">{livestockStats.parrots.count}</span> birds
              </p>
              <p className="text-xs text-blue-700">
                ₦{(livestockStats.parrots.value / 1000000).toFixed(2)}M
              </p>
              <Button variant="outline" size="sm" className="mt-2 w-full text-xs">
                Manage
              </Button>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
              <h3 className="font-semibold text-amber-900 mb-2">🐰 Rabbits</h3>
              <p className="text-sm">
                <span className="font-bold">{livestockStats.rabbits.count}</span> rabbits
              </p>
              <p className="text-xs text-amber-700">
                ₦{(livestockStats.rabbits.value / 1000000).toFixed(2)}M
              </p>
              <Button variant="outline" size="sm" className="mt-2 w-full text-xs">
                Manage
              </Button>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <h3 className="font-semibold text-yellow-900 mb-2">🐔 Chickens</h3>
              <p className="text-sm">
                <span className="font-bold">{livestockStats.chickens.count}</span> birds
              </p>
              <p className="text-xs text-yellow-700">
                ₦{(livestockStats.chickens.value / 1000000).toFixed(2)}M
              </p>
              <Button variant="outline" size="sm" className="mt-2 w-full text-xs">
                Manage
              </Button>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <h3 className="font-semibold text-green-900 mb-2">🐐 Goats</h3>
              <p className="text-sm">
                <span className="font-bold">{livestockStats.goats.count}</span> goats
              </p>
              <p className="text-xs text-green-700">
                ₦{(livestockStats.goats.value / 1000000).toFixed(2)}M
              </p>
              <Button variant="outline" size="sm" className="mt-2 w-full text-xs">
                Manage
              </Button>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <h3 className="font-semibold text-purple-900 mb-2">🐏 Rams</h3>
              <p className="text-sm">
                <span className="font-bold">{livestockStats.rams.count}</span> rams
              </p>
              <p className="text-xs text-purple-700">
                ₦{(livestockStats.rams.value / 1000000).toFixed(2)}M
              </p>
              <Button variant="outline" size="sm" className="mt-2 w-full text-xs">
                Manage
              </Button>
            </div>

            <div className="p-4 bg-pink-50 rounded-lg border border-pink-100">
              <h3 className="font-semibold text-pink-900 mb-2">🐑 Sheep</h3>
              <p className="text-sm">
                <span className="font-bold">{livestockStats.sheep.count}</span> sheep
              </p>
              <p className="text-xs text-pink-700">
                ₦{(livestockStats.sheep.value / 1000000).toFixed(2)}M
              </p>
              <Button variant="outline" size="sm" className="mt-2 w-full text-xs">
                Manage
              </Button>
            </div>

            <div className="p-4 bg-blue-100 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">🐟 Fish</h3>
              <p className="text-sm">
                <span className="font-bold">{livestockStats.fish.count}</span> ponds
              </p>
              <p className="text-xs text-blue-700">
                ₦{(livestockStats.fish.value / 1000000).toFixed(2)}M
              </p>
              <Button variant="outline" size="sm" className="mt-2 w-full text-xs">
                Manage
              </Button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">💰 Sales</h3>
              <p className="text-sm">
                <span className="font-bold">8</span> transactions
              </p>
              <p className="text-xs text-gray-700">
                ₦{(monthlyRevenue / 1000000).toFixed(2)}M collected
              </p>
              <Button variant="outline" size="sm" className="mt-2 w-full text-xs">
                View Sales
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common farm operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Record Livestock Purchase
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Record Sales Transaction
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Log Health Issue
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Record Feed Purchase
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>This month performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Total Revenue:</span>
              <span className="font-bold text-green-600">₦{(monthlyRevenue / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between">
              <span>Total Expenses:</span>
              <span className="font-bold text-red-600">₦{(monthlyExpenses / 1000000).toFixed(2)}M</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-medium">Net Profit:</span>
              <span className="font-bold text-green-600">₦{(monthlyProfit / 1000000).toFixed(2)}M</span>
            </div>
            <div className="bg-green-50 p-2 rounded border border-green-100">
              <p className="text-xs text-green-700">
                💡 <strong>Profit Margin:</strong> {((monthlyProfit / monthlyRevenue) * 100).toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health & Status Alert */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            Farm Status & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• <strong>Parrot (Rio)</strong> - Under medication, recovering well</p>
          <p>• <strong>Rabbit (RBT-005)</strong> - Under treatment for respiratory issue</p>
          <p>• <strong>Ram (Chief)</strong> - Under medical care, temporarily reduced value</p>
          <p>• <strong>West Fish Pond</strong> - Water quality needs monitoring (algae bloom)</p>
          <p className="text-xs text-muted-foreground mt-3">
            ⚠️ Review individual livestock pages for full health details
          </p>
        </CardContent>
      </Card>
    </div>
  );
}