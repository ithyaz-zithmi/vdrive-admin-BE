import { Router } from 'express';
import PriceController from './price.controller';
import { celebrate, Joi, Segments } from 'celebrate';

const router = Router();

// -------------------- READ ROUTES --------------------
router.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      search: Joi.string().optional(),
    }),
  }),
  PriceController.getPriceSettings
);

router.get(
  '/:location_id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      location_id: Joi.string().uuid().required(),
    }),
  }),
  PriceController.getPriceSettingById
);

// -------------------- WRITE ROUTES --------------------
// Single price setting creation
router.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      location: Joi.object()
        .keys({
          country: Joi.string().required(),
          state: Joi.string().allow('', null).optional(),
          district: Joi.string().allow('', null).optional(),
          area: Joi.string().allow('', null).optional(),
          pincode: Joi.string().length(6).pattern(/^\d+$/).allow('', null).optional(),
          global_price: Joi.number().precision(2).min(0).allow(null).optional(),
        })
        .required(),
      hotspotDetails: Joi.object()
        .keys({
          isHotspot: Joi.boolean().required(),
          hotspotId: Joi.string()
            .when('isHotspot', {
              is: true,
              then: Joi.required(),
              otherwise: Joi.allow('', null),
            })
            .optional(),
          hotspotName: Joi.string().allow('', null).optional(),
          fare: Joi.number().precision(2).min(0).allow(null).optional(),
        })
        .required(),
      rateDetails: Joi.array()
        .min(1)
        .items(
          Joi.object().keys({
            driverType: Joi.string().valid('normal', 'premium', 'elite').required(),
            cancellationFee: Joi.number().precision(2).min(0).required(),
            waitingFee: Joi.object()
              .keys({
                perMinutes: Joi.number().integer().min(1).required(),
                fee: Joi.number().precision(2).greater(0).required(),
              })
              .required(),
            timing: Joi.array()
              .min(1)
              .items(
                Joi.object().keys({
                  day: Joi.string()
                    .valid(
                      'monday',
                      'tuesday',
                      'wednesday',
                      'thursday',
                      'friday',
                      'saturday',
                      'sunday'
                    )
                    .required(),
                  from: Joi.object()
                    .keys({
                      time: Joi.number().integer().min(1).max(12).required(),
                      type: Joi.string().valid('AM', 'PM').required(),
                    })
                    .required(),
                  to: Joi.object()
                    .keys({
                      time: Joi.number().integer().min(1).max(12).required(),
                      type: Joi.string().valid('AM', 'PM').required(),
                    })
                    .required(),
                  rate: Joi.number().precision(2).greater(0).required(),
                })
              )
              .required(),
          })
        )
        .required(),
    }),
  }),
  PriceController.createPriceSetting
);

// Bulk price settings creation
router.post(
  '/bulk',
  celebrate({
    [Segments.BODY]: Joi.array()
      .min(1)
      .max(50)
      .items(
        Joi.object().keys({
          location: Joi.object()
            .keys({
              country: Joi.string().required(),
              state: Joi.string().allow('', null).optional(),
              district: Joi.string().allow('', null).optional(),
              area: Joi.string().allow('', null).optional(),
              pincode: Joi.string().length(6).pattern(/^\d+$/).allow('', null).optional(),
              global_price: Joi.number().precision(2).min(0).allow(null).optional(),
            })
            .required(),
          hotspotDetails: Joi.object()
            .keys({
              isHotspot: Joi.boolean().required(),
              hotspotId: Joi.string()
                .when('isHotspot', {
                  is: true,
                  then: Joi.required(),
                  otherwise: Joi.allow('', null),
                })
                .optional(),
              hotspotName: Joi.string().allow('', null).optional(),
              fare: Joi.number().precision(2).min(0).allow(null).optional(),
            })
            .required(),
          rateDetails: Joi.array()
            .min(1)
            .items(
              Joi.object().keys({
                driverType: Joi.string().valid('normal', 'premium', 'elite').required(),
                cancellationFee: Joi.number().precision(2).min(0).required(),
                waitingFee: Joi.object()
                  .keys({
                    perMinutes: Joi.number().integer().min(1).required(),
                    fee: Joi.number().precision(2).greater(0).required(),
                  })
                  .required(),
                timing: Joi.array()
                  .min(1)
                  .items(
                    Joi.object().keys({
                      day: Joi.string()
                        .valid(
                          'monday',
                          'tuesday',
                          'wednesday',
                          'thursday',
                          'friday',
                          'saturday',
                          'sunday'
                        )
                        .required(),
                      from: Joi.object()
                        .keys({
                          time: Joi.number().integer().min(1).max(12).required(),
                          type: Joi.string().valid('AM', 'PM').required(),
                        })
                        .required(),
                      to: Joi.object()
                        .keys({
                          time: Joi.number().integer().min(1).max(12).required(),
                          type: Joi.string().valid('AM', 'PM').required(),
                        })
                        .required(),
                      rate: Joi.number().precision(2).greater(0).required(),
                    })
                  )
                  .required(),
              })
            )
            .required(),
        })
      ),
  }),
  PriceController.createPriceSetting
);

// -------------------- UPDATE ROUTE --------------------
router.put(
  '/:location_id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      location_id: Joi.string().uuid().required(),
    }),
    [Segments.BODY]: Joi.object()
      .keys({
        location: Joi.object()
          .keys({
            country: Joi.string().optional(),
            state: Joi.string().allow('', null).optional(),
            district: Joi.string().allow('', null).optional(),
            area: Joi.string().allow('', null).optional(),
            pincode: Joi.string().length(6).pattern(/^\d+$/).allow('', null).optional(),
            global_price: Joi.number().precision(2).min(0).allow(null).optional(),
          })
          .optional(),
        hotspotDetails: Joi.object()
          .keys({
            isHotspot: Joi.boolean().optional(),
            hotspotId: Joi.string()
              .when('isHotspot', {
                is: true,
                then: Joi.required(),
                otherwise: Joi.allow('', null),
              })
              .optional(),
            hotspotName: Joi.string().allow('', null).optional(),
            fare: Joi.number().precision(2).min(0).allow(null).optional(),
          })
          .optional(),
        rateDetails: Joi.array()
          .min(1)
          .items(
            Joi.object().keys({
              driverType: Joi.string().valid('normal', 'premium', 'elite').required(),
              cancellationFee: Joi.number().precision(2).min(0).required(),
              waitingFee: Joi.object()
                .keys({
                  perMinutes: Joi.number().integer().min(1).required(),
                  fee: Joi.number().precision(2).greater(0).required(),
                })
                .required(),
              timing: Joi.array()
                .min(1)
                .items(
                  Joi.object().keys({
                    day: Joi.string()
                      .valid(
                        'monday',
                        'tuesday',
                        'wednesday',
                        'thursday',
                        'friday',
                        'saturday',
                        'sunday'
                      )
                      .required(),
                    from: Joi.object()
                      .keys({
                        time: Joi.number().integer().min(1).max(12).required(),
                        type: Joi.string().valid('AM', 'PM').required(),
                      })
                      .required(),
                    to: Joi.object()
                      .keys({
                        time: Joi.number().integer().min(1).max(12).required(),
                        type: Joi.string().valid('AM', 'PM').required(),
                      })
                      .required(),
                    rate: Joi.number().precision(2).greater(0).required(),
                  })
                )
                .required(),
            })
          )
          .optional(),
      })
      .min(1), // At least one field must be provided for update
  }),
  PriceController.updatePriceSetting
);

// -------------------- DELETE ROUTE --------------------
router.delete(
  '/:location_id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      location_id: Joi.string().uuid().required(),
    }),
  }),
  PriceController.deletePriceSetting
);

export default router;
