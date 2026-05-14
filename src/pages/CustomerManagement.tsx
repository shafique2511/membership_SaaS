import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Search, UserPlus, Mail, Phone, Calendar, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useBusiness } from "@/context/BusinessContext";

export default function CustomerManagement() {
  const { currentBusiness } = useBusiness();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (currentBusiness) {
      fetchCustomers();
    }
  }, [currentBusiness]);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers', {
        headers: { 'x-business-id': currentBusiness.id }
      });
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.phone && c.phone.includes(searchQuery))
  );

  if (loading) return <div className="p-8">Loading CRM...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer CRM</h2>
          <p className="text-muted-foreground">Manage your relationships and loyalty data.</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email or phone..." 
            className="pl-8 w-full max-w-sm" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-black">{customer.full_name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-mono">ID: {customer.id.slice(0,8)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs space-y-1">
                       <span className="flex items-center"><Mail className="h-3 w-3 mr-1" /> {customer.email || 'No email'}</span>
                       <span className="flex items-center"><Phone className="h-3 w-3 mr-1" /> {customer.phone || 'No phone'}</span>
                    </div>
                  </TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-50">{customer.loyalty_points || 0} pts</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      (customer.loyalty_points || 0) > 1000 ? "default" :
                      (customer.loyalty_points || 0) > 0 ? "secondary" : "outline"
                    }>
                      {(customer.loyalty_points || 0) > 1000 ? "VIP" : 
                       (customer.loyalty_points || 0) > 0 ? "Member" : "Prospect"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Booking History</DropdownMenuItem>
                        <DropdownMenuItem>Adjust Points</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
