import { BookingStatus } from '@/types';

export const APP_NAME = "FixNow 24/7";
export const APP_TAGLINE = "Instant Roadside Assistance, Vehicle Mechanics & Home Appliance Repairs";
export const CURRENCY = "₹";

export const GST_RATE = 0.18; // 18% GST in India
export const PLATFORM_COMMISSION_RATE = 0.15; // 15% platform commission

// Petroleum & Explosives Safety Organisation (PESO) Regulatory Limits
export const PESO_REGULATIONS = {
  DIESEL_MAX_DELIVERY_LITERS: 20, // Emergency roadside delivery limit in PESO-approved containers
  PETROL_MAX_DELIVERY_LITERS: 5,  // Highly restricted Class A petroleum
  PETROL_REQUIRES_SEALED_CAN: true,
  DIESEL_BASE_PRICE_PER_LITER: 94.50,
  PETROL_BASE_PRICE_PER_LITER: 104.20,
  HAZARDOUS_DELIVERY_SURCHARGE: 250, // Mandatory certified transport charge
  STATUTORY_WARNING: "Under Rule 130 of the Petroleum Rules 2002, fuel delivery is restricted to certified emergency roadside assistance via PESO-authorized mobile units and PESO-approved containers only. Commercial resale without license is strictly punishable by law."
};

export const SERVICE_CATEGORIES = {
  VEHICLE: [
    {
      id: 'car-breakdown',
      title: 'Car Breakdown & Mechanical',
      icon: 'Wrench',
      description: 'Engine stalling, clutch failure, belt issues, coolant leaks',
      basePrice: 499,
      type: 'emergency_vehicle'
    },
    {
      id: 'bike-breakdown',
      title: 'Bike & Scooter Breakdown',
      icon: 'Bike',
      description: 'Starting trouble, chain breakdown, spark plug, brake issues',
      basePrice: 299,
      type: 'emergency_vehicle'
    },
    {
      id: 'puncture-tyre',
      title: 'Flat Tyre & Puncture Repair',
      icon: 'Disc',
      description: 'Tubeless puncture plug, tube change, spare wheel replacement',
      basePrice: 249,
      type: 'emergency_vehicle'
    },
    {
      id: 'battery-jumpstart',
      title: 'Battery Jump-Start & Replacement',
      icon: 'Zap',
      description: 'Instant booster cable jumpstart, voltage testing, on-site battery replacement',
      basePrice: 349,
      type: 'emergency_vehicle'
    },
    {
      id: 'towing-recovery',
      title: 'Flatbed & Hydraulic Towing',
      icon: 'Truck',
      description: 'Safe towing to authorized service center or residence',
      basePrice: 999,
      type: 'towing'
    },
    {
      id: 'key-lockout',
      title: 'Car Key Lockout Assistance',
      icon: 'Key',
      description: 'Non-destructive door lock opening with identity verification',
      basePrice: 599,
      type: 'emergency_vehicle'
    },
    {
      id: 'ev-charging-support',
      title: 'EV Urgent Mobile Fast Boost',
      icon: 'BatteryCharging',
      description: 'Mobile EV charger rescue boost to reach the nearest charging station',
      basePrice: 799,
      type: 'emergency_vehicle'
    }
  ],
  APPLIANCE: [
    {
      id: 'refrigerator-repair',
      title: 'Refrigerator & Deep Freezer',
      icon: 'Snowflake',
      description: 'Not cooling, gas charging, thermostat, compressor failure',
      basePrice: 349,
      type: 'appliance'
    },
    {
      id: 'washing-machine-repair',
      title: 'Washing Machine (Front/Top Load)',
      icon: 'RotateCw',
      description: 'Drainage error, drum vibration, PCB board fault, motor replacement',
      basePrice: 349,
      type: 'appliance'
    },
    {
      id: 'air-conditioner-repair',
      title: 'AC Service & Repair (Split/Window)',
      icon: 'Wind',
      description: 'Gas leakage, cooling coil, jet clean service, capacitor change',
      basePrice: 449,
      type: 'appliance'
    },
    {
      id: 'television-repair',
      title: 'Smart LED/OLED TV Repair',
      icon: 'Tv',
      description: 'Screen display issue, sound problem, backlight repair, motherboard fix',
      basePrice: 399,
      type: 'appliance'
    },
    {
      id: 'microwave-repair',
      title: 'Microwave & Oven Servicing',
      icon: 'Flame',
      description: 'Magnetron failure, turntable motor, touch panel malfunction',
      basePrice: 299,
      type: 'appliance'
    },
    {
      id: 'water-purifier-repair',
      title: 'RO & UV Water Purifier',
      icon: 'Droplets',
      description: 'Filter replacement, membrane choke, pump leakage, TDS calibration',
      basePrice: 299,
      type: 'appliance'
    }
  ],
  FUEL: [
    {
      id: 'emergency-diesel',
      title: 'Emergency Roadside Diesel Supply',
      icon: 'Fuel',
      description: 'PESO-authorized sealed container delivery (5L, 10L, 20L) for stranded vehicles',
      basePrice: 250,
      type: 'emergency_fuel'
    },
    {
      id: 'emergency-petrol',
      title: 'Emergency Roadside Petrol Supply',
      icon: 'Fuel',
      description: 'PESO Class-A safety canister supply (Max 5L emergency top-up only)',
      basePrice: 300,
      type: 'emergency_fuel'
    }
  ]
};

// Legal state transitions for booking state machine
export const ALLOWED_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  REQUESTED: ['SEARCHING', 'CANCELLED'],
  SEARCHING: ['PROVIDER_ASSIGNED', 'NO_PROVIDER_AVAILABLE', 'CANCELLED'],
  PROVIDER_ASSIGNED: ['PROVIDER_EN_ROUTE', 'CANCELLED', 'SEARCHING'],
  PROVIDER_EN_ROUTE: ['ARRIVED', 'CANCELLED'],
  ARRIVED: ['DIAGNOSING', 'CANCELLED'],
  DIAGNOSING: ['QUOTE_PENDING', 'IN_PROGRESS', 'CANCELLED'],
  QUOTE_PENDING: ['QUOTE_APPROVED', 'CANCELLED'],
  QUOTE_APPROVED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'DISPUTED'],
  COMPLETED: ['DISPUTED'],
  CANCELLED: ['REFUND_PENDING'],
  NO_PROVIDER_AVAILABLE: ['SEARCHING', 'CANCELLED'],
  DISPUTED: ['REFUND_PENDING', 'COMPLETED'],
  REFUND_PENDING: ['REFUNDED'],
  REFUNDED: []
};

// Major Indian cities and default coordinates
export const POPULAR_LOCATIONS = [
  { name: 'Bengaluru (Koramangala/Indiranagar)', lat: 12.9352, lng: 77.6245 },
  { name: 'Mumbai (Andheri/Bandra)', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi NCR (Gurugram/Noida/South Delhi)', lat: 28.6139, lng: 77.2090 },
  { name: 'Hyderabad (Hitec City/Gachibowli)', lat: 17.3850, lng: 78.4867 },
  { name: 'Pune (Kothrud/Viman Nagar)', lat: 18.5204, lng: 73.8567 },
  { name: 'Chennai (Anna Nagar/OMR)', lat: 13.0827, lng: 80.2707 }
];

export const DEMO_USERS = {
  customer: {
    email: 'customer@fixnow.in',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    role: 'customer' as const,
    city: 'Bengaluru'
  },
  mechanic: {
    email: 'mechanic@fixnow.in',
    name: 'Vikram Singh (Apex Auto Care)',
    phone: '+91 98111 22334',
    role: 'mechanic' as const,
    city: 'Bengaluru'
  },
  appliance_tech: {
    email: 'technician@fixnow.in',
    name: 'Anand Kumar (CoolTech Appliances)',
    phone: '+91 98222 33445',
    role: 'appliance_tech' as const,
    city: 'Bengaluru'
  },
  fuel_partner: {
    email: 'fuel@fixnow.in',
    name: 'Bharat Petroleum Certified Delivery (SafeFuel Logistics)',
    phone: '+91 98333 44556',
    role: 'fuel_partner' as const,
    city: 'Bengaluru'
  },
  admin: {
    email: 'admin@fixnow.in',
    name: 'FixNow Operations Administrator',
    phone: '+91 99000 11223',
    role: 'admin' as const,
    city: 'Bengaluru'
  }
};
