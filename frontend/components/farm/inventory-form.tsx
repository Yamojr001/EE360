'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const inventorySchema = z.object({
  name: z.string().min(2, 'Item name is required'),
  category: z.enum(['fertilizer', 'seed', 'tool', 'chemical', 'feed'], { message: 'Category is required' }),
  quantity: z.string().transform(Number).refine(n => n >= 0, 'Quantity must be non-negative'),
  unit: z.string().min(1, 'Unit is required'),
  minimumLevel: z.string().transform(Number).refine(n => n >= 0, 'Minimum level must be non-negative'),
  unitCost: z.string().transform(Number).refine(n => n > 0, 'Unit cost must be greater than 0'),
  lastRestocked: z.string().min(1, 'Last restocked date is required'),
});

type InventoryFormData = z.infer<typeof inventorySchema>;

interface InventoryFormProps {
  initialData?: Partial<InventoryFormData>;
  onSubmit: (data: InventoryFormData) => void;
}

const UNIT_OPTIONS = ['kg', 'liters', 'pieces', 'bags', 'bundles', 'cartons', 'meters'];

export function InventoryForm({ initialData, onSubmit }: InventoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || 'feed',
      unit: initialData?.unit || '',
      quantity: initialData?.quantity || 0,
      minimumLevel: initialData?.minimumLevel || 0,
      unitCost: initialData?.unitCost || 0,
      lastRestocked: initialData?.lastRestocked || new Date().toISOString().split('T')[0],
    },
  });

  const selectedCategory = watch('category');
  const selectedUnit = watch('unit');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Item Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Item Name *</Label>
        <Input
          id="name"
          placeholder="e.g., NPK Fertilizer 20:10:10"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select value={selectedCategory || ''} onValueChange={(value) => setValue('category', value as any)}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fertilizer">Fertilizer</SelectItem>
            <SelectItem value="seed">Seeds</SelectItem>
            <SelectItem value="tool">Tools</SelectItem>
            <SelectItem value="chemical">Chemicals</SelectItem>
            <SelectItem value="feed">Feed</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category.message}</p>
        )}
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity *</Label>
        <Input
          id="quantity"
          type="number"
          min="0"
          step="0.1"
          placeholder="e.g., 450"
          {...register('quantity')}
        />
        {errors.quantity && (
          <p className="text-sm text-destructive">{errors.quantity.message}</p>
        )}
      </div>

      {/* Unit */}
      <div className="space-y-2">
        <Label htmlFor="unit">Unit *</Label>
        <Select value={selectedUnit || ''} onValueChange={(value) => setValue('unit', value)}>
          <SelectTrigger id="unit">
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            {UNIT_OPTIONS.map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.unit && (
          <p className="text-sm text-destructive">{errors.unit.message}</p>
        )}
      </div>

      {/* Minimum Level */}
      <div className="space-y-2">
        <Label htmlFor="minimumLevel">Minimum Stock Level *</Label>
        <Input
          id="minimumLevel"
          type="number"
          min="0"
          step="0.1"
          placeholder="e.g., 200"
          {...register('minimumLevel')}
        />
        {errors.minimumLevel && (
          <p className="text-sm text-destructive">{errors.minimumLevel.message}</p>
        )}
      </div>

      {/* Unit Cost */}
      <div className="space-y-2">
        <Label htmlFor="unitCost">Unit Cost (₦) *</Label>
        <Input
          id="unitCost"
          type="number"
          step="0.01"
          placeholder="e.g., 150"
          {...register('unitCost')}
        />
        {errors.unitCost && (
          <p className="text-sm text-destructive">{errors.unitCost.message}</p>
        )}
      </div>

      {/* Last Restocked */}
      <div className="space-y-2">
        <Label htmlFor="lastRestocked">Last Restocked Date *</Label>
        <Input
          id="lastRestocked"
          type="date"
          {...register('lastRestocked')}
        />
        {errors.lastRestocked && (
          <p className="text-sm text-destructive">{errors.lastRestocked.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        {initialData ? 'Update Item' : 'Add Item'}
      </Button>
    </form>
  );
}
