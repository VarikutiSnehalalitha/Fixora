import { FuelPartnerAuthorization } from '@/types';
import { PESO_REGULATIONS } from './constants';

export interface FuelValidationResult {
  isCompliant: boolean;
  legalQuantityAllowed: number;
  warnings: string[];
  requiresSpecialCanister: boolean;
  complianceRuleReference: string;
}

export function validateFuelRequest(
  fuelType: 'petrol' | 'diesel',
  requestedQuantityLiters: number,
  vehicleType: string
): FuelValidationResult {
  const warnings: string[] = [];
  let isCompliant = true;
  let legalQuantityAllowed = requestedQuantityLiters;
  let requiresSpecialCanister = false;

  if (fuelType === 'petrol') {
    requiresSpecialCanister = true;
    if (requestedQuantityLiters > PESO_REGULATIONS.PETROL_MAX_DELIVERY_LITERS) {
      isCompliant = false;
      warnings.push(
        `PESO Regulation 2002 restricts emergency roadside petrol to a maximum of ${PESO_REGULATIONS.PETROL_MAX_DELIVERY_LITERS} Litres (Class-A petroleum, highly inflammable flashpoint <23°C). Delivery must use a sealed PESO-certified safety canister.`
      );
      legalQuantityAllowed = PESO_REGULATIONS.PETROL_MAX_DELIVERY_LITERS;
    }
  } else if (fuelType === 'diesel') {
    if (requestedQuantityLiters > PESO_REGULATIONS.DIESEL_MAX_DELIVERY_LITERS) {
      isCompliant = false;
      warnings.push(
        `Emergency roadside diesel assistance is capped at ${PESO_REGULATIONS.DIESEL_MAX_DELIVERY_LITERS} Litres per incident under Petroleum Rules 130 to prevent unauthorized wholesale distribution.`
      );
      legalQuantityAllowed = PESO_REGULATIONS.DIESEL_MAX_DELIVERY_LITERS;
    }
  }

  // Commercial / heavy vehicle check
  if (vehicleType.toLowerCase().includes('truck') || vehicleType.toLowerCase().includes('bus')) {
    warnings.push("Heavy commercial vehicles are advised to arrange designated PESO-certified bowsers directly if total tank capacity exceeds 50 Litres.");
  }

  return {
    isCompliant,
    legalQuantityAllowed,
    warnings,
    requiresSpecialCanister,
    complianceRuleReference: 'The Petroleum Rules, 2002 — Rules 130 to 145 & PESO Circular Ref. P-11018/2020'
  };
}

export function verifyFuelPartnerAuthorization(
  auth: FuelPartnerAuthorization | null | undefined
): { isValid: boolean; reason?: string } {
  if (!auth) {
    return { isValid: false, reason: "No PESO authorization records found for this partner." };
  }

  if (auth.status !== 'active') {
    return { isValid: false, reason: `Partner PESO authorization is currently ${auth.status}.` };
  }

  const expiry = new Date(auth.license_expiry_date);
  if (expiry < new Date()) {
    return { isValid: false, reason: `PESO safety license expired on ${auth.license_expiry_date}. Service dispatch blocked.` };
  }

  if (!auth.peso_license_number || auth.peso_license_number.trim() === '') {
    return { isValid: false, reason: "Invalid PESO license registration code." };
  }

  return { isValid: true };
}

// Fallback: Nearby authorized fuel stations for emergency when mobile delivery is not permitted or unavailable
export const NEARBY_AUTHORIZED_PETROL_PUMPS = [
  {
    name: 'Indian Oil Retail Outlet (COCO)',
    brand: 'IOCL',
    address: 'Outer Ring Road, Near Bellandur Junction, Bengaluru',
    lat: 12.9304,
    lng: 77.6784,
    isOpen24Hours: true,
    distanceKm: 2.1,
    contactNumber: '+91 80 2574 1200'
  },
  {
    name: 'Bharat Petroleum Highway Auto Care',
    brand: 'BPCL',
    address: 'Hosur Road, Singasandra, Bengaluru',
    lat: 12.8791,
    lng: 77.6433,
    isOpen24Hours: true,
    distanceKm: 3.8,
    contactNumber: '+91 80 2574 3400'
  },
  {
    name: 'Hindustan Petroleum Super Station',
    brand: 'HPCL',
    address: '100 Feet Road, Indiranagar, Bengaluru',
    lat: 12.9719,
    lng: 77.6412,
    isOpen24Hours: true,
    distanceKm: 4.2,
    contactNumber: '+91 80 2520 8899'
  }
];
