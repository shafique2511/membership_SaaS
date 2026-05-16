import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  ChevronRight,
  Info,
  Gift,
  User,
  History
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Separator } from "@/components/ui/Separator";
import { useAuth } from "@/context/AuthContext";
import { safeFetch } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CustomerPortal() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBusinessData();
    }
  }, [slug]);

  const fetchBusinessData = async () => {
    try {
      const data = await safeFetch(`/api/businesses/public/${slug}`);
      setBusiness(data);

      const sData = await safeFetch(`/api/businesses/${data.id}/public-services`);
      setServices(sData);
    } catch (err) {
      console.error(err);
      toast.error("Business not found");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }

    if (!selectedService) return;

    try {
      await safeFetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          serviceId: selectedService.id,
          startTime: new Date(Date.now() + 86400000), // Mock tomorrow
          endTime: new Date(Date.now() + 86400000 + (selectedService.duration_minutes * 60000)),
        })
      });

      toast.success("Booking requested! We'll notify you once confirmed.");
      setSelectedService(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to book appointment");
    }
  };

  if (loading) return <div className="p-8 text-center">Finding business...</div>;
  if (!business) return <div className="p-8 text-center text-destructive">Business not found</div>;

  return (
    <div className="min-h-screen bg-muted/30 pb-12 font-sans">
      {/* Hero Header */}
      <div className="h-[300px] w-full relative overflow-hidden">
        <img 
          src={business.logo_url || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop"} 
          alt={business.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex items-end">
          <div className="max-w-4xl mx-auto w-full p-6 text-white pb-12">
            <Badge className="mb-2 bg-primary/80 border-none uppercase tracking-widest">{business.type}</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{business.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm opacity-90">
              <div className="flex items-center gap-1.5 font-sans">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">4.9</span>
                <span className="opacity-70">(128 reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 font-sans">
                <MapPin className="w-4 h-4" />
                <span>{business.address || "123 Business Way"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-8 space-y-8">
          <Tabs defaultValue="booking">
            <TabsList className="w-full h-14 bg-white border shadow-sm p-1">
              <TabsTrigger value="booking" className="flex-1 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                <Calendar className="w-4 h-4" /> Book Appointment
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="flex-1 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                <Gift className="w-4 h-4" /> Rewards & Points
              </TabsTrigger>
              <TabsTrigger value="about" className="flex-1 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                <Info className="w-4 h-4" /> About Us
              </TabsTrigger>
            </TabsList>

            <TabsContent value="booking" className="mt-6">
              <Card className="border-none shadow-xl shadow-gray-200/50">
                <CardHeader>
                  <CardTitle>Select a Service</CardTitle>
                  <CardDescription>Professional treatments tailored for you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {services.map((service) => (
                    <div 
                      key={service.id} 
                      className={cn(
                        "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group",
                        selectedService?.id === service.id ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                      )}
                      onClick={() => setSelectedService(service)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold">{service.name}</p>
                          <p className="text-xs text-muted-foreground">{service.duration_minutes} min • {service.category || 'General'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${Number(service.price).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {services.length === 0 && <p className="text-center py-8 text-muted-foreground">No services listed yet.</p>}
                </CardContent>
                <CardFooter className="border-t pt-6 bg-muted/10">
                  <Button 
                    disabled={!selectedService} 
                    className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
                    onClick={handleBooking}
                  >
                    Confirm Booking for Tomorrow
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="loyalty" className="mt-6 space-y-6">
              <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none shadow-xl">
                <CardContent className="p-8 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">OmniRewards™</h3>
                    <p className="opacity-80 text-sm mb-4">You have 0 active points. Sign in to start earning!</p>
                    <Button variant="secondary" className="font-bold">Join Loyalty Program</Button>
                  </div>
                  <div className="hidden sm:block">
                    <Gift className="w-24 h-24 opacity-20 -rotate-12" />
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-none shadow-lg shadow-gray-200/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Current Campaigns</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <div>
                        <p className="text-sm font-bold">10th Cut Free</p>
                        <p className="text-[10px] text-muted-foreground">Automatically applied at checkout</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card className="border-none shadow-xl shadow-gray-200/50">
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                <User className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">Customer Account</CardTitle>
              <CardDescription>Track your bookings and loyalty status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pb-6">
              <Button variant="outline" className="w-full">Sign In</Button>
              <Button className="w-full font-bold">Create Account</Button>
              <Separator className="my-4" />
              <Button variant="ghost" className="w-full gap-2 text-xs text-muted-foreground hover:text-foreground">
                <History className="w-3.5 h-3.5" /> View My History
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-gray-200/50 overflow-hidden">
             <div className="p-4 bg-muted/40 font-bold text-xs uppercase tracking-wider border-b">Business Hours</div>
             <CardContent className="p-6 space-y-3">
               {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((d) => (
                 <div key={d} className="flex justify-between text-sm">
                   <span className="text-muted-foreground">{d}</span>
                   <span className="font-medium font-sans">09:00 - 20:00</span>
                 </div>
               ))}
               <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Saturday</span>
                   <span className="font-bold text-primary">09:00 - 15:00</span>
               </div>
               <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Sunday</span>
                   <span className="text-red-500 font-bold">Closed</span>
               </div>
             </CardContent>
             <CardFooter className="p-4 border-t bg-muted/10 flex items-center gap-3">
               <div className="p-2 bg-green-100 rounded-full text-green-600">
                 <Phone className="w-4 h-4" />
               </div>
               <div>
                 <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Emergency Booking</p>
                 <p className="text-sm font-bold">{business.phone}</p>
               </div>
             </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
