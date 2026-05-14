import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useBusiness } from "@/context/BusinessContext";
import { toast } from "sonner";

export default function SettingsPage() {
  const { currentBusiness, modules } = useBusiness();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your business details and preferences.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hours">Opening Hours</TabsTrigger>
          <TabsTrigger value="bookings">Booking Rules</TabsTrigger>
          <TabsTrigger value="modules">Modules & Plan</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>This information will be displayed on your customer booking page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="business-name" defaultValue="Sharp Cuts Barber" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" defaultValue="123 Barber Street, Kuala Lumpur" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+60 123 456 789" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input id="whatsapp" defaultValue="+60 123 456 789" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Plan & Modules</CardTitle>
              <CardDescription>Manage your active modules and subscription settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-primary/5 border rounded-lg">
                <div className="space-y-0.5">
                  <p className="font-semibold text-primary">Current Plan: Professional</p>
                  <p className="text-xs text-muted-foreground">$49/month • Next billing on Jun 14, 2026</p>
                </div>
                <Button variant="outline" size="sm">Change Plan</Button>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Active Modules</h4>
                <div className="grid gap-4">
                  {modules.map((mod) => (
                    <div key={mod.id} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{mod.name}</Label>
                        <p className="text-xs text-muted-foreground">Module ID: {mod.id}</p>
                      </div>
                      <Switch 
                        checked={mod.enabled} 
                        disabled={mod.locked && mod.id !== 'core'}
                        onCheckedChange={async (checked) => {
                          try {
                             const res = await fetch(`/api/businesses/${currentBusiness.id}/modules/toggle`, {
                               method: 'POST',
                               headers: { 'Content-Type': 'application/json' },
                               body: JSON.stringify({ moduleId: mod.id, enabled: checked })
                             });
                             if (res.ok) {
                               toast.success(`${mod.name} ${checked ? 'enabled' : 'disabled'}`);
                               // Refresh modules in context
                               window.location.reload(); // Simple way to refresh state for now
                             } else {
                               toast.error("Failed to update module");
                             }
                          } catch (err) {
                             toast.error("Operation failed");
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
           <Card>
             <CardHeader>
               <CardTitle>Booking Rules</CardTitle>
               <CardDescription>Control how customers book appointments.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
               <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                   <Label>Auto-Confirm Bookings</Label>
                   <p className="text-xs text-muted-foreground">Automatically confirm new booking requests.</p>
                 </div>
                 <Switch defaultChecked />
               </div>
               <Separator />
               <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="min-notice">Minimum Notice (Hours)</Label>
                    <Input id="min-notice" type="number" defaultValue="2" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="slot-duration">Slot Duration (Minutes)</Label>
                    <Input id="slot-duration" type="number" defaultValue="30" />
                  </div>
               </div>
               <div className="grid gap-2">
                 <Label htmlFor="cancellation-policy">Cancellation Policy</Label>
                 <Textarea id="cancellation-policy" defaultValue="Cancellations must be made at least 24 hours in advance." />
               </div>
             </CardContent>
             <CardFooter className="border-t px-6 py-4">
               <Button>Save Rules</Button>
             </CardFooter>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
