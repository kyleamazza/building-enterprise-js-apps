import express from 'express';
import bodyParser from 'body-parser';
import elasticsearch from 'elasticsearch';

import { injectHandlerDependencies } from './utils';

import {
  checkEmptyPayload,
  checkContentTypeIsSet,
  checkContentTypeIsJSON,
  errorHandler
} from './middlewares';

import { createUser } from './handlers/users';

const app = express();

const client = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`
});

app.use(bodyParser.json({ limit: 1e6 }));

app.use(checkEmptyPayload);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJSON);
app.use(errorHandler);

app.post('/users', injectHandlerDependencies(createUser, client));

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server listening on port ${process.env.SERVER_PORT}`);
});
