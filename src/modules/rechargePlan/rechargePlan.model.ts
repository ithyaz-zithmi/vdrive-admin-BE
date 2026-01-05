
export type PlanType =
  | 'ONE-WAY'
  | 'ROUND-TRIP'
  | 'OUT-STATION'
  | 'SCHEDULE';
export interface RechargePlan {
  id?: number;
  plan_name: string;
  plan_type: PlanType[];
  description?: string;
  ride_limit: number;
  validity_days: number;
  price: number;
  is_active: boolean;
  created_at?: Date;
}


