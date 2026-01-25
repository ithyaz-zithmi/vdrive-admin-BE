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

  static async getCities(req: Request, res: Response, next: NextFunction) {
    try {
      const { country_id } = req.params;
      const { state_id, search, page, limit } = req.query;
      const cities = await LocationService.getCities(
        country_id,
        (state_id as string) || null,
        (search as string) || '',
        parseInt(page as string, 10) || 1,
        parseInt(limit as string, 10) || 10
      );
      return successResponse(res, 200, 'Cities fetched successfully', cities);
    } catch (err) {
      next(err);
    }
  }

  static async getAreas(req: Request, res: Response, next: NextFunction) {
    try {
      const { country_id } = req.params;
      const { state_id, city_id, search, page, limit } = req.query;
      const areas = await LocationService.getAreas(
        country_id,
        (state_id as string) || null,
        (city_id as string) || null,
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

  static async getLocationByZipcode(req: Request, res: Response, next: NextFunction) {
    try {
      const { zipcode } = req.params;
      const location = await LocationService.getLocationByZipcode(zipcode);
      return successResponse(res, 200, 'Location fetched successfully', location);
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
  static async addCity(req: Request, res: Response, next: NextFunction) {
    try {
      const cityData = req.body;
      const newCity = await LocationService.addCity(cityData);
      return successResponse(res, 201, 'City added successfully', newCity);
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
}
export default LocationController;
