import Ajv from 'ajv';
import { profileSchema, createUserSchema } from '../../schema/users';

import { generateValidationErrorMessage, ValidationError } from '../errors';

function validate(req) {
  const ajvValidate = new Ajv()
    .addFormat('email', /^[\w.+]+@\w+\.\w+$/)
    .addSchema([ profileSchema, createUserSchema ])
    .compile(createUserSchema);

  const valid = ajvValidate(req.body);

  if (!valid) {
    const message = generateValidationErrorMessage(ajvValidate.errors);
    return new ValidationError(message);
  }

  return true;
}

export default validate;
