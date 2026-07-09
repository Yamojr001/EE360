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

const cropSchema = z.object({
  name: z.string().min(2, 'Crop name is required'),
  variety: z.string().min(1, 'Variety is required'),
  plantedArea: z.string().transform(Number).refine(n => n > 0, 'Planted area must be greater than 0'),
  plantedDate: z.string().min(1, 'Planting date is required'),
  expectedHarvestDate: z.string().min(1, 'Expected harvest date is required'),
  estimatedYield: z.string().transform(Number).refine(n => n > 0, 'Estimated yield must be greater than 0'),
});

type CropFormData = z.infer<typeof cropSchema>;

interface CropFormProps {
  initialData?: Partial<CropFormData>;
  onSubmit: (data: CropFormData) => void;
}

const CROP_VARIETIES: Record<string, string[]> = {
  'Maize': ['White Maize', 'Yellow Maize', 'Composite Maize'],
  'Cassava': ['TMS 419', 'TMS 90555', 'Improved White'],
  'Tomato': ['Roma VF', 'Cherry', 'Beef Steak'],
  'Rice': ['NERICA 4', 'NERICA 10', 'Swat'],
  'Pepper': ['Green Bell', 'Red Bell', 'Habanero'],
  'Cucumber': ['Marketmore', 'Suyo Long'],
  'Spinach': ['New Zealand', 'Spinacia'],
  'Beans': ['Bambara', 'Cowpea', 'Pinto'],
};

export function CropForm({ initialData, onSubmit }: CropFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CropFormData>({
    resolver: zodSchema(cropSchema),
    defaultValues: {
      name: initialData?.name || '',
      variety: initialData?.variety || '',
      plantedArea: initialData?.plantedArea || 0,
      plantedDate: initialData?.plantedDate || '',
      expectedHarvestDate: initialData?.expectedHarvestDate || '',
      estimatedYield: initialData?.estimatedYield || 0,
    },
  });

  const selectedCrop = watch('name');
  const selectedVariety = watch('variety');

  const availableVarieties = selectedCrop ? CROP_VARIETIES[selectedCrop] || [] : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Crop Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Crop Name *</Label>
        <Select value={selectedCrop || ''} onValueChange={(value) => {
          setValue('name', value);
          setValue('variety', '');
        }}>
          <SelectTrigger id="name">
            <SelectValue placeholder="Select crop" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(CROP_VARIETIES).map((crop) => (
              <SelectItem key={crop} value={crop}>
                {crop}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Variety */}
      <div className="space-y-2">
        <Label htmlFor="variety">Variety *</Label>
        <Select value={selectedVariety || ''} onValueChange={(value) => setValue('variety', value)}>
          <SelectTrigger id="variety">
            <SelectValue placeholder="Select variety" />
          </SelectTrigger>
          <SelectContent>
            {availableVarieties.map((variety) => (
              <SelectItem key={variety} value={variety}>
                {variety}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.variety && (
          <p className="text-sm text-destructive">{errors.variety.message}</p>
        )}
      </div>

      {/* Planted Area */}
      <div className="space-y-2">
        <Label htmlFor="plantedArea">Planted Area (hectares) *</Label>
        <Input
          id="plantedArea"
          type="number"
          step="0.1"
          placeholder="e.g., 2.5"
          {...register('plantedArea')}
        />
        {errors.plantedArea && (
          <p className="text-sm text-destructive">{errors.plantedArea.message}</p>
        )}
      </div>

      {/* Planted Date */}
      <div className="space-y-2">
        <Label htmlFor="plantedDate">Planting Date *</Label>
        <Input
          id="plantedDate"
          type="date"
          {...register('plantedDate')}
        />
        {errors.plantedDate && (
          <p className="text-sm text-destructive">{errors.plantedDate.message}</p>
        )}
      </div>

      {/* Expected Harvest Date */}
      <div className="space-y-2">
        <Label htmlFor="expectedHarvestDate">Expected Harvest Date *</Label>
        <Input
          id="expectedHarvestDate"
          type="date"
          {...register('expectedHarvestDate')}
        />
        {errors.expectedHarvestDate && (
          <p className="text-sm text-destructive">{errors.expectedHarvestDate.message}</p>
        )}
      </div>

      {/* Estimated Yield */}
      <div className="space-y-2">
        <Label htmlFor="estimatedYield">Estimated Yield (kg) *</Label>
        <Input
          id="estimatedYield"
          type="number"
          step="100"
          placeholder="e.g., 7500"
          {...register('estimatedYield')}
        />
        {errors.estimatedYield && (
          <p className="text-sm text-destructive">{errors.estimatedYield.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        {initialData ? 'Update Crop' : 'Add Crop'}
      </Button>
    </form>
  );
}

// Helper function to use zodResolver correctly
function zodSchema(schema: any) {
  return zodResolver(schema);
}
