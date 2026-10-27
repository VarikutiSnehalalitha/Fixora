export type UserRole = 'customer' | 'mechanic' | 'appliance_tech' | 'fuel_partner' | 'admin';

export type BookingStatus =
  | 'REQUESTED'
  | 'SEARCHING'
  | 'PROVIDER_ASSIGNED'
  | 'PROVIDER_EN_ROUTE'
  | 'ARRIVED'
  | 'DIAGNOSING'
  | 'QUOTE_PENDING'
  | 'QUOTE_APPROVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_PROVIDER_AVAILABLE'
  | 'DISPUTED'
  | 'REFUND_PENDING'
  | 'REFUNDED';

export type ServiceType = 
  | 'emergency_vehicle'
  | 'scheduled_vehicle'
  | 'appliance'
  | 'emergency_fuel'
  | 'towing';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface CustomerAddress {
  id: string;
  user_id: string;
  label: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  is_default: boolean;
}

export interface Vehicle {
  id: string;
  user_id: string;
  type: 'car' | 'bike' | 'scooter' | 'suv' | 'commercial' | 'ev';
  make: string;
  model: string;
  year: number;
  license_plate: string;
  fuel_type: 'petrol' | 'diesel' | 'electric' | 'cng';
  color?: string;
}

export interface Appliance {
  id: string;
  user_id: string;
  category: 'refrigerator' | 'washing_machine' | 'air_conditioner' | 'television' | 'microwave' | 'water_purifier' | 'dishwasher' | 'other';
  brand: string;
  model_number?: string;
  purchase_year?: number;
  address_id?: string;
}

export interface ProviderDocument {
  id: string;
  document_type: 'aadhaar' | 'driving_license' | 'trade_certificate' | 'peso_license' | 'gst_certificate' | 'mechanic_diploma';
  document_number: string;
  document_url: string;
  expiry_date?: string;
  is_verified: boolean;
}

export interface ProviderProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  provider_type: 'mechanic' | 'appliance_tech' | 'fuel_partner';
  skills: string[];
  vehicle_specializations?: string[];
  appliance_specializations?: string[];
  service_radius_km: number;
  is_available: boolean;
  is_verified: boolean;
  verification_status: 'pending' | 'verified' | 'rejected';
  rejection_reason?: string;
  documents: ProviderDocument[];
  rating: number;
  review_count: number;
  base_visit_charge: number;
  current_lat: number;
  current_lng: number;
  city: string;
  operating_hours: string;
  total_completed_jobs: number;
  total_earnings: number;
  created_at: string;
}

export interface FuelPartnerAuthorization {
  id: string;
  provider_id: string;
  company_name: string;
  peso_license_number: string;
  license_expiry_date: string;
  authorized_fuel_types: ('diesel' | 'petrol')[];
  max_approved_quantity_liters: number;
  approved_dispensing_vehicle_number: string;
  status: 'pending' | 'active' | 'suspended' | 'expired';
  safety_inspection_date: string;
  certified_by_authority: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  type: 'part' | 'labour' | 'visit_fee' | 'towing_fee' | 'fuel_charge';
  unit_price: number;
  quantity: number;
  total: number;
}

export interface ServiceQuote {
  id: string;
  booking_id: string;
  provider_id: string;
  diagnosis_notes: string;
  items: QuoteItem[];
  subtotal: number;
  gst_tax: number;
  total_amount: number;
  estimated_completion_minutes: number;
  warranty_days: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Booking {
  id: string;
  booking_number: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  provider_id?: string;
  provider_name?: string;
  provider_phone?: string;
  provider_rating?: number;
  service_type: ServiceType;
  category: string;
  issue_title: string;
  issue_description: string;
  vehicle_details?: {
    type: string;
    make: string;
    model: string;
    license_plate?: string;
    licensePlate?: string;
    fuel_type?: string;
  };
  appliance_details?: {
    category: string;
    brand: string;
    model_number?: string;
  };
  fuel_details?: {
    fuel_type: 'petrol' | 'diesel';
    quantity_liters: number;
    authorized_container_verified: boolean;
    reason_for_emergency: string;
  };
  location: {
    address: string;
    landmark?: string;
    city: string;
    lat: number;
    lng: number;
    direction_of_travel?: string;
  };
  status: BookingStatus;
  status_history: {
    status: BookingStatus;
    timestamp: string;
    note?: string;
  }[];
  arrival_otp: string;
  completion_otp: string;
  is_arrival_verified: boolean;
  is_completion_verified: boolean;
  
  // Financials
  base_charge: number;
  distance_charge: number;
  emergency_surcharge: number;
  parts_charge: number;
  labour_charge: number;
  fuel_charge: number;
  discount: number;
  gst_tax: number;
  total_amount: number;
  platform_commission: number;
  provider_payout: number;
  
  payment_status: 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded' | 'cash_pending';
  payment_method?: 'razorpay' | 'upi' | 'card' | 'cash';
  payment_reference?: string;
  
  // Media
  issue_photos: string[];
  completion_photos: string[];
  
  // Quote
  quote?: ServiceQuote;

  // Timestamps & ETA
  estimated_arrival_minutes?: number;
  created_at: string;
  scheduled_at?: string;
  assigned_at?: string;
  arrived_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
}

export interface RatingReview {
  id: string;
  booking_id: string;
  customer_id: string;
  customer_name: string;
  provider_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string;
  user_name: string;
  user_email: string;
  booking_id?: string;
  subject: string;
  category: 'booking' | 'payment' | 'safety' | 'provider_behavior' | 'technical' | 'fuel_regulatory';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  messages: {
    sender: 'user' | 'support' | 'system';
    text: string;
    timestamp: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_role: UserRole;
  action: string;
  target_resource: string;
  target_id: string;
  ip_address?: string;
  details: Record<string, any>;
  timestamp: string;
}
