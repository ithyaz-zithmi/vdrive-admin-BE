import { DriverTimeSlotsPricing } from './driverTimeSlotsPricing.model';

export interface PricingFareRule {
  id: string;
  district_id: string;
  city_id: string | null;
  global_price: number;
  is_hotspot: boolean;
  hotspot_id: string | null;
  multiplier: number | null;
}

export interface FareSummary {
  id: string;
  city_name: string | null;
  city_id: string | null;
  area_name: string;
  area_id: string;
  global_price: number;
  is_hotspot: boolean;
  hotspot_id: string | null;
  hotspot_name: string | null;
  multiplier: number | null;
  time_slots?: DriverTimeSlotsPricing[];
}
