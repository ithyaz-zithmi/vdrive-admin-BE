import { DriverTimeSlotsPricing } from './driverTimeSlotsPricing.model';

export interface PricingFareRule {
  id: string;
  district_id: string;
  area_id: string | null;
  global_price: number;
  is_hotspot: boolean;
  hotspot_id: string | null;
  multiplier: number | null;
}

export interface FareSummary {
  id: string;
  country_name: string;
  country_id: string;
  state_name: string;
  state_id: string;
  district_name: string;
  district_id: string;
  area_name: string | null;
  area_id: string | null;
  pincode: string | null;
  global_price: number;
  is_hotspot: boolean;
  hotspot_id: string | null;
  hotspot_name: string | null;
  multiplier: number | null;
  time_slots?: DriverTimeSlotsPricing[];
}
