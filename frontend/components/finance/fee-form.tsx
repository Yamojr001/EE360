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

const feeSchema = z.object({
  amount: z.string().transform(Number).refine(n => n > 0, 'Amount must be greater than 0'),
  dueDate: z.string().min(1, 'Due date is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
  term: z.enum(['Term 1', 'Term 2', 'Term 3'], { message: 'Term is required' }),
  description: z.string().optional(),
});

type FeeFormData = z.infer<typeof feeSchema>;

interface FeeFormProps {
  initialData?: Partial<FeeFormData>;
  onSubmit: (data: FeeFormData) => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const ACADEMIC_YEARS = [
  `${CURRENT_YEAR}/${CURRENT_YEAR + 1}`,
  `${CURRENT_YEAR - 1}/${CURRENT_YEAR}`,
  `${CURRENT_YEAR + 1}/${CURRENT_YEAR + 2}`,
];

export function FeeForm({ initialData, onSubmit }: FeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FeeFormData>({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      term: initialData?.term || 'Term 1',
      dueDate: initialData?.dueDate || '',
      amount: initialData?.amount || 0,
      academicYear: initialData?.academicYear || new Date().getFullYear().toString(),
      description: initialData?.description || '',
    },
  });

  const selectedTerm = watch('term');
  const selectedYear = watch('academicYear');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Academic Year */}
      <div className="space-y-2">
        <Label htmlFor="academicYear">Academic Year *</Label>
        <Select value={selectedYear || ''} onValueChange={(value) => setValue('academicYear', value)}>
          <SelectTrigger id="academicYear">
            <SelectValue placeholder="Select academic year" />
          </SelectTrigger>
          <SelectContent>
            {ACADEMIC_YEARS.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.academicYear && (
          <p className="text-sm text-destructive">{errors.academicYear.message}</p>
        )}
      </div>

      {/* Term */}
      <div className="space-y-2">
        <Label htmlFor="term">Term *</Label>
        <Select value={selectedTerm || ''} onValueChange={(value) => setValue('term', value as any)}>
          <SelectTrigger id="term">
            <SelectValue placeholder="Select term" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Term 1">Term 1</SelectItem>
            <SelectItem value="Term 2">Term 2</SelectItem>
            <SelectItem value="Term 3">Term 3</SelectItem>
          </SelectContent>
        </Select>
        {errors.term && (
          <p className="text-sm text-destructive">{errors.term.message}</p>
        )}
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (₦) *</Label>
        <Input
          id="amount"
          type="number"
          placeholder="e.g., 150000"
          {...register('amount')}
        />
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount.message}</p>
        )}
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date *</Label>
        <Input
          id="dueDate"
          type="date"
          {...register('dueDate')}
        />
        {errors.dueDate && (
          <p className="text-sm text-destructive">{errors.dueDate.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="e.g., First term school fees"
          {...register('description')}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        {initialData ? 'Update Fee Schedule' : 'Create Fee Schedule'}
      </Button>
    </form>
  );
}
