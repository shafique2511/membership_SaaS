import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  Package, Search, Plus, Filter, 
  ArrowUpDown, AlertTriangle, 
  History, Settings, MoreHorizontal 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useBusiness } from "@/context/BusinessContext";
import { cn } from "@/lib/utils";

export default function InventoryManagement() {
  const { currentBusiness } = useBusiness();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (currentBusiness) {
      fetchInventory();
    }
  }, [currentBusiness]);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory', {
        headers: { 'x-business-id': currentBusiness.id }
      });
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const lowStockCount = inventory.filter(item => item.stock_quantity <= (item.low_stock_threshold || 0)).length;
  const totalValue = inventory.reduce((acc, item) => acc + (Number(item.price_sell || 0) * (item.stock_quantity || 0)), 0);

  if (loading) return <div className="p-8">Loading Inventory...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground mt-1">Track products, supplies, and receive stock alerts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <History className="w-4 h-4" /> Stock History
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: 'Total Value', value: `$${totalValue.toLocaleString()}`, desc: 'Estimated value', icon: Package },
          { label: 'Low Stock', value: `${lowStockCount} Items`, desc: 'Require attention', icon: AlertTriangle, color: 'text-amber-500' },
          { label: 'Total Products', value: inventory.length.toString(), desc: 'Active unique SKUs', icon: Settings },
          { label: 'Out of Stock', value: inventory.filter(i => i.stock_quantity === 0).length.toString(), desc: 'Critical status', icon: Package },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <stat.icon className={cn("h-4 w-4 text-muted-foreground", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/5">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                className="pl-9" 
                placeholder="Filter by Name or SKU..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" /> Category
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="w-4 h-4" /> Sort
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product / SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-black">{item.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{item.sku || 'N/A'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal text-[10px]">{item.category || 'General'}</Badge>
                  </TableCell>
                  <TableCell className="font-medium font-sans">
                    {item.stock_quantity} units
                  </TableCell>
                  <TableCell>${Number(item.price_sell || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    {item.stock_quantity <= (item.low_stock_threshold || 0) ? (
                      <Badge variant="destructive" className="gap-1 animate-pulse">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Optimal</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Adjust Stock</DropdownMenuItem>
                        <DropdownMenuItem>Edit Product</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredInventory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No products found.
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

