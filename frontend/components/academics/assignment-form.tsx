'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const assignmentFormSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  class: z.string().min(1, 'Class is required'),
  dueDate: z.string(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  totalPoints: z.number().min(1).max(100),
});

type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;

interface AssignmentFormProps {
  initialData?: any;
  onSubmit: (data: AssignmentFormValues) => void;
}

export function AssignmentForm({ initialData, onSubmit }: AssignmentFormProps) {
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: initialData || {
      title: '',
      subject: '',
      class: '',
      dueDate: new Date().toISOString().split('T')[0],
      description: '',
      totalPoints: 20,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignment Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Chapter 5 Questions" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Geography">Geography</SelectItem>
                    <SelectItem value="Agricultural Science">Agricultural Science</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="JSS1A">JSS 1A</SelectItem>
                    <SelectItem value="JSS1B">JSS 1B</SelectItem>
                    <SelectItem value="JSS2A">JSS 2A</SelectItem>
                    <SelectItem value="JSS2B">JSS 2B</SelectItem>
                    <SelectItem value="JSS3A">JSS 3A</SelectItem>
                    <SelectItem value="SSS1A">SSS 1A</SelectItem>
                    <SelectItem value="SSS2A">SSS 2A</SelectItem>
                    <SelectItem value="SSS3A">SSS 3A</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalPoints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Points</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Maximum 100 points</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description & Instructions</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the assignment and provide instructions..." rows={5} {...field} />
              </FormControl>
              <FormDescription>
                Provide clear instructions and requirements for students
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {initialData ? 'Update Assignment' : 'Create Assignment'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
