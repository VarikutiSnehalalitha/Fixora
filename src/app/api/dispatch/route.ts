import { NextResponse } from 'next/server';
import { fixNowStore } from '@/lib/store';
import { findAndRankProviders } from '@/lib/dispatch';
import { verifyFuelPartnerAuthorization } from '@/lib/fuel-compliance';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lat, lng, serviceType, category, maxRadiusKm = 20 } = body;

    if (!lat || !lng) {
      return NextResponse.json({ success: false, error: 'GPS coordinates (lat, lng) are required' }, { status: 400 });
    }

    const requiredType =
      serviceType === 'emergency_fuel'
        ? 'fuel_partner'
        : serviceType === 'appliance'
        ? 'appliance_tech'
        : 'mechanic';

    let allProviders = fixNowStore.getProviders();

    // If fuel partner, verify PESO compliance
    if (requiredType === 'fuel_partner') {
      allProviders = allProviders.filter(provider => {
        const auth = fixNowStore.getFuelAuthByProviderId(provider.id);
        const check = verifyFuelPartnerAuthorization(auth);
        return check.isValid;
      });
    }

    // Rank candidate providers
    const candidates = findAndRankProviders(allProviders, {
      customerLat: lat,
      customerLng: lng,
      requiredType,
      requiredSkill: category,
      maxRadiusKm
    });

    return NextResponse.json({
      success: true,
      count: candidates.length,
      candidates
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
