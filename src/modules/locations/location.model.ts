export interface Country {
  id: string;
  code: string;
  name: string;
  flag?: string | null;
}

export interface State {
  id: string;
  code?: string | null;
  name: string;
  country_id: string;
}

export interface District {
  id: string;
  name: string;
  state_id: string;
  country_id: string;
}

export interface Area {
  id: string;
  name: string;
  district_id?: string | null;
  state_id?: string | null;
  country_id: string;
  pincode: string;
}
