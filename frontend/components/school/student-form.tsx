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

const studentSchema = z.object({
  regNumber: z.string().min(1, 'Registration number is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  class: z.string().min(1, 'Class is required'),
  gender: z.enum(['male', 'female', 'other'], { message: 'Gender is required' }),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  initialData?: Partial<StudentFormData>;
  onSubmit: (data: StudentFormData) => void;
}

const CLASSES = [
  'JSS 1',
  'JSS 2',
  'JSS 3',
  'SSS 1',
  'SSS 2',
  'SSS 3',
];

export function StudentForm({ initialData, onSubmit }: StudentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData,
  });

  const selectedClass = watch('class') ?? '';
  const selectedGender = watch('gender') ?? '';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Registration Number */}
      <div className="space-y-2">
        <Label htmlFor="regNumber">Registration Number *</Label>
        <Input
          id="regNumber"
          placeholder="e.g., EEA/2024/001"
          {...register('regNumber')}
        />
        {errors.regNumber && (
          <p className="text-sm text-destructive">{errors.regNumber.message}</p>
        )}
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          placeholder="Student&apos;s full name"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          placeholder="student@excellence.edu"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Class */}
      <div className="space-y-2">
        <Label htmlFor="class">Class *</Label>
        <Select value={selectedClass || ''} onValueChange={(value) => setValue('class', value)}>
          <SelectTrigger id="class">
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            {CLASSES.map((cls) => (
              <SelectItem key={cls} value={cls}>
                {cls}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.class && (
          <p className="text-sm text-destructive">{errors.class.message}</p>
        )}
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label htmlFor="gender">Gender *</Label>
        <Select
          value={selectedGender}
          onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'other')}
        >
          <SelectTrigger id="gender">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && (
          <p className="text-sm text-destructive">{errors.gender.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        {initialData ? 'Update Student' : 'Create Student'}
      </Button>
    </form>
  );
}
