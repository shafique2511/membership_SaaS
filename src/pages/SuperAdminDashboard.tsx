import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart3, Users, Building2, Package2, 
  Search, ShieldCheck, CreditCard, Filter,
  ExternalLink, MoreVertical, CheckCircle, XCircle
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SuperAdminDashboard() {
  const businesses = [
    { id: "1", name: "Sharp Cuts Barber", owner: "Marcus H.", package: "Pro", status: "ACTIVE", revenue: "$450/mo", joined: "2024-01-10" },
    { id: "2", name: "Bean & Brew Cafe", owner: "Sarah J.", package: "Growth", status: "TRIAL", revenue: "$0/mo", joined: "2024-05-02" },
    { id: "3", name: "Zen Spa & Wellness", owner: "Elena R.", package: "Enterprise", status: "ACTIVE", revenue: "$1,200/mo", joined: "2023-11-20" },
    { id: "4", name: "Quick Wash Auto", owner: "Tony S.", package: "Starter", status: "EXPIRED", revenue: "$19/mo", joined: "2024-02-15" },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Platform Control</h1>
            <p className="text-muted-foreground">Super Admin overview of all registered businesses and health metrics.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Package2 className="w-4 h-4" /> Packages
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Register Business
          </Button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Revenue (MRR)', value: '$145,240', delta: '+12%', icon: CreditCard },
          { label: 'Total Businesses', value: '1,248', delta: '+24', icon: Building2 },
          { label: 'Active Users', value: '45.2k', delta: '+1.2k', icon: Users },
          { label: 'Server Load', value: '14%', delta: 'Optimal', icon: BarChart3 },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 font-bold">{stat.delta}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Businesses */}
        <Card className="md:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Businesses</CardTitle>
                <CardDescription>Comprehensive list of all tenants on the platform.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search slug or name..." className="pl-8 h-9 w-[200px]" />
                </div>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>MRR</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div>
                        <div className="font-semibold text-sm">{b.name}</div>
                        <div className="text-xs text-muted-foreground">{b.owner}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-[10px]">{b.package}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{b.revenue}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {b.status === 'ACTIVE' ? <CheckCircle className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-amber-500" />}
                        <span className="text-xs font-medium">{b.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Impersonate Owner</DropdownMenuItem>
                            <DropdownMenuItem>Edit Plan</DropdownMenuItem>
                            <DropdownMenuItem>Disable Access</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* System Health / Alerts */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Starter', count: 450, color: 'bg-blue-500' },
                  { label: 'Growth', count: 320, color: 'bg-indigo-500' },
                  { label: 'Pro', count: 280, color: 'bg-purple-500' },
                  { label: 'Enterprise', count: 12, color: 'bg-amber-500' },
                ].map((p, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{p.label}</span>
                      <span className="text-muted-foreground">{p.count} businesses</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full", p.color)} 
                        style={{ width: `${(p.count / 1248) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-none">
            <CardHeader>
              <CardTitle className="text-sm">Revenue Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[150px] flex items-center justify-center">
               {/* Pie chart placeholder or similar */}
               <div className="w-24 h-24 rounded-full border-8 border-primary border-r-transparent animate-spin-slow" />
               <div className="ml-4">
                 <p className="text-xs font-bold">85% Renewal Rate</p>
                 <p className="text-[10px] text-muted-foreground border-t mt-1 pt-1 underline cursor-pointer">View full audit</p>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
