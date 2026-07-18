import Ajv, { type ValidateFunction } from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

import schema from 'src/engine/core-modules/executive-search/contracts/external-sync-event.schema.json';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

let compiledValidator: ValidateFunction | null = null;

const getValidator = (): ValidateFunction => {
  if (!compiledValidator) {
    compiledValidator = ajv.compile(schema);
  }

  return compiledValidator;
};

export const validate = (
  payload: unknown,
): { valid: boolean; errors?: string[] } => {
  const validateFn = getValidator();
  const valid = validateFn(payload);

  if (!valid) {
    return {
      valid: false,
      errors:
        validateFn.errors?.map(
          (err) => `${err.instancePath ? `${err.instancePath}: ` : ''}${err.message ?? 'Unknown validation error'}`,
        ) ?? [],
    };
  }

  return { valid: true };
};
