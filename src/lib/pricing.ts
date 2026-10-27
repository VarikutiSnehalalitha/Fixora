import { GST_RATE, PLATFORM_COMMISSION_RATE, PESO_REGULATIONS } from './constants';

export interface PricingInput {
  serviceType: string;
  categoryBasePrice: number;
  distanceKm: number;
  isNightTime?: boolean;
  isEmergency?: boolean;
  fuelType?: 'petrol' | 'diesel';
  fuelQuantityLiters?: number;
  partsTotal?: number;
  labourTotal?: number;
  towingKm?: number;
}

export interface PricingBreakdown {
  baseCharge: number;
  distanceCharge: number;
  emergencySurcharge: number;
  nightSurcharge: number;
  fuelCharge: number;
  towingCharge: number;
  partsCharge: number;
  labourCharge: number;
  subtotal: number;
  gstTax: number;
  totalAmount: number;
  platformCommission: number;
  providerPayout: number;
}

export function calculatePricing(input: PricingInput): PricingBreakdown {
  const baseCharge = Math.max(0, input.categoryBasePrice);
  
  // Distance charge: First 3 km covered in base, ₹20 per km beyond 3 km
  const extraKm = Math.max(0, input.distanceKm - 3);
  const distanceCharge = Math.round(extraKm * 20);

  // Night surcharge: 10 PM to 6 AM (or if flag passed)
  const isNight = input.isNightTime ?? checkIsNightTime();
  const nightSurcharge = isNight ? 150 : 0;

  // Emergency instant dispatch priority fee
  const emergencySurcharge = input.isEmergency ? 100 : 0;

  // Fuel calculation (PESO compliant)
  let fuelCharge = 0;
  if (input.fuelType && input.fuelQuantityLiters) {
    const rate = input.fuelType === 'diesel' 
      ? PESO_REGULATIONS.DIESEL_BASE_PRICE_PER_LITER 
      : PESO_REGULATIONS.PETROL_BASE_PRICE_PER_LITER;
    
    // Delivery & hazardous safety certified handling
    fuelCharge = Math.round((input.fuelQuantityLiters * rate) + PESO_REGULATIONS.HAZARDOUS_DELIVERY_SURCHARGE);
  }

  // Towing charge
  let towingCharge = 0;
  if (input.serviceType === 'towing' && input.towingKm) {
    // ₹999 base covers 5km, ₹40/km thereafter
    const extraTowingKm = Math.max(0, input.towingKm - 5);
    towingCharge = Math.round(extraTowingKm * 40);
  }

  const partsCharge = Math.max(0, input.partsTotal || 0);
  const labourCharge = Math.max(0, input.labourTotal || 0);

  const subtotal = 
    baseCharge + 
    distanceCharge + 
    emergencySurcharge + 
    nightSurcharge + 
    fuelCharge + 
    towingCharge + 
    partsCharge + 
    labourCharge;

  const gstTax = Math.round(subtotal * GST_RATE);
  const totalAmount = subtotal + gstTax;

  // Platform commission is 15% on service/labour/base/distance (excluding raw parts/fuel cost pass-through)
  const commissionableAmount = baseCharge + distanceCharge + emergencySurcharge + nightSurcharge + labourCharge;
  const platformCommission = Math.round(commissionableAmount * PLATFORM_COMMISSION_RATE);
  const providerPayout = totalAmount - platformCommission;

  return {
    baseCharge,
    distanceCharge,
    emergencySurcharge,
    nightSurcharge,
    fuelCharge,
    towingCharge,
    partsCharge,
    labourCharge,
    subtotal,
    gstTax,
    totalAmount,
    platformCommission,
    providerPayout
  };
}

export function checkIsNightTime(): boolean {
  const hour = new Date().getHours();
  return hour >= 22 || hour < 6;
}
