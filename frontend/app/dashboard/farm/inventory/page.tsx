'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { InventoryForm } from '@/components/farm/inventory-form';

interface InventoryItem {
  id: string;
  name: string;
  category: 'fertilizer' | 'seed' | 'tool' | 'chemical' | 'feed';
  quantity: number;
  unit: string;
  minimumLevel: number;
  unitCost: number;
  lastRestocked: string;
}

// Mock data
const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'NPK Fertilizer 20:10:10',
    category: 'fertilizer',
    quantity: 450,
    unit: 'kg',
    minimumLevel: 200,
    unitCost: 150,
    lastRestocked: '2025-02-10',
  },
  {
    id: '2',
    name: 'Maize Seeds (Composite)',
    category: 'seed',
    quantity: 80,
    unit: 'kg',
    minimumLevel: 50,
    unitCost: 500,
    lastRestocked: '2025-01-15',
  },
  {
    id: '3',
    name: 'Farm Spade',
    category: 'tool',
    quantity: 12,
    unit: 'pieces',
    minimumLevel: 8,
    unitCost: 2500,
    lastRestocked: '2024-12-20',
  },
  {
    id: '4',
    name: 'Poultry Feed (layers)',
    category: 'feed',
    quantity: 150,
    unit: 'kg',
    minimumLevel: 200,
    unitCost: 350,
    lastRestocked: '2025-03-28',
  },
  {
    id: '5',
    name: 'Pesticide (Organic)',
    category: 'chemical',
    quantity: 25,
    unit: 'liters',
    minimumLevel: 30,
    unitCost: 8000,
    lastRestocked: '2025-03-05',
  },
];

const categoryLabel = {
  fertilizer: 'Fertilizer',
  seed: 'Seeds',
  tool: 'Tools',
  chemical: 'Chemicals',
  feed: 'Feed',
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const filteredInventory = inventory.filter(
    (item) =>
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.includes(searchTerm.toLowerCase())) &&
      (filterCategory === 'all' || item.category === filterCategory)
  );

  const handleAddItem = (data: any) => {
    if (editingItem) {
      setInventory(
        inventory.map((i) => (i.id === editingItem.id ? { ...editingItem, ...data } : i))
      );
      setEditingItem(null);
    } else {
      const newItem: InventoryItem = {
        id: String(inventory.length + 1),
        ...data,
      };
      setInventory([...inventory, newItem]);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter((i) => i.id !== id));
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const lowStockItems = inventory.filter((i) => i.quantity <= i.minimumLevel);
  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Farm Inventory</h1>
        <p className="text-muted-foreground mt-2">
          Manage seeds, fertilizers, tools, and supplies
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Inventory categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalInventoryValue / 1000000).toFixed(1)}M</div>
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
            <h3 className="font-semibold text-orange-900 dark:text-orange-100">Low Stock Items</h3>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} {lowStockItems.length === 1 ? 'is' : 'are'} below minimum stock level. Consider restocking soon.
            </p>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="all">All Categories</option>
            <option value="fertilizer">Fertilizer</option>
            <option value="seed">Seeds</option>
            <option value="tool">Tools</option>
            <option value="chemical">Chemicals</option>
            <option value="feed">Feed</option>
          </select>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => setEditingItem(null)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update inventory item' : 'Register a new item in inventory'}
              </DialogDescription>
            </DialogHeader>
            <InventoryForm
              initialData={editingItem || undefined}
              onSubmit={handleAddItem}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            {filteredInventory.length} item{filteredInventory.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Minimum Level</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Last Restocked</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => {
                    const isLowStock = item.quantity <= item.minimumLevel;
                    return (
                      <TableRow key={item.id} className={isLowStock ? 'bg-orange-50 dark:bg-orange-950' : ''}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{categoryLabel[item.category]}</Badge>
                        </TableCell>
                        <TableCell>
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell>{item.minimumLevel} {item.unit}</TableCell>
                        <TableCell>₦{item.unitCost.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold">
                          ₦{(item.quantity * item.unitCost).toLocaleString()}
                        </TableCell>
                        <TableCell>{new Date(item.lastRestocked).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="p-2 hover:bg-muted rounded-lg"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-2 hover:bg-destructive/10 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
