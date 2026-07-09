'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, CheckCircle2, XCircle, UserCheck, Briefcase } from 'lucide-react';

interface StaffAttendanceRecord {
  id: string;
  name: string;
  department: string;
  position: string;
  date: string;
  status: 'present' | 'absent' | 'on-leave' | 'remote';
}

const mockStaffAttendance: StaffAttendanceRecord[] = [
  {
    id: '1',
    name: 'Oluwaseun Okafor',
    department: 'Administration',
    position: 'Principal',
    date: '2024-04-09',
    status: 'present',
  },
  {
    id: '2',
    name: 'Chioma Eze',
    department: 'Academics',
    position: 'Mathematics Teacher',
    date: '2024-04-09',
    status: 'present',
  },
  {
    id: '3',
    name: 'Adebayo Olude',
    department: 'Agriculture',
    position: 'Farm Manager',
    date: '2024-04-09',
    status: 'on-leave',
  },
  {
    id: '4',
    name: 'Ngozi Ezeoke',
    department: 'Academics',
    position: 'English Teacher',
    date: '2024-04-09',
    status: 'remote',
  },
];

const departments = ['All', 'Administration', 'Academics', 'Agriculture', 'Support'];

export default function StaffAttendancePage() {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedDate, setSelectedDate] = useState('2024-04-09');
  const [attendance, setAttendance] = useState<Record<string, StaffAttendanceRecord['status']>>({});

  useEffect(() => {
    const statusMap: Record<string, StaffAttendanceRecord['status']> = {};
    mockStaffAttendance.forEach((record) => {
      statusMap[record.id] = record.status;
    });
    setAttendance(statusMap);
  }, []);

  const filteredRecords = useMemo(
    () =>
      mockStaffAttendance.filter((record) => {
        const matchesDepartment = selectedDepartment === 'All' || record.department === selectedDepartment;
        const matchesDate = record.date === selectedDate;
        return matchesDepartment && matchesDate;
      }),
    [selectedDepartment, selectedDate]
  );

  const handleStatusChange = (id: string, status: StaffAttendanceRecord['status']) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  const handleSave = () => {
    console.log('Saving staff attendance', attendance);
  };

  const statusCounts = useMemo(() => {
    const counts = { present: 0, absent: 0, 'on-leave': 0, remote: 0 };
    Object.values(attendance).forEach((value) => {
      counts[value] += 1;
    });
    return counts;
  }, [attendance]);

  const getStatusClass = (status: StaffAttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'remote':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Attendance</h1>
        <p className="text-muted-foreground mt-2">
          Track attendance and availability for school staff members.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Filters</CardTitle>
          <CardDescription>Select department and date for attendance review.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="department" className="text-sm font-medium">
              Department
            </label>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger id="department" className="w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="staff-attendance-date" className="text-sm font-medium">
              Date
            </label>
            <Input
              id="staff-attendance-date"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSave} className="w-full">
              Save Attendance
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Present', value: statusCounts.present, icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
          { label: 'Absent', value: statusCounts.absent, icon: XCircle, color: 'bg-red-100 text-red-700' },
          { label: 'On Leave', value: statusCounts['on-leave'], icon: Briefcase, color: 'bg-yellow-100 text-yellow-700' },
          { label: 'Remote', value: statusCounts.remote, icon: UserCheck, color: 'bg-blue-100 text-blue-700' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Attendance Records</CardTitle>
          <CardDescription>
            Review and update the current attendance status for staff.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{record.position}</TableCell>
                  <TableCell>
                    <Badge className={getStatusClass(attendance[record.id] || record.status)}>
                      {(attendance[record.id] || record.status).replace('-', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {(['present', 'absent', 'on-leave', 'remote'] as const).map((status) => (
                        <Button
                          key={status}
                          variant={attendance[record.id] === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleStatusChange(record.id, status)}
                          className="capitalize"
                        >
                          {status.replace('-', ' ')}
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No staff attendance records found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
