'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplet, Package, TrendingUp, DollarSign, Plus, Truck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function WaterPage() {
  const stats = {
    totalProduction: 15250, // liters
    totalInventory: 8500,   // liters
    monthlySales: 12500,    // liters
    monthlyRevenue: 625000, // ₦
  };

  const quickActions = [
    {
      title: 'Record Production',
      description: 'Log production batches',
      href: '/dashboard/water/production',
      icon: <Droplet className="w-5 h-5" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Manage Inventory',
      description: 'Track stock levels',
      href: '/dashboard/water/inventory',
      icon: <Package className="w-5 h-5" />,
      color: 'bg-cyan-500',
    },
    {
      title: 'Record Sales',
      description: 'Log customer sales',
      href: '/dashboard/water/sales',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'bg-green-500',
    },
    {
      title: 'Distribution',
      description: 'Manage deliveries',
      href: '/dashboard/water/distribution',
      icon: <Truck className="w-5 h-5" />,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sachet Water Production</h1>
        <p className="text-muted-foreground mt-2">
          Manage production, inventory, sales, and distribution
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplet className="w-4 h-4 text-blue-600" />
              Total Production
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProduction.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Liters (all time)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-600" />
              Current Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInventory.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Liters in stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Monthly Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlySales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Liters sold this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(stats.monthlyRevenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Revenue this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                    {action.icon}
                  </div>
                  <CardTitle className="text-base">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Production Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Production Schedule</CardTitle>
          <CardDescription>Recent production batches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: '2026-04-14', quantity: 2500, cost: 12500, status: 'completed' },
              { date: '2026-04-13', quantity: 1800, cost: 9000, status: 'completed' },
              { date: '2026-04-12', quantity: 2200, cost: 11000, status: 'completed' },
            ].map((batch, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{batch.quantity.toLocaleString()} Liters</h3>
                  <p className="text-sm text-muted-foreground">{batch.date}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₦{batch.cost.toLocaleString()}</div>
                  <div className="text-xs text-green-600 capitalize">{batch.status}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>Latest customer purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { customer: 'Market A', quantity: 500, price: 25000, date: '2026-04-15' },
              { customer: 'Shop B', quantity: 300, price: 15000, date: '2026-04-15' },
              { customer: 'Distributor C', quantity: 1000, price: 50000, date: '2026-04-14' },
            ].map((sale, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{sale.customer}</h3>
                  <p className="text-sm text-muted-foreground">{sale.quantity} sachets</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₦{sale.price.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{sale.date}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
