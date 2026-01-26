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
  '/districts/:state_id',
  validateParams(LocationValidation.stateIdValidation),
  validateQuery(LocationValidation.districtsQueryValidation),
  LocationController.getDistricts
);

router.get(
  '/areas/:district_id',
  validateParams(LocationValidation.districtIdValidation),
  validateQuery(LocationValidation.areasQueryValidation),
  LocationController.getAreas
);

router.get(
  '/country/:country_id',
  validateParams(LocationValidation.countryIdValidation),
  LocationController.getCountryById
);

router.get(
  '/state/:state_id',
  validateParams(LocationValidation.stateIdValidation),
  LocationController.getStateById
);

router.get(
  '/district/:district_id',
  validateParams(LocationValidation.districtIdValidation),
  LocationController.getDistrictById
);

router.get(
  '/area/:area_id',
  validateParams(LocationValidation.areaIdValidation),
  LocationController.getAreaById
);

router.get(
  '/full-location/:area_id',
  validateParams(LocationValidation.areaIdValidation),
  LocationController.getFullLocation
);

router.get('/pincode/:pincode', LocationController.getLocationByPincode);

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
  '/districts',
  validateBody(LocationValidation.createDistrictValidation),
  LocationController.addDistrict
);

router.post(
  '/areas',
  validateBody(LocationValidation.createAreaValidation),
  LocationController.addArea
);

// -------------------- UPDATE ROUTES --------------------
router.put(
  '/countries/:country_id',
  validateParams(LocationValidation.countryIdValidation),
  validateBody(LocationValidation.updateCountryValidation),
  LocationController.updateCountry
);

router.put(
  '/states/:state_id',
  validateParams(LocationValidation.stateIdValidation),
  validateBody(LocationValidation.updateStateValidation),
  LocationController.updateState
);

router.put(
  '/districts/:district_id',
  validateParams(LocationValidation.districtIdValidation),
  validateBody(LocationValidation.updateDistrictValidation),
  LocationController.updateDistrict
);

router.put(
  '/areas/:area_id',
  validateParams(LocationValidation.areaIdValidation),
  validateBody(LocationValidation.updateAreaValidation),
  LocationController.updateArea
);

// -------------------- DELETE ROUTES --------------------
router.delete(
  '/countries/:country_id',
  validateParams(LocationValidation.countryIdValidation),
  LocationController.deleteCountry
);

router.delete(
  '/states/:state_id',
  validateParams(LocationValidation.stateIdValidation),
  LocationController.deleteState
);

router.delete(
  '/districts/:district_id',
  validateParams(LocationValidation.districtIdValidation),
  LocationController.deleteDistrict
);

router.delete(
  '/areas/:area_id',
  validateParams(LocationValidation.areaIdValidation),
  LocationController.deleteArea
);

export default router;
