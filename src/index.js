import express from 'express';
import bodyParser from 'body-parser';
import elasticsearch from 'elasticsearch';

const app = express();

const client = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`
});

function checkEmptyPayload(req, res, next) {
  if (['POST', 'PATCH', 'PUT'].includes(req.method) && (req.headers['content-length'] === '0' || !req.headers['content-length'])) {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: 'Payload should not be empty' });
  }

  return next();
}

function checkContentTypeIsSet(req, res, next) {
  if (req.headers['content-length'] && req.headers['content-length'] !== '0' && !req.headers['content-type']) {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: 'The "Content-Type" header must be set for requests with a non-empty payload' });
  }

  return next();
}

function checkContentTypeIsJson(req, res, next) {
  if (!req.headers['content-type'].includes('application/json')) {
    return res
      .status(415)
      .set('Content-Type', 'application/json')
      .json({ message: 'The "Content-Type" header must always be "application/json"' });
  }

  return next();
}

app.use(checkEmptyPayload);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJson);

app.use(bodyParser.json({ limit: 1e6 }));

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

  return res.status(201).set('Content-Type', 'text/plain').send('yeet you did it');
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err && err.type === 'entity.parse.failed') {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: 'Payload should be in JSON format' });
  }

  return next();
});


app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server listening on port ${process.env.SERVER_PORT}`);
});
