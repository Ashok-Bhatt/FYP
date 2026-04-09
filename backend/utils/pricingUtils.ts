/**
 * Pricing Utility Functions
 * 
 * Contains all pricing calculation logic for quotes and partner filtering.
 * Uses room-based pricing instead of deprecated budgetRange/startingPrice.
 */

import { IPartnerProfile } from '../models/PartnerProfile';

/**
 * Calculate minimum room price from partner's roomTypes
 */
export const getMinRoomPrice = (partner: IPartnerProfile): number | null => {
  if (!partner.roomTypes || partner.roomTypes.length === 0) {
    return null;
  }
  return Math.min(...partner.roomTypes.map(room => room.price));
};

/**
 * Get room price by room type name
 */
export const getRoomPriceByName = (
  partner: IPartnerProfile,
  roomTypeName: string
): number | null => {
  if (!partner.roomTypes || partner.roomTypes.length === 0) {
    return null;
  }
  
  const room = partner.roomTypes.find(r => r.name === roomTypeName);
  if (room) {
    return room.price;
  }
  
  // Fallback to first room if specified room not found
  return partner.roomTypes[0]?.price || null;
};

/**
 * Calculate base cost using the formula:
 * baseCost = minRoomPrice * totalDays * (noOfAdults + 0.5 * noOfChildren)
 */
export const calculateBaseCost = (
  minRoomPrice: number,
  totalDays: number,
  noOfAdults: number,
  noOfChildren: number = 0
): number => {
  const totalPersons = noOfAdults + 0.5 * noOfChildren;
  return minRoomPrice * totalDays * totalPersons;
};

/**
 * Calculate activity cost for given number of persons
 */
export const calculateActivityCost = (
  activityPrice: number,
  noOfAdults: number,
  noOfChildren: number = 0
): number => {
  const totalPersons = noOfAdults + 0.5 * noOfChildren;
  return activityPrice * totalPersons;
};

/**
 * Calculate final quote cost using the formula:
 * 
 * totalPersons = noOfAdults + 0.5 * noOfChildren
 * 
 * finalCost =
 *   (roomPrice * totalDays * totalPersons)
 *   + Σ(totalPersons * activityPrice)
 *   + Σ(totalPersons * sightSeeingPrice)
 */
export interface FinalCostParams {
  roomPrice: number;
  totalDays: number;
  noOfAdults: number;
  noOfChildren: number;
  activities: Array<{ name: string; price: number }>;
  sightseeings: Array<{ name: string; entryFee: number }>;
  margin?: number; // Percentage (e.g., 10 for 10%)
}

export interface FinalCostResult {
  baseCost: number;
  activitiesCost: number;
  sightseeingCost: number;
  netCost: number;
  margin: number;
  finalCost: number;
  perHead: number;
  breakdown: {
    hotels: number;
    activities: number;
    sightseeing: number;
  };
}

export const calculateFinalCost = (params: FinalCostParams): FinalCostResult => {
  const {
    roomPrice,
    totalDays,
    noOfAdults,
    noOfChildren,
    activities,
    sightseeings,
    margin = 10,
  } = params;

  const totalPersons = noOfAdults + 0.5 * noOfChildren;

  // Base hotel cost
  const baseCost = roomPrice * totalDays * totalPersons;

  // Activities cost
  const activitiesCost = activities.reduce(
    (sum, activity) => sum + activity.price * totalPersons,
    0
  );

  // Sightseeing cost
  const sightseeingCost = sightseeings.reduce(
    (sum, sight) => sum + sight.entryFee * totalPersons,
    0
  );

  const netCost = baseCost + activitiesCost + sightseeingCost;
  const finalCost = netCost * (1 + margin / 100);

  return {
    baseCost,
    activitiesCost,
    sightseeingCost,
    netCost,
    margin,
    finalCost,
    perHead: finalCost / noOfAdults,
    breakdown: {
      hotels: baseCost,
      activities: activitiesCost,
      sightseeing: sightseeingCost,
    },
  };
};

/**
 * Find activities by names from partner's activities list
 */
export const findActivitiesByNames = (
  partner: IPartnerProfile,
  activityNames: string[]
): Array<{ name: string; price: number }> => {
  if (!partner.activities || partner.activities.length === 0) {
    return [];
  }

  return activityNames
    .map(name => {
      const activity = partner.activities.find(a => a.name === name);
      return activity ? { name: activity.name, price: activity.price } : null;
    })
    .filter((a): a is { name: string; price: number } => a !== null);
};

/**
 * Find sightseeings by names from partner's sightseeing list
 */
export const findSightseeingsByNames = (
  partner: IPartnerProfile,
  sightseeingNames: string[]
): Array<{ name: string; entryFee: number }> => {
  if (!partner.sightSeeings || partner.sightSeeings.length === 0) {
    return [];
  }

  return sightseeingNames
    .map(name => {
      const sight = partner.sightSeeings.find(s => s.name === name);
      return sight ? { name: sight.name, entryFee: sight.entryFee || 0 } : null;
    })
    .filter((s): s is { name: string; entryFee: number } => s !== null);
};
