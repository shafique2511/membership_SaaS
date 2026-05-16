import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { CalendarDays, Users, TrendingUp, Clock, Scissors, CreditCard, ChevronRight, Package } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { useBusiness } from "@/context/BusinessContext";

const data = [
  { name: "Mon", sales: 400, bookings: 24 },
  { name: "Tue", sales: 300, bookings: 13 },
  { name: "Wed", sales: 200, bookings: 98 },
  { name: "Thu", sales: 278, bookings: 39 },
  { name: "Fri", sales: 189, bookings: 48 },
  { name: "Sat", sales: 239, bookings: 38 },
  { name: "Sun", sales: 349, bookings: 43 },
];

export default function BusinessOverview() {
  const { currentBusiness } = useBusiness();
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    if (currentBusiness) {
      fetch(`/api/businesses/${currentBusiness.id}/stats`)
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error(err));

      fetch(`/api/bookings/business/${currentBusiness.id}`)
        .then(res => res.json())
        .then(data => setRecentBookings(data.slice(0, 5)))
        .catch(err => console.error(err));
    }
  }, [currentBusiness]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter">Business Overview</h1>
        <p className="text-muted-foreground">Real-time performance metrics for your enterprise.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalSales?.toLocaleString() || "0"}</div>
            <p className="text-xs text-muted-foreground">{stats?.growth || "+0%"} from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeBookings || "0"}</div>
            <p className="text-xs text-muted-foreground">Confirmed appointments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCustomers || "0"}</div>
            <p className="text-xs text-muted-foreground">Registered in database</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.lowStockCount || "0"}</div>
            <p className="text-xs text-muted-foreground">Low stock items</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Revenue</CardTitle>
            <CardDescription>Daily sales performance for the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip />
                <Bar dataKey="sales" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest appointments across your business.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentBookings.map((booking, i) => (
                <div key={i} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{(booking.customer_name || 'U')[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{booking.customer_name || 'Guest User'}</p>
                    <p className="text-xs text-muted-foreground">{booking.status}</p>
                  </div>
                  <div className="ml-auto font-bold text-xs text-primary">
                    ${Number(booking.total_price).toFixed(2)}
                  </div>
                </div>
              ))}
              {recentBookings.length === 0 && (
                <p className="text-center py-4 text-sm text-muted-foreground">No recent bookings found.</p>
              )}
              <Button variant="outline" className="w-full text-xs font-bold" asChild>
                 <Link to="bookings">View All Bookings <ChevronRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

