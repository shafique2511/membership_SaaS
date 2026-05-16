import React from 'react';
import { useBusiness } from '@/context/BusinessContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lock, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModuleGuardProps {
  moduleId: string;
  children: React.ReactNode;
}

export function ModuleGuard({ moduleId, children }: ModuleGuardProps) {
  const { checkAccess, isLoading } = useBusiness();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading modules...</div>;
  }

  const hasAccess = checkAccess(moduleId);

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <Card className="max-w-md w-full border-dashed border-2">
          <CardHeader>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Module Locked</CardTitle>
            <CardDescription>
              The <strong>{moduleId.charAt(0).toUpperCase() + moduleId.slice(1)}</strong> module is not included in your current plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground border-t pt-4">
              Unlock advanced features like automated scheduling, professional inventory management, and deep analytics by upgrading your plan.
            </p>
            <Button asChild className="w-full gap-2">
              <Link to="/settings/billing">
                <Rocket className="w-4 h-4" />
                View Upgrade Options
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
