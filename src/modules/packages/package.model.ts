// src/modules/packages/package.model.ts
export interface Package {
  id: string;
  package_name: string;
  duration_minutes: number;
  distance_km: number;
  extra_distance_km: number;
  extra_minutes: number;
  created_at: Date;
  updated_at: Date;
}
