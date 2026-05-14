import express from 'express';
import { supabase } from '../supabase.ts';
import { authenticate, AuthRequest } from '../middleware/auth.ts';

const router = express.Router();

// Create a new business
router.post('/', authenticate, async (req: AuthRequest, res) => {
  const { name, slug, type, address, phone, whatsapp } = req.body;
  const userId = req.user!.id;

  try {
    const { data: business, error: bError } = await supabase.from('businesses').insert({
      name,
      slug,
      type,
      address,
      phone,
      whatsapp,
    }).select().single();

    if (bError) throw bError;

    // Create default branch
    const { data: branch, error: brError } = await supabase.from('branches').insert({
      business_id: business.id,
      name: 'Main Branch',
      is_main_branch: true,
    }).select().single();

    if (brError) throw brError;

    // Link user to business as Owner
    const { error: buError } = await supabase.from('business_users').insert({
      user_id: userId,
      business_id: business.id,
      role: 'OWNER',
    });

    if (buError) throw buError;

    // Enable default modules (Booking, POS, Staff are enabled for all by default in this demo)
    const defaultModules = ['booking', 'pos', 'staff'];
    const moduleInserts = defaultModules.map(modId => ({
      business_id: business.id,
      module_id: modId,
      enabled: true
    }));

    await supabase.from('business_module_access').insert(moduleInserts);

    res.json(business);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Business creation failed' });
  }
});

// Get user's businesses
router.get('/my-businesses', authenticate, async (req: AuthRequest, res) => {
  const userId = req.user!.id;

  try {
    const { data: userBusinesses, error } = await supabase
      .from('business_users')
      .select('role, business:businesses(*)')
      .eq('user_id', userId);

    if (error) throw error;

    res.json(userBusinesses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
});

// Get business details (if authorized)
router.get('/:businessId', authenticate, async (req: AuthRequest, res) => {
  const { businessId } = req.params;
  const userId = req.user!.id;

  try {
    const { data: membership } = await supabase
      .from('business_users')
      .select('*')
      .eq('business_id', businessId)
      .eq('user_id', userId)
      .single();

    if (!membership && req.user!.roleGlobal !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Not a member of this business' });
    }

    const { data: business } = await supabase.from('businesses').select('*').eq('id', businessId).single();
    if (!business) return res.status(404).json({ error: 'Business not found' });
    res.json(business);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get business modules (access control)
router.get('/:businessId/modules', authenticate, async (req, res) => {
  const { businessId } = req.params;
  try {
    // 1. Get business and its package
    const { data: business } = await supabase
      .from('businesses')
      .select('current_package_id')
      .eq('id', businessId)
      .single();

    if (!business) return res.status(404).json({ error: 'Business not found' });

    // 2. Get all available modules
    const { data: allModules } = await supabase.from('modules').select('*');
    
    // 3. Get modules in the business's package
    const { data: packageModules } = await supabase
      .from('package_modules')
      .select('module_id')
      .eq('package_id', business.current_package_id);
    
    const packageModuleIds = packageModules?.map(pm => pm.module_id) || [];

    // 4. Get modules enabled as add-ons
    const { data: addOns } = await supabase
      .from('business_module_access')
      .select('module_id, enabled, expires_at')
      .eq('business_id', businessId);

    const result = allModules?.map(mod => {
      const isPackageModule = packageModuleIds.includes(mod.id);
      const addOn = addOns?.find(a => a.module_id === mod.id);
      const isEnabledAddOn = addOn ? addOn.enabled : false;
      const isExpired = addOn?.expires_at ? new Date(addOn.expires_at) < new Date() : false;

      return {
        id: mod.id,
        name: mod.name,
        enabled: isPackageModule || (isEnabledAddOn && !isExpired),
        locked: !isPackageModule && (!isEnabledAddOn || isExpired),
        icon: mod.icon
      };
    });

    res.json(result || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle module status
router.post('/:businessId/modules/toggle', authenticate, async (req: AuthRequest, res) => {
  const { businessId } = req.params;
  const { moduleId, enabled } = req.body;
  const userId = req.user!.id;

  try {
    // Check if user is owner
    const { data: membership } = await supabase
      .from('business_users')
      .select('role')
      .eq('business_id', businessId)
      .eq('user_id', userId)
      .single();

    if (!membership || membership.role !== 'OWNER') {
      return res.status(403).json({ error: 'Only owners can toggle modules' });
    }

    const { error } = await supabase
      .from('business_module_access')
      .upsert({
        business_id: businessId,
        module_id: moduleId,
        enabled: enabled
      }, { onConflict: 'business_id,module_id' });

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to toggle module' });
  }
});

// Get business stats
router.get('/:businessId/stats', authenticate, async (req: AuthRequest, res) => {
  const { businessId } = req.params;
  try {
    // Total Sales
    const { data: salesData } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('business_id', businessId);
    
    const totalSales = salesData?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

    // Active Bookings
    const { count: bookingCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('status', 'CONFIRMED');

    // Total Customers
    const { count: customerCount } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId);

    // Low stock items
    const { count: lowStockCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .lte('stock_quantity', 5); // Default threshold check

    res.json({
      totalSales,
      activeBookings: bookingCount || 0,
      totalCustomers: customerCount || 0,
      lowStockCount: lowStockCount || 0,
      growth: '+12.5%' // Placeholder for now
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/:id/analytics', authenticate, async (req, res) => {
  const businessId = req.params.id;
  try {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const revenueByDay = days.map(day => ({
      name: day,
      revenue: Math.floor(Math.random() * 2000) + 1000,
      bookings: Math.floor(Math.random() * 15) + 5
    }));
    
    const categoryDistribution = [
      { name: "Services", value: 65 },
      { name: "Products", value: 25 },
      { name: "Others", value: 10 },
    ];

    res.json({
      revenueByDay,
      categoryDistribution
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get public business details by slug
router.get('/public/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const { data: business } = await supabase.from('businesses').select('*').eq('slug', slug).single();
    if (!business) return res.status(404).json({ error: 'Business not found' });
    res.json(business);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get public services for a business
router.get('/:businessId/public-services', async (req, res) => {
  const { businessId } = req.params;
  try {
    const { data: results } = await supabase.from('services').select('*').eq('business_id', businessId);
    res.json(results || []);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get public memberships for a business
router.get('/:businessId/public-memberships', async (req, res) => {
  const { businessId } = req.params;
  try {
    const { data: results } = await supabase.from('memberships').select('*').eq('business_id', businessId);
    res.json(results || []);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
