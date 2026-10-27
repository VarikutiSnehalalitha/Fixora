import { ProviderProfile } from '@/types';

// Haversine formula to compute great-circle distance between two points in km
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// Estimate city travel time in minutes based on distance
export function estimateTravelMinutes(distanceKm: number): number {
  // Average city traffic speed ~ 24 km/h (0.4 km/min) + 5 min preparation/dispatch buffer
  const minutes = Math.round(distanceKm / 0.4) + 5;
  return Math.max(10, Math.min(90, minutes));
}

export interface MatchCandidate {
  provider: ProviderProfile;
  distanceKm: number;
  estimatedArrivalMinutes: number;
  matchScore: number;
}

export interface DispatchCriteria {
  customerLat: number;
  customerLng: number;
  requiredType: 'mechanic' | 'appliance_tech' | 'fuel_partner';
  requiredSkill?: string;
  maxRadiusKm?: number;
  activeProviderIds?: Set<string>; // Providers currently busy
}

/**
 * Filter and rank providers based on proximity, rating, verified credentials, and availability.
 */
export function findAndRankProviders(
  providers: ProviderProfile[],
  criteria: DispatchCriteria
): MatchCandidate[] {
  const radius = criteria.maxRadiusKm || 15;
  const busySet = criteria.activeProviderIds || new Set();

  const candidates: MatchCandidate[] = [];

  for (const provider of providers) {
    // 1. Must be verified by admin
    if (!provider.is_verified || provider.verification_status !== 'verified') {
      continue;
    }

    // 2. Must be online and available
    if (!provider.is_available) {
      continue;
    }

    // 3. Concurrency check: must not currently be servicing another active booking
    if (busySet.has(provider.id)) {
      continue;
    }

    // 4. Must match the provider type
    if (provider.provider_type !== criteria.requiredType) {
      continue;
    }

    // 5. Must have the required skill or vehicle/appliance specialization if specified
    if (criteria.requiredSkill) {
      const skillMatches = provider.skills.some(s => 
        s.toLowerCase().includes(criteria.requiredSkill!.toLowerCase())
      );
      const vehicleMatches = provider.vehicle_specializations?.some(v => 
        v.toLowerCase().includes(criteria.requiredSkill!.toLowerCase())
      );
      const applianceMatches = provider.appliance_specializations?.some(a => 
        a.toLowerCase().includes(criteria.requiredSkill!.toLowerCase())
      );

      if (!skillMatches && !vehicleMatches && !applianceMatches) {
        continue;
      }
    }

    // 6. Calculate geographic distance
    const dist = calculateHaversineDistance(
      criteria.customerLat,
      criteria.customerLng,
      provider.current_lat,
      provider.current_lng
    );

    // 7. Must be within the allowable radius and the provider's own service radius
    const effectiveRadius = Math.min(radius, provider.service_radius_km || 20);
    if (dist > effectiveRadius) {
      continue;
    }

    // 8. Scoring algorithm:
    // Distance weight (closer = higher score, max 50 pts)
    const distanceScore = Math.max(0, 50 - (dist * 2.5));
    // Rating weight (5 stars = 35 pts)
    const ratingScore = (provider.rating / 5) * 35;
    // Experience / completion count weight (up to 15 pts)
    const expScore = Math.min(15, provider.total_completed_jobs * 0.5);

    const totalScore = Math.round((distanceScore + ratingScore + expScore) * 10) / 10;
    const eta = estimateTravelMinutes(dist);

    candidates.push({
      provider,
      distanceKm: dist,
      estimatedArrivalMinutes: eta,
      matchScore: totalScore
    });
  }

  // Sort descending by highest match score
  return candidates.sort((a, b) => b.matchScore - a.matchScore);
}
