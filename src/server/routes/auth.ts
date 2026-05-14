import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../supabase.ts';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

router.post('/register', async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    const { data: existing, error: checkError } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    if (checkError) {
      console.error('Check Error:', checkError);
      throw new Error(`Database check failed: ${checkError.message}`);
    }
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const isOwner = email === 'quebackup001@gmail.com' || email === 'shafique2511@gmail.com';
    
    const { data: user, error: insertError } = await supabase.from('users').insert({
      email,
      password_hash: hashedPassword,
      full_name: fullName,
      role_global: isOwner ? 'SUPER_ADMIN' : 'USER',
    }).select().single();

    if (insertError) {
      console.error('Insert Error:', insertError);
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    if (!user) throw new Error('User creation failed - no data returned');

    const token = jwt.sign(
      { id: user.id, email: user.email, roleGlobal: user.role_global },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ user: { id: user.id, email: user.email, fullName: user.full_name, roleGlobal: user.role_global } });
  } catch (error: any) {
    console.error('Registration Error:', error);
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user } = await supabase.from('users').select('*').eq('email', email).single();

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, roleGlobal: user.role_global },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ user: { id: user.id, email: user.email, fullName: user.full_name, roleGlobal: user.role_global } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

router.get('/me', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not logged in' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const { data: user } = await supabase.from('users').select('*').eq('id', decoded.id).single();
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user: { id: user.id, email: user.email, fullName: user.full_name, roleGlobal: user.role_global } });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
