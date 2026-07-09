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
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { CropForm } from '@/components/farm/crop-form';

interface Crop {
  id: string;
  name: string;
  variety: string;
  plantedArea: number; // hectares
  plantedDate: string;
  expectedHarvestDate: string;
  estimatedYield: number; // kg
  status: 'planning' | 'planted' | 'growing' | 'harvested' | 'completed';
}

// Mock data
const mockCrops: Crop[] = [
  {
    id: '1',
    name: 'Maize',
    variety: 'Composite Maize',
    plantedArea: 2.5,
    plantedDate: '2025-02-15',
    expectedHarvestDate: '2025-06-15',
    estimatedYield: 7500,
    status: 'growing',
  },
  {
    id: '2',
    name: 'Cassava',
    variety: 'TMS 419',
    plantedArea: 1.8,
    plantedDate: '2025-01-20',
    expectedHarvestDate: '2026-01-20',
    estimatedYield: 18000,
    status: 'growing',
  },
  {
    id: '3',
    name: 'Tomato',
    variety: 'Roma VF',
    plantedArea: 0.5,
    plantedDate: '2025-03-01',
    expectedHarvestDate: '2025-05-30',
    estimatedYield: 5000,
    status: 'growing',
  },
  {
    id: '4',
    name: 'Rice',
    variety: 'NERICA 4',
    plantedArea: 1.2,
    plantedDate: '2024-11-15',
    expectedHarvestDate: '2025-04-15',
    estimatedYield: 4800,
    status: 'harvested',
  },
];

const statusBadgeVariant = {
  planning: 'outline',
  planted: 'secondary',
  growing: 'default',
  harvested: 'default',
  completed: 'secondary',
} as const;

export default function CropsPage() {
  const [crops, setCrops] = useState<Crop[]>(mockCrops);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);

  const filteredCrops = crops.filter(
    (crop) =>
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.variety.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCrop = (data: any) => {
    if (editingCrop) {
      setCrops(crops.map((c) => (c.id === editingCrop.id ? { ...editingCrop, ...data } : c)));
      setEditingCrop(null);
    } else {
      const newCrop: Crop = {
        id: String(crops.length + 1),
        ...data,
        status: 'planning',
      };
      setCrops([...crops, newCrop]);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteCrop = (id: string) => {
    setCrops(crops.filter((c) => c.id !== id));
  };

  const handleEditCrop = (crop: Crop) => {
    setEditingCrop(crop);
    setIsDialogOpen(true);
  };

  const totalArea = crops.reduce((sum, crop) => sum + crop.plantedArea, 0);
  const activeCrops = crops.filter((c) => c.status === 'growing' || c.status === 'planted').length;
  const totalEstimatedYield = crops.reduce((sum, crop) => sum + crop.estimatedYield, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Crop Management</h1>
        <p className="text-muted-foreground mt-2">
          Track crop cultivation from planting to harvest
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Planted Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArea.toFixed(1)} ha</div>
            <p className="text-xs text-muted-foreground">Hectares</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCrops}</div>
            <p className="text-xs text-muted-foreground">Growing or planted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Est. Total Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalEstimatedYield / 1000).toFixed(1)}T</div>
            <p className="text-xs text-muted-foreground">Metric tons</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Crops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crops.length}</div>
            <p className="text-xs text-muted-foreground">All varieties</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => setEditingCrop(null)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Crop
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCrop ? 'Edit Crop' : 'Add New Crop'}
              </DialogTitle>
              <DialogDescription>
                {editingCrop
                  ? 'Update crop information'
                  : 'Register a new crop for cultivation'}
              </DialogDescription>
            </DialogHeader>
            <CropForm
              initialData={editingCrop || undefined}
              onSubmit={handleAddCrop}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Crops Table */}
      <Card>
        <CardHeader>
          <CardTitle>Crops</CardTitle>
          <CardDescription>
            {filteredCrops.length} crop{filteredCrops.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crop Name</TableHead>
                  <TableHead>Variety</TableHead>
                  <TableHead>Area (ha)</TableHead>
                  <TableHead>Planted Date</TableHead>
                  <TableHead>Est. Harvest</TableHead>
                  <TableHead>Est. Yield (kg)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCrops.length > 0 ? (
                  filteredCrops.map((crop) => (
                    <TableRow key={crop.id}>
                      <TableCell className="font-medium">{crop.name}</TableCell>
                      <TableCell>{crop.variety}</TableCell>
                      <TableCell>{crop.plantedArea.toFixed(2)}</TableCell>
                      <TableCell>{new Date(crop.plantedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(crop.expectedHarvestDate).toLocaleDateString()}</TableCell>
                      <TableCell>{(crop.estimatedYield / 1000).toFixed(1)}K</TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant[crop.status]}>
                          {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditCrop(crop)}
                            className="p-2 hover:bg-muted rounded-lg"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDeleteCrop(crop.id)}
                            className="p-2 hover:bg-destructive/10 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No crops found
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
