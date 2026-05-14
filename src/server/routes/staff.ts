import express from 'express';
import { supabase } from '../supabase.ts';
import { authenticate, AuthRequest } from '../middleware/auth.ts';
import { checkModuleAccess } from '../middleware/moduleCheck.ts';

const router = express.Router();

// Get staff list
router.get('/', authenticate, checkModuleAccess('staff'), async (req: AuthRequest, res) => {
  const businessId = req.headers['x-business-id'] as string;
  try {
    const { data: staff } = await supabase
      .from('staff_profiles')
      .select('*, user:users(id, email, full_name, avatar_url)')
      .eq('business_id', businessId);
    res.json(staff || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

router.post('/', authenticate, checkModuleAccess('staff'), async (req: AuthRequest, res) => {
  const businessId = req.headers['x-business-id'] as string;
  const { userId, role, commission_service, commission_product } = req.body;
  try {
    const { data, error } = await supabase
      .from('staff_profiles')
      .insert({
        business_id: businessId,
        user_id: userId,
        role,
        commission_service,
        commission_product
      })
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add staff member' });
  }
});

router.patch('/:id', authenticate, checkModuleAccess('staff'), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const { data, error } = await supabase
      .from('staff_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
});

export default router;
