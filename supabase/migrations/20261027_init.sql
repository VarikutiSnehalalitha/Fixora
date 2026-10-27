-- ============================================================================
-- FIXNOW 24/7 - COMPLETE TECHNICIAN & EMERGENCY ASSISTANCE PLATFORM
-- DATABASE INITIALIZATION SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'mechanic', 'appliance_tech', 'fuel_partner', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CUSTOMER ADDRESSES
CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  street TEXT NOT NULL,
  landmark TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Karnataka',
  pincode TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. VEHICLES
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('car', 'bike', 'scooter', 'suv', 'commercial', 'ev')),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT NOT NULL,
  license_plate TEXT NOT NULL,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'cng')),
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. APPLIANCES
CREATE TABLE IF NOT EXISTS appliances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('refrigerator', 'washing_machine', 'air_conditioner', 'television', 'microwave', 'water_purifier', 'dishwasher', 'other')),
  brand TEXT NOT NULL,
  model_number TEXT,
  purchase_year INT,
  address_id UUID REFERENCES customer_addresses(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROVIDER PROFILES
CREATE TABLE IF NOT EXISTS provider_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('mechanic', 'appliance_tech', 'fuel_partner')),
  skills TEXT[] NOT NULL DEFAULT '{}',
  vehicle_specializations TEXT[] DEFAULT '{}',
  appliance_specializations TEXT[] DEFAULT '{}',
  service_radius_km INT NOT NULL DEFAULT 15,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  rejection_reason TEXT,
  rating DOUBLE PRECISION NOT NULL DEFAULT 5.0,
  review_count INT NOT NULL DEFAULT 0,
  base_visit_charge INT NOT NULL DEFAULT 349,
  current_lat DOUBLE PRECISION NOT NULL,
  current_lng DOUBLE PRECISION NOT NULL,
  city TEXT NOT NULL DEFAULT 'Bengaluru',
  operating_hours TEXT NOT NULL DEFAULT '24/7 Emergency Dispatch',
  total_completed_jobs INT NOT NULL DEFAULT 0,
  total_earnings NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROVIDER DOCUMENTS
CREATE TABLE IF NOT EXISTS provider_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('aadhaar', 'driving_license', 'trade_certificate', 'peso_license', 'gst_certificate', 'mechanic_diploma')),
  document_number TEXT NOT NULL,
  document_url TEXT NOT NULL,
  expiry_date DATE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. FUEL PARTNER AUTHORIZATIONS (PESO Specific)
CREATE TABLE IF NOT EXISTS fuel_partner_authorizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  peso_license_number TEXT NOT NULL UNIQUE,
  license_expiry_date DATE NOT NULL,
  authorized_fuel_types TEXT[] NOT NULL DEFAULT '{"diesel"}',
  max_approved_quantity_liters INT NOT NULL DEFAULT 20,
  approved_dispensing_vehicle_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'expired')),
  safety_inspection_date DATE NOT NULL,
  certified_by_authority TEXT NOT NULL DEFAULT 'Petroleum and Explosives Safety Organisation (PESO)',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  provider_id UUID REFERENCES provider_profiles(id) ON DELETE SET NULL,
  provider_name TEXT,
  provider_phone TEXT,
  service_type TEXT NOT NULL CHECK (service_type IN ('emergency_vehicle', 'scheduled_vehicle', 'appliance', 'emergency_fuel', 'towing')),
  category TEXT NOT NULL,
  issue_title TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  vehicle_details JSONB,
  appliance_details JSONB,
  fuel_details JSONB,
  location JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN (
    'REQUESTED', 'SEARCHING', 'PROVIDER_ASSIGNED', 'PROVIDER_EN_ROUTE',
    'ARRIVED', 'DIAGNOSING', 'QUOTE_PENDING', 'QUOTE_APPROVED',
    'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_PROVIDER_AVAILABLE',
    'DISPUTED', 'REFUND_PENDING', 'REFUNDED'
  )),
  status_history JSONB NOT NULL DEFAULT '[]',
  arrival_otp TEXT NOT NULL,
  completion_otp TEXT NOT NULL,
  is_arrival_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_completion_verified BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Financials
  base_charge NUMERIC NOT NULL DEFAULT 0,
  distance_charge NUMERIC NOT NULL DEFAULT 0,
  emergency_surcharge NUMERIC NOT NULL DEFAULT 0,
  parts_charge NUMERIC NOT NULL DEFAULT 0,
  labour_charge NUMERIC NOT NULL DEFAULT 0,
  fuel_charge NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  gst_tax NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  platform_commission NUMERIC NOT NULL DEFAULT 0,
  provider_payout NUMERIC NOT NULL DEFAULT 0,
  
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'authorized', 'paid', 'failed', 'refunded', 'cash_pending')),
  payment_method TEXT CHECK (payment_method IN ('razorpay', 'upi', 'card', 'cash')),
  payment_reference TEXT,
  
  issue_photos TEXT[] DEFAULT '{}',
  completion_photos TEXT[] DEFAULT '{}',
  
  estimated_arrival_minutes INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_at TIMESTAMPTZ,
  assigned_at TIMESTAMPTZ,
  arrived_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT
);

-- 9. SERVICE QUOTES
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  diagnosis_notes TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC NOT NULL,
  gst_tax NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  estimated_completion_minutes INT NOT NULL DEFAULT 60,
  warranty_days INT NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. REVIEWS & RATINGS
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('booking', 'payment', 'safety', 'provider_behavior', 'technical', 'fuel_regulatory')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID NOT NULL REFERENCES profiles(id),
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_resource TEXT NOT NULL,
  target_id TEXT NOT NULL,
  ip_address TEXT,
  details JSONB NOT NULL DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE & FAST GEOLOCATION
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_provider_profiles_geo ON provider_profiles(current_lat, current_lng);
CREATE INDEX IF NOT EXISTS idx_provider_profiles_status ON provider_profiles(is_available, is_verified, verification_status);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_quotes_booking ON quotes(booking_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_partner_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view their own profile, admins view all
CREATE POLICY "Users can read own profile or admin reads all"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR is_admin());

-- Customer Addresses: Only the address owner or admin
CREATE POLICY "Customers manage own addresses"
  ON customer_addresses FOR ALL
  USING (auth.uid() = user_id OR is_admin());

-- Vehicles: Owner or admin
CREATE POLICY "Customers manage own vehicles"
  ON vehicles FOR ALL
  USING (auth.uid() = user_id OR is_admin());

-- Appliances: Owner or admin
CREATE POLICY "Customers manage own appliances"
  ON appliances FOR ALL
  USING (auth.uid() = user_id OR is_admin());

-- Provider Profiles:
-- Public can view verified online providers for dispatch matching; provider can update their own; admin has full control
CREATE POLICY "Public read verified providers"
  ON provider_profiles FOR SELECT
  USING (verification_status = 'verified' OR auth.uid() = user_id OR is_admin());

CREATE POLICY "Providers update own profile"
  ON provider_profiles FOR UPDATE
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Providers insert own profile"
  ON provider_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_admin());

-- Bookings:
-- Customers view their own bookings
-- Assigned providers view their assigned jobs
-- Admins view all bookings
CREATE POLICY "Customers and Providers view related bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid() = customer_id 
    OR auth.uid() IN (SELECT user_id FROM provider_profiles WHERE id = bookings.provider_id)
    OR is_admin()
  );

CREATE POLICY "Customers can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id OR is_admin());

CREATE POLICY "Parties can update related bookings"
  ON bookings FOR UPDATE
  USING (
    auth.uid() = customer_id 
    OR auth.uid() IN (SELECT user_id FROM provider_profiles WHERE id = bookings.provider_id)
    OR is_admin()
  );

-- Quotes:
-- Customer and Provider of booking can view
CREATE POLICY "Related parties view quotes"
  ON quotes FOR SELECT
  USING (
    auth.uid() IN (SELECT customer_id FROM bookings WHERE id = quotes.booking_id)
    OR auth.uid() IN (SELECT user_id FROM provider_profiles WHERE id = quotes.provider_id)
    OR is_admin()
  );

CREATE POLICY "Providers create and update quotes"
  ON quotes FOR ALL
  USING (
    auth.uid() IN (SELECT user_id FROM provider_profiles WHERE id = quotes.provider_id)
    OR is_admin()
  );

-- Audit logs: Admins only
CREATE POLICY "Only admins read audit logs"
  ON audit_logs FOR SELECT
  USING (is_admin());

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);
