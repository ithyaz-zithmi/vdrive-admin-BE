import { Router } from 'express';
import LocationController from './location.controller';
import { LocationValidation } from './location.validator';
import { validateBody, validateParams, validateQuery } from '../../utilities/helper';

const router = Router();

// -------------------- READ ROUTES --------------------
router.get(
  '/countries',
  validateQuery(LocationValidation.paginationQueryValidation),
  LocationController.getCountries
);

router.get(
  '/states/:country_id',
  validateParams(LocationValidation.countryIdValidation),
  validateQuery(LocationValidation.statesQueryValidation),
  LocationController.getStates
);

router.get(
  '/cities/:country_id',
  validateParams(LocationValidation.countryIdValidation),
  validateQuery(LocationValidation.citiesQueryValidation),
  LocationController.getCities
);

router.get(
  '/areas/:country_id',
  validateParams(LocationValidation.countryIdValidation),
  validateQuery(LocationValidation.areasQueryValidation),
  LocationController.getAreas
);

router.get(
  '/full-location/:area_id',
  validateParams(LocationValidation.areaIdValidation),
  LocationController.getFullLocation
);

// -------------------- WRITE ROUTES --------------------
router.post(
  '/countries',
  validateBody(LocationValidation.createCountryValidation),
  LocationController.addCountry
);

router.post(
  '/states',
  validateBody(LocationValidation.createStateValidation),
  LocationController.addState
);

router.post(
  '/cities',
  validateBody(LocationValidation.createCityValidation),
  LocationController.addCity
);

router.post(
  '/areas',
  validateBody(LocationValidation.createAreaValidation),
  LocationController.addArea
);

export default router;
