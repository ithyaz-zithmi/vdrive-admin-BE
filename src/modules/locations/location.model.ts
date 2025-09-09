export interface Country {
  id: string;
  country_code: string;
  country_name: string;
  country_flag: string;
}

export interface State {
  id: string;
  state_code: string;
  state_name: string;
  country_id: string;
}

export interface City {
  id: string;
  city_code: string;
  city_name: string;
  state_id: string;
  country_id: string;
}

export interface Area {
  id: string;
  place: string; // instead of area_name
  city_id: string;
  state_id: string;
  country_id: string;
  zipcode: string; // instead of postal_code
}
