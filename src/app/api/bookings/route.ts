import { NextResponse } from 'next/server';
import { fixNowStore } from '@/lib/store';
import { calculatePricing } from '@/lib/pricing';
import { findAndRankProviders } from '@/lib/dispatch';
import { validateFuelRequest } from '@/lib/fuel-compliance';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const providerId = searchParams.get('providerId');
    const status = searchParams.get('status');

    let bookings = fixNowStore.getBookings();

    if (customerId) {
      bookings = bookings.filter(b => b.customer_id === customerId);
    }
    if (providerId) {
      bookings = bookings.filter(b => b.provider_id === providerId);
    }
    if (status) {
      bookings = bookings.filter(b => b.status === status);
    }

    return NextResponse.json({ success: true, count: bookings.length, bookings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerId,
      customerName,
      customerPhone,
      serviceType,
      category,
      issueTitle,
      issueDescription,
      location,
      vehicleDetails,
      applianceDetails,
      fuelDetails,
      basePrice = 349,
      distanceKm = 4
    } = body;

    if (!serviceType || !issueTitle || !location?.lat || !location?.lng) {
      return NextResponse.json(
        { success: false, error: 'Missing required booking attributes (serviceType, issueTitle, GPS coordinates)' },
        { status: 400 }
      );
    }

    // Regulated fuel validation if applicable
    if (serviceType === 'emergency_fuel') {
      if (!fuelDetails?.fuel_type || !fuelDetails?.quantity_liters) {
        return NextResponse.json(
          { success: false, error: 'Fuel type and quantity in litres are required for fuel assistance' },
          { status: 400 }
        );
      }

      const compliance = validateFuelRequest(
        fuelDetails.fuel_type,
        fuelDetails.quantity_liters,
        vehicleDetails?.type || 'car'
      );

      if (!compliance.isCompliant) {
        return NextResponse.json(
          { 
            success: false, 
            error: compliance.warnings[0] || 'Fuel request exceeds statutory PESO safety limitations',
            compliance
          },
          { status: 422 }
        );
      }
    }

    // Calculate pricing breakdown
    const pricing = calculatePricing({
      serviceType,
      categoryBasePrice: Number(basePrice),
      distanceKm: Number(distanceKm),
      fuelType: fuelDetails?.fuel_type,
      fuelQuantityLiters: fuelDetails?.quantity_liters,
      isEmergency: serviceType === 'emergency_vehicle' || serviceType === 'emergency_fuel'
    });

    // Create booking in database/store
    const newBooking = fixNowStore.createBooking({
      customer_id: customerId || 'usr-customer-001',
      customer_name: customerName || 'Rahul Sharma',
      customer_phone: customerPhone || '+91 98765 43210',
      service_type: serviceType,
      category,
      issue_title: issueTitle,
      issue_description: issueDescription || '',
      location,
      vehicle_details: vehicleDetails,
      appliance_details: applianceDetails,
      fuel_details: fuelDetails,
      base_charge: pricing.baseCharge,
      distance_charge: pricing.distanceCharge,
      emergency_surcharge: pricing.emergencySurcharge,
      fuel_charge: pricing.fuelCharge,
      gst_tax: pricing.gstTax,
      total_amount: pricing.totalAmount,
      platform_commission: pricing.platformCommission,
      provider_payout: pricing.providerPayout
    });

    // Automatically trigger dispatch ranking
    const requiredType =
      serviceType === 'emergency_fuel'
        ? 'fuel_partner'
        : serviceType === 'appliance'
        ? 'appliance_tech'
        : 'mechanic';

    const candidates = findAndRankProviders(fixNowStore.getProviders(), {
      customerLat: location.lat,
      customerLng: location.lng,
      requiredType,
      requiredSkill: category
    });

    // If top candidate exists, assign immediately
    if (candidates.length > 0) {
      const topMatch = candidates[0];
      fixNowStore.updateBookingStatus(
        newBooking.id,
        'PROVIDER_ASSIGNED',
        `Assigned to verified specialist ${topMatch.provider.name} (${topMatch.distanceKm} km away)`,
        {
          provider_id: topMatch.provider.id,
          provider_name: topMatch.provider.name,
          provider_phone: topMatch.provider.phone,
          provider_rating: topMatch.provider.rating,
          estimated_arrival_minutes: topMatch.estimatedArrivalMinutes
        }
      );
    }

    // Fetch refreshed booking
    const finalized = fixNowStore.getBookingById(newBooking.id);

    return NextResponse.json({
      success: true,
      booking: finalized,
      dispatchCandidatesCount: candidates.length
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
