'use client';

import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, HelpCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

const mockAttendanceData: AttendanceRecord[] = [
  {
    id: '1',
    studentId: 's1',
    studentName: 'Chukwu Obi',
    class: 'JSS2A',
    date: '2024-04-09',
    status: 'present',
  },
  {
    id: '2',
    studentId: 's2',
    studentName: 'Amara Ejiro',
    class: 'JSS2A',
    date: '2024-04-09',
    status: 'present',
  },
  {
    id: '3',
    studentId: 's3',
    studentName: 'Tunde Olumide',
    class: 'JSS2A',
    date: '2024-04-09',
    status: 'absent',
  },
  {
    id: '4',
    studentId: 's4',
    studentName: 'Zainab Hassan',
    class: 'JSS2A',
    date: '2024-04-09',
    status: 'late',
  },
];

const attendanceTrendData = [
  { date: 'Mon', present: 85, absent: 10, late: 5 },
  { date: 'Tue', present: 88, absent: 8, late: 4 },
  { date: 'Wed', present: 82, absent: 12, late: 6 },
  { date: 'Thu', present: 90, absent: 6, late: 4 },
  { date: 'Fri', present: 80, absent: 14, late: 6 },
];

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState('JSS2A');
  const [selectedDate, setSelectedDate] = useState('2024-04-09');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({});

  useEffect(() => {
    const todayRecords = mockAttendanceData.filter((r) => r.class === selectedClass && r.date === selectedDate);
    setAttendance(todayRecords);
    const statusMap: Record<string, any> = {};
    todayRecords.forEach((r) => {
      statusMap[r.studentId] = r.status;
    });
    setAttendanceStatus(statusMap);
  }, [selectedClass, selectedDate]);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSaveAttendance = () => {
    // In real app, this would save to API
    console.log('[v0] Saving attendance:', attendanceStatus);
  };

  const stats = [
    {
      label: 'Present',
      value: Object.values(attendanceStatus).filter((s) => s === 'present').length,
      color: 'bg-green-100 text-green-700',
      icon: CheckCircle2,
    },
    {
      label: 'Absent',
      value: Object.values(attendanceStatus).filter((s) => s === 'absent').length,
      color: 'bg-red-100 text-red-700',
      icon: XCircle,
    },
    {
      label: 'Late',
      value: Object.values(attendanceStatus).filter((s) => s === 'late').length,
      color: 'bg-yellow-100 text-yellow-700',
      icon: HelpCircle,
    },
    {
      label: 'Excused',
      value: Object.values(attendanceStatus).filter((s) => s === 'excused').length,
      color: 'bg-blue-100 text-blue-700',
      icon: CheckCircle2,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'excused':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Tracking</h1>
        <p className="text-muted-foreground">Record and monitor student attendance</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Mark</CardTitle>
          <CardDescription>Mark attendance for students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JSS1A">JSS 1A</SelectItem>
                  <SelectItem value="JSS1B">JSS 1B</SelectItem>
                  <SelectItem value="JSS2A">JSS 2A</SelectItem>
                  <SelectItem value="JSS2B">JSS 2B</SelectItem>
                  <SelectItem value="SSS1A">SSS 1A</SelectItem>
                  <SelectItem value="SSS1B">SSS 1B</SelectItem>
                  <SelectItem value="SSS2A">SSS 2A</SelectItem>
                  <SelectItem value="SSS3A">SSS 3A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSaveAttendance} className="w-full">
                Save Attendance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
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

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>{selectedClass} - {selectedDate}</CardTitle>
          <CardDescription>Mark student attendance for the selected date</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.studentName}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(attendanceStatus[record.studentId] || 'present')}>
                      {(attendanceStatus[record.studentId] || 'present').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {['present', 'absent', 'late', 'excused'].map((status) => (
                        <Button
                          key={status}
                          variant={attendanceStatus[record.studentId] === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleStatusChange(record.studentId, status as any)}
                          className="capitalize"
                        >
                          {status.charAt(0)}
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Weekly Attendance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#22c55e" strokeWidth={2} />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="late" stroke="#eab308" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
