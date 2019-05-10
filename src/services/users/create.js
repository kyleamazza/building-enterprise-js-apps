import { ValidationError } from '../../validators/errors';
import { validate } from '../../validators/users';

async function createUser(req, res, db) {
  const validationResults = validate(req);
  if (validationResults instanceof ValidationError) {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: validationResults.message });
  }

  try {
    const result = await db.index({
      index: 'hobnob',
      type: 'user',
      body: req.body
    });

    return res
      .status(201)
      .set('Content-Type', 'text/plain')
      .send(result._id);
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .set('Content-Type', 'application/json')
      .json({ message: 'Internal Server Error' });
  }
}

export default createUser;
