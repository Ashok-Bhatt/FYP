/**
 * Flight Controller
 * Handles flight search using SerpAPI (Google Flights)
 */

import { Request, Response } from 'express';
import axios from 'axios';
import { SERP_API_KEY } from '../config/env';

interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
}

// City to IATA code mapper for major cities
const cityToIATA: Record<string, string> = {
  // Major Indian cities
  'mumbai': 'BOM',
  'delhi': 'DEL',
  'new delhi': 'DEL',
  'bangalore': 'BLR',
  'bengaluru': 'BLR',
  'chennai': 'MAA',
  'hyderabad': 'HYD',
  'kolkata': 'CCU',
  'pune': 'PNQ',
  'ahmedabad': 'AMD',
  'jaipur': 'JAI',
  'goa': 'GOI',
  'lucknow': 'LKO',
  'kochi': 'COK',
  'cochin': 'COK',
  'chandigarh': 'IXC',
  'indore': 'IDR',
  'nagpur': 'NAG',
  'patna': 'PAT',
  'bhubaneswar': 'BBI',
  'guwahati': 'GAU',
  'varanasi': 'VNS',
  'amritsar': 'ATQ',
  'srinagar': 'SXR',
  'dehradun': 'DED',
  'raipur': 'RPR',
  'ranchi': 'IXR',
  // International
  'dubai': 'DXB',
  'london': 'LHR',
  'new york': 'JFK',
  'singapore': 'SIN',
  'bangkok': 'BKK',
  'paris': 'CDG',
};

/**
 * Convert city name or input to IATA code
 */
function getIATACode(input: string): string {
  const normalized = input.toLowerCase().trim();
  
  // If already 3 uppercase letters, assume it's IATA
  if (/^[A-Z]{3}$/.test(input.trim())) {
    return input.trim();
  }
  
  // Look up in mapper
  return cityToIATA[normalized] || normalized.slice(0, 3).toUpperCase();
}

/**
 * Convert travel class to SerpAPI format (1-4)
 */
function getTravelClassCode(travelClass?: string): string | undefined {
  const classMap: Record<string, string> = {
    'ECONOMY': '1',
    'PREMIUM_ECONOMY': '2',
    'BUSINESS': '3',
    'FIRST': '4',
  };
  return travelClass ? classMap[travelClass] : undefined;
}

/**
 * Search flights using SerpAPI (Google Flights)
 * @route POST /api/flights/search
 * @access Private
 */
export const searchFlights = async (req: Request, res: Response) => {
  const { origin, destination, departureDate, returnDate, adults, children, travelClass } = req.body as FlightSearchRequest;

  // Validate required fields
  if (!origin || !destination || !departureDate || !adults) {
    res.status(400).json({
      message: 'Missing required fields: origin, destination, departureDate, adults',
    });
    return;
  }

  // If SerpAPI key not configured, return empty result
  if (!SERP_API_KEY) {
    console.log('⚠️  SerpAPI key not configured');
    res.json({ flights: [], source: 'not_configured', message: 'Flight search not available' });
    return;
  }

  try {
    // Convert city names to IATA codes
    const originCode = getIATACode(origin);
    const destinationCode = getIATACode(destination);
    
    console.log(`Converting: ${origin} → ${originCode}, ${destination} → ${destinationCode}`);

    // Build SerpAPI search parameters
    const searchParams: any = {
      engine: 'google_flights',
      api_key: SERP_API_KEY,
      departure_id: originCode,
      arrival_id: destinationCode,
      outbound_date: departureDate,
      adults: adults.toString(),
      currency: 'INR',
    };

    if (returnDate) {
      searchParams.return_date = returnDate;
      searchParams.type = '1'; // Round trip
    } else {
      searchParams.type = '2'; // One way
    }

    if (children) {
      searchParams.children = children.toString();
    }

    const travelClassCode = getTravelClassCode(travelClass);
    if (travelClassCode) {
      searchParams.travel_class = travelClassCode;
    }

    console.log('SerpAPI params:', searchParams);

    const response = await axios.get('https://serpapi.com/search', {
      params: searchParams,
    });

    console.log('SerpAPI response:', response.data);

    // Transform SerpAPI response to our format
    const bestFlights = response.data.best_flights || [];
    const otherFlights = response.data.other_flights || [];
    const allFlights = [...bestFlights, ...otherFlights];

    const transformedFlights = allFlights.slice(0, 10).map((flight: any, index: number) => {
      const firstLeg = flight.flights?.[0] || flight;
      
      // Extract airline info
      const airline = firstLeg.airline || 'Unknown Airline';
      const flightNumber = firstLeg.flight_number || `${firstLeg.airline_code || 'XX'}${firstLeg.flight_number || index}`;
      
      // Extract departure info
      const depTime = firstLeg.departure_airport?.time || firstLeg.departure_time || '';
      const depAirport = firstLeg.departure_airport?.id || originCode;
      
      // Extract arrival info
      const arrTime = firstLeg.arrival_airport?.time || firstLeg.arrival_time || '';
      const arrAirport = firstLeg.arrival_airport?.id || destinationCode;
      
      // Calculate duration
      const duration = firstLeg.duration || flight.total_duration || 0;
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      const durationStr = `${hours}h ${minutes > 0 ? minutes + 'm' : ''}`;
      
      // Get price
      const price = flight.price || flight.total_price || 0;
      
      // Count stops
      const stops = flight.layovers?.length || 0;

      return {
        id: flight.id || `flight-${index}`,
        airline: airline,
        flightNumber: flightNumber,
        departure: {
          airport: depAirport,
          time: depTime ? new Date(depTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '',
          date: depTime ? new Date(depTime).toISOString().split('T')[0] : departureDate,
        },
        arrival: {
          airport: arrAirport,
          time: arrTime ? new Date(arrTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '',
          date: arrTime ? new Date(arrTime).toISOString().split('T')[0] : departureDate,
        },
        duration: durationStr,
        price: Math.round(price),
        stops: stops,
        currency: 'INR',
      };
    });

    res.json({ flights: transformedFlights, source: 'serpapi' });

  } catch (error: any) {
    console.error('Flight search error:', error.message);
    console.error('API response:', error.response?.data);
    console.error('Status code:', error.response?.status);
    
    res.json({ 
      flights: [], 
      source: 'error', 
      message: error.response?.data?.error || 'Failed to search flights. Please try again.' 
    });
  }
};


/**
 * Get airport suggestions (city to IATA code mapping)
 * @route GET /api/flights/airports
 * @access Public
 */
export const getAirports = async (req: Request, res: Response) => {
  const { keyword } = req.query;

  if (!keyword || typeof keyword !== 'string') {
    res.status(400).json({ message: 'Keyword parameter is required' });
    return;
  }

  // Common Indian airports mapping
  const indianAirports: Record<string, { code: string; city: string; name: string }[]> = {
    'mumbai': [{ code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International Airport' }],
    'delhi': [{ code: 'DEL', city: 'Delhi', name: 'Indira Gandhi International Airport' }],
    'bangalore': [{ code: 'BLR', city: 'Bangalore', name: 'Kempegowda International Airport' }],
    'bengaluru': [{ code: 'BLR', city: 'Bangalore', name: 'Kempegowda International Airport' }],
    'hyderabad': [{ code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International Airport' }],
    'chennai': [{ code: 'MAA', city: 'Chennai', name: 'Chennai International Airport' }],
    'kolkata': [{ code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International Airport' }],
    'pune': [{ code: 'PNQ', city: 'Pune', name: 'Pune International Airport' }],
    'goa': [{ code: 'GOI', city: 'Goa', name: 'Goa International Airport' }],
    'jaipur': [{ code: 'JAI', city: 'Jaipur', name: 'Jaipur International Airport' }],
    'ahmedabad': [{ code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel International Airport' }],
    'kochi': [{ code: 'COK', city: 'Kochi', name: 'Cochin International Airport' }],
    'cochin': [{ code: 'COK', city: 'Kochi', name: 'Cochin International Airport' }],
    'trivandrum': [{ code: 'TRV', city: 'Thiruvananthapuram', name: 'Trivandrum International Airport' }],
    'lucknow': [{ code: 'LKO', city: 'Lucknow', name: 'Chaudhary Charan Singh International Airport' }],
    'varanasi': [{ code: 'VNS', city: 'Varanasi', name: 'Lal Bahadur Shastri Airport' }],
    'srinagar': [{ code: 'SXR', city: 'Srinagar', name: 'Sheikh ul-Alam International Airport' }],
    'udaipur': [{ code: 'UDR', city: 'Udaipur', name: 'Maharana Pratap Airport' }],
    'jodhpur': [{ code: 'JDH', city: 'Jodhpur', name: 'Jodhpur Airport' }],
    'amritsar': [{ code: 'ATQ', city: 'Amritsar', name: 'Sri Guru Ram Dass Jee International Airport' }],
  };

  const normalizedKeyword = keyword.toLowerCase();
  const results = indianAirports[normalizedKeyword] || [];

  // If no exact match, try partial matches
  if (results.length === 0) {
    Object.entries(indianAirports).forEach(([key, airports]) => {
      if (key.includes(normalizedKeyword) || normalizedKeyword.includes(key)) {
        results.push(...airports);
      }
    });
  }

  res.json({ airports: results });
};
