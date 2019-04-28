import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json({ limit: 1e6 }));

app.post('/users', (req, res) => {
  // req.headers.* are all strings...
  if (req.headers['content-length'] === '0') {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: 'Payload should not be empty' });
  }

  if (req.headers['content-type'] !== 'application/json') {
    return res
      .status(415)
      .set('Content-Type', 'application/json')
      .json({ message: 'The "Content-Type" header must always be "application/json"' });
  }

  return res
    .status(400)
    .set('Content-Type', 'application/json')
    .json({ message: 'Payload should be in JSON format' });
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
