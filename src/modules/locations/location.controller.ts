import { LocationService } from './location.service';
import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../../shared/errorHandler';

class LocationController {
  static async getCountries(req: Request, res: Response, next: NextFunction) {
    try {
      const { search = '', page, limit } = req.query;
      const countries = await LocationService.getCountries(
        search as string,
        parseInt(page as string, 10) || 1,
        parseInt(limit as string, 10) || 10
      );
      return successResponse(res, 200, 'Countries fetched successfully', countries);
    } catch (err) {
      next(err);
    }
  }

  static async getStates(req: Request, res: Response, next: NextFunction) {
    try {
      const { country_id } = req.params;
      const { search, page, limit } = req.query;
      const states = await LocationService.getStates(
        country_id,
        (search as string) || '',
        parseInt(page as string, 10) || 1,
        parseInt(limit as string, 10) || 10
      );
      return successResponse(res, 200, 'States fetched successfully', states);
    } catch (err) {
      next(err);
    }
  }

  static async getDistricts(req: Request, res: Response, next: NextFunction) {
    try {
      const { state_id } = req.params;
      const { country_id, search, page, limit } = req.query;
      const districts = await LocationService.getDistricts(
        state_id,
        (country_id as string) || '',
        (search as string) || '',
        parseInt(page as string, 10) || 1,
        parseInt(limit as string, 10) || 10
      );
      return successResponse(res, 200, 'Districts fetched successfully', districts);
    } catch (err) {
      next(err);
    }
  }

  static async getAreas(req: Request, res: Response, next: NextFunction) {
    try {
      const { district_id } = req.params;
      const { state_id, search, page, limit } = req.query;
      const areas = await LocationService.getAreas(
        district_id,
        (state_id as string) || null,
        (search as string) || '',
        parseInt(page as string, 10) || 1,
        parseInt(limit as string, 10) || 10
      );
      return successResponse(res, 200, 'Areas fetched successfully', areas);
    } catch (err) {
      next(err);
    }
  }

  static async getFullLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const { area_id } = req.params;
      const location = await LocationService.getFullLocation(area_id);
      return successResponse(res, 200, 'Full location fetched successfully', location);
    } catch (err) {
      next(err);
    }
  }

  static async getLocationByPincode(req: Request, res: Response, next: NextFunction) {
    try {
      const { pincode } = req.params;
      const location = await LocationService.getLocationByPincode(pincode);
      return successResponse(res, 200, 'Location fetched successfully', location);
    } catch (err) {
      next(err);
    }
  }

  static async getCountryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { country_id } = req.params;
      const country = await LocationService.getCountryById(country_id);
      return successResponse(res, 200, 'Country fetched successfully', country);
    } catch (err) {
      next(err);
    }
  }

  static async getStateById(req: Request, res: Response, next: NextFunction) {
    try {
      const { state_id } = req.params;
      const state = await LocationService.getStateById(state_id);
      return successResponse(res, 200, 'State fetched successfully', state);
    } catch (err) {
      next(err);
    }
  }

  static async getDistrictById(req: Request, res: Response, next: NextFunction) {
    try {
      const { district_id } = req.params;
      const district = await LocationService.getDistrictById(district_id);
      return successResponse(res, 200, 'District fetched successfully', district);
    } catch (err) {
      next(err);
    }
  }

  static async getAreaById(req: Request, res: Response, next: NextFunction) {
    try {
      const { area_id } = req.params;
      const area = await LocationService.getAreaById(area_id);
      return successResponse(res, 200, 'Area fetched successfully', area);
    } catch (err) {
      next(err);
    }
  }

  static async addCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const countryData = req.body;
      const newCountry = await LocationService.addCountry(countryData);
      return successResponse(res, 201, 'Country added successfully', newCountry);
    } catch (err) {
      next(err);
    }
  }

  static async addState(req: Request, res: Response, next: NextFunction) {
    try {
      const stateData = req.body;
      const newState = await LocationService.addState(stateData);
      return successResponse(res, 201, 'State added successfully', newState);
    } catch (err) {
      next(err);
    }
  }
  static async addDistrict(req: Request, res: Response, next: NextFunction) {
    try {
      const districtData = req.body;
      const newDistrict = await LocationService.addDistrict(districtData);
      return successResponse(res, 201, 'District added successfully', newDistrict);
    } catch (err) {
      next(err);
    }
  }
  static async addArea(req: Request, res: Response, next: NextFunction) {
    try {
      const areaData = req.body;
      const newArea = await LocationService.addArea(areaData);
      return successResponse(res, 201, 'Area added successfully', newArea);
    } catch (err) {
      next(err);
    }
  }

  // Update handlers
  static async updateCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const { country_id } = req.params;
      const data = req.body;
      const updated = await LocationService.updateCountry(country_id, data);
      return successResponse(res, 200, 'Country updated successfully', updated);
    } catch (err) {
      next(err);
    }
  }

  static async updateState(req: Request, res: Response, next: NextFunction) {
    try {
      const { state_id } = req.params;
      const data = req.body;
      const updated = await LocationService.updateState(state_id, data);
      return successResponse(res, 200, 'State updated successfully', updated);
    } catch (err) {
      next(err);
    }
  }

  static async updateDistrict(req: Request, res: Response, next: NextFunction) {
    try {
      const { district_id } = req.params;
      const data = req.body;
      const updated = await LocationService.updateDistrict(district_id, data);
      return successResponse(res, 200, 'District updated successfully', updated);
    } catch (err) {
      next(err);
    }
  }

  static async updateArea(req: Request, res: Response, next: NextFunction) {
    try {
      const { area_id } = req.params;
      const data = req.body;
      const updated = await LocationService.updateArea(area_id, data);
      return successResponse(res, 200, 'Area updated successfully', updated);
    } catch (err) {
      next(err);
    }
  }

  // Delete handlers
  static async deleteCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const { country_id } = req.params;
      await LocationService.deleteCountry(country_id);
      return successResponse(res, 200, 'Country deleted successfully', { id: country_id });
    } catch (err) {
      next(err);
    }
  }

  static async deleteState(req: Request, res: Response, next: NextFunction) {
    try {
      const { state_id } = req.params;
      await LocationService.deleteState(state_id);
      return successResponse(res, 200, 'State deleted successfully', { id: state_id });
    } catch (err) {
      next(err);
    }
  }

  static async deleteDistrict(req: Request, res: Response, next: NextFunction) {
    try {
      const { district_id } = req.params;
      await LocationService.deleteDistrict(district_id);
      return successResponse(res, 200, 'District deleted successfully', { id: district_id });
    } catch (err) {
      next(err);
    }
  }

  static async deleteArea(req: Request, res: Response, next: NextFunction) {
    try {
      const { area_id } = req.params;
      await LocationService.deleteArea(area_id);
      return successResponse(res, 200, 'Area deleted successfully', { id: area_id });
    } catch (err) {
      next(err);
    }
  }
}
export default LocationController;
