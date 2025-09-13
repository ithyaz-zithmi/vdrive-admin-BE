export interface Country {
  id: string;
  country_code: string;
  country_name: string;
  country_flag?: string | null;
}

export interface State {
  id: string;
  state_code?: string | null;
  state_name: string;
  country_id: string;
}

export interface City {
  id: string;
  city_name: string;
  state_id?: string | null;
  country_id: string;
}

export interface Area {
  id: string;
  place: string;
  city_id?: string | null;
  state_id?: string | null;
  country_id: string;
  zipcode?: string | null;
}
