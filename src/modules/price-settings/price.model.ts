export interface Location {
  location_id: string;
  country: string;
  state?: string;
  district?: string;
  area?: string;
  pincode?: string;
  global_price?: number;
  is_hotspot: boolean;
  hotspot_id?: string;
}

export interface HotspotDetails {
  isHotspot: boolean;
  hotspotId?: string;
  hotspotName?: string;
  fare?: number;
}

export interface Timing {
  timing_id?: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  from: {
    time: number;
    type: 'AM' | 'PM';
  };
  to: {
    time: number;
    type: 'AM' | 'PM';
  };
  rate: number;
}

export interface RateDetail {
  rate_id?: string;
  driverType: 'normal' | 'premium' | 'elite';
  cancellationFee: number;
  waitingFee: {
    perMinutes: number;
    fee: number;
  };
  timing: Timing[];
}

export interface PriceSetting {
  location: {
    country: string;
    state?: string;
    district?: string;
    area?: string;
    pincode?: string;
    global_price?: number;
  };
  hotspotDetails: HotspotDetails;
  rateDetails: RateDetail[];
}

export interface HotspotResponse {
  isHotspot: boolean;
  hotspotId?: string;
  hotspotName?: string;
  fare?: number | null;
  multiplier?: number;
}

export interface PriceSettingResponse {
  location_id: string;
  location: {
    country: string;
    state?: string;
    district?: string;
    area?: string;
    pincode?: string;
    global_price?: number;
  };
  hotspotDetails: HotspotResponse;
  rateDetails: {
    rate_id: string;
    driverType: 'normal' | 'premium' | 'elite';
    cancellationFee: number;
    waitingFee: {
      perMinutes: number;
      fee: number;
    };
    timing: Timing[];
  }[];
}
