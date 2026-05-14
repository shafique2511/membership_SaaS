import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Calendar, ShoppingCart, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Package, Users2,
  Clock, Plus
} from "lucide-react";
import { useBusiness } from '@/context/BusinessContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const data = [
  { name: 'Mon', sales: 4000, bookings: 24 },
  { name: 'Tue', sales: 3000, bookings: 13 },
  { name: 'Wed', sales: 2000, bookings: 98 },
  { name: 'Thu', sales: 2780, bookings: 39 },
  { name: 'Fri', sales: 1890, bookings: 48 },
  { name: 'Sat', sales: 2390, bookings: 38 },
  { name: 'Sun', sales: 3490, bookings: 43 },
];

export default function Dashboard() {
  const { currentBusiness } = useBusiness();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back,</h1>
          <p className="text-muted-foreground mt-1">Here is what is happening with {currentBusiness?.name} today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Clock className="w-4 h-4" />
            View Schedule
          </Button>
          <Button size="sm" className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            Quick Action
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Revenue', value: '$12,845.00', icon: TrendingUp, delta: '+12.5%', sign: 'plus' },
          { label: 'Active Bookings', value: '24', icon: Calendar, delta: '+4.3%', sign: 'plus' },
          { label: 'Total Customers', value: '1,248', icon: Users, delta: '-2.1%', sign: 'minus' },
          { label: 'Staff Online', value: '8/12', icon: Users2, delta: 'Active', sign: 'neutral' },
        ].map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center mt-1">
                {stat.sign === 'plus' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : stat.sign === 'minus' ? (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                ) : null}
                <span className={cn(
                  "text-xs font-medium",
                  stat.sign === 'plus' ? "text-green-500" : stat.sign === 'minus' ? "text-red-500" : "text-muted-foreground"
                )}>
                  {stat.delta}
                </span>
                <span className="text-xs text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Sales Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
            <CardDescription>Daily revenue performance for the current week.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest appointments scheduled across branches.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-primary">View all</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: 'Alex Johnson', service: 'Classic Haircut', time: '10:30 AM', status: 'Confirmed' },
                { name: 'Sarah Miller', service: 'Spa Manicure', time: '11:15 AM', status: 'Pending' },
                { name: 'Michael Chen', service: 'Latte Art Class', time: '1:00 PM', status: 'In Progress' },
                { name: 'Emma Davis', service: 'Consultation', time: '2:30 PM', status: 'Confirmed' },
              ].map((booking, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 ring-2 ring-transparent group-hover:ring-primary/10 transition-all">
                      <AvatarFallback className="bg-primary/5 text-primary text-xs">
                        {booking.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">{booking.name}</p>
                      <p className="text-xs text-muted-foreground">{booking.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{booking.time}</p>
                    <Badge variant={booking.status === 'Confirmed' ? 'default' : 'secondary'} className="text-[10px] h-4 py-0 px-1">
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

