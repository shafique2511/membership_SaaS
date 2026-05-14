import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  BarChart3, Calendar, Users, Package, ShoppingCart, 
  Settings, CreditCard, Gift, Users2, Bell, 
  MapPin, Megaphone, UserCircle, LogOut, Lock,
  ChevronRight, Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { useBusiness } from '@/context/BusinessContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from 'react-router-dom';

const NAVIGATION_ITEMS = [
  { id: 'core', label: 'Dashboard', icon: BarChart3, path: '' },
  { id: 'booking', label: 'Bookings', icon: Calendar, path: '/bookings' },
  { id: 'pos', label: 'POS / Sales', icon: ShoppingCart, path: '/pos' },
  { id: 'membership', label: 'Members', icon: CreditCard, path: '/memberships' },
  { id: 'loyalty', label: 'Loyalty', icon: Gift, path: '/loyalty' },
  { id: 'inventory', label: 'Inventory', icon: Package, path: '/inventory' },
  { id: 'staff', label: 'Staff', icon: Users2, path: '/staff' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
];

export default function DashboardLayout() {
  const { businessId } = useParams();
  const { user, logout } = useAuth();
  const { currentBusiness, modules, checkAccess } = useBusiness();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getFullPath = (path: string) => `/dashboard/${businessId}${path}`;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col hidden md:flex">
        <div className="p-6 border-b flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">
            O
          </div>
          <span className="font-bold text-xl tracking-tight">OmniBiz</span>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {NAVIGATION_ITEMS.map((item) => {
              const fullPath = getFullPath(item.path);
              const isActive = item.path === '' 
                ? location.pathname === fullPath 
                : location.pathname.startsWith(fullPath);
              const isLocked = item.id !== 'core' && !checkAccess(item.id);

              return (
                <Link
                  key={item.id}
                  to={fullPath}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                  {isLocked && (
                    <Lock className="w-3.5 h-3.5 ml-auto text-muted-foreground/50 group-hover:text-muted-foreground" />
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t space-y-2">
          {user?.roleGlobal === 'SUPER_ADMIN' && (
            <Button variant="ghost" className="w-full justify-start gap-3 bg-primary/5 text-primary hover:bg-primary/10" asChild>
              <Link to="/admin">
                <Lock className="w-5 h-5" />
                Admin Panel
              </Link>
            </Button>
          )}
          <Button variant="ghost" className="w-full justify-start gap-3" asChild>
            <Link to={getFullPath('/settings')}>
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                {currentBusiness?.name || 'Loading business...'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                    <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal font-sans">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive cursor-pointer" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <ScrollArea className="flex-1 bg-muted/20">
          <div className="p-8">
            <Outlet />
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
