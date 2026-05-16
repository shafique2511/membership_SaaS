import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { 
  Building2, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Smartphone,
  Scissors,
  Coffee,
  Store,
  Layers,
  Rocket
} from "lucide-react";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState("");
  const [formData, setFormData] = useState({ name: "", slug: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const businessTypes = [
    { id: 'BARBER', label: 'Barber Shop', icon: Scissors, color: 'bg-blue-500' },
    { id: 'CAFE', label: 'Coffee Shop', icon: Coffee, color: 'bg-amber-600' },
    { id: 'HYBRID', label: 'Hybrid Business', icon: Store, color: 'bg-indigo-600' },
    { id: 'CUSTOM', label: 'Other Service', icon: Building2, color: 'bg-emerald-600' },
  ];

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/businesses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            name: formData.name, 
            slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
            type: businessType 
          }),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success("Business set up successfully!");
          navigate(`/dashboard/${data.id}`);
        } else {
          toast.error(data.error || "Failed to create business");
        }
      } catch (err) {
        toast.error("Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-6 sm:p-12 font-sans">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-black tracking-tighter">Setup Your Business</h1>
            <p className="text-muted-foreground">Let's configure your OmniBiz terminal in 3 quick steps.</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
            <span>Step {step} of 3</span>
            <span>{step === 1 ? 'Core Config' : step === 2 ? 'Industry Selection' : 'Finalizing'}</span>
          </div>
          <Progress value={step * 33.3} className="h-2" />
        </div>

        <div className="relative">
          {step === 1 && (
            <Card className="shadow-2xl border-none animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle>Business Basics</CardTitle>
                <CardDescription>How should we identify your business on the platform?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Business Name</label>
                  <Input 
                    placeholder="e.g. The Sharp Fade" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Platform URL Slug</label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm font-mono">omnibiz.com/</span>
                    <Input 
                      placeholder="the-sharp-fade" 
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                 <Button className="w-full h-12 font-bold text-lg" onClick={handleNext}>
                   Continue <ChevronRight className="ml-2 w-5 h-5" />
                 </Button>
              </CardFooter>
            </Card>
          )}

          {step === 2 && (
            <Card className="shadow-2xl border-none animate-in fade-in slide-in-from-right-4 duration-500">
              <CardHeader>
                <CardTitle>What do you do?</CardTitle>
                <CardDescription>This helps us pre-configure the best modules for your industry.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {businessTypes.map((type) => (
                  <div 
                    key={type.id}
                    className={cn(
                      "p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-4 group",
                      businessType === type.id ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                    )}
                    onClick={() => setBusinessType(type.id)}
                  >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110", type.color)}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm">{type.label}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button variant="ghost" onClick={handleBack} className="flex-1 font-bold">Back</Button>
                <Button disabled={!businessType} className="flex-1 h-12 font-bold text-lg" onClick={handleNext}>
                   Continue <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 3 && (
            <Card className="shadow-2xl border-none animate-in fade-in zoom-in-95 duration-500">
              <CardHeader className="text-center">
                 <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary animate-pulse">
                   <Rocket className="w-10 h-10" />
                 </div>
                 <CardTitle className="text-2xl">Deploying System...</CardTitle>
                 <CardDescription>Setting up your modular environment for {formData.name}.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-3">
                    {[
                      'Initializing Core Business System',
                      'Enabling Booking & Calendar Module',
                      'Configuring Local POS Terminal',
                      'Provisioning PostgreSQL Storage'
                    ].map((task, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium">{task}</span>
                      </div>
                    ))}
                 </div>
              </CardContent>
              <CardFooter>
                 <Button className="w-full h-14 font-bold text-xl shadow-xl shadow-primary/20" onClick={handleNext} disabled={isSubmitting}>
                   {isSubmitting ? "Finalizing..." : "Launch Dashboard"}
                 </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
