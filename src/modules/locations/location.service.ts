import { LocationRepository } from './location.repository';
import { Country, State, City, Area } from './location.model';

export const LocationService = {
  async getCountries(
    search: string,
    page: number,
    limit: number
  ): Promise<{ data: Country[]; total: number }> {
    return await LocationRepository.getCountries(search, page, limit);
  },

  async getStates(
    country_id: string,
    search: string,
    page: number,
    limit: number
  ): Promise<{ data: State[]; total: number }> {
    return await LocationRepository.getStates(country_id, search, page, limit);
  },

  async getCities(
    country_id: string,
    state_id: string | null,
    search: string,
    page: number,
    limit: number
  ): Promise<{ data: City[]; total: number }> {
    return await LocationRepository.getCities(country_id, state_id, search, page, limit);
  },

  async getAreas(
    country_id: string,
    state_id: string | null,
    city_id: string | null,
    search: string | '',
    page: number,
    limit: number
  ): Promise<{ data: Area[]; total: number }> {
    return await LocationRepository.getAreas(country_id, state_id, city_id, search, page, limit);
  },

  async getFullLocation(area_id: string): Promise<any> {
    const location = await LocationRepository.getFullLocation(area_id);
    if (!location || !location.country) {
      throw { statusCode: 404, message: 'Location not found' };
    }
    return location;
  },

  async getLocationByZipcode(zipcode: string): Promise<any> {
    const location = await LocationRepository.getLocationByZipcode(zipcode);
    if (!location) {
      throw { statusCode: 404, message: 'Location not found for this zipcode' };
    }
    return location;
  },

  async addCountry(data: {
    country_code: string;
    country_name: string;
    country_flag?: string | null;
  }): Promise<Country> {
    const existingCountry = await LocationRepository.getCountryByCountryCode(data.country_code);
    if (existingCountry) {
      throw { statusCode: 409, message: 'Country ID already exists' };
    }
    return await LocationRepository.createCountry(data);
  },

  async addState(data: {
    state_code?: string | null;
    state_name: string;
    country_id: string;
  }): Promise<State> {
    if (data.state_code) {
      const existingState = await LocationRepository.getStateByStateCode(
        data.state_code,
        data.country_id
      );
      if (existingState) {
        throw { statusCode: 409, message: 'State ID already exists' };
      }
    }
    const country = await LocationRepository.getCountryById(data.country_id);
    if (!country) {
      throw { statusCode: 404, message: 'Country not found' };
    }
    return await LocationRepository.createState(data);
  },

  async addCity(data: {
    city_name: string;
    state_id?: string | null;
    country_id: string;
  }): Promise<City> {
    if (data.state_id) {
      const existingCity = await LocationRepository.getCityByCityName(
        data.city_name,
        data.state_id,
        data.country_id
      );
      if (existingCity) {
        throw { statusCode: 409, message: 'City already exists' };
      }
      const state = await LocationRepository.getStateById(data.state_id);
      if (!state) {
        throw { statusCode: 404, message: 'State not found' };
      }
    }
    return await LocationRepository.createCity(data);
  },
  async addArea(data: {
    place: string;
    city_id?: string | null;
    state_id?: string | null;
    country_id: string;
    zipcode?: string | null;
  }): Promise<Area> {
    if (data.city_id) {
      const existingArea = await LocationRepository.getAreaByAreaName(
        data.place,
        data.city_id || null,
        data.state_id || null,
        data.country_id
      );
      if (existingArea) {
        throw { statusCode: 409, message: 'Area already exists' };
      }
      const city = await LocationRepository.getCityById(data.city_id);
      if (!city) {
        throw { statusCode: 404, message: 'City not found' };
      }
    }
    return await LocationRepository.createArea(data);
  },
};
