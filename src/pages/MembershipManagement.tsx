import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Users, 
  Plus, 
  Search, 
  Calendar, 
  MoreVertical,
  CheckCircle2,
  Clock,
  Zap
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MembershipManagement() {
  const plans = [
    { id: "1", name: "Premium Barber Monthly", price: "$49.99", members: 124, status: "ACTIVE", type: "Subscription" },
    { id: "2", name: "10-Visit Haircut Bundle", price: "$199.00", members: 45, status: "ACTIVE", type: "Package" },
    { id: "3", name: "VIP Annual Lounge", price: "$499.00", members: 12, status: "PENDING", type: "Annual" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Memberships</h1>
          <p className="text-muted-foreground mt-1">Design plans and manage your loyal customer base.</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          Create New Plan
        </Button>
      </div>

      <Tabs defaultValue="plans">
        <TabsList className="mb-6">
          <TabsTrigger value="plans" className="gap-2">
            <Zap className="w-4 h-4" /> Membership Plans
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-2">
            <Users className="w-4 h-4" /> Active Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className="relative overflow-hidden group border-2 transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={plan.status === "ACTIVE" ? "default" : "secondary"}>
                      {plan.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Plan</DropdownMenuItem>
                        <DropdownMenuItem>View Sales</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-xl mt-4">{plan.name}</CardTitle>
                  <CardDescription>{plan.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold text-primary">{plan.price}</div>
                  <div className="flex items-center gap-4 py-2 border-y border-dashed">
                    <div className="flex-1 text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Members</p>
                      <p className="text-lg font-bold">{plan.members}</p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="flex-1 text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Revenue</p>
                      <p className="text-lg font-bold">
                        ${(parseFloat(plan.price.replace('$', '')) * plan.members).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {['Unlimited priority booking', '10% Product discount', 'Complimentary beverages'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="bg-muted/30 pt-4">
                  <Button variant="ghost" className="w-full text-xs font-bold text-primary">MANAGE PLAN</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search members by name, email or QR ID..." />
            </div>
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Filter by Expiry
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "John Wick", plan: "Annual VIP", joined: "Jan 12, 2024", expiry: "Jan 12, 2025", status: "Active", balance: "Unlimited" },
                  { name: "Sia Furler", plan: "Monthly Basic", joined: "May 1, 2024", expiry: "Jun 1, 2024", status: "Active", balance: "$0.00" },
                  { name: "Tony Stark", plan: "10-Haircut Bundle", joined: "Feb 15, 2024", expiry: "Never", status: "Active", balance: "7 Left" },
                ].map((m, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell>{m.plan}</TableCell>
                    <TableCell className="text-muted-foreground font-sans">{m.joined}</TableCell>
                    <TableCell className="text-muted-foreground font-sans">{m.expiry}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {m.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold">{m.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
