import express from 'express';
import { supabase } from '../supabase.ts';
import { authenticate, AuthRequest } from '../middleware/auth.ts';
import { checkModuleAccess } from '../middleware/moduleCheck.ts';

const router = express.Router();

// Get all customers for a business
router.get('/', authenticate, async (req: AuthRequest, res) => {
  const businessId = req.headers['x-business-id'] as string;
  if (!businessId) return res.status(400).json({ error: 'Business ID required' });

  try {
    const { data: customers } = await supabase
      .from('customers')
      .select('*')
      .eq('business_id', businessId)
      .order('full_name');
    res.json(customers || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Create customer
router.post('/', authenticate, async (req: AuthRequest, res) => {
  const businessId = req.headers['x-business-id'] as string;
  const { full_name, email, phone } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        business_id: businessId,
        full_name,
        email,
        phone,
        loyalty_points: 0
      })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create customer' });
  }
});

// Update customer
router.patch('/:id', authenticate, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from('customers')
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
