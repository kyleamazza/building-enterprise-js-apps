import { ValidationError } from '../../validators/errors';
import { create } from '../../engines/users';

async function createUser(req, res, db) {
  try {
    const result = await create(req, db);
    return res
      .status(201)
      .set('Content-Type', 'text/plain')
      .send(result._id);
  } catch (e) {
    if (e instanceof ValidationError) {
      return res
        .status(400)
        .set('Content-Type', 'application/json')
        .json({ message: e.message });
    }
    return res
      .status(500)
      .set('Content-Type', 'application/json')
      .json({ message: 'Internal Server Error' });
  }
}

export default createUser;
