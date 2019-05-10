import { ValidationError } from '../../validators/errors';
import { validate } from '../../validators/users';

async function create(req, db) {
  const validationResults = validate(req);
  if (validationResults instanceof ValidationError) {
    throw validationResults;
  }

  return db.index({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    body: req.body
  });
}

export default create;
