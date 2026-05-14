import express from 'express';
import { supabase } from '../supabase.ts';
import { authenticate, AuthRequest } from '../middleware/auth.ts';

const router = express.Router();

router.post('/', authenticate, async (req: AuthRequest, res) => {
  const { businessId, serviceId, staffId, startTime, endTime, notes } = req.body;
  const customerId = req.user!.id;

  try {
    const { data: service } = await supabase.from('services').select('*').eq('id', serviceId).single();

    if (!service) return res.status(404).json({ error: 'Service not found' });

    const { data: booking, error } = await supabase.from('bookings').insert({
      business_id: businessId,
      customer_id: customerId,
      service_id: serviceId,
      staff_id: staffId,
      start_time: new Date(startTime),
      end_time: new Date(endTime),
      status: 'PENDING',
      total_price: service.price,
      notes,
    }).select().single();

    if (error) throw error;

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Booking failed' });
  }
});

router.get('/business/:businessId', authenticate, async (req: AuthRequest, res) => {
  const { businessId } = req.params;
  
  try {
    const { data: results } = await supabase.from('bookings').select('*').eq('business_id', businessId);
    res.json(results || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.patch('/:bookingId/status', authenticate, async (req: AuthRequest, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  try {
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
});

export default router;
