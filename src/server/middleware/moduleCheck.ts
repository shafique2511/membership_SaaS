import { Response, NextFunction } from 'express';
import { supabase } from '../supabase.ts';
import { AuthRequest } from './auth.ts';

export const checkModuleAccess = (moduleId: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const businessId = req.headers['x-business-id'] as string;

    if (!businessId) {
      return res.status(400).json({ error: 'Business ID is required' });
    }

    try {
      // 1. Get business and its package
      const { data: business, error: bError } = await supabase
        .from('businesses')
        .select('current_package_id')
        .eq('id', businessId)
        .single();

      if (bError || !business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // 2. Check if module is in package
      const { data: packageModule } = await supabase
        .from('package_modules')
        .select('*')
        .eq('package_id', business.current_package_id)
        .eq('module_id', moduleId)
        .single();

      if (packageModule) {
        return next();
      }

      // 3. Check if module is enabled as an add-on
      const { data: addOn } = await supabase
        .from('business_module_access')
        .select('*')
        .eq('business_id', businessId)
        .eq('module_id', moduleId)
        .eq('enabled', true)
        .single();

      if (addOn) {
        // Optional: check expiry
        if (addOn.expires_at && new Date(addOn.expires_at) < new Date()) {
          return res.status(403).json({ error: 'Module access expired. Please upgrade your plan.', locked: true });
        }
        return next();
      }

      return res.status(403).json({ 
        error: `Module '${moduleId}' is not enabled for your plan.`,
        locked: true,
        moduleId 
      });
    } catch (error) {
      console.error('Module check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};
