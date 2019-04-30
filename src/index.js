import express from 'express';
import bodyParser from 'body-parser';
import elasticsearch from 'elasticsearch';

import {
  checkEmptyPayload,
  checkContentTypeIsSet,
  checkContentTypeIsJSON,
  errorHandler
} from './middlewares';

const app = express();

const client = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`
});

app.use(bodyParser.json({ limit: 1e6 }));

app.use(checkEmptyPayload);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJSON);
app.use(errorHandler);

app.post('/users', async (req, res) => {
  const { email, password } = req.body;
  if (!Object.prototype.hasOwnProperty.call(req.body, 'email') || !Object.prototype.hasOwnProperty.call(req.body, 'password')) {
    return res
      .status(400)
      .set('Content-Header', 'application/json')
      .json({ message: 'Payload must contain at least the email and password fields' });
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res
      .status(400)
      .set('Content-Header', 'application/json')
      .json({ message: 'The email and password fields must be of type string' });
  }

  if (!/^[\w.+]+@\w+\.\w+$/.test(email)) {
    return res
      .status(400)
      .set('Content-Header', 'application/json')
      .json({ message: 'The email field must be a valid email' });
  }

  try {
    const result = await client.index({
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
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server listening on port ${process.env.SERVER_PORT}`);
});
