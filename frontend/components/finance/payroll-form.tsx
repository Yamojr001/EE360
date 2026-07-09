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

const payrollSchema = z.object({
  staffId: z.string().min(1, 'Staff is required'),
  month: z.string().min(1, 'Month is required'),
  year: z.string().transform(Number),
  baseSalary: z.string().transform(Number).refine(n => n > 0, 'Base salary must be greater than 0'),
  allowances: z.string().transform(Number).default('0'),
  deductions: z.string().transform(Number).default('0'),
});

type PayrollFormData = z.infer<typeof payrollSchema>;

interface PayrollFormProps {
  onSubmit: (data: any) => void;
}

const STAFF_MEMBERS = [
  { id: 'STF001', name: 'Mrs. Ngozi Adeyemi', position: 'Principal' },
  { id: 'STF002', name: 'Mr. Chinedu Okafor', position: 'Mathematics Teacher' },
  { id: 'STF003', name: 'Miss Zainab Hassan', position: 'English Teacher' },
  { id: 'STF004', name: 'Mr. Adekunle Bello', position: 'Farm Manager' },
  { id: 'STF005', name: 'Mrs. Ada Okoro', position: 'Nurse' },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CURRENT_YEAR = new Date().getFullYear();

export function PayrollForm({ onSubmit }: PayrollFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PayrollFormData>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      staffId: '',
      month: 'April',
      year: CURRENT_YEAR,
      baseSalary: 0,
      allowances: 0,
      deductions: 0,
    },
  });

  const selectedStaff = watch('staffId');
  const selectedMonth = watch('month');
  const selectedYear = watch('year');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Staff Member */}
      <div className="space-y-2">
        <Label htmlFor="staffId">Staff Member *</Label>
        <Select value={selectedStaff || ''} onValueChange={(value) => setValue('staffId', value)}>
          <SelectTrigger id="staffId">
            <SelectValue placeholder="Select staff member" />
          </SelectTrigger>
          <SelectContent>
            {STAFF_MEMBERS.map((staff) => (
              <SelectItem key={staff.id} value={staff.id}>
                {staff.name} - {staff.position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.staffId && (
          <p className="text-sm text-destructive">{errors.staffId.message}</p>
        )}
      </div>

      {/* Month */}
      <div className="space-y-2">
        <Label htmlFor="month">Month *</Label>
        <Select value={selectedMonth || ''} onValueChange={(value) => setValue('month', value)}>
          <SelectTrigger id="month">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.month && (
          <p className="text-sm text-destructive">{errors.month.message}</p>
        )}
      </div>

      {/* Year */}
      <div className="space-y-2">
        <Label htmlFor="year">Year *</Label>
        <Input
          id="year"
          type="number"
          min="2020"
          max={CURRENT_YEAR + 5}
          defaultValue={CURRENT_YEAR}
          {...register('year')}
        />
        {errors.year && (
          <p className="text-sm text-destructive">{errors.year.message}</p>
        )}
      </div>

      {/* Base Salary */}
      <div className="space-y-2">
        <Label htmlFor="baseSalary">Base Salary (₦) *</Label>
        <Input
          id="baseSalary"
          type="number"
          placeholder="e.g., 120000"
          {...register('baseSalary')}
        />
        {errors.baseSalary && (
          <p className="text-sm text-destructive">{errors.baseSalary.message}</p>
        )}
      </div>

      {/* Allowances */}
      <div className="space-y-2">
        <Label htmlFor="allowances">Allowances (₦)</Label>
        <Input
          id="allowances"
          type="number"
          placeholder="e.g., 20000"
          defaultValue="0"
          {...register('allowances')}
        />
        {errors.allowances && (
          <p className="text-sm text-destructive">{errors.allowances.message}</p>
        )}
      </div>

      {/* Deductions */}
      <div className="space-y-2">
        <Label htmlFor="deductions">Deductions (₦)</Label>
        <Input
          id="deductions"
          type="number"
          placeholder="e.g., 5000"
          defaultValue="0"
          {...register('deductions')}
        />
        {errors.deductions && (
          <p className="text-sm text-destructive">{errors.deductions.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        Calculate Payroll
      </Button>
    </form>
  );
}
