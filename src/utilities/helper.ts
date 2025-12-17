import { celebrate, Joi } from 'celebrate';

export const validateBody = (schema: Joi.Schema) => celebrate({ body: schema });
export const validateParams = (schema: Joi.ObjectSchema) => celebrate({ params: schema });
export const validateQuery = (schema: Joi.ObjectSchema) => celebrate({ query: schema });

export const formFullName = (firstName?: string, lastName?: string): string => {
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';
  return `${first} ${last}`.trim();
};

export const cleanUndefined = (obj: any): any => {
  const cleaned: any = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  }
  return cleaned;
};
