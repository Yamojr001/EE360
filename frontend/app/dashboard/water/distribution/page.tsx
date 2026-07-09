'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Truck, MapPin } from 'lucide-react';

interface Delivery {
  id: string;
  date: string;
  destination: string;
  quantity: number;
  driver: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'returned';
  notes: string;
}

const mockDeliveries: Delivery[] = [
  {
    id: '1',
    date: '2026-04-15',
    destination: 'Lekki Market',
    quantity: 500,
    driver: 'John Okafor',
    status: 'delivered',
    notes: 'Delivered to main entrance',
  },
  {
    id: '2',
    date: '2026-04-15',
    destination: 'VI Shopping Center',
    quantity: 300,
    driver: 'Ahmed Hassan',
    status: 'in-transit',
    notes: 'On it way to store B',
  },
  {
    id: '3',
    date: '2026-04-14',
    destination: 'Distributor Centre',
    quantity: 1000,
    driver: 'Chinedu Eze',
    status: 'delivered',
    notes: 'Large bulk delivery completed',
  },
  {
    id: '4',
    date: '2026-04-14',
    destination: 'Local Store D',
    quantity: 800,
    driver: 'John Okafor',
    status: 'pending',
    notes: 'Scheduled for morning delivery',
  },
];

export default function DistributionPage() {
  const delivered = mockDeliveries.filter((d) => d.status === 'delivered').length;
  const inTransit = mockDeliveries.filter((d) => d.status === 'in-transit').length;
  const totalQuantity = mockDeliveries.reduce((sum, d) => sum + d.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Distribution Management</h1>
        <p className="text-muted-foreground mt-2">Track deliveries and distribution routes</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDeliveries.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{delivered}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inTransit}</div>
            <p className="text-xs text-muted-foreground">On the way</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Sachets</p>
          </CardContent>
        </Card>
      </div>

      {/* New Delivery Button */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Delivery
        </Button>
      </div>

      {/* Deliveries List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Deliveries</CardTitle>
          <CardDescription>Current and recent delivery routes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDeliveries.map((delivery) => (
              <div key={delivery.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold text-lg">{delivery.destination}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Driver: <span className="font-medium">{delivery.driver}</span> | Date: {delivery.date}
                  </p>
                  <p className="text-sm text-muted-foreground italic">{delivery.notes}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div>
                    <div className="text-lg font-bold">{delivery.quantity.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Sachets</div>
                  </div>
                  <Badge
                    variant={
                      delivery.status === 'delivered'
                        ? 'default'
                        : delivery.status === 'in-transit'
                        ? 'secondary'
                        : delivery.status === 'pending'
                        ? 'outline'
                        : 'destructive'
                    }
                  >
                    {delivery.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
