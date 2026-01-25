export interface DriverTimeSlotsPricing {
  id: string;
  price_and_fare_rules_id: string;
  driver_types: string;
  day: string;
  from_time: string; // time format HH:MM:SS
  to_time: string; // time format HH:MM:SS
  price: number;
}
