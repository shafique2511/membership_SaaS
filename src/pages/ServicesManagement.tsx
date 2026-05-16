import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Plus, Coffee, Scissors, MoreHorizontal, Clock, DollarSign } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/DropdownMenu";

export default function ServicesManagement() {
  const services = [
    { id: "1", name: "Classic Haircut", category: "Barber", price: "$25.00", duration: "30 min", status: "Active" },
    { id: "2", name: "Beard Trim & Stylist", category: "Barber", price: "$40.00", duration: "45 min", status: "Active" },
    { id: "3", name: "Espresso Lungo", category: "Coffee", price: "$3.50", duration: "5 min", status: "Active" },
    { id: "4", name: "Latte Art Masterclass", category: "Event", price: "$75.00", duration: "120 min", status: "Inactive" },
    { id: "5", name: "Shave & Hot Towel", category: "Barber", price: "$15.00", duration: "20 min", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Services & Products</h2>
          <p className="text-muted-foreground">Define what you sell and how long each service takes.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Service
            </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                     {service.category === "Barber" ? <Scissors className="h-4 w-4 text-gray-400" /> : <Coffee className="h-4 w-4 text-gray-400" />}
                     {service.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.category}</Badge>
                  </TableCell>
                  <TableCell>{service.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-gray-500">
                      <Clock className="mr-1 h-3 w-3" />
                      {service.duration}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={service.status === "Active" ? "default" : "secondary"}>
                      {service.status}
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
                        <DropdownMenuItem>Edit Service</DropdownMenuItem>
                        <DropdownMenuItem>Assign Staff</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
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
