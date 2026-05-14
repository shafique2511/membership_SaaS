-- Supabase Schema for OmniBiz CRM - Modular SaaS

-- 1. Modules Registry
CREATE TABLE modules (
  id TEXT PRIMARY KEY, -- e.g. 'booking', 'pos', 'inventory'
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Packages
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- Starter, Growth, Pro, Business Suite, Enterprise
  price_monthly DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Package Modules (What modules are included in what package)
CREATE TABLE package_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  module_id TEXT REFERENCES modules(id) ON DELETE CASCADE,
  UNIQUE(package_id, module_id)
);

-- 4. Users Table (Core)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role_global TEXT DEFAULT 'USER', -- SUPER_ADMIN, USER
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Businesses Table
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- BARBER, CAFE, HYBRID, CUSTOM
  address TEXT,
  phone TEXT,
  whatsapp TEXT,
  logo_url TEXT,
  current_package_id UUID REFERENCES packages(id),
  subscription_status TEXT DEFAULT 'ACTIVE', -- ACTIVE, TRIAL, EXPIRED, CANCELLED
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Business Users (Roles within a business)
CREATE TABLE business_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'STAFF', -- OWNER, MANAGER, STAFF
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, business_id)
);

-- 7. Add-ons (Manually enabled modules)
CREATE TABLE business_module_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  module_id TEXT REFERENCES modules(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, module_id)
);

-- 8. Branches
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  is_main_branch BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Staff Profiles
CREATE TABLE staff_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  title TEXT, -- e.g. Master Barber
  bio TEXT,
  commission_rate_service DECIMAL(5,2) DEFAULT 0.00,
  commission_rate_product DECIMAL(5,2) DEFAULT 0.00,
  working_hours JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES staff_profiles(id) ON DELETE SET NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'PENDING', -- PENDING, CONFIRMED, CHECKED_IN, COMPLETED, CANCELLED, NO_SHOW
  total_price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Customers (Local to business)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  price_sell DECIMAL(10,2) NOT NULL,
  price_cost DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. POS Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  status TEXT DEFAULT 'COMPLETED',
  payment_method TEXT, -- CASH, CARD, QR, TRANSFER
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  service_id UUID REFERENCES services(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

-- Seed Initial Modules
INSERT INTO modules (id, name, description, icon) VALUES
('booking', 'Booking Module', 'Appointment and reservation management', 'calendar'),
('membership', 'Membership Module', 'Subscription and pre-paid plans', 'credit-card'),
('loyalty', 'Loyalty & Rewards', 'Point system and rewards', 'gift'),
('pos', 'POS Module', 'Point of sale and billing', 'shopping-cart'),
('inventory', 'Inventory Module', 'Stock and supplier management', 'package'),
('staff', 'Staff & Commission', 'Staff performance and payroll', 'users'),
('payment', 'Payment Module', 'Payment processing and invoices', 'dollar-sign'),
('notification', 'Notification Module', 'WhatsApp, SMS, and Email', 'bell'),
('reports', 'Reports Module', 'Advanced analytics and export', 'bar-chart'),
('multibranch', 'Multi-Branch Module', 'Manage multiple locations', 'map-pin'),
('marketing', 'Marketing Module', 'Campaigns and promo codes', 'megaphone'),
('portal', 'Customer Portal', 'Branded client area', 'user'),
('whitelabel', 'White Label', 'Custom branding and domain', 'award');
