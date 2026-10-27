import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import { calculatePricing } from '../lib/pricing';
import { calculateHaversineDistance, estimateTravelMinutes, findAndRankProviders } from '../lib/dispatch';
import { validateFuelRequest, verifyFuelPartnerAuthorization } from '../lib/fuel-compliance';
import { ALLOWED_STATUS_TRANSITIONS, PESO_REGULATIONS } from '../lib/constants';
import { ProviderProfile, BookingStatus } from '../types';

describe('FixNow 24/7 Platform Core Architecture Tests', () => {
  // 1. PRICING ENGINE
  test('Pricing engine calculates base, distance, GST and commission correctly', () => {
    const input = {
      serviceType: 'emergency_vehicle',
      categoryBasePrice: 499,
      distanceKm: 8, // 3 km free, 5 km extra * ₹20 = ₹100
      isNightTime: false,
      isEmergency: false,
      partsTotal: 500,
      labourTotal: 300
    };

    const result = calculatePricing(input);

    assert.equal(result.baseCharge, 499);
    assert.equal(result.distanceCharge, 100);
    assert.equal(result.nightSurcharge, 0);
    assert.equal(result.partsCharge, 500);
    assert.equal(result.labourCharge, 300);

    // subtotal = 499 + 100 + 500 + 300 = 1399
    assert.equal(result.subtotal, 1399);

    // GST = 18% of 1399 = 251.82 -> Math.round is 252
    assert.equal(result.gstTax, 252);
    assert.equal(result.totalAmount, 1399 + 252);

    // Platform commission is 15% on (base 499 + dist 100 + labour 300 = 899) = 134.85 -> Math.round is 135
    assert.equal(result.platformCommission, 135);
    assert.equal(result.providerPayout, result.totalAmount - result.platformCommission);
  });

  test('Pricing applies night surcharge between 10 PM and 6 AM', () => {
    const result = calculatePricing({
      serviceType: 'emergency_vehicle',
      categoryBasePrice: 349,
      distanceKm: 2,
      isNightTime: true,
      isEmergency: true
    });

    assert.equal(result.nightSurcharge, 150);
    assert.equal(result.emergencySurcharge, 100);
    assert.ok(result.totalAmount > result.subtotal);
  });

  // 2. STATE MACHINE TRANSITIONS
  test('State machine permits valid progressive workflow', () => {
    const validNextStates = ALLOWED_STATUS_TRANSITIONS['REQUESTED'];
    assert.ok(validNextStates.includes('SEARCHING'));
    assert.ok(validNextStates.includes('CANCELLED'));

    assert.ok(ALLOWED_STATUS_TRANSITIONS['SEARCHING'].includes('PROVIDER_ASSIGNED'));
    assert.ok(ALLOWED_STATUS_TRANSITIONS['PROVIDER_ASSIGNED'].includes('PROVIDER_EN_ROUTE'));
    assert.ok(ALLOWED_STATUS_TRANSITIONS['PROVIDER_EN_ROUTE'].includes('ARRIVED'));
    assert.ok(ALLOWED_STATUS_TRANSITIONS['ARRIVED'].includes('DIAGNOSING'));
    assert.ok(ALLOWED_STATUS_TRANSITIONS['DIAGNOSING'].includes('QUOTE_PENDING'));
    assert.ok(ALLOWED_STATUS_TRANSITIONS['QUOTE_PENDING'].includes('QUOTE_APPROVED'));
    assert.ok(ALLOWED_STATUS_TRANSITIONS['QUOTE_APPROVED'].includes('IN_PROGRESS'));
    assert.ok(ALLOWED_STATUS_TRANSITIONS['IN_PROGRESS'].includes('COMPLETED'));
  });

  test('State machine rejects illegal status skips', () => {
    // Should never allow jumping directly from REQUESTED to COMPLETED
    const allowed = ALLOWED_STATUS_TRANSITIONS['REQUESTED'];
    assert.equal(allowed.includes('COMPLETED'), false);
    assert.equal(allowed.includes('IN_PROGRESS'), false);
  });

  // 3. GEOLOCATION & DISPATCH ENGINE
  test('Haversine distance calculation is accurate within expected bounds', () => {
    // Distance between Bellandur (12.9304, 77.6784) and Koramangala (12.9352, 77.6245) is ~5.8 km
    const dist = calculateHaversineDistance(12.9304, 77.6784, 12.9352, 77.6245);
    assert.ok(dist >= 5.0 && dist <= 6.5, `Calculated distance ${dist} should be ~5.8 km`);
  });

  test('Travel time estimate includes realistic traffic buffer', () => {
    const timeFor5Km = estimateTravelMinutes(5);
    assert.ok(timeFor5Km >= 15 && timeFor5Km <= 30);
  });

  test('Dispatch ranking filters unverified or busy providers', () => {
    const mockProviders: ProviderProfile[] = [
      {
        id: 'p1',
        user_id: 'u1',
        name: 'Verified Mechanic',
        email: 'v@mech.in',
        phone: '+919999999999',
        business_name: 'Fast Auto',
        provider_type: 'mechanic',
        skills: ['car-breakdown'],
        service_radius_km: 15,
        is_available: true,
        is_verified: true,
        verification_status: 'verified',
        documents: [],
        rating: 4.9,
        review_count: 50,
        base_visit_charge: 349,
        current_lat: 12.9320,
        current_lng: 77.6700,
        city: 'Bengaluru',
        operating_hours: '24/7',
        total_completed_jobs: 100,
        total_earnings: 50000,
        created_at: new Date().toISOString()
      },
      {
        id: 'p2',
        user_id: 'u2',
        name: 'Unverified Mechanic',
        email: 'uv@mech.in',
        phone: '+918888888888',
        business_name: 'Slow Auto',
        provider_type: 'mechanic',
        skills: ['car-breakdown'],
        service_radius_km: 15,
        is_available: true,
        is_verified: false, // NOT VERIFIED
        verification_status: 'pending',
        documents: [],
        rating: 4.0,
        review_count: 5,
        base_visit_charge: 299,
        current_lat: 12.9304,
        current_lng: 77.6784,
        city: 'Bengaluru',
        operating_hours: '24/7',
        total_completed_jobs: 0,
        total_earnings: 0,
        created_at: new Date().toISOString()
      }
    ];

    const candidates = findAndRankProviders(mockProviders, {
      customerLat: 12.9304,
      customerLng: 77.6784,
      requiredType: 'mechanic',
      requiredSkill: 'car-breakdown'
    });

    // Only p1 should be matched
    assert.equal(candidates.length, 1);
    assert.equal(candidates[0].provider.id, 'p1');
  });

  // 4. PESO FUEL COMPLIANCE & SAFETY REQUIREMENTS
  test('Fuel validation strictly caps Petrol at 5L maximum under PESO rules', () => {
    // 5L is compliant
    const validCheck = validateFuelRequest('petrol', 5, 'car');
    assert.equal(validCheck.isCompliant, true);
    assert.equal(validCheck.requiresSpecialCanister, true);

    // 10L petrol is ILLEGAL under Rule 130
    const invalidCheck = validateFuelRequest('petrol', 10, 'car');
    assert.equal(invalidCheck.isCompliant, false);
    assert.equal(invalidCheck.legalQuantityAllowed, 5);
    assert.ok(invalidCheck.warnings.length > 0);
  });

  test('Fuel validation caps roadside Diesel at 20L maximum', () => {
    const validDiesel = validateFuelRequest('diesel', 20, 'suv');
    assert.equal(validDiesel.isCompliant, true);

    const invalidDiesel = validateFuelRequest('diesel', 50, 'suv');
    assert.equal(invalidDiesel.isCompliant, false);
    assert.equal(invalidDiesel.legalQuantityAllowed, 20);
  });

  test('PESO authorization verification blocks expired or suspended licenses', () => {
    const activeAuth = {
      id: 'auth1',
      provider_id: 'prov1',
      company_name: 'SafeFuel',
      peso_license_number: 'PESO-2024-VALID',
      license_expiry_date: '2028-12-31',
      authorized_fuel_types: ['diesel' as const],
      max_approved_quantity_liters: 20,
      approved_dispensing_vehicle_number: 'KA-01-9999',
      status: 'active' as const,
      safety_inspection_date: '2026-01-01',
      certified_by_authority: 'PESO'
    };
    assert.equal(verifyFuelPartnerAuthorization(activeAuth).isValid, true);

    // Expired license check
    const expiredAuth = {
      ...activeAuth,
      license_expiry_date: '2020-01-01'
    };
    const expiredCheck = verifyFuelPartnerAuthorization(expiredAuth);
    assert.equal(expiredCheck.isValid, false);
    assert.ok(expiredCheck.reason?.includes('expired'));
  });
});
