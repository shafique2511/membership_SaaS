import express from 'express';
import { supabase } from '../supabase.ts';
import { authenticate, AuthRequest } from '../middleware/auth.ts';
import { checkModuleAccess } from '../middleware/moduleCheck.ts';

const router = express.Router();

router.get('/', authenticate, checkModuleAccess('inventory'), async (req: AuthRequest, res) => {
  const businessId = req.headers['x-business-id'] as string;
  try {
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('business_id', businessId)
      .order('name');
    res.json(products || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

router.post('/', authenticate, checkModuleAccess('inventory'), async (req: AuthRequest, res) => {
  const businessId = req.headers['x-business-id'] as string;
  const { name, sku, category, price_sell, stock_quantity, threshold } = req.body;
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        business_id: businessId,
        name,
        sku,
        category,
        price_sell,
        stock_quantity,
        low_stock_threshold: threshold
      })
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create product' });
  }
});

router.patch('/:id', authenticate, checkModuleAccess('inventory'), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const { data, error } = await supabase
      .from('products')
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
