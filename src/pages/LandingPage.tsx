import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { 
  Rocket, Shield, Zap, Layers, 
  CheckCircle2, ArrowRight, Star,
  Smartphone, BarChart3, Users,
  Search
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useBusiness } from '@/context/BusinessContext';

function AuthCTA() {
  const { user } = useAuth();
  
  if (user) {
    return (
      <Button asChild size="lg" className="h-14 px-8 text-lg font-bold rounded-full gap-2 w-full sm:w-auto shadow-2xl shadow-primary/30">
        <Link to="/dashboard">Go to Dashboard <ArrowRight className="w-5 h-5" /></Link>
      </Button>
    );
  }

  return (
    <Button asChild size="lg" className="h-14 px-8 text-lg font-bold rounded-full gap-2 w-full sm:w-auto shadow-2xl shadow-primary/30">
      <Link to="/register">Register Your Business <ArrowRight className="w-5 h-5" /></Link>
    </Button>
  );
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
            O
          </div>
          <span className="text-2xl font-bold tracking-tighter text-gray-900">OmniBiz</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#solutions" className="hover:text-primary transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-4">
          {(() => {
            const { user } = useAuth();
            if (user) {
              return (
                <Button asChild className="shadow-xl shadow-primary/20 font-bold h-11 px-6 rounded-full">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              );
            }
            return (
              <>
                <Button variant="ghost" asChild className="hidden sm:flex font-bold">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild className="shadow-xl shadow-primary/20 font-bold h-11 px-6 rounded-full">
                  <Link to="/register">Start Free Trial</Link>
                </Button>
              </>
            );
          })()}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 group">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
          </div>
          
          <div className="container px-6 mx-auto text-center max-w-5xl">
            <Badge variant="outline" className="mb-6 py-1 px-4 rounded-full border-primary/20 bg-primary/5 text-primary font-bold animate-bounce-slow">
              🔥 The World's First Truly Modular SaaS for Business
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-gray-900 leading-[1.05] mb-8">
              One Operating System.<br />
              <span className="text-primary italic">Every</span> Single Business.
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Don't pay for features you don't use. Choose your industry, pick your modules, and scale your business with the most flexible CRM on the market.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <AuthCTA />
              <form 
                className="relative w-full sm:w-80 group"
                onSubmit={(e) => {
                  e.preventDefault();
                  const slug = (e.currentTarget.elements.namedItem('slug') as HTMLInputElement).value;
                  if (slug) window.location.href = `/p/${slug}`;
                }}
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  name="slug"
                  placeholder="Enter business slug..." 
                  className="h-14 pl-12 rounded-full border-gray-200 bg-white shadow-xl shadow-gray-200/20 focus-visible:ring-primary" 
                />
              </form>
            </div>

            {/* Social Proof */}
            <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="font-bold text-2xl tracking-tighter italic">BARBERHUB</span>
              <span className="font-bold text-2xl tracking-tighter italic">CAFEPRO</span>
              <span className="font-bold text-2xl tracking-tighter italic">LUXESTUDIO</span>
              <span className="font-bold text-2xl tracking-tighter italic">TECHRETAIL</span>
            </div>
          </div>
        </section>

        {/* Modular Grid */}
        <section id="features" className="py-24 bg-gray-50 border-y border-gray-100">
          <div className="container px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-black tracking-tighter text-gray-900 mb-4">Atomic Module Control</h2>
              <p className="text-lg text-gray-600">Toggle modules like building blocks. Our infrastructure adapts to your specific operational needs in real-time.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                { title: 'Booking & Scheduling', desc: 'Enterprise-grade calendar for appointments, tables, and events.', icon: Zap },
                { title: 'Unified POS System', desc: 'Seamlessly sell services, products, and memberships anywhere.', icon: Rocket },
                { title: 'Inventory Intel', desc: 'Real-time stock tracking with intelligent low-threshold alerts.', icon: Layers },
                { title: 'Staff Performance', desc: 'Automated commission tracking and high-resolution reports.', icon: Users },
                { title: 'Loyalty Engine', desc: 'Customizable reward rules that keep your customers coming back.', icon: Star },
                { title: 'Multi-Branch Ready', desc: 'Scale from one location to a national chain with one click.', icon: Smartphone },
              ].map((feature, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Table */}
        <section id="pricing" className="py-24">
          <div className="container px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-black tracking-tighter text-gray-900 mb-4">Transparent Growth Plans</h2>
              <p className="text-lg text-gray-600">Select the package that fits your current size. You can always add individual modules as your business evolves.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-4">
              {[
                { name: 'Starter', price: '$19', modules: ['Core System', 'Basic Booking', 'Reports Basic'], limit: '100 bookings/mo' },
                { name: 'Growth', price: '$49', modules: ['Core System', 'Advanced Booking', 'Loyalty Basic', 'Payments'], limit: '300 bookings/mo', popular: true },
                { name: 'Pro', price: '$99', modules: ['Core System', 'All Booking', 'POS System', 'Staff Commission'], limit: '1,000 bookings/mo' },
                { name: 'Business Suite', price: '$199', modules: ['Everything Included', 'Multi-Branch', 'Marketing Tools'], limit: 'Unlimited' },
              ].map((pkg, i) => (
                <div key={i} className={cn(
                  "p-8 rounded-3xl border flex flex-col h-full",
                  pkg.popular ? "border-primary ring-4 ring-primary/5 bg-white scale-105 z-10 shadow-2xl" : "border-gray-100 bg-gray-50"
                )}>
                  {pkg.popular && <Badge className="w-fit mb-4 uppercase text-[10px] tracking-widest px-3 py-1">Recommended</Badge>}
                  <h3 className="text-2xl font-bold mb-1">{pkg.name}</h3>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-black text-gray-900">{pkg.price}</span>
                    <span className="text-gray-500 font-medium mb-1">/month</span>
                  </div>
                  <Separator className="mb-6 opacity-50" />
                  <ul className="space-y-4 mb-8 flex-1">
                    {pkg.modules.map((m, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-primary" /> {m}
                      </li>
                    ))}
                    <li className="flex items-center gap-3 text-sm font-bold text-primary">
                      <Zap className="w-4 h-4" /> {pkg.limit}
                    </li>
                  </ul>
                  <Button className={cn("w-full h-12 rounded-xl font-bold shadow-lg", pkg.popular ? "bg-primary shadow-primary/20" : "bg-gray-900 shadow-gray-900/10")}>
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-950 text-white py-20 px-6">
        <div className="container mx-auto grid gap-12 md:grid-cols-4 border-b border-white/10 pb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black">O</div>
              <span className="text-xl font-bold tracking-tighter">OmniBiz</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">The only Saas solution built to follow your business through every stage of growth.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Booking Module</a></li>
              <li><a href="#" className="hover:text-white transition-colors">POS & Billing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Inventory Control</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Staff Analytics</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
            </ul>
          </div>
          <div>
             <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Connect</h4>
             <div className="flex gap-4">
                <Button variant="outline" size="icon" className="bg-white/5 border-white/10 text-white hover:bg-white/10"><Smartphone /></Button>
             </div>
          </div>
        </div>
        <div className="container mx-auto pt-10 text-center text-xs text-gray-500 font-medium">
          © 2024 OmniBiz CRM System. Built with Antigravity. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
