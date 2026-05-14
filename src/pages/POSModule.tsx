import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useBusiness } from "@/context/BusinessContext";
import { 
  ShoppingCart, 
  Search, 
  Trash2, 
  CreditCard, 
  Banknote, 
  Scan,
  Scissors,
  Coffee,
  Plus,
  Minus
} from "lucide-react";
import { toast } from "sonner";

const products = [
  { id: "1", name: "Classic Haircut", price: 25.00, icon: Scissors, category: "Service" },
  { id: "2", name: "Beard Trim", price: 15.00, icon: Scissors, category: "Service" },
  { id: "3", name: "Espresso", price: 3.50, icon: Coffee, category: "Drink" },
  { id: "4", name: "Latte", price: 4.50, icon: Coffee, category: "Drink" },
  { id: "5", name: "Cappuccino", price: 4.50, icon: Coffee, category: "Drink" },
  { id: "6", name: "Croissant", price: 3.00, icon: Coffee, category: "Food" },
  { id: "7", name: "Hair Wax", price: 12.00, icon: ShoppingCart, category: "Product" },
];

export default function POSModule() {
  const { currentBusiness } = useBusiness();
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [productsList, setProductsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (currentBusiness) {
      const fetchAll = async () => {
        try {
          const [invRes, servRes] = await Promise.all([
            fetch(`/api/inventory`, { headers: { 'x-business-id': currentBusiness.id } }),
            fetch(`/api/businesses/${currentBusiness.id}/public-services`)
          ]);
          
          const invData = await invRes.json();
          const servData = await servRes.json();
          
          const joined = [
            ...(invData || []).map((p: any) => ({ ...p, type: 'product', price: Number(p.price_sell) })),
            ...(servData || []).map((s: any) => ({ ...s, type: 'service', price: Number(s.price), icon: Scissors }))
          ];
          
          setProductsList(joined);
          setIsLoading(false);
        } catch (err) {
          console.error(err);
          setIsLoading(false);
        }
      };
      fetchAll();
    }
  }, [currentBusiness]);

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((acc, item) => acc + (Number(item.price_sell || item.price) * item.quantity), 0);

  const handleCheckout = async (paymentMethod: string) => {
    if (cart.length === 0) return;
    
    try {
      const res = await fetch('/api/pos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-business-id': currentBusiness.id
        },
        body: JSON.stringify({
          cart,
          totalAmount: total,
          paymentMethod,
        })
      });

      if (res.ok) {
        toast.success("Transaction completed successfully!");
        setCart([]);
        // Optional: refresh inventory to see updated stock
        fetch(`/api/inventory`, {
          headers: { 'x-business-id': currentBusiness.id }
        })
          .then(res => res.json())
          .then(data => setProductsList(data));
      } else {
        toast.error("Checkout failed. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const currentProducts = productsList.length > 0 ? productsList : products;
  const filteredProducts = currentProducts.filter(p => (p.name || "").toLowerCase().includes(search.toLowerCase()));

  if (isLoading) return <div className="flex items-center justify-center h-full">Loading Products...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-3xl font-bold tracking-tight">POS Terminal</h2>
        <div className="flex items-center gap-2">
            <Input 
              placeholder="Search products..." 
              className="w-64" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-2">
           <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
             {filteredProducts.map((product) => (
               <Card 
                 key={product.id} 
                 className="cursor-pointer hover:border-primary transition-colors flex flex-col justify-between"
                 onClick={() => addToCart(product)}
               >
                 <CardHeader className="p-4">
                   <div className="bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center mb-2">
                     <product.icon className="h-5 w-5 text-gray-700" />
                   </div>
                   <CardTitle className="text-sm">{product.name}</CardTitle>
                   <CardDescription className="text-xs">{product.category}</CardDescription>
                 </CardHeader>
                 <CardContent className="p-4 pt-0">
                   <p className="font-bold text-primary">${product.price.toFixed(2)}</p>
                 </CardContent>
               </Card>
             ))}
           </div>
        </div>

        {/* Cart */}
        <Card className="w-96 flex flex-col shrink-0">
          <CardHeader className="p-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Current Order
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full px-4">
              <div className="py-4 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Cart is empty</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">${(item.price_sell || item.price || 0).toFixed(2)} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>
                           <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>
                           <Plus className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeFromCart(item.id)}>
                           <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <Separator />
          <CardFooter className="p-4 flex flex-col gap-4">
             <div className="w-full space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground">Subtotal</span>
                 <span>${total.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-lg font-bold">
                 <span>Total</span>
                 <span>${total.toFixed(2)}</span>
               </div>
             </div>
             <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline" className="flex items-center gap-2" onClick={() => handleCheckout('CASH')}>
                  <Banknote className="h-4 w-4" /> Cash
                </Button>
                <Button className="flex items-center gap-2" onClick={() => handleCheckout('CARD')}>
                  <CreditCard className="h-4 w-4" /> Card
                </Button>
             </div>
             <Button variant="secondary" className="w-full flex items-center gap-2" onClick={() => handleCheckout('QR')}>
               <Scan className="h-4 w-4" /> QR Pay
             </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
