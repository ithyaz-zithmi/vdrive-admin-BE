import { LocationRepository } from './location.repository';
import { Country, State, District, Area } from './location.model';

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

  async getDistricts(
    state_id: string,
    country_id: string,
    search: string,
    page: number,
    limit: number
  ): Promise<{ data: District[]; total: number }> {
    return await LocationRepository.getDistricts(state_id, country_id, search, page, limit);
  },

  async getAreas(
    district_id: string,
    state_id: string | null,
    search: string | '',
    page: number,
    limit: number
  ): Promise<{ data: Area[]; total: number }> {
    return await LocationRepository.getAreas(district_id, state_id, search, page, limit);
  },

  async getFullLocation(area_id: string): Promise<any> {
    const location = await LocationRepository.getFullLocation(area_id);
    if (!location || !location.country) {
      throw { statusCode: 404, message: 'Location not found' };
    }
    return location;
  },

  async getLocationByPincode(pincode: string): Promise<any> {
    const location = await LocationRepository.getLocationByPincode(pincode);
    if (!location) {
      throw { statusCode: 404, message: 'Location not found for this pincode' };
    }
    return location;
  },

  async getCountryById(id: string): Promise<Country> {
    const country = await LocationRepository.getCountryById(id);
    if (!country) {
      throw { statusCode: 404, message: 'Country not found' };
    }
    return country;
  },

  async getStateById(id: string): Promise<State> {
    const state = await LocationRepository.getStateById(id);
    if (!state) {
      throw { statusCode: 404, message: 'State not found' };
    }
    return state;
  },

  async getDistrictById(id: string): Promise<District> {
    const district = await LocationRepository.getDistrictById(id);
    if (!district) {
      throw { statusCode: 404, message: 'District not found' };
    }
    return district;
  },

  async getAreaById(id: string): Promise<Area> {
    const area = await LocationRepository.getAreaById(id);
    if (!area) {
      throw { statusCode: 404, message: 'Area not found' };
    }
    return area;
  },

  async addCountry(data: { code: string; name: string; flag?: string | null }): Promise<Country> {
    const existingCountry = await LocationRepository.getCountryByCountryCode(data.code);
    if (existingCountry) {
      throw { statusCode: 409, message: 'Country ID already exists' };
    }
    return await LocationRepository.createCountry(data);
  },

  async addState(data: {
    code?: string | null;
    name: string;
    country_id: string;
    created_by?: string;
  }): Promise<State> {
    if (data.code) {
      const existingState = await LocationRepository.getStateByStateCode(
        data.code,
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
    return await LocationRepository.createState(data, data.created_by || null);
  },

  async addDistrict(data: {
    name: string;
    state_id: string;
    country_id: string;
    created_by?: string;
  }): Promise<District> {
    if (data.state_id) {
      const existingDistrict = await LocationRepository.getDistrictByName(
        data.name,
        data.state_id,
        data.country_id
      );
      if (existingDistrict) {
        throw { statusCode: 409, message: 'District already exists' };
      }
      const state = await LocationRepository.getStateById(data.state_id);
      if (!state) {
        throw { statusCode: 404, message: 'State not found' };
      }
    }
    return await LocationRepository.createDistrict(data, data.created_by || null);
  },
  async addArea(data: {
    name: string;
    district_id: string;
    state_id: string;
    country_id: string;
    pincode: string;
    created_by?: string;
  }): Promise<Area> {
    if (data.district_id) {
      const existingArea = await LocationRepository.getAreaByAreaName(
        data.name,
        data.district_id,
        data.state_id,
        data.country_id
      );
      if (existingArea) {
        throw { statusCode: 409, message: 'Area already exists' };
      }
      const district = await LocationRepository.getDistrictById(data.district_id);
      if (!district) {
        throw { statusCode: 404, message: 'District not found' };
      }
    }
    return await LocationRepository.createArea(data, data.created_by || null);
  },

  async updateCountry(
    id: string,
    data: { name: string; code: string; flag?: string | null }
  ): Promise<Country> {
    const country = await LocationRepository.getCountryById(id);
    if (!country) throw { statusCode: 404, message: 'Country not found' };

    const updated = await LocationRepository.updateCountry(id, data);
    if (!updated) throw { statusCode: 500, message: 'Failed to update country' };
    return updated;
  },

  async deleteCountry(id: string): Promise<boolean> {
    const country = await LocationRepository.getCountryById(id);
    if (!country) throw { statusCode: 404, message: 'Country not found' };

    return await LocationRepository.deleteCountry(id);
  },

  async updateState(
    id: string,
    data: { name: string; code?: string | null; country_id: string; updated_by?: string }
  ): Promise<State> {
    const state = await LocationRepository.getStateById(id);
    if (!state) throw { statusCode: 404, message: 'State not found' };

    if (data.country_id) {
      const country = await LocationRepository.getCountryById(data.country_id);
      if (!country) throw { statusCode: 404, message: 'Country not found' };
    }

    const updated = await LocationRepository.updateState(id, data, data.updated_by || null);
    if (!updated) throw { statusCode: 500, message: 'Failed to update state' };
    return updated;
  },

  async deleteState(id: string): Promise<boolean> {
    const state = await LocationRepository.getStateById(id);
    if (!state) throw { statusCode: 404, message: 'State not found' };

    return await LocationRepository.deleteState(id);
  },

  async updateDistrict(
    id: string,
    data: { name: string; state_id: string; country_id: string; updated_by?: string }
  ): Promise<District> {
    const district = await LocationRepository.getDistrictById(id);
    if (!district) throw { statusCode: 404, message: 'District not found' };

    // Validate relationships if provided (basic check)
    if (data.state_id) {
      const state = await LocationRepository.getStateById(data.state_id);
      if (!state) throw { statusCode: 404, message: 'State not found' };
    }

    const updated = await LocationRepository.updateDistrict(id, data, data.updated_by || null);
    if (!updated) throw { statusCode: 500, message: 'Failed to update district' };
    return updated;
  },

  async deleteDistrict(id: string): Promise<boolean> {
    const district = await LocationRepository.getDistrictById(id);
    if (!district) throw { statusCode: 404, message: 'District not found' };

    return await LocationRepository.deleteDistrict(id);
  },

  async updateArea(
    id: string,
    data: {
      name: string;
      district_id: string;
      state_id: string;
      country_id: string;
      pincode: string;
      updated_by?: string;
    }
  ): Promise<Area> {
    const area = await LocationRepository.getAreaById(id);
    if (!area) throw { statusCode: 404, message: 'Area not found' };

    if (data.district_id) {
      const district = await LocationRepository.getDistrictById(data.district_id);
      if (!district) throw { statusCode: 404, message: 'District not found' };
    }

    const updated = await LocationRepository.updateArea(id, data, data.updated_by || null);
    if (!updated) throw { statusCode: 500, message: 'Failed to update area' };
    return updated;
  },

  async deleteArea(id: string): Promise<boolean> {
    const area = await LocationRepository.getAreaById(id);
    if (!area) throw { statusCode: 404, message: 'Area not found' };

    return await LocationRepository.deleteArea(id);
  },
};
