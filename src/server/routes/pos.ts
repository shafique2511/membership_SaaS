import express from 'express';
import { supabase } from '../supabase.ts';
import { authenticate, AuthRequest } from '../middleware/auth.ts';
import { checkModuleAccess } from '../middleware/moduleCheck.ts';

const router = express.Router();

router.get('/orders', authenticate, checkModuleAccess('pos'), async (req: AuthRequest, res) => {
  const businessId = req.headers['x-business-id'] as string;
  try {
    const { data: orders } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
    res.json(orders || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/', authenticate, checkModuleAccess('pos'), async (req: AuthRequest, res) => {
  const businessId = req.headers['x-business-id'] as string;
  const { cart, totalAmount, paymentMethod, customerId } = req.body;

  try {
    // 1. Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        business_id: businessId,
        customer_id: customerId || null,
        total_amount: totalAmount,
        payment_method: paymentMethod || 'CASH',
        status: 'COMPLETED'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create order items and update inventory
    for (const item of cart) {
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: item.type === 'product' ? item.id : null,
          service_id: item.type === 'service' ? item.id : null,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity
        });
      
      if (itemError) throw itemError;

      // Update stock if it's a product
      if (item.type === 'product' && item.id) {
        // Fetch current stock
        const { data: product } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.id)
          .single();
        
        if (product) {
          await supabase
            .from('products')
            .update({ stock_quantity: product.stock_quantity - item.quantity })
            .eq('id', item.id);
        }
      }
    }

    // Update customer loyalty points if a customer is associated
    if (customerId) {
      const { data: customer } = await supabase
        .from('customers')
        .select('loyalty_points')
        .eq('id', customerId)
        .single();
      
      if (customer) {
        const pointsEarned = Math.floor(totalAmount); // 1 point per $1
        await supabase
          .from('customers')
          .update({ loyalty_points: (customer.loyalty_points || 0) + pointsEarned })
          .eq('id', customerId);
      }
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Checkout failed' });
  }
});

export default router;
