'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, AlertTriangle } from 'lucide-react';

interface InventoryItem {
  id: string;
  product: string;
  unit: string;
  quantity: number;
  minimumLevel: number;
  cost: number;
  lastUpdated: string;
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    product: 'Finished Water (Sachets)',
    unit: 'liters',
    quantity: 8500,
    minimumLevel: 5000,
    cost: 425000,
    lastUpdated: '2026-04-15',
  },
  {
    id: '2',
    product: 'Empty Sachets',
    unit: 'pieces',
    quantity: 12000,
    minimumLevel: 8000,
    cost: 120000,
    lastUpdated: '2026-04-14',
  },
  {
    id: '3',
    product: 'Packaging (Cartons)',
    unit: 'pieces',
    quantity: 450,
    minimumLevel: 500,
    cost: 90000,
    lastUpdated: '2026-04-13',
  },
  {
    id: '4',
    product: 'Labels',
    unit: 'pieces',
    quantity: 3000,
    minimumLevel: 2000,
    cost: 15000,
    lastUpdated: '2026-04-12',
  },
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);

  const lowStockItems = inventory.filter((item) => item.quantity <= item.minimumLevel);
  const totalValue = inventory.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
        <p className="text-muted-foreground mt-2">Track materials, finished goods, and stock levels</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Product types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalValue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Total worth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Below minimum level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{inventory.length - lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Adequate stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-orange-900 dark:text-orange-100">Low Stock Alert</h3>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} are below minimum stock level.
            </p>
          </div>
        </div>
      )}

      {/* Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Current stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{item.product}</h3>
                  <p className="text-sm text-muted-foreground">
                    Min: {item.minimumLevel} {item.unit} | Updated: {item.lastUpdated}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-lg font-bold">{item.quantity.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{item.unit}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">₦{item.cost.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Value</div>
                  </div>
                  {item.quantity <= item.minimumLevel && (
                    <Badge variant="destructive">Low Stock</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
