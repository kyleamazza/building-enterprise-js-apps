async function createUser(req, res, db) {
  const { email, password } = req.body;
  const { hasOwnProperty } = Object.prototype.hasOwnProperty;
  if (
    !hasOwnProperty.call(req.body, 'email')
    || !hasOwnProperty.call(req.body, 'password')
  ) {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: 'Payload must contain at least the email and password fields' });
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: 'The email and password fields must be of type string' });
  }

  if (!/^[\w.+]+@\w+\.\w+$/.test(email)) {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: 'The email field must be a valid email' });
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
