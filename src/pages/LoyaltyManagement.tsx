import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/Input";
import { 
  Gift, 
  Coins, 
  Settings2, 
  Users, 
  Plus, 
  Star,
  Zap,
  Award
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function LoyaltyManagement() {
  const [activeRule, setActiveRule] = useState<any>(null);

  const rules = [
    { id: "1", name: "Welcome Bonus", points: "50", trigger: "Registration", status: "ACTIVE" },
    { id: "2", name: "Dollar for Dollar", points: "1/1$", trigger: "Purchase", status: "ACTIVE" },
    { id: "3", name: "Referral Bonus", points: "100", trigger: "New Customer", status: "INACTIVE" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loyalty & Rewards</h1>
          <p className="text-muted-foreground mt-1">Configure how customers earn and spend points.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          New Campaign
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary text-primary-foreground shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold opacity-80 uppercase tracking-widest">Total Points Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
               <Coins className="w-10 h-10 opacity-30" />
               <div className="text-4xl font-black">124.5k</div>
            </div>
            <p className="text-xs mt-2 opacity-70">Across 850 active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Redemption Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-orange-500">
               <Zap className="w-10 h-10 opacity-30" />
               <div className="text-4xl font-black">22%</div>
            </div>
            <p className="text-xs mt-2 text-muted-foreground">↑ 4% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Avg. Member Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-green-500">
               <Award className="w-10 h-10 opacity-30" />
               <div className="text-4xl font-black">$245</div>
            </div>
            <p className="text-xs mt-2 text-muted-foreground">Lifetime value per loyalist</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Rules Config */}
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Earning Rules</CardTitle>
                <CardDescription>Rules that determine how points are credited.</CardDescription>
              </div>
              <Button variant="outline" size="sm">Manage Global Ratios</Button>
            </CardHeader>
            <CardContent className="space-y-4">
               {rules.map((rule) => (
                 <div key={rule.id} className="flex items-center justify-between p-4 border-2 rounded-2xl group hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                          <Settings2 className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="font-bold">{rule.name}</p>
                          <p className="text-xs text-muted-foreground">Trigger: {rule.trigger}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-primary">+{rule.points} pts</p>
                       <Badge variant={rule.status === 'ACTIVE' ? 'default' : 'secondary'} className="text-[10px]">
                         {rule.status}
                       </Badge>
                    </div>
                 </div>
               ))}
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
                <CardTitle>Redeemable Rewards</CardTitle>
                <CardDescription>Items or discounts customers can buy with points.</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { name: 'Free Espresso', cost: '100 pts', icon: '☕' },
                    { name: '15% Off Total Bill', cost: '350 pts', icon: '🎟️' },
                    { name: 'Premium Hair Wax', cost: '500 pts', icon: '🧴' },
                    { name: 'V.I.P Lounge Access', cost: '1,000 pts', icon: '⭐' },
                  ].map((reward, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-muted/20 rounded-xl border border-dashed border-muted-foreground/30">
                       <span className="text-3xl">{reward.icon}</span>
                       <div>
                          <p className="font-bold text-sm">{reward.name}</p>
                          <p className="text-xs font-bold text-primary">{reward.cost}</p>
                       </div>
                    </div>
                  ))}
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Top Loyalists */}
        <div className="md:col-span-4 space-y-6">
           <Card className="border-none shadow-xl shadow-gray-200/50">
              <CardHeader>
                 <CardTitle className="text-lg font-bold">Top Members</CardTitle>
                 <CardDescription>Most active customers by points.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {[
                   { name: 'John Wick', points: '12,540', tier: 'Gold' },
                   { name: 'Tony Stark', points: '8,200', tier: 'Iron' },
                   { name: 'Steve Rogers', points: '5,400', tier: 'Silver' },
                 ].map((m, i) => (
                   <div key={i} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs">{i+1}</div>
                      <div className="flex-1">
                         <p className="text-sm font-bold">{m.name}</p>
                         <p className="text-[10px] text-muted-foreground uppercase">{m.tier} Tier</p>
                      </div>
                      <div className="font-sans font-black text-primary text-sm">{m.points}</div>
                   </div>
                 ))}
                 <Separator className="my-2" />
                 <Button variant="link" className="w-full text-xs h-4">View All Members</Button>
              </CardContent>
           </Card>

           <Card className="bg-amber-50 border-amber-200">
              <CardHeader className="pb-2">
                 <CardTitle className="text-amber-800 text-sm flex items-center gap-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    Tier Thresholds
                 </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-amber-900/70">
                 <div className="flex justify-between"><span>Silver</span> <span>500 pts</span></div>
                 <div className="flex justify-between"><span>Gold</span> <span>2,500 pts</span></div>
                 <div className="flex justify-between"><span>Platinum</span> <span>10,000 pts</span></div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
