import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Scissors, Clock, Star, TrendingUp, Percent, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useBusiness } from "@/context/BusinessContext";
import { cn } from "@/lib/utils";
import { Users2 } from "lucide-react";

export default function StaffManagement() {
  const { currentBusiness } = useBusiness();
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentBusiness) {
      fetchStaff();
    }
  }, [currentBusiness]);

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff', {
        headers: { 'x-business-id': currentBusiness.id }
      });
      const data = await res.json();
      setStaffList(data);
      if (data.length > 0) setSelectedStaff(data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading Team...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff & Commission</h1>
          <p className="text-muted-foreground mt-1">Manage your team, commission rates, and working schedules.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          Add Team Member
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Staff List */}
        <div className="md:col-span-4 space-y-4">
          {staffList.map((member) => (
            <Card 
              key={member.id} 
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedStaff?.id === member.id ? "ring-2 ring-primary border-primary" : ""
              )}
              onClick={() => setSelectedStaff(member)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <Avatar className="h-12 w-12 ring-2 ring-background shadow-sm">
                  <AvatarImage src={member.user?.avatar_url} />
                  <AvatarFallback>{member.user?.full_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold truncate">{member.user?.full_name}</p>
                    <Badge variant={member.is_active ? "default" : "secondary"} className="text-[10px] h-4">
                      {member.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-medium">4.8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {staffList.length === 0 && (
            <div className="p-8 border-2 border-dashed rounded-xl text-center text-muted-foreground">
              No staff members found.
            </div>
          )}
        </div>

        {/* Staff Detail / Management */}
        <div className="md:col-span-8">
          {selectedStaff ? (
            <Card className="animate-in fade-in slide-in-from-right-4 duration-300">
              <CardHeader className="flex flex-row items-center gap-4 border-b pb-6">
                <Avatar className="h-20 w-20 ring-4 ring-muted shadow-lg">
                  <AvatarImage src={selectedStaff.user?.avatar_url} />
                  <AvatarFallback>{selectedStaff.user?.full_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{selectedStaff.user?.full_name}</CardTitle>
                  <CardDescription className="text-base">{selectedStaff.role}</CardDescription>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <TrendingUp className="w-3 h-3" />
                      $1,450 Sales (MTD)
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="commission">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="commission" className="gap-2">
                      <Percent className="w-4 h-4" /> Commission
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="gap-2">
                      <Calendar className="w-4 h-4" /> Schedule
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="gap-2">
                      <Star className="w-4 h-4" /> Performance
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="commission" className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="service-comm">Service Commission (%)</Label>
                        <Input id="service-comm" type="number" defaultValue={selectedStaff.commission_service} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-comm">Product Commission (%)</Label>
                        <Input id="product-comm" type="number" defaultValue={selectedStaff.commission_product} />
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-sans">Service Specific Rates</h4>
                      <p className="text-xs text-muted-foreground mb-4">Set custom rates for high-value services.</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <Scissors className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Premium Coloring</span>
                          </div>
                          <Badge variant="outline">25% Override</Badge>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full">Save Changes</Button>
                  </TabsContent>

                  <TabsContent value="schedule" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">Weekly Working Hours</h4>
                      <Button variant="outline" size="sm">Edit Schedule</Button>
                    </div>
                    <div className="space-y-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <div key={day} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                          <span className="text-sm font-medium">{day}</span>
                          <span className={cn(
                            "text-sm font-sans",
                            ['Sat', 'Sun'].includes(day) ? "text-muted-foreground" : "font-mono font-medium"
                          )}>
                            {['Sat', 'Sun'].includes(day) ? 'Off Day' : '10 AM - 8 PM'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/5">
              <Users2 className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">Select a team member to manage</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

