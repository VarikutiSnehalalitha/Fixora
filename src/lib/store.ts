'use client';

import {
  UserProfile,
  ProviderProfile,
  FuelPartnerAuthorization,
  Vehicle,
  Appliance,
  CustomerAddress,
  Booking,
  ServiceQuote,
  SupportTicket,
  AuditLog,
  BookingStatus,
  UserRole
} from '@/types';
import { ALLOWED_STATUS_TRANSITIONS, DEMO_USERS } from './constants';

const STORAGE_KEYS = {
  CURRENT_USER: 'fixnow_current_user',
  BOOKINGS: 'fixnow_bookings',
  PROVIDERS: 'fixnow_providers',
  FUEL_AUTH: 'fixnow_fuel_auth',
  VEHICLES: 'fixnow_vehicles',
  APPLIANCES: 'fixnow_appliances',
  ADDRESSES: 'fixnow_addresses',
  SUPPORT_TICKETS: 'fixnow_support_tickets',
  AUDIT_LOGS: 'fixnow_audit_logs'
};

// INITIAL SEED DATA
const INITIAL_CURRENT_USER: UserProfile = {
  id: 'usr-customer-001',
  email: DEMO_USERS.customer.email,
  name: DEMO_USERS.customer.name,
  phone: DEMO_USERS.customer.phone,
  role: 'customer',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  created_at: new Date(Date.now() - 30 * 86400000).toISOString()
};

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-001',
    user_id: 'usr-customer-001',
    type: 'car',
    make: 'Hyundai',
    model: 'Creta SX (O)',
    year: 2022,
    license_plate: 'KA 05 MN 4821',
    fuel_type: 'petrol',
    color: 'Polar White'
  },
  {
    id: 'veh-002',
    user_id: 'usr-customer-001',
    type: 'bike',
    make: 'Royal Enfield',
    model: 'Classic 350',
    year: 2021,
    license_plate: 'KA 01 EK 9102',
    fuel_type: 'petrol',
    color: 'Stealth Black'
  }
];

const INITIAL_APPLIANCES: Appliance[] = [
  {
    id: 'app-001',
    user_id: 'usr-customer-001',
    category: 'refrigerator',
    brand: 'Samsung',
    model_number: 'RT34T4513S8/HL (324L Double Door)',
    purchase_year: 2021
  },
  {
    id: 'app-002',
    user_id: 'usr-customer-001',
    category: 'washing_machine',
    brand: 'LG',
    model_number: 'FHM1207ZDL 7Kg Inverter Front Load',
    purchase_year: 2020
  },
  {
    id: 'app-003',
    user_id: 'usr-customer-001',
    category: 'air_conditioner',
    brand: 'Daikin',
    model_number: 'FTKF50TV 1.5 Ton 5 Star Inverter Split AC',
    purchase_year: 2022
  }
];

const INITIAL_ADDRESSES: CustomerAddress[] = [
  {
    id: 'addr-001',
    user_id: 'usr-customer-001',
    label: 'Home',
    street: 'Flat 402, Green Glen Layout, Bellandur',
    landmark: 'Behind Central Mall',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    lat: 12.9304,
    lng: 77.6784,
    is_default: true
  },
  {
    id: 'addr-002',
    user_id: 'usr-customer-001',
    label: 'Office',
    street: 'Prestige Tech Park, Marathahalli Outer Ring Road',
    landmark: 'Building Jupiter, 3rd Floor',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    lat: 12.9392,
    lng: 77.6934,
    is_default: false
  }
];

const INITIAL_PROVIDERS: ProviderProfile[] = [
  {
    id: 'prov-001',
    user_id: 'usr-mech-001',
    name: 'Vikram Singh',
    email: DEMO_USERS.mechanic.email,
    phone: DEMO_USERS.mechanic.phone,
    business_name: 'Apex Auto Care & 24/7 Mobile Recovery',
    provider_type: 'mechanic',
    skills: ['car-breakdown', 'battery-jumpstart', 'towing-recovery', 'puncture-tyre', 'engine-diagnostic'],
    vehicle_specializations: ['Hyundai', 'Maruti Suzuki', 'Tata', 'Toyota', 'Honda', 'Mahindra'],
    service_radius_km: 20,
    is_available: true,
    is_verified: true,
    verification_status: 'verified',
    documents: [
      {
        id: 'doc-001',
        document_type: 'aadhaar',
        document_number: 'XXXX-XXXX-9821',
        document_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
        is_verified: true
      },
      {
        id: 'doc-002',
        document_type: 'driving_license',
        document_number: 'KA-05-2018-00912',
        document_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
        expiry_date: '2030-05-15',
        is_verified: true
      }
    ],
    rating: 4.9,
    review_count: 142,
    base_visit_charge: 399,
    current_lat: 12.9352,
    current_lng: 77.6245,
    city: 'Bengaluru',
    operating_hours: '24 Hours Emergency Dispatch',
    total_completed_jobs: 318,
    total_earnings: 128400,
    created_at: new Date(Date.now() - 120 * 86400000).toISOString()
  },
  {
    id: 'prov-002',
    user_id: 'usr-mech-002',
    name: 'Rajesh Patil',
    email: 'rajesh.patil@fixnow.in',
    phone: '+91 98444 55667',
    business_name: 'Speedy Tyres & Bike Roadside Assistance',
    provider_type: 'mechanic',
    skills: ['bike-breakdown', 'puncture-tyre', 'battery-jumpstart'],
    vehicle_specializations: ['Royal Enfield', 'Honda Activa', 'Yamaha', 'Bajaj', 'TVS'],
    service_radius_km: 15,
    is_available: true,
    is_verified: true,
    verification_status: 'verified',
    documents: [
      {
        id: 'doc-003',
        document_type: 'aadhaar',
        document_number: 'XXXX-XXXX-4422',
        document_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
        is_verified: true
      }
    ],
    rating: 4.8,
    review_count: 89,
    base_visit_charge: 249,
    current_lat: 12.9279,
    current_lng: 77.6271,
    city: 'Bengaluru',
    operating_hours: '06:00 AM - 11:30 PM',
    total_completed_jobs: 176,
    total_earnings: 64200,
    created_at: new Date(Date.now() - 90 * 86400000).toISOString()
  },
  {
    id: 'prov-003',
    user_id: 'usr-tech-001',
    name: 'Anand Kumar',
    email: DEMO_USERS.appliance_tech.email,
    phone: DEMO_USERS.appliance_tech.phone,
    business_name: 'CoolTech Appliances & HVAC Solutions',
    provider_type: 'appliance_tech',
    skills: ['refrigerator-repair', 'washing-machine-repair', 'air-conditioner-repair', 'microwave-repair'],
    appliance_specializations: ['Samsung', 'LG', 'Whirlpool', 'Daikin', 'Voltas', 'IFB', 'Bosch'],
    service_radius_km: 25,
    is_available: true,
    is_verified: true,
    verification_status: 'verified',
    documents: [
      {
        id: 'doc-004',
        document_type: 'trade_certificate',
        document_number: 'HVAC-CERT-2016-99',
        document_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
        is_verified: true
      }
    ],
    rating: 4.9,
    review_count: 210,
    base_visit_charge: 349,
    current_lat: 12.9412,
    current_lng: 77.6189,
    city: 'Bengaluru',
    operating_hours: '08:00 AM - 09:00 PM',
    total_completed_jobs: 442,
    total_earnings: 215000,
    created_at: new Date(Date.now() - 200 * 86400000).toISOString()
  },
  {
    id: 'prov-004',
    user_id: 'usr-fuel-001',
    name: 'SafeFuel Logistics (Authorized BPCL Fleet)',
    email: DEMO_USERS.fuel_partner.email,
    phone: DEMO_USERS.fuel_partner.phone,
    business_name: 'Bharat Petroleum Authorized SafeFuel Emergency Units',
    provider_type: 'fuel_partner',
    skills: ['emergency-diesel', 'emergency-petrol'],
    service_radius_km: 30,
    is_available: true,
    is_verified: true,
    verification_status: 'verified',
    documents: [
      {
        id: 'doc-005',
        document_type: 'peso_license',
        document_number: 'PESO/SC/2023/BLR-0892',
        document_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
        expiry_date: '2028-12-31',
        is_verified: true
      }
    ],
    rating: 5.0,
    review_count: 67,
    base_visit_charge: 250,
    current_lat: 12.9250,
    current_lng: 77.6320,
    city: 'Bengaluru',
    operating_hours: '24/7 PESO Certified On-Call Dispensing',
    total_completed_jobs: 145,
    total_earnings: 112000,
    created_at: new Date(Date.now() - 150 * 86400000).toISOString()
  },
  {
    id: 'prov-005',
    user_id: 'usr-mech-pending',
    name: 'Kiran Reddy',
    email: 'kiran.reddy@fixnow.in',
    phone: '+91 97333 88112',
    business_name: 'Kiran Motor Works',
    provider_type: 'mechanic',
    skills: ['car-breakdown', 'bike-breakdown'],
    service_radius_km: 15,
    is_available: false,
    is_verified: false,
    verification_status: 'pending',
    documents: [
      {
        id: 'doc-006',
        document_type: 'aadhaar',
        document_number: 'XXXX-XXXX-1199',
        document_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
        is_verified: false
      }
    ],
    rating: 0,
    review_count: 0,
    base_visit_charge: 299,
    current_lat: 12.9500,
    current_lng: 77.6500,
    city: 'Bengaluru',
    operating_hours: '09:00 AM - 08:00 PM',
    total_completed_jobs: 0,
    total_earnings: 0,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

const INITIAL_FUEL_AUTHORIZATIONS: FuelPartnerAuthorization[] = [
  {
    id: 'fuel-auth-001',
    provider_id: 'prov-004',
    company_name: 'SafeFuel Logistics Private Limited',
    peso_license_number: 'PESO/SC/2023/BLR-0892',
    license_expiry_date: '2028-12-31',
    authorized_fuel_types: ['diesel', 'petrol'],
    max_approved_quantity_liters: 20,
    approved_dispensing_vehicle_number: 'KA-01-MJ-9912 (PESO Fabricated)',
    status: 'active',
    safety_inspection_date: '2026-01-10',
    certified_by_authority: 'Petroleum and Explosives Safety Organisation (PESO) Southern Circle'
  }
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bkg-demo-101',
    booking_number: 'FXN-2026-101',
    customer_id: 'usr-customer-001',
    customer_name: 'Rahul Sharma',
    customer_phone: '+91 98765 43210',
    provider_id: 'prov-001',
    provider_name: 'Vikram Singh (Apex Auto Care)',
    provider_phone: '+91 98111 22334',
    provider_rating: 4.9,
    service_type: 'emergency_vehicle',
    category: 'battery-jumpstart',
    issue_title: 'Dead Battery & Car Jumpstart Needed',
    issue_description: 'Car battery completely drained after leaving headlights on. Unable to self-crank engine.',
    vehicle_details: {
      type: 'car',
      make: 'Hyundai',
      model: 'Creta SX (O)',
      license_plate: 'KA 05 MN 4821',
      fuel_type: 'petrol'
    },
    location: {
      address: 'Outer Ring Road, Near Bellandur Junction, Bengaluru',
      landmark: 'Opposite Shell Fuel Station, Service Road',
      city: 'Bengaluru',
      lat: 12.9304,
      lng: 77.6784,
      direction_of_travel: 'Heading towards Marathahalli'
    },
    status: 'PROVIDER_EN_ROUTE',
    status_history: [
      { status: 'REQUESTED', timestamp: new Date(Date.now() - 18 * 60000).toISOString(), note: 'Emergency broadcast initiated' },
      { status: 'SEARCHING', timestamp: new Date(Date.now() - 17 * 60000).toISOString(), note: 'Matching within 15km radius' },
      { status: 'PROVIDER_ASSIGNED', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), note: 'Assigned to Vikram Singh' },
      { status: 'PROVIDER_EN_ROUTE', timestamp: new Date(Date.now() - 12 * 60000).toISOString(), note: 'Provider departed shop with jump pack' }
    ],
    arrival_otp: '4829',
    completion_otp: '7391',
    is_arrival_verified: false,
    is_completion_verified: false,
    base_charge: 349,
    distance_charge: 60,
    emergency_surcharge: 100,
    parts_charge: 0,
    labour_charge: 0,
    fuel_charge: 0,
    discount: 0,
    gst_tax: 92,
    total_amount: 601,
    platform_commission: 76,
    provider_payout: 525,
    payment_status: 'authorized',
    payment_method: 'razorpay',
    payment_reference: 'pay_test_9829104812',
    issue_photos: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500'],
    completion_photos: [],
    estimated_arrival_minutes: 8,
    created_at: new Date(Date.now() - 18 * 60000).toISOString(),
    assigned_at: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: 'bkg-demo-102',
    booking_number: 'FXN-2026-102',
    customer_id: 'usr-customer-001',
    customer_name: 'Rahul Sharma',
    customer_phone: '+91 98765 43210',
    provider_id: 'prov-003',
    provider_name: 'Anand Kumar (CoolTech)',
    provider_phone: '+91 98222 33445',
    provider_rating: 4.9,
    service_type: 'appliance',
    category: 'refrigerator-repair',
    issue_title: 'Refrigerator Freezer Ice Accumulation & Cooling Loss',
    issue_description: 'Freezer is frosting heavily but lower compartment is warm. Suspected defrost sensor or thermostat issue.',
    appliance_details: {
      category: 'refrigerator',
      brand: 'Samsung',
      model_number: 'RT34T4513S8/HL'
    },
    location: {
      address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru',
      city: 'Bengaluru',
      lat: 12.9304,
      lng: 77.6784
    },
    status: 'QUOTE_PENDING',
    status_history: [
      { status: 'REQUESTED', timestamp: new Date(Date.now() - 80 * 60000).toISOString() },
      { status: 'PROVIDER_ASSIGNED', timestamp: new Date(Date.now() - 70 * 60000).toISOString() },
      { status: 'ARRIVED', timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
      { status: 'DIAGNOSING', timestamp: new Date(Date.now() - 25 * 60000).toISOString() },
      { status: 'QUOTE_PENDING', timestamp: new Date(Date.now() - 10 * 60000).toISOString() }
    ],
    arrival_otp: '3190',
    completion_otp: '8821',
    is_arrival_verified: true,
    is_completion_verified: false,
    base_charge: 349,
    distance_charge: 0,
    emergency_surcharge: 0,
    parts_charge: 850,
    labour_charge: 400,
    fuel_charge: 0,
    discount: 50,
    gst_tax: 278,
    total_amount: 1827,
    platform_commission: 112,
    provider_payout: 1715,
    payment_status: 'pending',
    issue_photos: [],
    completion_photos: [],
    quote: {
      id: 'quote-001',
      booking_id: 'bkg-demo-102',
      provider_id: 'prov-003',
      diagnosis_notes: 'Defrost heating element is open circuit. Defrost bi-metal thermostat needs replacement with genuine OEM Samsung part.',
      items: [
        { id: 'qi-1', description: 'Samsung OEM Defrost Heater & Bi-metal Sensor', type: 'part', unit_price: 850, quantity: 1, total: 850 },
        { id: 'qi-2', description: 'Diagnostic & Evaporator Disassembly Labour', type: 'labour', unit_price: 400, quantity: 1, total: 400 },
        { id: 'qi-3', description: 'Inspection & Visit Fee', type: 'visit_fee', unit_price: 349, quantity: 1, total: 349 }
      ],
      subtotal: 1599,
      gst_tax: 278,
      total_amount: 1827,
      estimated_completion_minutes: 45,
      warranty_days: 90,
      status: 'pending',
      created_at: new Date(Date.now() - 10 * 60000).toISOString()
    },
    created_at: new Date(Date.now() - 80 * 60000).toISOString(),
    assigned_at: new Date(Date.now() - 70 * 60000).toISOString(),
    arrived_at: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: 'bkg-demo-103',
    booking_number: 'FXN-2026-098',
    customer_id: 'usr-customer-001',
    customer_name: 'Rahul Sharma',
    customer_phone: '+91 98765 43210',
    provider_id: 'prov-004',
    provider_name: 'SafeFuel Logistics (BPCL Partner)',
    provider_phone: '+91 98333 44556',
    provider_rating: 5.0,
    service_type: 'emergency_fuel',
    category: 'emergency-diesel',
    issue_title: 'Emergency 10L Diesel Roadside Delivery',
    issue_description: 'Stranded on elevated flyover after low fuel sensor malfunction.',
    fuel_details: {
      fuel_type: 'diesel',
      quantity_liters: 10,
      authorized_container_verified: true,
      reason_for_emergency: 'Vehicle fuel gauge stalled at 1/4th tank; ran completely dry on highway.'
    },
    location: {
      address: 'Electronic City Phase 1 Toll Gate, Hosur Road, Bengaluru',
      city: 'Bengaluru',
      lat: 12.8452,
      lng: 77.6602
    },
    status: 'COMPLETED',
    status_history: [
      { status: 'REQUESTED', timestamp: new Date(Date.now() - 24 * 3600000).toISOString() },
      { status: 'PROVIDER_ASSIGNED', timestamp: new Date(Date.now() - 23.8 * 3600000).toISOString() },
      { status: 'ARRIVED', timestamp: new Date(Date.now() - 23.3 * 3600000).toISOString() },
      { status: 'COMPLETED', timestamp: new Date(Date.now() - 23.1 * 3600000).toISOString() }
    ],
    arrival_otp: '9182',
    completion_otp: '5540',
    is_arrival_verified: true,
    is_completion_verified: true,
    base_charge: 250,
    distance_charge: 120,
    emergency_surcharge: 100,
    parts_charge: 0,
    labour_charge: 0,
    fuel_charge: 945, // 10L * 94.50
    discount: 0,
    gst_tax: 255,
    total_amount: 1670,
    platform_commission: 70,
    provider_payout: 1600,
    payment_status: 'paid',
    payment_method: 'upi',
    payment_reference: 'upi_ref_9921827461',
    issue_photos: [],
    completion_photos: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500'],
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    completed_at: new Date(Date.now() - 23.1 * 3600000).toISOString()
  }
];

const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-001',
    ticket_number: 'TCK-2026-0041',
    user_id: 'usr-customer-001',
    user_name: 'Rahul Sharma',
    user_email: DEMO_USERS.customer.email,
    booking_id: 'bkg-demo-103',
    subject: 'Receipt & PESO Compliance Safety Certificate Copy',
    category: 'fuel_regulatory',
    priority: 'low',
    status: 'resolved',
    messages: [
      {
        sender: 'user',
        text: 'Hello, I received the 10L diesel delivery safely yesterday. Can I get the digital PESO compliance voucher for my vehicle company reimbursement?',
        timestamp: new Date(Date.now() - 20 * 3600000).toISOString()
      },
      {
        sender: 'support',
        text: 'Dear Rahul, your verified PESO batch transfer receipt has been attached to your booking record. You can download the PDF invoice directly from your booking details page.',
        timestamp: new Date(Date.now() - 19 * 3600000).toISOString()
      }
    ],
    created_at: new Date(Date.now() - 20 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 19 * 3600000).toISOString()
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    actor_id: 'usr-admin-001',
    actor_role: 'admin',
    action: 'PROVIDER_DOCUMENT_VERIFIED',
    target_resource: 'provider_profiles',
    target_id: 'prov-001',
    details: { business_name: 'Apex Auto Care', verified_docs: ['aadhaar', 'driving_license'] },
    timestamp: new Date(Date.now() - 40 * 86400000).toISOString()
  },
  {
    id: 'log-002',
    actor_id: 'usr-admin-001',
    actor_role: 'admin',
    action: 'PESO_LICENSE_APPROVED',
    target_resource: 'fuel_partner_authorizations',
    target_id: 'prov-004',
    details: { peso_license: 'PESO/SC/2023/BLR-0892', authorized_liters: 20 },
    timestamp: new Date(Date.now() - 35 * 86400000).toISOString()
  }
];

class FixNowStore {
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  private getItem<T>(key: string, fallback: T): T {
    if (!this.isClient) return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (!this.isClient) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set failed', e);
    }
  }

  // USER / SESSION
  getCurrentUser(): UserProfile {
    return this.getItem<UserProfile>(STORAGE_KEYS.CURRENT_USER, INITIAL_CURRENT_USER);
  }

  setCurrentUser(user: UserProfile): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  switchRole(role: UserRole): UserProfile {
    let targetUser: UserProfile;

    if (role === 'customer') {
      targetUser = {
        id: 'usr-customer-001',
        email: DEMO_USERS.customer.email,
        name: DEMO_USERS.customer.name,
        phone: DEMO_USERS.customer.phone,
        role: 'customer',
        created_at: new Date().toISOString()
      };
    } else if (role === 'mechanic') {
      targetUser = {
        id: 'usr-mech-001',
        email: DEMO_USERS.mechanic.email,
        name: DEMO_USERS.mechanic.name,
        phone: DEMO_USERS.mechanic.phone,
        role: 'mechanic',
        created_at: new Date().toISOString()
      };
    } else if (role === 'appliance_tech') {
      targetUser = {
        id: 'usr-tech-001',
        email: DEMO_USERS.appliance_tech.email,
        name: DEMO_USERS.appliance_tech.name,
        phone: DEMO_USERS.appliance_tech.phone,
        role: 'appliance_tech',
        created_at: new Date().toISOString()
      };
    } else if (role === 'fuel_partner') {
      targetUser = {
        id: 'usr-fuel-001',
        email: DEMO_USERS.fuel_partner.email,
        name: DEMO_USERS.fuel_partner.name,
        phone: DEMO_USERS.fuel_partner.phone,
        role: 'fuel_partner',
        created_at: new Date().toISOString()
      };
    } else {
      // admin
      targetUser = {
        id: 'usr-admin-001',
        email: DEMO_USERS.admin.email,
        name: DEMO_USERS.admin.name,
        phone: DEMO_USERS.admin.phone,
        role: 'admin',
        created_at: new Date().toISOString()
      };
    }

    this.setCurrentUser(targetUser);
    return targetUser;
  }

  // VEHICLES
  getVehicles(): Vehicle[] {
    return this.getItem<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
  }

  addVehicle(vehicle: Omit<Vehicle, 'id'>): Vehicle {
    const vehicles = this.getVehicles();
    const newVeh: Vehicle = {
      ...vehicle,
      id: `veh-${Date.now()}`
    };
    vehicles.push(newVeh);
    this.setItem(STORAGE_KEYS.VEHICLES, vehicles);
    return newVeh;
  }

  deleteVehicle(id: string): void {
    const vehicles = this.getVehicles().filter(v => v.id !== id);
    this.setItem(STORAGE_KEYS.VEHICLES, vehicles);
  }

  // APPLIANCES
  getAppliances(): Appliance[] {
    return this.getItem<Appliance[]>(STORAGE_KEYS.APPLIANCES, INITIAL_APPLIANCES);
  }

  addAppliance(appliance: Omit<Appliance, 'id'>): Appliance {
    const list = this.getAppliances();
    const newApp: Appliance = {
      ...appliance,
      id: `app-${Date.now()}`
    };
    list.push(newApp);
    this.setItem(STORAGE_KEYS.APPLIANCES, list);
    return newApp;
  }

  deleteAppliance(id: string): void {
    const list = this.getAppliances().filter(a => a.id !== id);
    this.setItem(STORAGE_KEYS.APPLIANCES, list);
  }

  // ADDRESSES
  getAddresses(): CustomerAddress[] {
    return this.getItem<CustomerAddress[]>(STORAGE_KEYS.ADDRESSES, INITIAL_ADDRESSES);
  }

  addAddress(addr: Omit<CustomerAddress, 'id'>): CustomerAddress {
    const list = this.getAddresses();
    const newAddr: CustomerAddress = {
      ...addr,
      id: `addr-${Date.now()}`
    };
    list.push(newAddr);
    this.setItem(STORAGE_KEYS.ADDRESSES, list);
    return newAddr;
  }

  // PROVIDERS
  getProviders(): ProviderProfile[] {
    return this.getItem<ProviderProfile[]>(STORAGE_KEYS.PROVIDERS, INITIAL_PROVIDERS);
  }

  getProviderById(id: string): ProviderProfile | undefined {
    return this.getProviders().find(p => p.id === id);
  }

  getProviderByUserId(userId: string): ProviderProfile | undefined {
    return this.getProviders().find(p => p.user_id === userId);
  }

  updateProvider(id: string, updates: Partial<ProviderProfile>): ProviderProfile | null {
    const list = this.getProviders();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    this.setItem(STORAGE_KEYS.PROVIDERS, list);
    return list[index];
  }

  toggleProviderAvailability(id: string): boolean {
    const provider = this.getProviderById(id);
    if (!provider) return false;
    const newStatus = !provider.is_available;
    this.updateProvider(id, { is_available: newStatus });
    return newStatus;
  }

  addProvider(provider: ProviderProfile): void {
    const list = this.getProviders();
    list.push(provider);
    this.setItem(STORAGE_KEYS.PROVIDERS, list);
  }

  // FUEL AUTHORIZATION
  getFuelAuthorizations(): FuelPartnerAuthorization[] {
    return this.getItem<FuelPartnerAuthorization[]>(STORAGE_KEYS.FUEL_AUTH, INITIAL_FUEL_AUTHORIZATIONS);
  }

  getFuelAuthByProviderId(providerId: string): FuelPartnerAuthorization | undefined {
    return this.getFuelAuthorizations().find(a => a.provider_id === providerId);
  }

  addFuelAuthorization(auth: FuelPartnerAuthorization): void {
    const list = this.getFuelAuthorizations();
    list.push(auth);
    this.setItem(STORAGE_KEYS.FUEL_AUTH, list);
  }

  updateFuelAuthorization(id: string, updates: Partial<FuelPartnerAuthorization>): void {
    const list = this.getFuelAuthorizations();
    const index = list.findIndex(a => a.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      this.setItem(STORAGE_KEYS.FUEL_AUTH, list);
    }
  }

  // BOOKINGS
  getBookings(): Booking[] {
    return this.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }

  getBookingById(id: string): Booking | undefined {
    return this.getBookings().find(b => b.id === id || b.booking_number === id);
  }

  createBooking(bookingData: Partial<Booking>): Booking {
    const bookings = this.getBookings();
    const randomOtp1 = Math.floor(1000 + Math.random() * 9000).toString();
    const randomOtp2 = Math.floor(1000 + Math.random() * 9000).toString();
    const bkgNumber = `FXN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newBooking: Booking = {
      id: `bkg-${Date.now()}`,
      booking_number: bkgNumber,
      customer_id: bookingData.customer_id || 'usr-customer-001',
      customer_name: bookingData.customer_name || 'Customer',
      customer_phone: bookingData.customer_phone || '+91 98765 43210',
      service_type: bookingData.service_type || 'emergency_vehicle',
      category: bookingData.category || 'car-breakdown',
      issue_title: bookingData.issue_title || 'Emergency Assistance Required',
      issue_description: bookingData.issue_description || '',
      vehicle_details: bookingData.vehicle_details,
      appliance_details: bookingData.appliance_details,
      fuel_details: bookingData.fuel_details,
      location: bookingData.location || {
        address: 'Current Location',
        city: 'Bengaluru',
        lat: 12.9352,
        lng: 77.6245
      },
      status: 'SEARCHING',
      status_history: [
        {
          status: 'REQUESTED',
          timestamp: new Date().toISOString(),
          note: 'Booking requested by customer'
        },
        {
          status: 'SEARCHING',
          timestamp: new Date().toISOString(),
          note: 'Searching nearest verified available technician'
        }
      ],
      arrival_otp: randomOtp1,
      completion_otp: randomOtp2,
      is_arrival_verified: false,
      is_completion_verified: false,
      base_charge: bookingData.base_charge || 349,
      distance_charge: bookingData.distance_charge || 0,
      emergency_surcharge: bookingData.emergency_surcharge || 0,
      parts_charge: 0,
      labour_charge: 0,
      fuel_charge: bookingData.fuel_charge || 0,
      discount: 0,
      gst_tax: bookingData.gst_tax || 63,
      total_amount: bookingData.total_amount || 412,
      platform_commission: bookingData.platform_commission || 52,
      provider_payout: bookingData.provider_payout || 360,
      payment_status: 'pending',
      payment_method: bookingData.payment_method || 'razorpay',
      issue_photos: bookingData.issue_photos || [],
      completion_photos: [],
      created_at: new Date().toISOString(),
      estimated_arrival_minutes: 15
    };

    bookings.unshift(newBooking);
    this.setItem(STORAGE_KEYS.BOOKINGS, bookings);
    return newBooking;
  }

  updateBookingStatus(
    id: string,
    newStatus: BookingStatus,
    note?: string,
    additionalData?: Partial<Booking>
  ): { success: boolean; booking?: Booking; error?: string } {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) {
      return { success: false, error: 'Booking not found' };
    }

    const currentBooking = bookings[index];
    
    // Validate state machine transition
    const allowed = ALLOWED_STATUS_TRANSITIONS[currentBooking.status] || [];
    if (!allowed.includes(newStatus)) {
      return {
        success: false,
        error: `Invalid transition from ${currentBooking.status} to ${newStatus}. Allowed next states: ${allowed.join(', ')}`
      };
    }

    const updatedHistory = [
      ...currentBooking.status_history,
      {
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: note || `Status updated to ${newStatus}`
      }
    ];

    const updatedBooking: Booking = {
      ...currentBooking,
      status: newStatus,
      status_history: updatedHistory,
      ...additionalData
    };

    if (newStatus === 'ARRIVED') {
      updatedBooking.arrived_at = new Date().toISOString();
    } else if (newStatus === 'COMPLETED') {
      updatedBooking.completed_at = new Date().toISOString();
      if (updatedBooking.payment_status === 'pending') {
        updatedBooking.payment_status = 'paid';
      }
    } else if (newStatus === 'CANCELLED') {
      updatedBooking.cancelled_at = new Date().toISOString();
      updatedBooking.cancellation_reason = note || 'Cancelled by user';
    }

    bookings[index] = updatedBooking;
    this.setItem(STORAGE_KEYS.BOOKINGS, bookings);
    return { success: true, booking: updatedBooking };
  }

  verifyArrivalOtp(bookingId: string, otp: string): boolean {
    const booking = this.getBookingById(bookingId);
    if (!booking) return false;
    if (booking.arrival_otp.trim() === otp.trim()) {
      this.updateBookingStatus(bookingId, 'ARRIVED', 'Arrival OTP verified by customer', {
        is_arrival_verified: true
      });
      return true;
    }
    return false;
  }

  verifyCompletionOtp(bookingId: string, otp: string): boolean {
    const booking = this.getBookingById(bookingId);
    if (!booking) return false;
    if (booking.completion_otp.trim() === otp.trim()) {
      this.updateBookingStatus(bookingId, 'COMPLETED', 'Completion OTP verified by customer', {
        is_completion_verified: true
      });
      return true;
    }
    return false;
  }

  submitServiceQuote(bookingId: string, quote: ServiceQuote): boolean {
    const booking = this.getBookingById(bookingId);
    if (!booking) return false;
    
    // Update booking with the quote and calculate revised totals
    const result = this.updateBookingStatus(bookingId, 'QUOTE_PENDING', 'Technician submitted service estimate for customer approval', {
      quote,
      parts_charge: quote.items.filter(i => i.type === 'part').reduce((sum, i) => sum + i.total, 0),
      labour_charge: quote.items.filter(i => i.type === 'labour').reduce((sum, i) => sum + i.total, 0),
      total_amount: quote.total_amount,
      gst_tax: quote.gst_tax
    });

    return result.success;
  }

  approveQuote(bookingId: string): boolean {
    const booking = this.getBookingById(bookingId);
    if (!booking || !booking.quote) return false;

    booking.quote.status = 'approved';
    const result = this.updateBookingStatus(bookingId, 'QUOTE_APPROVED', 'Customer approved the repair quote. Work beginning.', {
      quote: booking.quote
    });

    return result.success;
  }

  // SUPPORT TICKETS
  getSupportTickets(): SupportTicket[] {
    return this.getItem<SupportTicket[]>(STORAGE_KEYS.SUPPORT_TICKETS, INITIAL_SUPPORT_TICKETS);
  }

  createSupportTicket(ticket: Partial<SupportTicket>): SupportTicket {
    const tickets = this.getSupportTickets();
    const newTkt: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticket_number: `TCK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      user_id: ticket.user_id || 'usr-customer-001',
      user_name: ticket.user_name || 'Rahul Sharma',
      user_email: ticket.user_email || DEMO_USERS.customer.email,
      booking_id: ticket.booking_id,
      subject: ticket.subject || 'Help Request',
      category: ticket.category || 'booking',
      priority: ticket.priority || 'medium',
      status: 'open',
      messages: ticket.messages || [
        {
          sender: 'user',
          text: ticket.subject || '',
          timestamp: new Date().toISOString()
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    tickets.unshift(newTkt);
    this.setItem(STORAGE_KEYS.SUPPORT_TICKETS, tickets);
    return newTkt;
  }

  // AUDIT LOGS
  getAuditLogs(): AuditLog[] {
    return this.getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const entry: AuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    logs.unshift(entry);
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
  }
}

export const fixNowStore = new FixNowStore();
