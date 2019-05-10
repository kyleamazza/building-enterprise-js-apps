import { ValidationError } from '../errors';

function validate(req) {
  const { hasOwnProperty } = Object.prototype;
  const { email, password } = req.body;
  if (
    !hasOwnProperty.call(req.body, 'email')
    || !hasOwnProperty.call(req.body, 'password')
  ) {
    return new ValidationError('Payload must contain at least the email and password fields');
  }

  if (
    typeof email !== 'string'
    || typeof password !== 'string'
  ) {
    return new ValidationError('The email and password fields must be of type string');
  }

  if (!/^[\w.+]+@\w+\.\w+$/.test(email)) {
    return new ValidationError('The email field must be a valid email');
  }

  return undefined;
}

export default validate;
