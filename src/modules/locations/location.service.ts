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
    const area = await LocationRepository.getAreaById(area_id);
    if (!area) {
      throw { statusCode: 404, message: 'Area not found' };
    }

    const city = await LocationRepository.getCityById(area.city_id);
    if (!city) {
      throw { statusCode: 404, message: 'City not found' };
    }

    const state = await LocationRepository.getStateById(city.state_id);
    if (!state) {
      throw { statusCode: 404, message: 'State not found' };
    }

    const country = await LocationRepository.getCountryById(state.country_id);
    if (!country) {
      throw { statusCode: 404, message: 'Country not found' };
    }

    return {
      country,
      state,
      city,
      area,
    };
  },

  async addCountry(data: {
    country_id: string;
    country_name: string;
    country_flag?: string;
  }): Promise<Country> {
    const existingCountry = await LocationRepository.getCountryByCountryId(data.country_id);
    if (existingCountry) {
      throw { statusCode: 409, message: 'Country ID already exists' };
    }
    return await LocationRepository.createCountry(data);
  },

  async addState(data: {
    state_id: string;
    state_name: string;
    country_id: number;
  }): Promise<State> {
    const existingState = await LocationRepository.getStateByStateId(data.state_id);
    if (existingState) {
      throw { statusCode: 409, message: 'State ID already exists' };
    }
    const country = await LocationRepository.getCountryById(data.country_id);
    if (!country) {
      throw { statusCode: 404, message: 'Country not found' };
    }
    return await LocationRepository.createState(data);
  },

  async addCity(data: { city_id: string; city_name: string; state_id: number }): Promise<City> {
    const existingCity = await LocationRepository.getCityByCityId(data.city_id);
    if (existingCity) {
      throw { statusCode: 409, message: 'City ID already exists' };
    }
    const state = await LocationRepository.getStateById(data.state_id);
    if (!state) {
      throw { statusCode: 404, message: 'State not found' };
    }
    return await LocationRepository.createCity(data);
  },
  async addArea(data: { area_id: string; area_name: string; city_id: number }): Promise<Area> {
    const existingArea = await LocationRepository.getAreaByAreaId(data.area_id);
    if (existingArea) {
      throw { statusCode: 409, message: 'Area ID already exists' };
    }
    const city = await LocationRepository.getCityById(data.city_id);
    if (!city) {
      throw { statusCode: 404, message: 'City not found' };
    }
    return await LocationRepository.createArea(data);
  },
};
